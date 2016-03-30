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
      brTotalAmount: '=',
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
    model.totalAmount = scope.brTotalAmount;
    model.offset = 0;
    model.currentAmount = model.limitAmount;

    var bottomElement = document.getElementById('infinite-scroll-bottom');

    scope.$watch('brTotalAmount', function() {
      bottomElement = document.getElementById('infinite-scroll-bottom');
      model.currentAmount = model.limitAmount;
      triggerPageLoad();
    });

    if(!$transclude) {
      console.log("transclude error");
    }
    var innerScope = scope.$new();
    $transclude(scope.$parent, function(clone) {
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
      viewport.bind('scroll', scrollHandler);
    }
    function unbindScrollHandler() {
      var viewport = angular.element($window);
      if(model.viewportSelector) {
        var viewportElem = angular.element(model.viewportSelector);
        if(hasScrollbar(viewportElem)) {
          viewport = viewportElem;
        }
      }
      viewport.unbind('scroll', scrollHandler);
    }
    function scrollHandler() {
      if(isVisible(bottomElement) && model.loading === false) {
        triggerPageLoad();
        scope.$apply();
      }
    }

    function triggerPageLoad() {
      var ceiling = parseInt(scope.brTotalAmount) + model.limitAmount;
      if(ceiling == NaN) {
        // Some error occured, just default to the limit amount
        ceiling = model.limitAmount;
      }
      if(model.currentAmount > ceiling) {
        unbindScrollHandler();
        // No more resources, don't trigger refresh
        return;
      }
      model.loading = true;
      model.pagingFunction(
        {
          limit: model.currentAmount,
          offset: model.offset,
          done: function() {
            model.currentAmount = model.currentAmount + model.limitAmount;
            model.loading = false;
            bindScrollHandler();
            if(isVisible(bottomElement)) {
              // There is still visible space, trigger refresh again
              triggerPageLoad();
            }
            scope.$apply();
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
