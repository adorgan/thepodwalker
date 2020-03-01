//form to subscribe for email updates
$("#unsubscribe_button").on("click", function(event){

    if($("#unsubscribe_email").val() === ""){
        var div = document.getElementById("subscribe_success");
        
            div.innerHTML = "*Please enter a valid email address.";
            div.style.color = "red";
        return false;
    }
    
    //prevent page reload
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: "/unsubscribe/?_method=DELETE",
        type: "POST",
        data: {
                email: {
                    "email" : $("#unsubscribe_email").val()
                }
            },
        success: (function(result){
            //reset form elements
            document.getElementById("form_unsubscribe").reset();

            //import ejs snippet
            var div = document.getElementById("subscribe_success");
            div.innerHTML = result;
            div.style.color = "green";
        })
    });
})