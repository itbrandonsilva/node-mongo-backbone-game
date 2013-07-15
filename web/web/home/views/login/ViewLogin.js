define([
    'jquery',
    'underscore',
    'backbone',
    'user',
    'text!html/login.html'
], function ($, _, Backbone, user, loginTemplate) {

    return Backbone.View.extend({
        name: "ViewLogin",
        el: $("#content"),
            
        events: {
            "submit .basicLoginForm form": "login"
        },

        render: function () {
            this.$el.html(loginTemplate);
            $('.menu li').removeClass('active');
            $('.menu li a[href="#"]').parent().addClass('active'); 
        },

        login: function (e) {
            e.preventDefault();

            var username = this.$('input[name=username]').val();
            var password = this.$('input[name=password]').val();

            user.login(username, password, function (err, data) {
                if (data.status = "Ok") return user.directToGame();

                var error = $('.formError');

                if (data.error && data.message) return error.html(data.message);
                if (data.error) return error.html(data.status + ": " + data.error);
                if (err) return error.html(err.message);
                return error.html("Unknown server side error.");
            });
        }
    });
});
