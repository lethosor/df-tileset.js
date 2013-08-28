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
	Demo.log('Demo initialized.');
}

Demo.logf = function(){
	$('#demo-log div').html($('#demo-log div').html() + [].slice.apply(arguments).join(' '));
	$('#demo-log').scrollTop($('#demo-log').children().height());
};
Demo.log = function(){
	var args = [].slice.apply(arguments);
	args.push('\n');
	Demo.logf.apply(this, args);
};

$(function(){
	Demo.init();
	$('#tileset').load(function(){
		var time, otime;
		otime = time = (new Date()).getTime();
		font = Tileset.Font('#tileset');
		Demo.log('Font loaded in ' + ((new Date()).getTime() - time) + ' ms.\nFont:',
				 font.characters.length, 'characters, background:',
				 'rgba(' + font.characters[0].pixels[0][0].toString() + ')');
		var canvas = $('<canvas>').prependTo('body').attr({
			width: $('body').width(),
			height: $('body').height() / 2
			}),
			cx = canvas[0].getContext('2d');
		Demo.log('Multiple color/caching demo (5 times)')
		for (var i = 1; i <= 5; i++) {
			time = (new Date()).getTime();
			Demo.logf('#' + i + ': ');
			for (var r = 0; r < 256; r += 5) {
				for (var g = 0; g < 256; g += 15) {
					var d = font.characters[1].image_data([255,255,255], [r,g,0]);
					cx.putImageData(d, r/5*d.width, g/15*d.height);
				}
			}
			Demo.log('Done ('+ ((new Date()).getTime() - time), 'ms)');
		}
		
		Demo.log('Total time for all demos:', (new Date()).getTime() - otime, 'ms');
	});
});
