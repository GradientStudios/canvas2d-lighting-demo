require.config({
  deps: [ 'demo' ],

  paths: {
    Events: 'events',
    InputController: 'inputcontroller',
    NormalBacking: 'normalbacking',
    NormalsCache: 'normalscache',
    RectRecord: 'rectrecord',
    Renderer: 'renderer',
    SoftwareCursor: 'softwarecursor',
    VehicleView: 'vehicleview',

    lodash: 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.1/lodash.min',
    Backbone: 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min',
    EaselJS: 'http://code.createjs.com/easeljs-0.6.0.min',
    PreloadJS: 'http://code.createjs.com/preloadjs-0.3.0.min'
  },

  shim: {
    Backbone: {
      deps: [ 'lodash' ],
      exports: 'Backbone'
    },

    PreloadJS: {
      exports: 'createjs'
    },

    EaselJS: {
      exports: 'createjs'
    }
  }
});
