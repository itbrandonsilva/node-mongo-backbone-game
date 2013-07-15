define([
    'jquery',
    'underscore',
    'backbone',
    'text!html/about.html'
], function ($, _, Backbone, loginTemplate) {

    return Backbone.View.extend({
        name: "ViewAbout", 
        el: $("#content"),
            
        render: function () {
            this.$el.html(loginTemplate);
            $('.menu li').removeClass('active');
            $('.menu li a[href="#/about"]').parent().addClass('active'); 
        }

    });

});
