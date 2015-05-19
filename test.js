var fs = require('fs');
var marked = require('marked');
var pygmentize = require('pygmentize-bundled');


String.prototype.format = function(placeholders) {
    var s = this;
    for(var propertyName in placeholders) {
        var re = new RegExp('{' + propertyName + '}', 'gm');
        s = s.replace(re, placeholders[propertyName]);
    }
    return s;
};


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
		slideRenderCount += 1;
		if(slideRenderCount == self.slides.length){
			self.slides.forEach(function(slide){
				self.body += slide.html;
			});
			self.emit('ready', self);
		}
	}

	self.render = function(){
		self.slides.forEach(function(slide){
			slide.on('rendered', self.slideRendered);
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
	self.isChild = isChild == true ? true : false;
	self.config = config;
	self.markdown = markdown;
	self.number = number;
	self.children = children;
	self.childHtml = '';
	self.class = config.titleSlide ? 'inverse' : 'normal';

	var rgx = /\(([^)]+)\)/;
	var backgroundImgUrl = config.background ? config.background.match(rgx)[1] : null;
	self.backgroundImg = backgroundImgUrl ? '<div class="background-image" style="background: url(\''+backgroundImgUrl +'\') no-repeat center center fixed;background-size: cover; -webkit-filter: opacity(0.4);"></div>' : '';

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
			self.html = '<{tag} class={class}><div class="{tag}-content">{content}{childHtml}</div>{backgroundImg}</{tag}>'.format({
				'tag': tag,
				'class': self.class,
				'content': content,
				'childHtml': self.childHtml,
				'backgroundImg': self.backgroundImg

			})
			self.emit('rendered');
		});
	}

	self.listeners = {}
	self.on = function(evt, callback){
		self.listeners[evt] = callback;
	}

	self.emit = function(evt, data){
		self.listeners[evt](self);
	}
}


function parseFile(fileName){
	var data = fs.readFileSync(fileName, {encoding: 'utf8'});
	var slides_md = data.split('---');
	var slides = [];
	var configKeywords = {'title': {'global': true}, 'footer': {'global': true}, 'background': {'global': false}};
	var presentationCfg = {'theme': './test.css', 'fileName': fileName};

	function parseSlideCfg(slide){
		var lines = slide.split('\n');
		var cfg = {};
		var cfgLines = [];

		lines.forEach(function(line, idx){
			var c = line.split(':');
			var cfgToken = c[0];
			var cfgValue= line.split(cfgToken + ':')[1];
			//Found something that looks like config, see if its one of the cfg keywords
			if (configKeywords.hasOwnProperty(cfgToken)){
				cfgLines.push(idx);

				//Some things should be applied to the slideshow as a whole
				if (configKeywords[cfgToken].global){
					presentationCfg[cfgToken] = cfgValue.trim();
				} else {
					cfg[cfgToken] = cfgValue.trim();
				}
			}
		});
		return {'cfg': cfg, 'cfgLines': cfgLines}
	}

	// Parse config data and child-slides from each slide
	slides_md.forEach(function(slide, slideNo){

		// Attempt to detect and parse out "sub-slides" for incrementally loaded data
		var children = [];
		var subSlides = slide.split('--');
		if (subSlides.length > 1){
			subSlides.forEach(function(subSlide, idx){
				if (idx){
					slide = slide.replace(subSlide, '')
					var res = parseSlideCfg(slide);
					var cfg = res.cfg;
					var cfgLines = res.cfgLines;
					var x = slide.split('\n').filter(function(e, idx, arr){ return !(cfgLines.indexOf(idx) > -1)}).join('\n');
					children.push(new Slide(cfg, subSlide, idx, [], true));
				}
			})
		}
		var res = parseSlideCfg(slide);
		var cfg = res.cfg;

		var cfgLines = res.cfgLines;
		var x = slide.split('\n').filter(function(e, idx, arr){ return !(cfgLines.indexOf(idx) > -1)})

		// If a slide only has a single entry, assume its a title page and reverse the color scheme
		cfg.titleSlide = x.filter(function(item){ return !!(item.replace(/[\W_]+/g,"")); }).length == 1 ? true : false;

		slides.push(new Slide(cfg, x.join('\n'), slideNo, children, false));
	});

	return {'slides': slides, 'presentationCfg': presentationCfg}
}

var parsed = parseFile("./test.md");

var presentation = new Presentation(parsed.slides, parsed.presentationCfg);
presentation.render();
presentation.on('ready', function(pres){
	console.log(pres.html);
});

