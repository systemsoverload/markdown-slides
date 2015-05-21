var fs = require('fs');
var Slide = require('./slide.js');


exports.parseFile = function(fileName){
	var data = fs.readFileSync(fileName, {encoding: 'utf8'});
	var slides_md = data.split('---');
	var slides = [];
	var configKeywords = {'title': {'global': true}, 'footer': {'global': true}, 'background': {'global': false}};
	var presentationCfg = {'theme': './test.css'};

	function parseSlide(slide){
		var lines = slide.split('\n');
		var cfg = {};
		var cfgLines = [];
		var images = [];

		lines.forEach(function(line, idx){
			var re = /!\[([^)]+)\]\(([^)]+)\)/;
			var match = line.match(re);
			if (match){
				console.log(match);
			}else{
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
			}


		});
		return {'cfg': cfg, 'cfgLines': cfgLines, 'images': images}
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
					var res = parseSlide(slide);
					var cfg = res.cfg;
					var cfgLines = res.cfgLines;
					var x = slide.split('\n').filter(function(e, idx, arr){ return !(cfgLines.indexOf(idx) > -1)}).join('\n');
					children.push(new Slide(cfg, subSlide, idx, [], true));
				}
			})
		}
		var res = parseSlide(slide);
		var cfg = res.cfg;

		var cfgLines = res.cfgLines;
		var x = slide.split('\n').filter(function(e, idx, arr){ return !(cfgLines.indexOf(idx) > -1)})

		// If a slide only has a single entry, assume its a title page and reverse the color scheme
		cfg.titleSlide = x.filter(function(item){ return !!(item.replace(/[\W_]+/g,"")); }).length == 1 ? true : false;

		slides.push(new Slide(cfg, x.join('\n'), slideNo, children, false));
	});

	return {'slides': slides, 'presentationCfg': presentationCfg}
}
