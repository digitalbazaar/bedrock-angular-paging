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

module.directive('inject', function() {
  return {
    transclude: true,
    link: function($scope, $element, $attrs, controller, transclude) {
      console.log(angular);
      if(!transclude) {
        console.log("Transclude error");
      }
      var innerScope = $scope.$new();
      transclude(innerScope, function(clone) {
        $element.empty();
        $element.append(clone);
        $element.on('$destroy', function() {
          innerScope.$destroy();
        });
      });
    }
  };
});

return module.name;

});
