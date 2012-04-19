(function($, _, Backbone, undefined){
    var NoteModel = Backbone.Model.extend({
	defaults : {content : "Click to change", x : 0, y : 0}
    });

    var NotesModel = Backbone.Collection.extend({
	model : NoteModel
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
	    $(this.el).addClass('note').css({
		position: 'absolute',
		top: this.model.get('y') + 'px',
		left: this.model.get('x') + 'px'
	    }).html(this.model.get('content'));
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
		var span = $("<div />");
		new NoteView({ el : span, model : noteModel });
		span.appendTo(noticeboard);
	    });
	}
    });

    $(function(){
	var notes = new NotesModel();
	new NoticeboardView({el: $("#noticeboard"), model: notes});
	
	$("#note-factory").click(function(){
	    var x = (window.innerWidth - 150) * Math.random();
	    var y = (window.innerHeight - 150) * Math.random();
	    notes.add({content: "Click to change", x : x, y : y});
	});
    });      
})(jQuery, _, Backbone);