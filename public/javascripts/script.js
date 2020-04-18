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


var divComment = document.getElementById("caption-container");
var caption = document.getElementById("caption");

function calcCommentHeight(){
    caption.innerHTML = longest;
    divComment.style.height = caption.offsetHeight + 12 ;
}
calcCommentHeight();


var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var images = document.getElementsByTagName("img");
  
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  
  slides[slideIndex-1].style.display = "block";  
  var caption = document.getElementById("caption");
  caption.innerHTML = images[slideIndex-1].alt;
}