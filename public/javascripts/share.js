//Copies link of current article to clipboard

var shareBtn = document.getElementById("shareBtn");
shareBtn.addEventListener("click", function () {

    var dummy = document.createElement('input'),
        text = window.location.href;
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    alert("Article link copied to clipboard");
    document.body.removeChild(dummy);
});

var fbShare = document.getElementById("commentsIcon");
var plugin = document.getElementById("plugin");
fbShare.addEventListener("click", function(){
    plugin.scrollIntoView(true);
})