define([ 'Events' ], function( Events ) {
  var InputController = function( canvas ) {
    this.canvas = canvas;

    // Mouse position given relative to center of canvas.
    this.mousePosition = new Int16Array([
      canvas.width  * -0.5,
      canvas.height * -0.5
    ]);

    this._mousemove = this.onMouseMove.bind( this );
    this.canvas.addEventListener( 'mousemove', this._mousemove );
  };

  Events.mixin( InputController.prototype );

  InputController.prototype.onMouseMove = function( e ) {
    // Extract mouse position.
    var posX = 0;
    var posY = 0;

    if ( !e ) { e = window.event; }

    if ( e.pageX || e.pageY ) {
      posX = e.pageX;
      posY = e.pageY;
    }

    else if ( e.clientX || e.clientY ) {
      posX = e.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
      posY = e.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    // Get canvas rect.
    var rect = this.canvas.getBoundingClientRect();
    var midX = ( rect.left + rect.right  ) * 0.5;
    var midY = ( rect.top  + rect.bottom ) * 0.5;

    // Get direction to pointer.
    this.mousePosition[0] = posX - midX;
    this.mousePosition[1] = posY - midY;

    this.trigger( 'pointermove', this.mousePosition );
  };

  return InputController;
});
