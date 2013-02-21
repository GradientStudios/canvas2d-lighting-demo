define([
  'NormalBacking',
  'EaselJS',
  'assert'
], function(
  NormalBacking,
  createjs,
  assert
) {
  var VehicleView = function() {
    this.initialize();
  };

  var p = VehicleView.prototype = new createjs.Container();

  p.Container_initialize = p.initialize;
  p.initialize = function() {
    this.Container_initialize();

    this.loaded = false;
    this.diffuse = null;
    this.normals = null;
    this.normalBacking = null;
  };

  p.load = function( diffuseImg, normalsData ) {
    assert( diffuseImg.width === normalsData.w, 'Width mismatch' );
    assert( diffuseImg.height === normalsData.h, 'Height mismatch' );

    this.removeAllChildren();

    this.diffuse = this.addChild( new createjs.Bitmap( diffuseImg ));
    this.normalBacking = new NormalBacking( normalsData.w, normalsData.h );
    this.normals = this.addChild( new createjs.Bitmap( this.normalBacking.canvas ));

    this.normalBacking.addData( normalsData );

    this.regX = normalsData.w * 0.5;
    this.regY = normalsData.h * 0.5;

    this.loaded = true;
  };

  p.Container__tick = p._tick;
  p._tick = function( params ) {
    this.Container__tick( params );

    if ( this.loaded ) {
      var directionalLight = params[0];
      this.normalBacking.updateLight( directionalLight );
    }
  };

  return VehicleView;
});
