"use strict";

define([
    "threejs"
], function () {

    var hexGeometry = (function () {

        var geo = new THREE.Geometry();
        var verts = geo.vertices;

        verts.push(new THREE.Vector3(0, 0, 0));
        verts.push(new THREE.Vector3(-1, 2, 0));
        verts.push(new THREE.Vector3(1, 2, 0));
        verts.push(new THREE.Vector3(2, 0, 0));
        verts.push(new THREE.Vector3(1, -2, 0));
        verts.push(new THREE.Vector3(-1, -2, 0));
        verts.push(new THREE.Vector3(-2, 0, 0));

        geo.faces.push( new THREE.Face3(0, 2, 1) );
        geo.faces.push( new THREE.Face3(0, 3, 2) );
        geo.faces.push( new THREE.Face3(0, 4, 3) );
        geo.faces.push( new THREE.Face3(0, 5, 4) );
        geo.faces.push( new THREE.Face3(0, 6, 5) );
        geo.faces.push( new THREE.Face3(0, 1, 6) );

        geo.computeFaceNormals();

        return geo;

    }());

    function Hex(x, y, material) {

        this.name = "Hex";
        this.defaultMaterial = material || new THREE.MeshBasicMaterial( {color: 0x009900} );


        this.mesh = new THREE.Mesh(hexGeometry, this.defaultMaterial);
        //this.mesh.parent = this;
        this.mesh.position.set(x, y, 0);

    };

    function HexGrid(sizeX, sizeY, scene) {

        this.scene = scene;
        
        this._newHex = function (x, y) {

            var xPos = x*6;
            var yPos = y*2;

            // If y is NOT an even number.
            if ( y%2 ) {
                xPos+=3;
            }

            // Padding.
            xPos+=(x*0.2);
            yPos+=(y*0.2);

            // Center grid.
            xPos-=(sizeX*3);
            yPos-=(sizeY*1);

            var hex = new Hex(xPos, yPos);
            this.scene.add(hex.mesh);

            return hex;
        };

        this._buildGrid = function (sizeX, sizeY) {

            var g = this.grid = {};
            for (var x = 0; x < sizeX; ++x) {
                g[x] = {};
                for (var y = 0; y < sizeY; y++) {
                    g[x][y] = this._newHex(x, y);
                };
            };
            return g;

        };

        this.grid = {};
        this._buildGrid(sizeX, sizeY);
    };

    return HexGrid;
});
