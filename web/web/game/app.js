define([
    'jquery',
    'router'
], function ($, Router) {

    $(document).ajaxSend(function (e, xhr, settings) {
        if (!settings.xhrFields) settings.xhrFields = {};
        settings.xhrFields.withCredentials = true;
    });

    $(document).ajaxSuccess(function (e, xhr, settings) {
        console.log("Response: " + xhr.responseText);
    });


    return function () {
        Router.initialize();
    };
});
