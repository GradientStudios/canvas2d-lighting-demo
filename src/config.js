require.config({
  deps: [ 'demo' ],

  paths: {
    EaselJS: 'http://code.createjs.com/easeljs-0.6.0.min',
    PreloadJS: 'http://code.createjs.com/preloadjs-0.3.0.min'
  },

  shim: {
    PreloadJS: {
      exports: 'createjs'
    },

    EaselJS: {
      exports: 'createjs'
    }
  }
});
