'use strict';

var compo = require('compo'),
    StandingState = require('./standing'),
    WalkingState = require('./walking'),
    JumpingState = require('./jumping'),
    ShootingState = require('./shooting'),
    DrawState = require('./draw');

var PlayerStateMachine = compo.extend(compo.StateMachine, function(args) {
  compo.StateMachine.call(this, {
    standing: new StandingState(args),
    walking: new WalkingState(args),
    jumping: new JumpingState(args),
    shooting: new ShootingState(args),
    draw: new DrawState(args)
  });

  this.setState('standing');
});

PlayerStateMachine.prototype.left = function() {
  this.currentState().left();
};

PlayerStateMachine.prototype.right = function() {
  this.currentState().right();
};

PlayerStateMachine.prototype.attack = function() {
  this.currentState().attack();
};

PlayerStateMachine.prototype.jump = function() {
  this.currentState().jump();
};

PlayerStateMachine.prototype.land = function() {
  this.currentState().land();
};

PlayerStateMachine.prototype.takeDamage = function() {
  this.currentState().takeDamage();
};

module.exports = PlayerStateMachine;