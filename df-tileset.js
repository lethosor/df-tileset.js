window.Tileset = (function($){
	Tileset = {};
	
	Tileset.Character = function(bg, data) {
		var self = {
			bg: bg,
			image_data: data,
			raw_data: [].slice.apply(data.data)
		};
		
		self.pixels = []
		for (var r = 0; r < data.height; r++) {
			self.pixels[r] = [];
			for (var c = 0; c < data.width; c++) {
				var offset = (data.width*r + c) * 4
				self.pixels[r][c] = self.raw_data.slice(offset, offset + 4);
			}
		}
		
		if (this instanceof Tileset.Character) $.extend(this, self);
		return self;
	};
	
	Tileset.Font = function(image) {
		var self = {};
		
		self.image = $(image).first().hide().attr({height: 'auto', width: 'auto'});
		self.image_width = self.image.width();
		self.image_height = self.image.height();
		self.image_canvas = $('<canvas>').hide().appendTo('body').attr({
			height: self.image_height,
			width: self.image_width
		});
		var ctx = self.image_context = self.image_canvas[0].getContext('2d');
		// Draw image onto image_canvas
		ctx.drawImage(self.image[0], 0, 0, self.image_width, self.image_height);
		
		self.characters = [];
		
		var background = ctx.getImageData(0, 0, 1, 1).data;
		var w = self.image_width / 16,
			h = self.image_height / 16;
		for (var row = 0; row < 16; row++) {
			for (var col = 0; col < 16; col++) {
				var data = ctx.getImageData(w * col, h * row, w, h);
				self.characters[row * 16 + col] = Tileset.Character(background, data);
			}
		}
		
		if (this instanceof Tileset.Font) $.extend(this, self);
		return self;
	};
	Tileset.Font.loadFromURL = function(url) {
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
