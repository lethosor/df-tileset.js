window.Tileset = (function($){
	Tileset = {};
	
	Tileset.Font = function(image){
		var self = {};
		
		self.image = $(image).first().hide().attr({height: 'auto', width: 'auto'});
		self.image_canvas = $('<canvas>').hide().appendTo('body').attr({
			height: self.image.height(),
			width: self.image.width()
		});
		var ctx = self.image_context = self.image_canvas[0].getContext('2d');
		// Draw image onto image_canvas
		ctx.drawImage(self.image[0], 0, 0, self.image.width(), self.image.height());
		
		var background = ctx.g;
		
		if (this instanceof Tileset.Font) $.extend(this, self);
		return self;
	};
	Tileset.Font.loadFromURL = function(url){
		var event = $({});
		$('<img>').attr({src: url}).hide().appendTo('body').attr({
			height: 'auto',
			width: 'auto'
		}).load(function(d){
			var font = Tileset.Font($('img[src=' + url + ']'));
			event.trigger('ready', font);
		}).error(function(d){
			event.trigger('error', d)
		});
		return event;
	};
	
	return Tileset;
})(jQuery);
