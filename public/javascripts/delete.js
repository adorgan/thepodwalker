// ask admin if they really want to delete blog post
$('.delete').on('click',function(){
    if(window.confirm("Are you sure you want to delete this episode?")){
        $.ajax({
            url: "/admin/episodes/" + $(this).attr('id') + "?_method=DELETE",
            type: "POST",
            data: {
                    podcast_id : $(this).attr('id')  
                },
            success: (function(result){
    
               location.reload();
            })
        });
    }
    
});