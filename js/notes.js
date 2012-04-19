(function($, _, Backbone, Markdown, undefined){
    var converter = new Markdown.Converter();

    var NoteModel = Backbone.Model.extend({
	defaults : {content : "*Click to change*", edit: false, x : 0, y : 0}
    });

    var NotesModel = Backbone.Collection.extend({
	model : NoteModel
    });

    var NoteContentView = Backbone.View.extend({
	initialize : function() {
	    _.bindAll(this, 'render');
	    
	    var renderMe = function(){this.render();};
	    this.model.bind("change:content", renderMe, this);
	    this.model.bind("change:edit", renderMe, this);

	    this.render();
	},

	render : function() {
	    $(this.el).empty().html(converter.makeHtml(this.model.get('content')));
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
	    var element = $(this.el);
	    element.addClass('note').css({
		position: 'absolute',
		top: this.model.get('y') + 'px',
		left: this.model.get('x') + 'px'
	    });
	    var content = $("<div />").appendTo(element);
	    new NoteContentView({ el: content, model: this.model });
	    
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