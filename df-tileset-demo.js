var Demo = {};

Demo.init = function(){
	$('<div id="demo-log">').css({
		border: '1px solid #eee',
		padding: 8,
		'border-radius': 2,
		'margin-top': '5em',
		'font-family': 'Courier, monospace',
		height: '15em',
		'overflow-y': 'scroll',
		'white-space': 'pre'
	}).appendTo('body').html('<div></div>');
	Demo.log('{green|Demo initialized}.');
}

Demo.logf = function(){
	var txt = [].slice.apply(arguments).join(' ');
	txt = txt.replace(/\{([^|]+)\|([^|}]+)\}/g, function(a, c, t){
		return '<span style="color:'+c+'">'+t+'</span>';
	}).replace(/\{([^|]+)\|([^|]+)\|([^|}]+)\}/g, function(a, c, b, t){
		return '<span style="color:'+c+'; background-color:'+b+'">'+t+'</span>';
	});
	$('#demo-log div').html($('#demo-log div').html() + txt);
	$('#demo-log').scrollTop($('#demo-log').children().height());
};
Demo.log = function(){
	var args = [].slice.apply(arguments);
	args.push('\n');
	Demo.logf.apply(this, args);
};
Demo.time = (window.performance && performance.now)
	? function() { return performance.now(); }
	: function() { return (new Date()).getTime(); };

$(function(){
	Demo.init();
	Demo.log('User agent: ' + window.navigator.userAgent);
	$('#tileset').load(function(){
		var time, otime;
		otime = time = Demo.time();
		font = Tileset.Font('#tileset');
		Demo.log('Font loaded in', (Demo.time() - time), 'ms:',
				 font.characters.length, 'characters');
		var canvas = $('<canvas>').prependTo('body').attr({
			width: font.char_width * 80,
			height: font.char_height * 25
		});
		Demo.canvas = canvas = Tileset.Canvas(canvas, font);
		Demo.canvas.$canvas.css('box-shadow', '0px 0px 2px 2px #afa');
		Demo.canvas.fill_char(0, [0,0,24,79]);
		ch = Math.floor(Math.random() * 256);
		Demo.log('Using character', ch);
		for (var i = 1; i <= 5; i++) {
			time = Demo.time();
			Demo.logf('#' + i + ': ');
			for (var r = 0; r < 256; r += 5) {
				for (var g = 0; g < 256; g += 15) {
					canvas.draw_at(ch, [255, 255, 255], [r,g,0], g/15 + 7, r/5 + 28);
				}
			}
			Demo.log('{green|Done} ('+ (Demo.time() - time), 'ms)');
		}
		var text = 'Type text here (click to focus first):';
		Demo.canvas.draw_string(text + ' __________', 0, 0);
		var r = 0, c = text.length + 1;
		Demo.canvas.events.on('keypress', function(_, e) {
			Demo.canvas.draw_string(String.fromCharCode(e.which), r, c, Math.randInt(200, 255, 3));
			c++;
			if (c>=80) {c=0; r++}
		});
		Demo.canvas.events.on('all', function(_, e) {
			Demo.canvas.draw_string(e.type + '         ', 20, 0, Math.randInt(100, 255, 3));
		});

		Demo.log('Total time:', Demo.time() - otime, 'ms');
	});
});
