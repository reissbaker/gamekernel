// Generated by CoffeeScript 1.7.1
(function() {
  var Component, Database, Table, expect;

  expect = require('chai').expect;

  Table = require('../../../build/lib/core/table');

  Component = require('../../../build/lib/core/component');

  Database = require('../../../build/lib/core/database');

  describe('table', function() {
    var db, table;
    db = null;
    table = null;
    beforeEach(function() {
      db = new Database;
      return table = db.table();
    });
    describe('attach', function() {
      it('attaches a component to an entity', function() {
        var component, entity;
        entity = db.entity();
        component = new Component;
        table.attach(entity, component);
        return expect(table.getComponents(entity)).to.deep.equal([component]);
      });
      it('sets the component\'s entity', function() {
        var component, entity;
        entity = db.entity();
        component = new Component();
        table.attach(entity, component);
        return expect(component.entity).to.equal(entity);
      });
      it('fires the attach event', function(done) {
        var entity;
        entity = db.entity();
        table.on('attach', function() {
          return done();
        });
        return table.attach(entity, new Component);
      });
      return it('passes the attached component to the attach event handler', function(done) {
        var component, entity;
        entity = db.entity();
        component = new Component;
        table.on('attach', function(attached) {
          expect(attached).to.equal(component);
          return done();
        });
        return table.attach(entity, component);
      });
    });
    describe('detach', function() {
      it('detaches a component from an entity if it is attached', function() {
        var component, entity, other;
        entity = db.entity();
        component = new Component;
        other = new Component;
        table.attach(entity, component);
        table.attach(entity, other);
        table.detach(entity, component);
        return expect(table.getComponents(entity)).to.deep.equal([other]);
      });
      it('deletes cleans up internal state if all components are detached', function() {
        var component, entity;
        entity = db.entity();
        component = new Component;
        table.attach(entity, component);
        table.detach(entity, component);
        return expect(table.getComponents(entity)).to.equal(void 0);
      });
      it('does nothing if the component isn\'t attached to the entity', function() {
        var a, b, component;
        a = db.entity();
        b = db.entity();
        component = new Component;
        table.attach(a, component);
        table.detach(b, component);
        expect(table.getComponents(a)).to.deep.equal([component]);
        return expect(component.entity).to.equal(a);
      });
      it('does nothing if the component is completely unattached', function() {
        var component, entity;
        entity = db.entity();
        component = new Component;
        return table.detach(entity, component);
      });
      it('fires the detach event', function(done) {
        var component, entity;
        entity = db.entity();
        component = new Component;
        table.on('detach', function() {
          return done();
        });
        table.attach(entity, component);
        return table.detach(entity, component);
      });
      return it('passes the detached component to the detach event handler', function(done) {
        var component, entity;
        entity = db.entity();
        component = new Component;
        table.attach(entity, component);
        table.on('detach', function(detached) {
          expect(detached).to.equal(component);
          return done();
        });
        return table.detach(entity, component);
      });
    });
    return describe('detachAllFrom', function() {
      it('detaches all components from a given entity', function() {
        var entity;
        entity = db.entity();
        table.attach(entity, new Component);
        table.attach(entity, new Component);
        table.attach(entity, new Component);
        table.detachAllFrom(entity);
        return expect(table.getComponents(entity)).to.equal(void 0);
      });
      it('does nothing if the entity has no components', function() {
        var entity;
        entity = db.entity();
        return table.detachAllFrom(entity);
      });
      return it('fires detach events for all detached components', function(done) {
        var a, all, b, c, entity, times;
        entity = db.entity();
        a = table.attach(entity, new Component);
        b = table.attach(entity, new Component);
        c = table.attach(entity, new Component);
        all = [a, b, c];
        times = all.length;
        table.on('detach', function(component) {
          expect(all).to.include.members([component]);
          times--;
          if (times === 0) {
            return done();
          }
        });
        return table.detachAllFrom(entity);
      });
    });
  });

}).call(this);
