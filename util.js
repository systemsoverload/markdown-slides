var fs = require('fs');
var Slide = require('./slide.js');

exports.parseFile = function(fileName){
	var data = fs.readFileSync(fileName, {encoding: 'utf8'});
	var slides_md = data.split('---').slice(2, data.split('---').length)
	var pCfg = data.split('---').slice(1, 2)[0].trim().split('\n')
	var slides = [];
	var presentationCfg = {'theme': './test.css'};

	//Rip through the yaml-ish cfg at the top of the presentation
	pCfg.forEach(function(option){
		var optionName = option.split(':')[0]
		var optionValue = option.split(optionName + ':')[1]
		presentationCfg[optionName] = optionValue;
	});


	function parseSlide(slide){
		var lines = slide.split('\n');
		var cfg = {};
		var cfgLines = [];
		var images = [];

		lines.forEach(function(line, lineNo){
			//Find things that look like MD image defs
			var imgRe = /!\[([^)]*)\]\(([^)]+)\)/;
			var match = line.match(imgRe);
			if (match){
				images.push({'url': match[2], 'options': match[1].split(' ')})
				cfgLines.push(lineNo)
			}
		});

		cfg['images'] = images;

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
					var res = parseSlide(slide);

					// Strip any lines that were determined to be config values
					var cfgLessLines = slide.split('\n').filter(function(e, id, arr){ return !(res.cfgLines.indexOf(idx) > -1)}).join('\n');
					children.push(new Slide(res.cfg, subSlide, idx, [], true));
				}
			})
		}
		var res = parseSlide(slide);
		var cfg = res.cfg;
		var cfgLines = res.cfgLines;

		// Strip any lines that were determined to be config values
		var cfgLessLines = slide.split('\n').filter(function(e, idx, arr){ return !(cfgLines.indexOf(idx) > -1)})

		// If a slide only has a single entry, assume its a title page and reverse the color scheme
		cfg.titleSlide = cfgLessLines.filter(function(item){ return !!(item.replace(/[\W_]+/g,"")); }).length == 1 ? true : false;

		slides.push(new Slide(cfg, cfgLessLines.join('\n'), slideNo, children, false));
	});

	return {'slides': slides, 'presentationCfg': presentationCfg}
}
