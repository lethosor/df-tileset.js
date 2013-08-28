window.Tileset = (function($){
	Tileset = {};
	
	Tileset.Character = function(bg, data) {
		var self = {
			bg: [].slice.apply(bg),
			img_data: data,
			raw_data: [].slice.apply(data.data)
		};
		
		self.pixels = [];
		self.map = [];
		for (var r = 0; r < data.height; r++) {
			self.pixels[r] = [];
			self.map[r] = [];
			for (var c = 0; c < data.width; c++) {
				var offset = (data.width*r + c) * 4
				self.pixels[r][c] = self.raw_data.slice(offset, offset + 4);
				if (self.pixels[r][c].toString() == self.bg.toString()) {
					// This is the background color, so transparency = 0
					self.map[r][c] = 0;
				}
				else {
					self.map[r][c] = 1;
				}
			}
		}
		
		self.blank_canvas = $('<canvas>').width(data.width).height(data.height).hide().appendTo('body');
		self.image_data_cache = {};
		
		self.image_data = function(fg, bg){
			/*
			 * Returns an ImageData object with this character drawn on it,
			 * with foreground 'fg' and background 'bg'.
			 * fg/bg: [r, g, b (, a)]
			 */
			var key = fg.toString() + ',' + bg.toString();
			if (key in self.image_data_cache) {
				return self.image_data_cache[key];
			}
			else {
				var w = self.img_data.width, h = self.img_data.height,
					cx = self.blank_canvas[0].getContext('2d'),
					pixels = cx.createImageData(w, h);
				for (var r = 0; r < self.img_data.height; r++) {
					for (var c = 0; c < self.img_data.width; c++) {
						var color = self.map[r][c] ? fg : bg;
						for (var i = 0; i <= 3; i++) {
							pixels.data[(r * w + c) * 4 + i] = i in color ? color[i] : 255;
						}
					}
				}
				
				cx.putImageData(pixels, 0, 0);
				
				self.image_data_cache[key] = pixels;
				return self.image_data_cache[key];
			}
		};
		
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
		var w = self.char_width = self.image_width / 16,
			h = self.char_height = self.image_height / 16;
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
	
	Tileset.Canvas = function(canvas, font) {
		var self = {canvas: $(canvas)[0], $canvas: $(canvas), font: font};
		canvas = self.canvas;
		var cx = self.cx = self.canvas.getContext('2d')
		
		self.draw_at = function(ch_id, fg, bg, r, c){
			var d = font.characters[ch_id].image_data(fg, bg);
			self.cx.putImageData(d, c * self.font.char_width, r * self.font.char_height);
		};
		
		if (this instanceof Tileset.Canvas) $.extend(this, self);
		return self;
	}
	
	return Tileset;
})(jQuery);
