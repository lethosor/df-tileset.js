window.Tileset = (function($){
	Tileset = {};
	
	Tileset.Font = function(image){
		var self = {};
		
		self.image = $(image).first();
		
		if (this instanceof Tileset.Font) $.extend(this, self);
		return self;
	};
	Tileset.Font.loadFromURL = function(url){
		var event = $({});
		$('<img>').attr({src: url, height:0, width:0}).hide().appendTo('body').ready(function(d){
			var font = Tileset.Font($('img[src=' + url + ']'));
			event.trigger('ready', font);
		}).error(function(d){
			event.trigger('error', d)
		});
		return event;
	};
	
	return Tileset;
})(jQuery);
