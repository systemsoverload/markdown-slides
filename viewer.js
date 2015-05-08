document.addEventListener('DOMContentLoaded', function () {

	//FIXME - wrap all of this up in a function
	var position = 0;
	var slides = document.getElementsByTagName('slide');
	var viewer = document.getElementById('viewer');
	var slideNumber = document.getElementById('slide-number');
	viewer.innerHTML = slides[position].innerHTML;
	slideNumber.innerHTML = position + 1 + '/' + slides.length;

	document.addEventListener('keyup', function(e){
		e.preventDefault();
		if (e.keyCode == 37){
			if (position > 0){
				position -= 1;
				viewer.innerHTML = slides[position].innerHTML;
				slideNumber.innerHTML = position + 1 + '/' + slides.length;
			}
		}else if (e.keyCode == 39){
			if (position < slides.length - 1){			
				position += 1;
				viewer.innerHTML = slides[position].innerHTML;
				slideNumber.innerHTML = position + 1 + '/' + slides.length;
			}
		}
	});
});