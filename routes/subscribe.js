const express = require("express");
const router = express.Router();
const Email = require("../models/email");
const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");

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
                Email.create(req.body.email, function (err, newEmail) {
                    if (err) {
                        res.render("subscribe");
                    } else {
                        sendEmail();
                        var msgSuccess = "Thank you for subscribing!";
                        return res.render("partials/subscribe_success", {
                            msg: msgSuccess,
                        });
                    }
                });
                
            }
        } catch (error) {
            console.log(error);
        }
        
    }

  fetchRecaptcha();

  const sendEmail = () => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
          to: req.body.email.email, // recipient
          from: "The Podwalker <tim@thepodwalker.com>", //verified sender
          templateId: process.env.TEMPLATE_ID_SUBSCRIBE,
          dynamic_template_data: {
              name: req.body.email.firstName,
          },
      };
      sgMail
          .send(msg)
          .then(() => {
              console.log("Email sent");
          })
          .catch((error) => {
              console.error(error);
          });
  }

    
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