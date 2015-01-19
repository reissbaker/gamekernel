'use strict';

var compo = require('compo'),
    Matrix = require('../data/matrix'),
    CollisionGrid = require('../physics/grid'),
    GridGraphic = require('../graphics/grid-graphic'),
    Point = require('../data/point');

var url = '/assets/bugtilesbrown.png';

module.exports = function(engine, world, matrix) {
  var entity = world.entity();
  var loc = new Point;
  var tileSize = new Point(16, 16);

  var grid = new CollisionGrid(loc, matrix, tileSize, [22], 'level');
  engine.physics.grids.attach(entity, grid);

  var backdropMatrix = new Matrix(matrix.numRows, matrix.numCols, 59);
  var backdrop = new GridGraphic({
    position: loc,
    url: url,
    matrix: backdropMatrix,
    tileSize: tileSize,
    crop: { x: 0, y: 0, width: 169, height: 169 },
    spacing: 1,
    parallax: 0.5
  });
  engine.renderer.table.attach(entity, backdrop);


  var graphics = new GridGraphic({
    position: loc,
    url: url,
    matrix: matrix,
    tileSize: tileSize,
    crop: { x: 0, y: 0, width: 169, height: 169 },
    spacing: 1
  });

  engine.renderer.table.attach(entity, graphics);

  return new Level(loc, grid, graphics);
};

function Level(loc, grid, graphics) {
  this.loc = loc;
  this.grid = grid;
  this.graphics = graphics;
}
