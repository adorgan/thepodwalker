//form to subscribe for email updates
$("#subscribe_button").on("click", function(event){

    //show error if fields are left blank
    if($("#subscribe_first_name").val() === "" || $("#subscribe_last_name").val() === "" 
        || $("#subscribe_email").val() === ""){
        var div = document.getElementById("subscribe_success");
            div.innerHTML = "*All fields must be completed";
            div.style.color = "red";
        return false;
    }
    
    //prevent page reload
    event.preventDefault();
    event.stopPropagation();
    $.ajax({
        url: "/subscribe",
        type: "POST",
        data: {
            email: {
                firstName: $("#subscribe_first_name").val(),
                lastName: $("#subscribe_last_name").val(),
                email: $("#subscribe_email").val(),
            },
            captcha: $("#g-recaptcha-response").val(),
        },
        success: function (result) {
            //reset form elements
            document.getElementById("form_subscribe").reset();
            grecaptcha.reset();

            //import ejs snippet
            var div = document.getElementById("subscribe_success");
            div.innerHTML = result;

        },
    });
})