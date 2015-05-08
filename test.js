var fs = require('fs');
var marked = require('marked');
var pygmentize = require('pygmentize-bundled')

marked.setOptions({
  highlight: function (code, lang, callback) {
  	pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
      callback(err, result.toString());
    })
  }
});

function Presentation(slides, cfg){
	var self = this;
	self.slides = slides;
	self.title = cfg.title ? cfg.title : "";
	self.footer = cfg.footer ? '<div class="footer">'+ marked(cfg.footer) +'</div>' : "";
	self.stylesheet = '<link rel="stylesheet" href="'+cfg.theme+'"></link>';
    self.head = '<head><title>' + self.title + '</title>' + self.stylesheet + '</head>';
    self.body = '<body><div id="viewer"></div>' + self.footer;

    var slideRenderCount = 0;
    self.slideRendered = function(slide){
    	slideRenderCount += 1
    	if(slideRenderCount == self.slides.length){
    		self.slides.forEach(function(slide){
    			self.body += slide.html;
    		});
    		self.emit('ready', self)
    	}
    }

	self.render = function(){
		self.slides.forEach(function(slide){
			slide.on('rendered', self.slideRendered)
			slide.render();	
		});
	}


	self.listeners = {}
	self.on = function(evt, callback){
		self.listeners[evt] =callback;
	}

	self.emit = function(evt, data){
		self.listeners[evt](data);
	}
}

Presentation.prototype = {
	
	get html(){
		var endBody = '<div id="slide-number"></div><script type="text/javascript" src="viewer.js"></script></body>';
		return '<!DOCTYPE html><html>'+ this.head + this.body + endBody +'</html>'; 
	}
}

function Slide(config, markdown, number){
	var self = this;
	self.config = config;
	self.markdown = markdown;
	self.number = number;


	self.render = function(){	
		marked(self.markdown, function(err, content){
			self.html = '<slide>' + content + '</slide>'
			self.emit('rendered');
		});
	}

	self.listeners = {}
	self.on = function(evt, callback){
		self.listeners[evt] = callback
	}

	self.emit = function(evt, data){
		self.listeners[evt](self)
	}
}



var data = fs.readFileSync("./test.md", {encoding: 'utf8'});
var slides_md = data.split('---');
var slides = [];
var configKeywords = {'title': {'global': true}, 'footer': {'global': true}};
var presentationCfg = {'theme': './test.css'};


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
presentation.on('ready', function(pres){
	console.log(pres.html)
});