/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define(['angular'], function(angular) {

'use strict';

function register(module) {
  module.component('brInfiniteScroller', {
    bindings: {
      canScroll: '<brCanScroll',
      // TODO: replace "canScroll" with one of these?, deprecate brCanScroll
      //pagesRemaining: '<?brPagesRemaining',
      //hasMore: '<?brHasMorePages',
      viewportSelector: '@?brScrollViewport',
      onLoadPage: '&brOnLoadPage'
    },
    transclude: true,
    controller: Ctrl,
    templateUrl:
      requirejs.toUrl('bedrock-angular-paging/infinite-scroller-component.html')
  });
}

/* @ngInject */
function Ctrl($element, $scope, $timeout, $window) {
  var self = this;
  self.loading = false;

  var viewport;
  var bottom = getBottom($element);

  // watch for scrollability changes
  $scope.$watch(function() {
    return self.canScroll;
  }, function(canScroll) {
    if(canScroll) {
      // handle scroll changes
      bindScrollHandler();
      // schedule a check to see if another page load is needed after digest
      $timeout(loadPageAsNeeded);
    } else {
      unbindScrollHandler();
    }
  });

  // cleanup scroll handler when component is destroyed
  self.$onDestroy = function() {
    unbindScrollHandler();
    viewport = bottom = null;
  };

  function bindScrollHandler() {
    if(viewport) {
      unbindScrollHandler();
    }
    viewport = angular.element($window);
    if(self.viewportSelector) {
      var customViewport = angular.element(self.viewportSelector);
      if(hasScrollbar(customViewport)) {
        viewport = customViewport;
      }
    }
    viewport.bind('scroll', loadPageAsNeeded);
  }

  function unbindScrollHandler() {
    if(viewport) {
      viewport.unbind('scroll', loadPageAsNeeded);
      viewport = null;
    }
  }

  function loadPageAsNeeded() {
    if(!self.loading && isVisible(bottom)) {
      triggerPageLoad();
    }
  }

  function triggerPageLoad() {
    if(!self.canScroll) {
      // no more items, don't trigger refresh
      return;
    }
    self.loading = true;
    Promise.resolve(self.onLoadPage()).catch(function() {}).then(function() {
      self.loading = false;
      $scope.$apply();
      // another page may be required
      loadPageAsNeeded();
    });
  }

  function isVisible(elem) {
    var top = elem.getBoundingClientRect().top;
    var rect;
    elem = elem.parentNode;
    do {
      if(elem === null) {
        return false;
      }
      rect = elem.getBoundingClientRect();
      if(top >= rect.bottom) {
        return false;
      }
      elem = elem.parentNode;
    } while(elem != document.body);
    // check its within the document viewport
    return top <= document.documentElement.clientHeight;
  }

  function hasScrollbar(elem) {
    return elem[0].scrollHeight > elem.height();
  }

  function getBottom() {
    return $element[0].querySelector('.br-infinite-scroller-bottom');
  }
}

return register;

});
