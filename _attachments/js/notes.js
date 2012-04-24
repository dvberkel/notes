(function($, _, Backbone, Markdown, undefined){
    Backbone.couch_connector.config.db_name = "notes";
    Backbone.couch_connector.config.ddoc_name = "data";
    Backbone.couch_connector.config.enableChanges = true;

    var converter = new Markdown.Converter();
    
    var StatusModel = Backbone.Model.extend({
	defaults : { enabled : false }
    });
    
    var NoteModel = Backbone.Model.extend({
	defaults : {content : "*Click to change*", active: true, edit: false, x : 0, y : 0}
    });

    var NotesModel = Backbone.Collection.extend({
	url : "/notes",
	db : {
	    view : "active_notes"
	},
	model : NoteModel
    });
    
    var FactoryView = Backbone.View.extend({
	initialize : function(){
	    _.bindAll(this, "render");
	    
	    this.model.bind("change", function(){
		this.render();
	    }, this);

	    this.render();
	},

	render : function(){
	    var view = this;
	    var element = $(view.el);
	    element.empty();
	    if (view.model.get("enabled")) {
		$("<input type='button' value='Create Note'/>").click(function(){
		    var user = view.model.get("user");
		    if (user) {
			var x = (window.innerWidth - 150) * Math.random();
			var y = (window.innerHeight - 150) * Math.random();
			view.options.notes.create({ user : user.name, x : x, y : y });
		    }
		}).appendTo(element);
	    }
	}
    });

    var WastebinView = Backbone.View.extend({
	initialize : function(){
	    _.bindAll(this, "render");
	    
	    this.model.bind("change", function(){
		this.render();
	    }, this);

	    this.render();
	},

	render : function(){
	    var view = this;
	    var element = $(view.el);
	    element.empty();
	    if (view.model.get("enabled")) {
		$("<div />").droppable({
		    accept : ".note",
		    drop : function(event, ui){
			ui.draggable.trigger("removed");
		    }
		}).addClass("waste-bin").appendTo(element);
	    }
	}
    });

    var NoteContentView = Backbone.View.extend({
	template : _.template("<textarea><%= content  %></textarea>"),

	initialize : function() {
	    _.bindAll(this, 'render');
	    
	    var renderMe = function(){this.render();};
	    this.model.bind("change:content", renderMe, this);
	    this.model.bind("change:edit", renderMe, this);

	    this.render();
	},

	render : function() {
	    var view = this; var element = $(view.el);
	    element.empty();
	    if (!view.model.get('edit')) {
		element.html(converter.makeHtml(view.model.get('content')));
		element.click(function(){
		    view.model.set({ edit : true });
		});
	    } else {
		var input = $(view.template(view.model.toJSON())).blur(function(){
		    view.model.set({ content : $(this).val(), edit : false });
		    view.model.save();
		});
		input.appendTo(element);
		input.focus();
		
	    }
	}
    });
    
    var NoteView = Backbone.View.extend({
	initialize : function(){
	    _.bindAll(this, 'render');
	    
	    this.model.bind("change", function(){
		this.render();
	    },this);
	    
	    this.render();
	},
	
	render : function(){
	    var view = this;
	    var element = $(view.el);
	    element.empty().addClass('note').css({
		position: 'absolute',
		top: view.model.get('y') + 'px',
		left: view.model.get('x') + 'px'
	    }).draggable({
		stop : function(){
		    var position = element.position();
		    view.model.set({ x: position.left, y : position.top }, { silent : true });
		    view.model.save();
		}
	    }).on("removed", function(){
		view.model.set({ active : false });
	    });
	    if (! view.model.get("active")) {
		element.hide();
	    }
	    var content = $("<div />").appendTo(element);
	    new NoteContentView({ el: content, model: view.model });
	    
	}
    });

    var NoticeboardView = Backbone.View.extend({
	initialize : function(){
	    _.bindAll(this, 'render');
	    
	    var renderMe = function(){ this.render(); };
	    this.model.bind("add", renderMe, this);
	    this.model.bind("reset", renderMe, this);

	    this.render();
	},
	
	render : function(){
	    var view = this;
	    var noticeboard = $(view.el);
	    noticeboard.empty();
	    view.model.forEach(function(noteModel, index){
		var note = $("<div />").appendTo(noticeboard);
		new NoteView({ el : note, model : noteModel });
	    });
	}
    });

    $(function(){
	var notes = new NotesModel();
	
	var statusModel = new StatusModel();
	new FactoryView({ el : $("#note-factory"), model : statusModel, notes : notes });
	new WastebinView({ el : $("#note-destructor"), model: statusModel });

	statusModel.bind("change", function(){
	    if (this.get("enabled")){
		notes.fetch({
		    success: function(){
			new NoticeboardView({el: $("#noticeboard"), model: notes});
		    }
		});
	    } else {
		notes.reset();
	    }
	}, statusModel);

	$("#login").couchLogin({
	    loggedIn : function(user){
		statusModel.set({ user : user, enabled : true });
	    },
	    loggedOut : function(){
		statusModel.unset("user", { silent : true });
		statusModel.set({ enabled : false });
	    }
	});
    });      
})(jQuery, _, Backbone, Markdown);