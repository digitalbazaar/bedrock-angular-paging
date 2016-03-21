/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory() {
  return {
    restrict: 'E',
    scope: {
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-paging/paging.html'),
    link: Link
  };

  function Link(scope) {
    var model = scope.model = {};
    model.loading = true;
  }
}

return {brPaging: factory};

});
