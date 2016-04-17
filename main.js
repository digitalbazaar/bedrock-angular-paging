/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './infinite-scroller-component',
  //'./pager-component'
], function(angular) {

'use strict';

var module = angular.module('bedrock.paging', []);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

return module.name;

});
