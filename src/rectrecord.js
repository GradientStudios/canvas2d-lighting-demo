define(function() {
  var RectRecord = function( numInitialRects ) {
    this.rects = new Uint16Array( this.NUM_ENTRIES * numInitialRects );
    this.length = 0;
  };
  RectRecord.prototype.NUM_ENTRIES = 4;

  RectRecord.prototype.resizeArrays = function() {
    var newArr = new Uint16Array( this.rects.length * 2 );
    newArr.set( this.rects );
    this.rects = newArr;
  };

  RectRecord.prototype.addEntry = function( x, y, w, h ) {
    var idx = this.length * this.NUM_ENTRIES;

    if ( idx === this.rects.length ) {
      this.resizeArrays();
    }

    // Store record
    this.rects[ idx + 0 ] = x;
    this.rects[ idx + 1 ] = y;
    this.rects[ idx + 2 ] = w;
    this.rects[ idx + 3 ] = h;

    this.length += 1;
  };

  RectRecord.prototype.draw = function( ctx ) {
    var length = this.length * this.NUM_ENTRIES;
    for ( var idx = 0; idx < length; idx += this.NUM_ENTRIES ) {
      var x = this.rects[ idx + 0 ];
      var y = this.rects[ idx + 1 ];
      var w = this.rects[ idx + 2 ];
      var h = this.rects[ idx + 3 ];

      ctx.rect( x, y, w, h );
    }
  };

  return RectRecord;
});
