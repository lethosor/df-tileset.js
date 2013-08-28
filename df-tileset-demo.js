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

Demo.log = function(){
	$('#demo-log div').html($('#demo-log div').html() + [].slice.apply(arguments).join(' ') + '\n');
	$('#demo-log').scrollTop($('#demo-log').children().height());
};

$(function(){
	Demo.init();
	$('#tileset').load(function(){
		var d = (new Date()).getTime();
		font = Tileset.Font('#tileset');
		Demo.log('Loaded in ' + ((new Date()).getTime() - d) + ' ms.\nFont:',
				 font.characters.length, 'characters, background:',
				 'rgba(' + font.characters[0].pixels[0][0].toString() + ')');
		var ch = Math.floor(Math.random()*256);
		Demo.log('Character', ch + ':');
		var cp = font.characters[ch].pixels;
		for (var r = 0; r < cp.length; r++) {
			var s = '';
			for (var c = 0; c < cp[r].length; c++) {
				var color = 'rgba(' + cp[r][c].toString() + ')'
				s += '<span style="background-color:'+color+'"> </span>'
			}
			Demo.log(s);
		}
		ch1_bw = font.characters[1].image_data([255,255,255], [0,0,0]);
		font.image_canvas.show();
		font.image_context.putImageData(ch1_bw, 0, 0);
	});
});
