"use strict";

define([
    "threejs",
    "scene"
], function (three, scene) {

    var clickedMaterial = new THREE.MeshBasicMaterial( {color: 0x0000ff} );

    function onDocumentMouseDown( event ) {
        event.preventDefault();

        var projector = new THREE.Projector();

        var x = (event.clientX / window.innerWidth) * 2 - 1;
        var y = -( event.clientY / window.innerHeight) * 2 + 1;
        var z = 0.5;
        var vector = new THREE.Vector3( x, y, z );

        var raycaster = projector.pickingRay( vector, scene.camera );

        /*
        lineGeometry = new THREE.Geometry();
        lineGeometry.vertices.push(raycaster.ray.origin);
        lineGeometry.vertices.push(raycaster.ray.direction);
        var line = new THREE.Line(lineGeometry, lineMaterial);
        g.scene.add(line);
        */

        var intersects = raycaster.intersectObjects(scene.scene.children, true);

        for (var i = 0, l = intersects.length; i < l; ++i) {
            intersects[i].object.material = clickedMaterial;
        }
    };

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

});
