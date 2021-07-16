(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CarbonLayout = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var unstable_tokens = [// Spacing
  'spacing01', 'spacing02', 'spacing03', 'spacing04', 'spacing05', 'spacing06', 'spacing07', 'spacing08', 'spacing09', 'spacing10', 'spacing11', 'spacing12', 'spacing13', // Fluid spacing
  'fluidSpacing01', 'fluidSpacing02', 'fluidSpacing03', 'fluidSpacing04', // Layout
  // Deprecated -- Remove in v11
  'layout01', 'layout02', 'layout03', 'layout04', 'layout05', 'layout06', 'layout07', // Containers
  'container01', 'container02', 'container03', 'container04', 'container05', 'sizeXSmall', 'sizeSmall', 'sizeMedium', 'sizeLarge', 'sizeXLarge', 'size2XLarge', // Icon sizes
  'iconSize01', 'iconSize02'];

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  // Default, Use with em() and rem() functions

  var baseFontSize = 16;
  /**
   * Convert a given px unit to a rem unit
   * @param {number} px
   * @returns {string}
   */

  function rem(px) {
    return "".concat(px / baseFontSize, "rem");
  }
  /**
   * Convert a given px unit to a em unit
   * @param {number} px
   * @returns {string}
   */

  function em(px) {
    return "".concat(px / baseFontSize, "em");
  }
  /**
   * Convert a given px unit to its string representation
   * @param {number} value - number of pixels
   * @returns {string}
   */

  function px(value) {
    return "".concat(value, "px");
  } // Breakpoint
  // Initial map of our breakpoints and their values

  var breakpoints = {
    sm: {
      width: rem(320),
      columns: 4,
      margin: '0'
    },
    md: {
      width: rem(672),
      columns: 8,
      margin: rem(16)
    },
    lg: {
      width: rem(1056),
      columns: 16,
      margin: rem(16)
    },
    xlg: {
      width: rem(1312),
      columns: 16,
      margin: rem(16)
    },
    max: {
      width: rem(1584),
      columns: 16,
      margin: rem(24)
    }
  };
  function breakpointUp(name) {
    return "@media (min-width: ".concat(breakpoints[name].width, ")");
  }
  function breakpointDown(name) {
    return "@media (max-width: ".concat(breakpoints[name].width, ")");
  }
  function breakpoint() {
    return breakpointUp.apply(void 0, arguments);
  } // Mini-unit

  var miniUnit = 8;
  function miniUnits(count) {
    return rem(miniUnit * count);
  } // Spacing

  var spacing01 = miniUnits(0.25);
  var spacing02 = miniUnits(0.5);
  var spacing03 = miniUnits(1);
  var spacing04 = miniUnits(1.5);
  var spacing05 = miniUnits(2);
  var spacing06 = miniUnits(3);
  var spacing07 = miniUnits(4);
  var spacing08 = miniUnits(5);
  var spacing09 = miniUnits(6);
  var spacing10 = miniUnits(8);
  var spacing11 = miniUnits(10);
  var spacing12 = miniUnits(12);
  var spacing13 = miniUnits(20);
  var spacing = [spacing01, spacing02, spacing03, spacing04, spacing05, spacing06, spacing07, spacing08, spacing09, spacing10, spacing11, spacing12, spacing13]; // Fluid spacing

  var fluidSpacing01 = 0;
  var fluidSpacing02 = '2vw';
  var fluidSpacing03 = '5vw';
  var fluidSpacing04 = '10vw';
  var fluidSpacing = [fluidSpacing01, fluidSpacing02, fluidSpacing03, fluidSpacing04]; // Layout
  // Deprecated -- Remove in v11

  var layout01 = miniUnits(2);
  var layout02 = miniUnits(3);
  var layout03 = miniUnits(4);
  var layout04 = miniUnits(6);
  var layout05 = miniUnits(8);
  var layout06 = miniUnits(12);
  var layout07 = miniUnits(20);
  var layout = [layout01, layout02, layout03, layout04, layout05, layout06, layout07]; // Container

  var container01 = miniUnits(3);
  var container02 = miniUnits(4);
  var container03 = miniUnits(5);
  var container04 = miniUnits(6);
  var container05 = miniUnits(8);
  var container = [container01, container02, container03, container04, container05];
  var sizeXSmall = rem(24);
  var sizeSmall = rem(32);
  var sizeMedium = rem(40);
  var sizeLarge = rem(48);
  var sizeXLarge = rem(64);
  var size2XLarge = rem(80);
  var sizes = {
    XSmall: sizeXSmall,
    Small: sizeSmall,
    Medium: sizeMedium,
    Large: sizeLarge,
    XLarge: sizeXLarge,
    '2XLarge': size2XLarge
  }; // Icon

  var iconSize01 = '1rem';
  var iconSize02 = '1.25rem';
  var iconSize = [iconSize01, iconSize02];

  exports.baseFontSize = baseFontSize;
  exports.breakpoint = breakpoint;
  exports.breakpointDown = breakpointDown;
  exports.breakpointUp = breakpointUp;
  exports.breakpoints = breakpoints;
  exports.container = container;
  exports.container01 = container01;
  exports.container02 = container02;
  exports.container03 = container03;
  exports.container04 = container04;
  exports.container05 = container05;
  exports.em = em;
  exports.fluidSpacing = fluidSpacing;
  exports.fluidSpacing01 = fluidSpacing01;
  exports.fluidSpacing02 = fluidSpacing02;
  exports.fluidSpacing03 = fluidSpacing03;
  exports.fluidSpacing04 = fluidSpacing04;
  exports.iconSize = iconSize;
  exports.iconSize01 = iconSize01;
  exports.iconSize02 = iconSize02;
  exports.layout = layout;
  exports.layout01 = layout01;
  exports.layout02 = layout02;
  exports.layout03 = layout03;
  exports.layout04 = layout04;
  exports.layout05 = layout05;
  exports.layout06 = layout06;
  exports.layout07 = layout07;
  exports.miniUnit = miniUnit;
  exports.miniUnits = miniUnits;
  exports.px = px;
  exports.rem = rem;
  exports.size2XLarge = size2XLarge;
  exports.sizeLarge = sizeLarge;
  exports.sizeMedium = sizeMedium;
  exports.sizeSmall = sizeSmall;
  exports.sizeXLarge = sizeXLarge;
  exports.sizeXSmall = sizeXSmall;
  exports.sizes = sizes;
  exports.spacing = spacing;
  exports.spacing01 = spacing01;
  exports.spacing02 = spacing02;
  exports.spacing03 = spacing03;
  exports.spacing04 = spacing04;
  exports.spacing05 = spacing05;
  exports.spacing06 = spacing06;
  exports.spacing07 = spacing07;
  exports.spacing08 = spacing08;
  exports.spacing09 = spacing09;
  exports.spacing10 = spacing10;
  exports.spacing11 = spacing11;
  exports.spacing12 = spacing12;
  exports.spacing13 = spacing13;
  exports.unstable_tokens = unstable_tokens;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
