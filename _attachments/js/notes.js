(function($, _, Backbone, Markdown, undefined){
    Backbone.couch_connector.config.db_name = "notes";
    Backbone.couch_connector.config.ddoc_name = "data";
    Backbone.couch_connector.config.enableChanges = true;

    var converter = new Markdown.Converter();

    var NoteModel = Backbone.Model.extend({
	defaults : {content : "*Click to change*", edit: false, x : 0, y : 0}
    });

    var NotesModel = Backbone.Collection.extend({
	url : "/notes",
	model : NoteModel
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
		}
	    }); 
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
	    var noticeboard = $(this.el);
	    noticeboard.empty();
	    this.model.forEach(function(noteModel, index){
		var note = $("<div />").appendTo(noticeboard);
		new NoteView({ el : note, model : noteModel });
	    });
	}
    });

    $(function(){
	var notes = new NotesModel();
	new NoticeboardView({el: $("#noticeboard"), model: notes});
	
	$("#note-factory").click(function(){
	    var x = (window.innerWidth - 150) * Math.random();
	    var y = (window.innerHeight - 150) * Math.random();
	    notes.add({x : x, y : y});
	});
    });      
})(jQuery, _, Backbone, Markdown);