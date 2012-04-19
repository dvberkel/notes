(function($, _, Backbone, undefined){
    var NoteModel = Backbone.Model.extend({
	defaults : {content: "Click to change"}
    });

    var NoteView = Backbone.View.extend({
	initialize : function(){
	    _.bindAll(this, 'render');
	    
	    this.model.bind("change", function(){
		this.render();
	    },this);
	    
	    this.render();
	},
	
	render: function(){
	    $(this.el).html(this.model.get('content'));
	}
    });

    $(function(){
	new NoteView({el: $("#note"), model: new NoteModel()});
    });      
})(jQuery, _, Backbone);