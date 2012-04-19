(function($, _, Backbone, undefined){
    var NoteView = Backbone.View.extend({
	initialize : function(){
	    _.bindAll(this, 'render');
	    
	    this.render();
	},
	
	render: function(){
	    $(this.el).html('Note');
	}
    });

    $(function(){
	new NoteView({el: $("#note")});
    });      
})(jQuery, _, Backbone);