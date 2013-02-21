define([ 'RectRecord' ], function( RectRecord ) {
  var NormalsCache = function( x, y, z ) {
    var invLength = 1 / Math.sqrt( x * x + y * y + z * z );
    this.direction = new Float64Array([
      x * invLength,
      y * invLength,
      z * invLength
    ]);

    this.rects = new RectRecord(4);
  };

  NormalsCache.prototype.addRect = function( x, y, w, h ) {
    return this.rects.addEntry( x, y, w, h );
  };

  NormalsCache.prototype.calculateLight = function( directionalLight ) {
    var lightDirection = directionalLight.direction;
    var dot =
      lightDirection[0] * this.direction[0] +
      lightDirection[1] * this.direction[1] +
      lightDirection[2] * this.direction[2];
    return Math.max( dot, 0 );
  };

  return NormalsCache;
});
