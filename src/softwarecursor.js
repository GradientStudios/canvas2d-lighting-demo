define([ 'EaselJS' ], function( createjs ) {
  var SoftwareCursor = function( renderer, input ) {
    this.renderer = renderer;
    this.input = input;

    this.cursor = null;

    this.input.on( 'pointermove', this.onPointerMove, this );
  };

  SoftwareCursor.prototype.load = function( img, regX, regY ) {
    if ( this.cursor && this.cursor.parent ) {
      this.cursor.parent.removeChild( this.cursor );
    }

    if ( typeof regX === 'undefined' ) {
      regX = img.width  * 0.5;
      regY = img.height * 0.5;
    }

    this.renderer.canvas.style.cursor = 'none';

    this.cursor = this.renderer.stage.addChild( new createjs.Bitmap( img ));
    this.cursor.regX = regX >>> 0;
    this.cursor.regY = regY >>> 0;
    this.onPointerMove( this.input.mousePosition );
  };

  SoftwareCursor.prototype.onPointerMove = function( position ) {
    if ( this.cursor ) {
      this.cursor.x = position[0];
      this.cursor.y = position[1];
    }
  };

  return SoftwareCursor;
});
