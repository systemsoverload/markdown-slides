var marked = require('marked');
var pygmentize = require('pygmentize-bundled');

marked.setOptions({
    highlight: function (code, lang, callback) {
        pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
            callback(err, result.toString());
        })
    }
});


function Slide(config, markdown, number, children, isChild){
	var self = this;
	self.isChild = isChild == true ? true : false;
	self.config = config;
	self.markdown = markdown;
	self.number = number;
	self.children = children;
	self.childHtml = '';
	self.class = config.titleSlide ? 'inverse' : 'normal';
	self.images = config.images ? config.images : null;

	// FIXME - this only handles 1 image per slide ATM
	var backgroundImg = self.images[0] ? self.images[0] : null;

	var backgroundImgHtml = '<div class="background-image {styles}" style="background-image: url(\'{url}\');"></div>';
	var styles = backgroundImg ? backgroundImg.options.map(function(x){ return 'background-image-'+x}) : null;
	self.backgroundImg = backgroundImg ? backgroundImgHtml.format({
		"url": backgroundImg.url,
		"styles": styles.join(' ')
	}) : '';


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
		if (self.listeners[evt]){
			self.listeners[evt](self);
		}
	}
}

Slide.prototype = {

    get butt(){
    	return 'butt'
    }
}
module.exports = Slide;

