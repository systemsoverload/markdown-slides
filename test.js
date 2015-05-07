var fs = require('fs');
var marked = require('marked');


function Presentation(slides, cfg){
	this.slides = slides;
	this.title = cfg.title ? cfg.title : "MY Presentation";
	this.footer = cfg.footer ? '<div class="footer">'+cfg.footer+'</div>' : "";
	this.stylesheet = '<link rel="stylesheet" href="'+cfg.stylesheet+'"></link>';
    this.head = '<head><title>' + this.title + '</title>' + this.stylesheet + '</head>';
    this.body = '<body><div id="viewer"></div>';

	this.render = function(){
		for(var i=0; i < this.slides.length; i++){
			this.body +=  '<slide>' + marked(this.slides[i].markdown + this.footer) + '</slide>';
		}
		this.body +='<div id="slide-number"></div><script type="text/javascript" src="viewer.js"></script></body>'
	}
}

Presentation.prototype = {
	get html(){ return '<!DOCTYPE html><html>'+ this.head + this.body + '</html>'; }
}

function Slide(config, markdown, number){
	this.config = config;
	this.markdown = markdown;
	this.number = number;
}



var data = fs.readFileSync("./test.md", {encoding: 'utf8'});
var slides_md = data.split('---');
var slides = [];
var configKeywords = {'title': {'global': true}, 'footer': {'global': true}};
var presentationCfg = {'stylesheet': './test.css'};

if 

// Parse config data from each slide
slides_md.forEach(function(slide, slideNo){
	var lines = slide.split('\n');
	var cfg = {};
	lines.forEach(function(line){
		var c = line.split(':');
		var cfgToken = c[0];
		var cfgValue= line.split(cfgToken + ':')[1];

		if (configKeywords.hasOwnProperty(cfgToken)){
			if (configKeywords[cfgToken].global){
				presentationCfg[cfgToken] = cfgValue.trim();
			} else {
				cfg[cfgToken] = cfgValue.trim();
			}
		}
	});
	var s = new Slide(cfg, slide, slideNo);
	slides.push(s);
});

var presentation = new Presentation(slides, presentationCfg);
presentation.render();
console.log(presentation.html)