var Demo = {};

Demo.init = function(){
	$('<div id="demo-log">').css({
		border: '1px solid #eee',
		padding: 8,
		'border-radius': 2,
		'margin-top': '5em',
		'font-family': 'Courier, monospace',
		height: '10em',
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
	});
});
