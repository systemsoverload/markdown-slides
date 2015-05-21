var fs = require('fs');
var marked = require('marked');
var pygmentize = require('pygmentize-bundled');
var Presentation = require('./presentation.js')
var Slide = require('./slide.js')
var util = require('./util.js')


var parsed = util.parseFile("./test.md");

var presentation = new Presentation(parsed.slides, parsed.presentationCfg);
presentation.render();
presentation.on('ready', function(pres){
	console.log(pres.html);
});

