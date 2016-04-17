/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.component('brPaging', {
    bindings: {},
    controller: Ctrl,
    templateUrl:
      requirejs.toUrl('bedrock-angular-paging/pager-component.html')
  });
}

/* @ngInject */
function Ctrl() {
}

return register;

});
