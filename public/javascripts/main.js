//find Load More button
var loadBtn = document.getElementById("loadEpBtn");

//number of loaded episodes beyond initial load
var epCount = 0;

//ajax request for more episodes to load
loadBtn.addEventListener("click", function(){
    
    $.ajax({
        url: "/loadEpisodes",
        type: "GET",
        data: {
                loadIndex : epCount  
            },
        success: (function(result){

            //import ejs snippet
            var divEp = document.getElementById("loadedEpisodes");
            var divNew = document.createElement("div");
            divNew.innerHTML = result;
            //add new episodes to list
            divEp.appendChild(divNew);
            
            //increment loaded episode count
            epCount =+ 3;

            //if episode 0 exists, hide Load More button
            if($('#episode0').length){
                loadBtn.style.display = "none";
            }
        })
    });
})