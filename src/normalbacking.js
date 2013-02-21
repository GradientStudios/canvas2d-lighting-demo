define([ 'NormalsCache' ], function( NormalsCache ) {
  function NormalBacking( width, height ) {
    this.normalsCache = {};
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = this.w = width;
    this.canvas.height = this.h = height;
    this.ctx = this.canvas.getContext( '2d' );
    this.ctx.fillStyle = '#000000';

    this.ctx.save();
  }

  NormalBacking.prototype.addData = function( normals ) {
    var data = normals.data;
    for ( var idx = 0; idx < data.length;) {
      var normalI = (( idx / 3 ) % normals.w ) * normals.scale;
      var normalJ = (( idx / 3 ) / normals.w >> 0 ) * normals.scale;

      var x = data[ idx++ ];
      var y = data[ idx++ ];
      var z = data[ idx++ ];

      var normalHash = x + ':' + y + ':' + z;

      x -= 128;
      y -= 128;
      z -= 128;

      // Transparent pixels from the normal map are interpreted as
      // (128, 128, 128).
      if ( !z && !x && !y) {
        continue;
      }

      var normalsCache = this.getNormalsCache( normalHash, x, y, z );
      var rectIdx = normalsCache.addRect(
        normalI,
        normalJ,
        normals.scale,
        normals.scale
      );
    }
  };

  NormalBacking.prototype.getNormalsCache = function( hash, x, y, z ) {
    var normalsCache = this.normalsCache[ hash ];
    if ( !normalsCache ) {
      normalsCache = this.normalsCache[ hash ] = new NormalsCache( x, y, z );
    }
    return normalsCache;
  };

  NormalBacking.prototype.updateLight = function( light ) {
    this.ctx.clearRect( 0, 0, this.w, this.h );
    var cache, idx, start, i, x, y, w, h;
    var hashes = Object.keys( this.normalsCache );
    for ( i = 0; i < hashes.length; ++i ) {
      cache = this.normalsCache[ hashes[i] ];
      var rects = cache.rects;

      // No rects to draw, so skip.
      if ( !rects.length ) {
        continue;
      }

      this.ctx.globalAlpha = 1 - cache.calculateLight( light );
      this.ctx.beginPath();
      rects.draw( this.ctx );
      this.ctx.fill();
    }

  };

  return NormalBacking;
});
