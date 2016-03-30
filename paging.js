/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './infinite-scroll-directive',
  './paging-directive',
], function(
  angular,
  infiniteScrollDirective,
  pagingDirective) {

'use strict';

var module = angular.module('bedrock.paging', []);

module.directive(infiniteScrollDirective);
module.directive(pagingDirective);

return module.name;

});
