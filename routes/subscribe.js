var express = require("express");
var router = express.Router();
var Email = require("../models/email");
var transporter = require("./mailer");
const fetch = require("node-fetch");

//display subscribe page
router.get("/subscribe", function (req, res) {
    res.render("subscribe", { msg: "" });
});

//add new subsriber to database
router.post("/subscribe", function (req, res) {
    // reject subscription if user doesn't check captcha box
    if (!req.body.captcha) {
        var msgSuccess = "Unsuccessful. Please check box.";
        return res.render("partials/subscribe_unsuccessful", { msg: msgSuccess });
    }

    const verifyURL = "https://www.google.com/recaptcha/api/siteverify";

    async function fetchRecaptcha(){
        try {
            const recaptchaRes = await fetch(verifyURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${req.body.captcha}`,
            }).then((res) => res.json());

            if (recaptchaRes.success !== undefined && !recaptchaRes.success) {
                var msgSuccess = "Failed captcha, please try again.";
                return res.render("partials/subscribe_unsuccessful", {
                    msg: msgSuccess,
                });
            } else {
                var msgSuccess = "Thank you for subscribing!";
                return res.render("partials/subscribe_success", {
                    msg: msgSuccess,
                });
            }
        } catch (error) {
            console.log(error);
        }
        
    }

  fetchRecaptcha();


    // Email.create(req.body.email, function (err, newEmail) {
    //     if (err) {
    //         res.render("subscribe");
    //     }
    //     else {
    //         //send email confirmation
    //         var mailOptions = {
    //             from: 'thepodwalker@gmail.com',
    //             to: newEmail.email,
    //             subject: 'Thanks for signing up for the Pod Walker',
    //             html: "<div style='color:black;'>Hey "+ newEmail.firstName +",</div>"+
    //                   "<div style='color: black'>"+
    //                     "That was easy! You are now signed up to receive email notifications when new Pod Walker episodes are published."+
    //                   "</div>"+
    //                   "<br><br><br><div>"+
    //                   "<a style='text-decoration:none;color:blue;' href='https://thepodwalker.com/unsubscribe'>Unsubscribe</a></div>"
    //         };
    //         transporter.sendMail(mailOptions, function (error, info) {
    //             if (error) {
    //                 console.log(error);
    //             } else {
    //                 console.log('Email sent: ' + info.response);
    //             }
    //         });

    //         //send back partial template
    //         var msgSuccess = "Thank you for subscribing!";
    //         res.render("partials/subscribe_success", { msg: msgSuccess });
    //     }
    // });
});

//show unsubscribe page
router.get("/unsubscribe", function (req, res) {
    res.render("unsubscribe");
});

//delete email from database
router.delete("/unsubscribe", function(req,res){
    Email.find({"email": req.body.email.email}, function(err, email){
        if(err){
            console.log(err);
        }
        else{
            email.forEach(function(em){
                Email.findByIdAndRemove(em._id, function (err) {
                    if (err) {
                        console.log(err);
                        return false;
                    }
                    else {
                        console.log("deleted email");
                    }
                });
            })
            //send back partial template
            var msgSuccess = "You will not receive any more email notifications.";
            res.render("partials/subscribe_success", { msg: msgSuccess });
        }
    });
});

module.exports = router;