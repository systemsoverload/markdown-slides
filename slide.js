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
	self.backgroundImg = backgroundImgUrl ? '<div class="background-image" style="background: url(\''+backgroundImgUrl +'\') no-repeat center center fixed;"></div>' : '';

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
