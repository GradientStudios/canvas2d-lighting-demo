require([
  'Renderer',
  'VehicleView',
  'EaselJS',

  // Plugins or other modules that we don't need references to.
  'PreloadJS'
], function(
  Renderer,
  VehicleView,
  createjs
) {
  // Direction of the sun.
  var gSunlight = {
    direction: new Float64Array([
     -0.5773502691896258,
      0.5773502691896258,
      0.5773502691896258
    ])
  };

  var renderer = new Renderer( 400, 400 );
  renderer.setBackgroundColor( 'black' );
  document.body.appendChild( renderer.canvas );
  var vehicle = renderer.root.addChild( new VehicleView() );

  renderer.canvas.addEventListener( 'mousemove', function( e ) {
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
    var rect = renderer.canvas.getBoundingClientRect();
    var midX = ( rect.left + rect.right  ) * 0.5;
    var midY = ( rect.top  + rect.bottom ) * 0.5;

    // Get pointer position.
    var dx = posX - midX;
    var dy = posY - midY;

    // Assume mouse pointer is 200px "up" and normalize.
    var invLength = 1 / Math.sqrt( dx * dx + dy * dy + 40000 );
    gSunlight.direction[0] =  dx * invLength;
    gSunlight.direction[1] = -dy * invLength;
    gSunlight.direction[2] = 200 * invLength;
  });

  (function loadImages( vehicleView ) {
    var queue = new createjs.LoadQueue();

    queue.addEventListener( 'complete', function() {
      var diffuseImg = queue.getResult( 'diffuse' );
      var normalsImg = queue.getResult( 'normals' );
      var normalsData = processToData( normalsImg );

      vehicleView.load( diffuseImg, normalsData );
    });

    queue.loadManifest([
      { id: 'diffuse', src: 'images/diffuse.png' },
      { id: 'normals', src: 'images/normals.png' }
    ]);
  }( vehicle ));

  createjs.Ticker.useRAF = true;
  createjs.Ticker.addEventListener( 'tick', function() {
    renderer.stage.update( gSunlight );
  });

  // Utility functions.
  function processToData( img, assetInfo ) {
    if ( !assetInfo ) { assetInfo = {}; }

    var normCanvas = document.createElement( 'canvas' );
    var normCtx = normCanvas.getContext( '2d' );

    var x = assetInfo.x || 0;
    var y = assetInfo.y || 0;
    var w = img.width;
    var h = img.height;
    var scale = assetInfo.scale;
    scale = scale === undefined ? 1 : scale;

    normCanvas.width = w;
    normCanvas.height = h;
    normCtx.clearRect( 0, 0, w, h );
    normCtx.drawImage( img, x, y, w, h, 0, 0, w, h );

    var data = new Uint8Array( w * h * 3 );

    var normMap = normCtx.getImageData(0, 0, w, h);
    for ( var i = 0; i < w * h; ++i ) {
      var mapOffset = i * 4;
      var dataOffset = i * 3;
      var alphaChannel = normMap.data[ mapOffset + 3 ];

      // Has any alpha
      if ( alphaChannel ) {
        var r = normMap.data[ mapOffset + 0 ];
        var g = normMap.data[ mapOffset + 1 ];
        var b = normMap.data[ mapOffset + 2 ];

        // Normals to World
        //   R: -Y
        //   G: +X
        //   B: +Z
        data[ dataOffset + 0 ] = g;
        data[ dataOffset + 1 ] = r ? 256 - r : 255;
        data[ dataOffset + 2 ] = b;
      }

      // Has no alpha, pretend it is (0, 0, 0).
      else {
        data[ dataOffset + 0 ] = 128;
        data[ dataOffset + 1 ] = 128;
        data[ dataOffset + 2 ] = 128;
      }
    }

    return {
      data: data,
      w: w,
      h: h,
      scale: scale
    };
  }
});
