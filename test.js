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

function Slide(config, markdown, number, children, isChild){
	var self = this;
	self.isChild = isChild ? false : isChild
	self.config = config;
	self.markdown = markdown;
	self.number = number;
	self.children = children;
	self.childHtml = ''

    var childRenderCount = 0;
    self.childRendered = function(child){
    	childRenderCount += 1
    	if(childRenderCount == self.children.length){
    		self.children.forEach(function(child){
    			self.childHtml += child.html;
    		});
    	}
    }

	//Generate HTML from markdown and apply all syntax highlighting
	self.render = function(){	
		self.children.forEach(function(child){
			child.on('rendered', self.childRendered);
			child.render();
		});
		marked(self.markdown, function(err, content){
			var tag = self.isChild ? 'subslide' : 'slide';
			self.html = '<'+tag+'>' + content + self.childHtml + '</'+tag+'>'
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

function parseSlideCfg(slide){
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
	return cfg
}

// Parse config data and child-slides from each slide
slides_md.forEach(function(slide, slideNo){
	var children = [];
	var subSlides = slide.split('--')
	if (subSlides.length > 1){
		subSlides.forEach(function(subSlide, idx){
			if (idx){
				var subSlideCfg = parseSlideCfg(subSlide);
				children.push(new Slide(subSlideCfg, subSlide, idx, [], true));
			}
		})
	}
	var slideCfg = parseSlideCfg(slide);
	var s = new Slide(slideCfg, slide, slideNo, children);
	slides.push(s);
});

var presentation = new Presentation(slides, presentationCfg);
presentation.render();
presentation.on('ready', function(pres){
	console.log(pres.html)
});