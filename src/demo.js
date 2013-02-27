require([
  'Renderer',
  'InputController',
  'SoftwareCursor',
  'VehicleView',
  'EaselJS',

  // Plugins or other modules that we don't need references to.
  'PreloadJS'
], function(
  Renderer,
  InputController,
  SoftwareCursor,
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
  var input = new InputController( renderer.canvas );
  var cursor = new SoftwareCursor( renderer, input );
  var vehicle = renderer.root.addChild( new VehicleView() );

  // Update sun position based on pointer position.
  input.on( 'pointermove', function( position ) {
    // Get direction to sun from center, and rotate in coordinate
    // space to proper 3D axes.
    var dirX =  position[0];
    var dirY = -position[1];

    // Assume mouse pointer is 200px "up" and normalize.
    var invLength = 1 / Math.sqrt( dirX * dirX + dirY * dirY + 40000 );
    gSunlight.direction[0] = dirX * invLength;
    gSunlight.direction[1] = dirY * invLength;
    gSunlight.direction[2] =  200 * invLength;
  });

  (function loadImages( vehicleView ) {
    var queue = new createjs.LoadQueue();

    queue.addEventListener( 'complete', function() {
      var diffuseImg = queue.getResult( 'diffuse' );
      var normalsImg = queue.getResult( 'normals' );
      var normalsData = processToData( normalsImg );

      vehicleView.load( diffuseImg, normalsData );

      cursor.load( queue.getResult( 'cursor' ));
    });

    queue.loadManifest([
      { id: 'diffuse', src: 'images/diffuse.png' },
      { id: 'normals', src: 'images/normals.png' },
      { id: 'cursor',  src: 'images/sun.png'     }
    ]);
  }( vehicle ));

  createjs.Ticker.useRAF = true;
  createjs.Ticker.setFPS( 60 );
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
