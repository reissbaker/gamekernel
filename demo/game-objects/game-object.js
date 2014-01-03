!function(seine, exports) {
  'use strict';

  var Entity = seine.Entity,
      Position = exports.Position,
      Rect = exports.Rect,
      Direction = exports.Direction;

  exports.GameObject = Entity.extend({
    constructor: function(x, y, width, height) {
      this.loc = new Position;
      this.hitbox = new Rect(x, y, width, height);
      this.dir = new Direction;
      Entity.apply(this, arguments);
    }
  });

}(seine, demo);
