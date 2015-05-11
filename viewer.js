document.addEventListener('DOMContentLoaded', function () {

	//FIXME - wrap all of this up in a function
	position = 0;
	childPosition = 0;

	slides = document.getElementsByTagName('slide');
	viewer = document.getElementById('viewer');
	slideNumber = document.getElementById('slide-number');
	viewer.innerHTML = slides[position].innerHTML;
	slideNumber.innerHTML = position + 1 + '/' + slides.length;

	document.addEventListener('keyup', function(e){
		e.preventDefault();
		if (e.keyCode == 37){
			if (position > 0){
				position -= 1;
				viewer.innerHTML = slides[position].innerHTML;
				slideNumber.innerHTML = position + 1 + '/' + slides.length;
				childPosition = 0;
			}
		}else if (e.keyCode == 39){
			if (position < slides.length - 1){
				position += 1;
				viewer.innerHTML = slides[position].innerHTML;
				slideNumber.innerHTML = position + 1 + '/' + slides.length;
				childPosition = 0;
			}
		}else if (e.keyCode == 38){
			// Key Up
			var childSlides = slides[position].getElementsByTagName('subslide');
			if (childSlides.length){
				childPosition -= 1;
				delete viewer.getElementsByTagName('subslide')
			}
		}else if (e.keyCode == 40){
			// Key Down
			var childSlides = slides[position].getElementsByTagName('subslide');
			if (childSlides.length){
				viewer.innerHTML += childSlides[childPosition].outerHTML;
				childPosition += 1;
			}
		}
	});
});
