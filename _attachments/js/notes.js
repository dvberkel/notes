(function($, _, Backbone, Markdown, undefined){
    Backbone.couch_connector.config.db_name = "notes";
    Backbone.couch_connector.config.ddoc_name = "data";
    Backbone.couch_connector.config.enableChanges = true;

    var converter = new Markdown.Converter();
    
    var FactoryModel = Backbone.Model.extend({
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
		    var x = (window.innerWidth - 150) * Math.random();
		    var y = (window.innerHeight - 150) * Math.random();
		    view.options.notes.create({x : x, y : y});
		}).appendTo(element);
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
	    
	    this.model.bind("add", function(){
		this.render();
	    }, this);

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
	$("#login").couchLogin();

	var notes = new NotesModel();
	notes.fetch({
	    success: function(){
		new NoticeboardView({el: $("#noticeboard"), model: notes});
	    }
	});

	var factoryModel = new FactoryModel({enabled : true});
	new FactoryView({ el : $("#note-factory"), model : factoryModel, notes : notes });
	
	$("#note-destructor").droppable({
	    accept : ".note",
	    drop : function(event, ui){
		ui.draggable.trigger("removed");
	    }
	}).addClass("waste-bin");
    });      
})(jQuery, _, Backbone, Markdown);