/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import InfiniteScrollerComponent from './infinite-scroller-component.js';

var module = angular.module('bedrock.paging', []);

module.component('brInfiniteScroller', InfiniteScrollerComponent);
