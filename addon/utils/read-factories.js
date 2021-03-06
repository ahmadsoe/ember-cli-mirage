/* global Ember, requirejs, require */
/*jslint node: true */

"use strict";

/*
  This function looks through all files that have been loaded by Ember CLI and
  finds the ones under /mirage/factories/, and exports a hash containing the names
  of the files as keys and the data as values.
*/
export default function(prefix) {
  var mirageFactoryFileRegExp = new RegExp('^' + prefix + '/mirage/factories');
  var factoryMap = {};

  Ember.keys(requirejs._eak_seen).filter(function(key) {
    return mirageFactoryFileRegExp.test(key);
  }).forEach(function(moduleName) {
    if (moduleName.match('.jshint')) { // ignore autogenerated .jshint files
      return;
    }

    var module = require(moduleName, null, null, true);
    if (!module) { throw new Error(moduleName + ' must export a factory.'); }

    var data = module['default'];
    var key = moduleName.match(/[^\/]+\/?$/)[0];

    factoryMap[key] = data;
  });

  return (Ember.keys(factoryMap).length !== 0) ? factoryMap : null;
}
