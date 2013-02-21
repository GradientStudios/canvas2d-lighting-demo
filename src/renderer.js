define([ 'EaselJS' ], function( createjs ) {
  var Renderer = function( w, h ) {
    this.w = w;
    this.h = h;

    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = w;
    this.canvas.height = h;

    this.stage = new createjs.Stage( this.canvas );
    this.stage.regX = -0.5 * w;
    this.stage.regY = -0.5 * h;

    this.background = this.stage.addChild( new createjs.Shape() );
    this.root = this.stage.addChild( new createjs.Container() );
  };

  Renderer.prototype.setBackgroundColor = function( color ) {
    var x = -0.5 * this.w;
    var y = -0.5 * this.h;

    this.background.graphics
      .beginFill( color )
      .rect( x, y, this.w, this.h );

    this.background.cache( x, y, this.w, this.h );
  };

  return Renderer;
});
