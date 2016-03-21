/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

/* @ngInject */
function factory($window) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      brResourceAmount: '@',
      brLimitAmount: '=',
      brViewportSelector: '@',
      brPagingFunction: '&'
    },
    templateUrl: requirejs.toUrl(
      'bedrock-angular-paging/infinite-scroll.html'),
    link: Link
  };

  function Link(scope, $element, $attrs, controller, $transclude) {
    var model = scope.model = {};
    model.loading = false;
    model.pagingFunction = scope.brPagingFunction;
    model.limitAmount = scope.brLimitAmount;
    model.viewportSelector = scope.brViewportSelector;
    model.resourceAmount = scope.brResourceAmount;
    model.offset = 0;
    model.currentAmount = model.limitAmount;

    var bottomElement = document.getElementById('infinite-scroll-bottom');

    console.log('limit amount', model.limitAmount);
    console.log('viewport selector', model.viewportSelector);
    console.log('Resource amount', scope.brResourceAmount);

    $attrs.$observe('brResourceAmount', function() {
      console.log("Resource amount changed to", scope.brResourceAmount);
      bottomElement = document.getElementById('infinite-scroll-bottom');
      triggerPageLoad();
    });

    if(!$transclude) {
      console.log("transclude error");
    }
    var innerScope = scope.$new();
    $transclude(scope.$parent, function(clone) {
      console.log("clone", clone);
      console.log("innerScope", innerScope);
      $element.prepend(clone);
      $element.on('$destroy', function() {
        innerScope.$destroy();
      });
    });

    bindScrollHandler();

    triggerPageLoad();

    function bindScrollHandler() {
      var viewport = angular.element($window);
      if(model.viewportSelector) {
        var viewportElem = angular.element(model.viewportSelector);
        if(hasScrollbar(viewportElem)) {
          viewport = viewportElem;
        }
      }
      viewport.bind('scroll', function() {
        if(isVisible(bottomElement) && model.loading === false) {
          triggerPageLoad();
          scope.$apply();
        }
      });
    }

    function triggerPageLoad() {
      if(model.currentAmount > scope.brResourceAmount) {
        // No more resources, don't trigger refresh
        console.log("Not triggering page load, current resource count", model.currentAmount);
        return;
      }
      model.loading = true;
      console.log('Trigger refresh with amount', model.currentAmount);
      model.pagingFunction(
        {
          limit: model.currentAmount,
          offset: model.offset,
          done: function() {
            model.currentAmount = model.currentAmount + model.limitAmount;
            model.loading = false;
            bindScrollHandler();
            scope.$apply();
            if(isVisible(bottomElement)) {
              console.log("Still visible space, triggering again");
              // There is still visible space, trigger refresh again
              triggerPageLoad();
            } else {
              console.log("No visible space");
            }
          }
        });
    }
    function isVisible(elem) {
      var top = elem.getBoundingClientRect().top, rect, elem = elem.parentNode;
      do {
        if(elem == null) {
          return false;
        }
        rect = elem.getBoundingClientRect();
        if(top <= rect.bottom === false) {
          return false;
        }
        elem = elem.parentNode;
      } while(elem != document.body);
      // Check its within the document viewport
      return top <= document.documentElement.clientHeight;
    }

    function hasScrollbar(elem) {
      return elem[0].scrollHeight > elem.height();
    }
  }
}

return {brInfiniteScroll: factory};

});
