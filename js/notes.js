(function($, _, Backbone, undefined){
    var NoteModel = Backbone.Model.extend({
	defaults : {content: "Click to change"}
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
	    $(this.el).html(this.model.get('content'));
	}
    });

    var NoticeboardView = Backbone.View.extend({
	initialize : function(){
	    _.bindAll(this, 'render');

	    this.render();
	},
	
	render : function(){
	    var noticeboard = $(this.el);
	    this.model.forEach(function(noteModel, index){
		var span = $("<span />", { "class" : "note" });
		new NoteView({ el : span, model : noteModel });
		span.appendTo(noticeboard);
	    });
	}
    });

    $(function(){
	var notes = new NotesModel();
	notes.add({content: "One of a kind"});
	new NoticeboardView({el: $("#noticeboard"), model: notes});

	new NoteView({el: $("#note"), model: new NoteModel()});
    });      
})(jQuery, _, Backbone);