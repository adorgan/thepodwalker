var btnPhotos = document.getElementById("photoBtn");

var div = document.getElementById("morePhotos");

var count = 2;



btnPhotos.addEventListener("click", function(event){
    
    var parentDiv = document.createElement("div");
    parentDiv.classList.add("form-group");
    var photoLabel = document.createElement("label");
    photoLabel.innerHTML = "Image " + count;
    var photoInput = document.createElement("input");
    photoInput.setAttribute("type", "file");
    photoLabel.classList.add("pr-2");
    photoInput.name = "blog[image]";
    
    parentDiv.appendChild(photoLabel);
    parentDiv.appendChild(photoInput);

    var captionDiv = document.createElement("div");
    captionDiv.classList.add("form-group");
    var captionLabel = document.createElement("label");
    captionLabel.innerHTML = "Image " + count + " Caption";
    var captionInput = document.createElement("input");
    captionInput.setAttribute("type", "text");
    captionInput.classList.add("form-control");
    captionInput.name = "blog[caption]";
    
    captionDiv.appendChild(captionLabel);
    captionDiv.appendChild(captionInput);

    div.append(parentDiv);
    div.append(captionDiv);
    event.preventDefault();

    count++;
})

