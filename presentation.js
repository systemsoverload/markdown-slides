var marked = require('marked');
var pygmentize = require('pygmentize-bundled');

marked.setOptions({
    highlight: function (code, lang, callback) {
        pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
            callback(err, result.toString());
        })
    }
});


String.prototype.format = function(placeholders) {
    var s = this;
    for(var propertyName in placeholders) {
        var re = new RegExp('{' + propertyName + '}', 'gm');
        s = s.replace(re, placeholders[propertyName]);
    }
    return s;
};


function Presentation(slides, cfg){
    var self = this;
    self.slides = slides;
    self.title = cfg.title ? cfg.title : "";
    self.footer = cfg.footer ? '<div class="footer">'+ marked(cfg.footer) +'</div>' : "";
    self.stylesheet = '<link rel="stylesheet" href="'+cfg.theme+'"></link>';
    self.head = '<head><title>' + self.title + '</title>' + self.stylesheet + '</head>';
    self.body = '<body><div id="viewer"></div>' + self.footer;
    self.fileName = cfg.fileName;

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
        self.listeners[evt] = callback;
    }

    self.emit = function(evt, data){
        if (self.listeners[evt]){
            self.listeners[evt](data);
        }
    }
}

Presentation.prototype = {

    get html(){
        var endBody = '<div id="slide-number"></div><script type="text/javascript" src="viewer.js"></script></body>';
        return '<!DOCTYPE html><html>'+ this.head + this.body + endBody +'</html>';
    },

    get preview(){
        return self.slides[0].html
    },
}


module.exports = Presentation;
