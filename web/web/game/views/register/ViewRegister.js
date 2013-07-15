define([
    'jquery',
    'underscore',
    'backbone',
    'user',
    'text!html/register.html'
], function ($, _, Backbone, user, registerTemplate) {

    return Backbone.View.extend({
        name: "ViewRegister",
        el: $("#content"),
            
        events: {
            "submit .basicRegistrationForm form": "register"
        },

        render: function () {
            $("#content").html(registerTemplate);
            $('.menu li').removeClass('active');
            $('.menu li a[href="#/register"]').parent().addClass('active'); 

            this.el = $('.basicRegistrationForm'); 
        },

        register: function (e) {
            e.preventDefault();

            var username    = this.$('input[name=username]').val();
            var password    = this.$('input[name=password]').val();
            var password_c  = this.$('input[name=password_c]').val();

            if (password !== password_c) {
                $('.formError').html("Passwords do not match.");
                return;
            }

            console.log("Send register request!");

            user.register(username, password, function (err) {
                if (err) return $('.formError').html(err.message);
                return window.location.hash = 'about'
            });

        }

    });
});
