define([
    'jquery',
    'scene',
    'HexGrid',
    'input'
], function ($, scene, HexGrid, input) {

    $(document).ajaxSend(function (e, xhr, settings) {
        if (!settings.xhrFields) settings.xhrFields = {};
        settings.xhrFields.withCredentials = true;
    });

    $(document).ajaxSuccess(function (e, xhr, settings) {
        console.log("Response: " + xhr.responseText);
    });

    return function () {
        var hexGrid = new HexGrid(7, 14, scene.scene);
    };
    
});
