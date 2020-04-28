var slides = document.getElementsByClassName("mySlides");
var images = document.getElementsByTagName("img");

var imageAlts = document.getElementsByTagName("img");
var alts = [];

for(var i = 0; i < imageAlts.length; i++){
    alts[i] = imageAlts[i].alt;
    
}




var longest = "";
for(var i = 0; i < imageAlts.length; i++){
    if(alts[i].length >= longest.length){
        longest = alts[i];
    }
}

var slideIndex = 1;

var divComment = document.getElementById("caption-container");
var caption = document.getElementById("caption");

function calcCommentHeight(){
  
    caption.innerHTML = longest;
    divComment.style.height = caption.offsetHeight + 12 ;
    caption.innerHTML = images[slideIndex-1].alt;
}
calcCommentHeight();



showSlides(slideIndex);

slideFadeCount = 0;

function plusSlides(n) {
  if(slideFadeCount == 0){
      var picDivs = document.getElementsByClassName("mySlides");
      for(var i = 0; i < picDivs.length; i++){
        picDivs[i].classList.add("fade");
      }
      slideFadeCount++;
  }
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  
  
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  
  slides[slideIndex-1].style.display = "block";  
  var caption = document.getElementById("caption");
  caption.innerHTML = images[slideIndex-1].alt;
}