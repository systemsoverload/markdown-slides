var fs = require('fs');
var marked = require('marked');


function Presentation(slides){
	this.slides = slides;
        this.head = '<head><title>Butt</title></head>';
        this.body = '';
	this.render = function(){
		for(var i=0; i < this.slides.length; i++){
			this.body += this.slides[i].html
		}
	}
}

Presentation.prototype = {
	get html(){ return '<!DOCTYPE html><html>'+ this.head + this.body + '</html>'; }
}

function Slide(config, markdown, number){
	this.config = config;
	this.markdown = markdown;
	this.number = number;
        this.render = function(){
        	this.html = '<slide>' + marked(this.markdown)  + '</slide>';
	}
}



var data = fs.readFileSync("./test.md", {encoding: 'utf8'});
var slides_md = data.split('---');
var slides = [];
var configKeywords = ['title', 'footer'];

var presentation = new Presentation();

// Parse config data from each slide
slides_md.forEach(function(slide, slideNo){
	var lines = slide.split('\n');
	var cfg = {};
	lines.forEach(function(line){
		var c = line.split(':');
		var cfgToken = c[0];
		var cfgValue= c[1];

		if (configKeywords.indexOf(cfgToken) != -1){
			cfg[cfgToken] = cfgValue;
		}
	});
	var s = new Slide(cfg, slide, slideNo);
	s.render();  //Meh
	slides.push(s);
});

var presentation = new Presentation(slides);
presentation.render();
console.log(presentation.html)
