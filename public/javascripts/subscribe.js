//form to subscribe for email updates
$("#subscribe_button").on("click", function(event){
    //prevent page reload
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: "/subscribe",
        type: "POST",
        data: {
                email: {
                    "firstName" : $("#subscribe_first_name").val(),
                    "lastName" : $("#subscribe_last_name").val(),
                    "email" : $("#subscribe_email").val()
                }
            },
        success: (function(result){
            //reset form elements
            document.getElementById("form_subscribe").reset();

            //import ejs snippet
            var div = document.getElementById("subscribe_success");
            div.innerHTML = result;
        })
    });
})