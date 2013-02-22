define([ 'Backbone' ], function( Backbone ) {
  var Events = Backbone.Events;

  return {
    mixin: function( obj ) {
      obj.on      = Events.on;
      obj.once    = Events.once;
      obj.off     = Events.off;
      obj.trigger = Events.trigger;
    }
  };
});
