"use strict";

define([
    "jquery",
    "threejs",
    "statsjs"
], function ($, three, stats) {

    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    var clearColor = 0xff0000;
  
    var renderer = new THREE.WebGLRenderer ( { antialias: true } );
    renderer.setClearColor(clearColor, 1);
    renderer.setSize(WIDTH, HEIGHT);

    var camera = new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 1, 1000);
    camera.position.y = -33;
    camera.position.z = 30;
    camera.rotation.x = 45 * (Math.PI / 180);
 
    var scene = new THREE.Scene();

    //document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    //var projector = new THREE.Projector();

    //g.hexGrid = new HexagonGrid(7, 14, null, g.scene);

    var container = $("#container");

    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style['z-index'] = -1;
    container.append( renderer.domElement );

    var stats = new Stats();
    stats.domElement.style.float = 'right';
    container.append( stats.domElement );

    function renderScene() {
        requestAnimationFrame(function () {
            renderer.render(scene, camera);
            stats.update();
            renderScene();
        });
    }
    renderScene();

    return {
        scene: scene,
        camera: camera
    }

});
