(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@carbon/colors')) :
  typeof define === 'function' && define.amd ? define(['exports', '@carbon/colors'], factory) :
  (factory((global.CarbonThemes = {}),global.CarbonColors));
}(this, (function (exports,colors) { 'use strict';

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var interactive01 = colors.blue60;
  var interactive02 = colors.gray100;
  var interactive03 = colors.blue60;
  var interactive04 = colors.blue60;
  var uiBackground = colors.white;
  var ui01 = colors.gray10;
  var ui02 = colors.white;
  var ui03 = colors.gray20;
  var ui04 = colors.gray50;
  var ui05 = colors.gray100;
  var text01 = colors.gray100;
  var text02 = colors.gray70;
  var text03 = colors.gray50;
  var text04 = colors.white;
  var icon01 = colors.gray100;
  var icon02 = colors.gray70;
  var icon03 = colors.white;
  var link01 = colors.blue60;
  var field01 = colors.gray10;
  var field02 = colors.white;
  var inverse01 = colors.white;
  var inverse02 = colors.gray80;
  var support01 = colors.red60;
  var support02 = colors.green50;
  var support03 = colors.yellow;
  var support04 = colors.blue70;
  var inverseSupport01 = colors.red50;
  var inverseSupport02 = colors.green40;
  var inverseSupport03 = colors.yellow;
  var inverseSupport04 = colors.blue50;
  var overlay01 = colors.rgba(colors.gray100, 0.5); // Interaction states

  var focus = colors.blue60;
  var hoverPrimary = '#0353e9';
  var activePrimary = colors.blue80;
  var hoverPrimaryText = colors.blue70;
  var hoverSecondary = '#4c4c4c';
  var activeSecondary = colors.gray60;
  var hoverTertiary = '#0353e9';
  var activeTertiary = colors.blue80;
  var hoverUI = '#e5e5e5';
  var activeUI = colors.gray30;
  var selectedUI = colors.gray20;
  var hoverSelectedUI = '#cacaca';
  var hoverDanger = '#ba1b23';
  var activeDanger = colors.red80;
  var hoverRow = '#e5e5e5';
  var visitedLink = colors.purple60;
  var disabled01 = colors.gray10;
  var disabled02 = colors.gray30;
  var disabled03 = colors.gray50;
  var highlight = colors.blue20;
  var skeleton01 = '#e5e5e5';
  var skeleton02 = colors.gray30; // Deprecated ☠️

  var brand01 = interactive01;
  var brand02 = interactive02;
  var brand03 = interactive03;
  var active01 = activeUI;
  var hoverField = hoverUI;

  var white = /*#__PURE__*/Object.freeze({
    interactive01: interactive01,
    interactive02: interactive02,
    interactive03: interactive03,
    interactive04: interactive04,
    uiBackground: uiBackground,
    ui01: ui01,
    ui02: ui02,
    ui03: ui03,
    ui04: ui04,
    ui05: ui05,
    text01: text01,
    text02: text02,
    text03: text03,
    text04: text04,
    icon01: icon01,
    icon02: icon02,
    icon03: icon03,
    link01: link01,
    field01: field01,
    field02: field02,
    inverse01: inverse01,
    inverse02: inverse02,
    support01: support01,
    support02: support02,
    support03: support03,
    support04: support04,
    inverseSupport01: inverseSupport01,
    inverseSupport02: inverseSupport02,
    inverseSupport03: inverseSupport03,
    inverseSupport04: inverseSupport04,
    overlay01: overlay01,
    focus: focus,
    hoverPrimary: hoverPrimary,
    activePrimary: activePrimary,
    hoverPrimaryText: hoverPrimaryText,
    hoverSecondary: hoverSecondary,
    activeSecondary: activeSecondary,
    hoverTertiary: hoverTertiary,
    activeTertiary: activeTertiary,
    hoverUI: hoverUI,
    activeUI: activeUI,
    selectedUI: selectedUI,
    hoverSelectedUI: hoverSelectedUI,
    hoverDanger: hoverDanger,
    activeDanger: activeDanger,
    hoverRow: hoverRow,
    visitedLink: visitedLink,
    disabled01: disabled01,
    disabled02: disabled02,
    disabled03: disabled03,
    highlight: highlight,
    skeleton01: skeleton01,
    skeleton02: skeleton02,
    brand01: brand01,
    brand02: brand02,
    brand03: brand03,
    active01: active01,
    hoverField: hoverField
  });

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var interactive01$1 = colors.blue60;
  var interactive02$1 = colors.gray100;
  var interactive03$1 = colors.blue60;
  var interactive04$1 = colors.blue60;
  var uiBackground$1 = colors.gray10;
  var ui01$1 = colors.white;
  var ui02$1 = colors.gray10;
  var ui03$1 = colors.gray20;
  var ui04$1 = colors.gray50;
  var ui05$1 = colors.gray100;
  var text01$1 = colors.gray100;
  var text02$1 = colors.gray70;
  var text03$1 = colors.gray50;
  var text04$1 = colors.white;
  var icon01$1 = colors.gray100;
  var icon02$1 = colors.gray70;
  var icon03$1 = colors.white;
  var link01$1 = colors.blue60;
  var field01$1 = colors.white;
  var field02$1 = colors.gray10;
  var inverse01$1 = colors.white;
  var inverse02$1 = colors.gray80;
  var support01$1 = colors.red60;
  var support02$1 = colors.green50;
  var support03$1 = colors.yellow;
  var support04$1 = colors.blue70;
  var inverseSupport01$1 = colors.red50;
  var inverseSupport02$1 = colors.green40;
  var inverseSupport03$1 = colors.yellow;
  var inverseSupport04$1 = colors.blue50;
  var overlay01$1 = colors.rgba(colors.gray100, 0.5); // Interaction states

  var focus$1 = colors.blue60;
  var hoverPrimary$1 = '#0353e9';
  var activePrimary$1 = colors.blue80;
  var hoverPrimaryText$1 = colors.blue70;
  var hoverSecondary$1 = '#4c4c4c';
  var activeSecondary$1 = colors.gray60;
  var hoverTertiary$1 = '#0353e9';
  var activeTertiary$1 = colors.blue80;
  var hoverUI$1 = '#e5e5e5';
  var activeUI$1 = colors.gray30;
  var selectedUI$1 = colors.gray20;
  var hoverSelectedUI$1 = '#cacaca';
  var hoverDanger$1 = '#ba1b23';
  var activeDanger$1 = colors.red80;
  var hoverRow$1 = '#e5e5e5';
  var visitedLink$1 = colors.purple60;
  var disabled01$1 = colors.white;
  var disabled02$1 = colors.gray30;
  var disabled03$1 = colors.gray50;
  var highlight$1 = colors.blue20;
  var skeleton01$1 = '#e5e5e5';
  var skeleton02$1 = colors.gray30; // Deprecated ☠️

  var brand01$1 = interactive01$1;
  var brand02$1 = interactive02$1;
  var brand03$1 = interactive03$1;
  var active01$1 = activeUI$1;
  var hoverField$1 = hoverUI$1;

  var g10 = /*#__PURE__*/Object.freeze({
    interactive01: interactive01$1,
    interactive02: interactive02$1,
    interactive03: interactive03$1,
    interactive04: interactive04$1,
    uiBackground: uiBackground$1,
    ui01: ui01$1,
    ui02: ui02$1,
    ui03: ui03$1,
    ui04: ui04$1,
    ui05: ui05$1,
    text01: text01$1,
    text02: text02$1,
    text03: text03$1,
    text04: text04$1,
    icon01: icon01$1,
    icon02: icon02$1,
    icon03: icon03$1,
    link01: link01$1,
    field01: field01$1,
    field02: field02$1,
    inverse01: inverse01$1,
    inverse02: inverse02$1,
    support01: support01$1,
    support02: support02$1,
    support03: support03$1,
    support04: support04$1,
    inverseSupport01: inverseSupport01$1,
    inverseSupport02: inverseSupport02$1,
    inverseSupport03: inverseSupport03$1,
    inverseSupport04: inverseSupport04$1,
    overlay01: overlay01$1,
    focus: focus$1,
    hoverPrimary: hoverPrimary$1,
    activePrimary: activePrimary$1,
    hoverPrimaryText: hoverPrimaryText$1,
    hoverSecondary: hoverSecondary$1,
    activeSecondary: activeSecondary$1,
    hoverTertiary: hoverTertiary$1,
    activeTertiary: activeTertiary$1,
    hoverUI: hoverUI$1,
    activeUI: activeUI$1,
    selectedUI: selectedUI$1,
    hoverSelectedUI: hoverSelectedUI$1,
    hoverDanger: hoverDanger$1,
    activeDanger: activeDanger$1,
    hoverRow: hoverRow$1,
    visitedLink: visitedLink$1,
    disabled01: disabled01$1,
    disabled02: disabled02$1,
    disabled03: disabled03$1,
    highlight: highlight$1,
    skeleton01: skeleton01$1,
    skeleton02: skeleton02$1,
    brand01: brand01$1,
    brand02: brand02$1,
    brand03: brand03$1,
    active01: active01$1,
    hoverField: hoverField$1
  });

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var interactive01$2 = colors.blue60;
  var interactive02$2 = colors.gray60;
  var interactive03$2 = colors.white;
  var interactive04$2 = colors.blue50;
  var uiBackground$2 = colors.gray100;
  var ui01$2 = colors.gray90;
  var ui02$2 = colors.gray80;
  var ui03$2 = colors.gray80;
  var ui04$2 = colors.gray60;
  var ui05$2 = colors.gray10;
  var text01$2 = colors.gray10;
  var text02$2 = colors.gray30;
  var text03$2 = colors.gray60;
  var text04$2 = colors.white;
  var icon01$2 = colors.gray10;
  var icon02$2 = colors.gray30;
  var icon03$2 = colors.white;
  var link01$2 = colors.blue40;
  var field01$2 = colors.gray90;
  var field02$2 = colors.gray80;
  var inverse01$2 = colors.gray100;
  var inverse02$2 = colors.gray10;
  var support01$2 = colors.red50;
  var support02$2 = colors.green40;
  var support03$2 = colors.yellow;
  var support04$2 = colors.blue50;
  var inverseSupport01$2 = colors.red60;
  var inverseSupport02$2 = colors.green50;
  var inverseSupport03$2 = colors.yellow;
  var inverseSupport04$2 = colors.blue60;
  var overlay01$2 = colors.rgba(colors.gray100, 0.7); // Interaction states

  var focus$2 = colors.white;
  var hoverPrimary$2 = '#0353e9';
  var activePrimary$2 = colors.blue80;
  var hoverPrimaryText$2 = colors.blue30;
  var hoverSecondary$2 = '#606060';
  var activeSecondary$2 = colors.gray80;
  var hoverTertiary$2 = colors.gray10;
  var activeTertiary$2 = colors.gray30;
  var hoverUI$2 = '#353535';
  var activeUI$2 = colors.gray70;
  var selectedUI$2 = colors.gray80;
  var hoverSelectedUI$2 = '#4c4c4c';
  var hoverDanger$2 = '#ba1b23';
  var activeDanger$2 = colors.red80;
  var hoverRow$2 = '#353535';
  var visitedLink$2 = colors.purple40;
  var disabled01$2 = colors.gray90;
  var disabled02$2 = colors.gray80;
  var disabled03$2 = colors.gray60;
  var highlight$2 = colors.blue80;
  var skeleton01$2 = '#353535';
  var skeleton02$2 = colors.gray80; // Deprecated ☠️

  var brand01$2 = interactive01$2;
  var brand02$2 = interactive02$2;
  var brand03$2 = interactive03$2;
  var active01$2 = activeUI$2;
  var hoverField$2 = hoverUI$2;

  var g100 = /*#__PURE__*/Object.freeze({
    interactive01: interactive01$2,
    interactive02: interactive02$2,
    interactive03: interactive03$2,
    interactive04: interactive04$2,
    uiBackground: uiBackground$2,
    ui01: ui01$2,
    ui02: ui02$2,
    ui03: ui03$2,
    ui04: ui04$2,
    ui05: ui05$2,
    text01: text01$2,
    text02: text02$2,
    text03: text03$2,
    text04: text04$2,
    icon01: icon01$2,
    icon02: icon02$2,
    icon03: icon03$2,
    link01: link01$2,
    field01: field01$2,
    field02: field02$2,
    inverse01: inverse01$2,
    inverse02: inverse02$2,
    support01: support01$2,
    support02: support02$2,
    support03: support03$2,
    support04: support04$2,
    inverseSupport01: inverseSupport01$2,
    inverseSupport02: inverseSupport02$2,
    inverseSupport03: inverseSupport03$2,
    inverseSupport04: inverseSupport04$2,
    overlay01: overlay01$2,
    focus: focus$2,
    hoverPrimary: hoverPrimary$2,
    activePrimary: activePrimary$2,
    hoverPrimaryText: hoverPrimaryText$2,
    hoverSecondary: hoverSecondary$2,
    activeSecondary: activeSecondary$2,
    hoverTertiary: hoverTertiary$2,
    activeTertiary: activeTertiary$2,
    hoverUI: hoverUI$2,
    activeUI: activeUI$2,
    selectedUI: selectedUI$2,
    hoverSelectedUI: hoverSelectedUI$2,
    hoverDanger: hoverDanger$2,
    activeDanger: activeDanger$2,
    hoverRow: hoverRow$2,
    visitedLink: visitedLink$2,
    disabled01: disabled01$2,
    disabled02: disabled02$2,
    disabled03: disabled03$2,
    highlight: highlight$2,
    skeleton01: skeleton01$2,
    skeleton02: skeleton02$2,
    brand01: brand01$2,
    brand02: brand02$2,
    brand03: brand03$2,
    active01: active01$2,
    hoverField: hoverField$2
  });

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var interactive01$3 = colors.blue60;
  var interactive02$3 = colors.gray60;
  var interactive03$3 = colors.white;
  var interactive04$3 = colors.blue50;
  var uiBackground$3 = colors.gray90;
  var ui01$3 = colors.gray80;
  var ui02$3 = colors.gray70;
  var ui03$3 = colors.gray70;
  var ui04$3 = colors.gray50;
  var ui05$3 = colors.gray10;
  var text01$3 = colors.gray10;
  var text02$3 = colors.gray30;
  var text03$3 = colors.gray50;
  var text04$3 = colors.white;
  var icon01$3 = colors.gray10;
  var icon02$3 = colors.gray30;
  var icon03$3 = colors.white;
  var link01$3 = colors.blue40;
  var field01$3 = colors.gray80;
  var field02$3 = colors.gray70;
  var inverse01$3 = colors.gray100;
  var inverse02$3 = colors.gray10;
  var support01$3 = colors.red50;
  var support02$3 = colors.green40;
  var support03$3 = colors.yellow;
  var support04$3 = colors.blue50;
  var inverseSupport01$3 = colors.red60;
  var inverseSupport02$3 = colors.green50;
  var inverseSupport03$3 = colors.yellow;
  var inverseSupport04$3 = colors.blue60;
  var overlay01$3 = colors.rgba(colors.gray100, 0.7); // Interaction states

  var focus$3 = colors.white;
  var hoverPrimary$3 = '#0353e9';
  var activePrimary$3 = colors.blue80;
  var hoverPrimaryText$3 = colors.blue30;
  var hoverSecondary$3 = '#606060';
  var activeSecondary$3 = colors.gray80;
  var hoverTertiary$3 = colors.gray10;
  var activeTertiary$3 = colors.gray30;
  var hoverUI$3 = '#4c4c4c';
  var activeUI$3 = colors.gray60;
  var selectedUI$3 = colors.gray70;
  var hoverSelectedUI$3 = '#656565';
  var hoverDanger$3 = '#ba1b23';
  var activeDanger$3 = colors.red80;
  var hoverRow$3 = '#4c4c4c';
  var visitedLink$3 = colors.purple40;
  var disabled01$3 = colors.gray80;
  var disabled02$3 = colors.gray70;
  var disabled03$3 = colors.gray50;
  var highlight$3 = colors.blue70;
  var skeleton01$3 = '#353535';
  var skeleton02$3 = colors.gray70; // Deprecated ☠️

  var brand01$3 = interactive01$3;
  var brand02$3 = interactive02$3;
  var brand03$3 = interactive03$3;
  var active01$3 = activeUI$3;
  var hoverField$3 = hoverUI$3;

  var g90 = /*#__PURE__*/Object.freeze({
    interactive01: interactive01$3,
    interactive02: interactive02$3,
    interactive03: interactive03$3,
    interactive04: interactive04$3,
    uiBackground: uiBackground$3,
    ui01: ui01$3,
    ui02: ui02$3,
    ui03: ui03$3,
    ui04: ui04$3,
    ui05: ui05$3,
    text01: text01$3,
    text02: text02$3,
    text03: text03$3,
    text04: text04$3,
    icon01: icon01$3,
    icon02: icon02$3,
    icon03: icon03$3,
    link01: link01$3,
    field01: field01$3,
    field02: field02$3,
    inverse01: inverse01$3,
    inverse02: inverse02$3,
    support01: support01$3,
    support02: support02$3,
    support03: support03$3,
    support04: support04$3,
    inverseSupport01: inverseSupport01$3,
    inverseSupport02: inverseSupport02$3,
    inverseSupport03: inverseSupport03$3,
    inverseSupport04: inverseSupport04$3,
    overlay01: overlay01$3,
    focus: focus$3,
    hoverPrimary: hoverPrimary$3,
    activePrimary: activePrimary$3,
    hoverPrimaryText: hoverPrimaryText$3,
    hoverSecondary: hoverSecondary$3,
    activeSecondary: activeSecondary$3,
    hoverTertiary: hoverTertiary$3,
    activeTertiary: activeTertiary$3,
    hoverUI: hoverUI$3,
    activeUI: activeUI$3,
    selectedUI: selectedUI$3,
    hoverSelectedUI: hoverSelectedUI$3,
    hoverDanger: hoverDanger$3,
    activeDanger: activeDanger$3,
    hoverRow: hoverRow$3,
    visitedLink: visitedLink$3,
    disabled01: disabled01$3,
    disabled02: disabled02$3,
    disabled03: disabled03$3,
    highlight: highlight$3,
    skeleton01: skeleton01$3,
    skeleton02: skeleton02$3,
    brand01: brand01$3,
    brand02: brand02$3,
    brand03: brand03$3,
    active01: active01$3,
    hoverField: hoverField$3
  });

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  // The color token names for a Carbon theme, value corresponds to what they're
  // exported as in JavaScript
  var colors$1 = [// Core
  'interactive01', 'interactive02', 'interactive03', 'interactive04', 'uiBackground', 'ui01', 'ui02', 'ui03', 'ui04', 'ui05', 'text01', 'text02', 'text03', 'text04', 'icon01', 'icon02', 'icon03', 'link01', 'field01', 'field02', 'inverse01', 'inverse02', 'support01', 'support02', 'support03', 'support04', 'inverseSupport01', 'inverseSupport02', 'inverseSupport03', 'inverseSupport04', 'overlay01', // Interactive states
  'focus', 'hoverPrimary', 'activePrimary', 'hoverPrimaryText', 'hoverSecondary', 'activeSecondary', 'hoverTertiary', 'activeTertiary', 'hoverUI', 'activeUI', 'selectedUI', 'hoverSelectedUI', 'hoverDanger', 'activeDanger', 'hoverRow', 'visitedLink', 'disabled01', 'disabled02', 'disabled03', 'highlight', 'skeleton01', 'skeleton02', // Deprecated
  'brand01', 'brand02', 'brand03', 'active01', 'hoverField'];
  var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  /**
   * Format a given token into the format expected in CSS/SCSS-based projects.
   * @param {string} token
   * @returns {string}
   */

  function formatTokenName(token) {
    var string = '';

    for (var i = 0; i < token.length; i++) {
      // If we run into a number, we hit the scale step at the end of a token name
      // and can safely truncate the rest of the token
      if (numbers.indexOf(token[i]) !== -1) {
        string += '-' + token.slice(i);
        break;
      } // When encountering an uppercase name, we will want to start adding `-`
      // between words


      if (token[i] === token[i].toUpperCase()) {
        // Check backwards to see if previous letter was also capitalized, if so
        // we are in a special case like UI where each piece should be connected
        if (token[i - 1] && token[i - 1] === token[i - 1].toUpperCase()) {
          string += token[i].toLowerCase();
          continue;
        } // Otherwise, just concatenate this new part on to the existing string


        string += '-' + token[i].toLowerCase();
        continue;
      } // By default, we add the current character to the output string


      string += token[i];
    }

    return string;
  }
  var tokens = {
    colors: colors$1
  };

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var themes = {
    white: white,
    g10: g10,
    g90: g90,
    g100: g100
  };

  exports.g10 = g10;
  exports.g90 = g90;
  exports.g100 = g100;
  exports.white = white;
  exports.tokens = tokens;
  exports.formatTokenName = formatTokenName;
  exports.themes = themes;
  exports.interactive01 = interactive01;
  exports.interactive02 = interactive02;
  exports.interactive03 = interactive03;
  exports.interactive04 = interactive04;
  exports.uiBackground = uiBackground;
  exports.ui01 = ui01;
  exports.ui02 = ui02;
  exports.ui03 = ui03;
  exports.ui04 = ui04;
  exports.ui05 = ui05;
  exports.text01 = text01;
  exports.text02 = text02;
  exports.text03 = text03;
  exports.text04 = text04;
  exports.icon01 = icon01;
  exports.icon02 = icon02;
  exports.icon03 = icon03;
  exports.link01 = link01;
  exports.field01 = field01;
  exports.field02 = field02;
  exports.inverse01 = inverse01;
  exports.inverse02 = inverse02;
  exports.support01 = support01;
  exports.support02 = support02;
  exports.support03 = support03;
  exports.support04 = support04;
  exports.inverseSupport01 = inverseSupport01;
  exports.inverseSupport02 = inverseSupport02;
  exports.inverseSupport03 = inverseSupport03;
  exports.inverseSupport04 = inverseSupport04;
  exports.overlay01 = overlay01;
  exports.focus = focus;
  exports.hoverPrimary = hoverPrimary;
  exports.activePrimary = activePrimary;
  exports.hoverPrimaryText = hoverPrimaryText;
  exports.hoverSecondary = hoverSecondary;
  exports.activeSecondary = activeSecondary;
  exports.hoverTertiary = hoverTertiary;
  exports.activeTertiary = activeTertiary;
  exports.hoverUI = hoverUI;
  exports.activeUI = activeUI;
  exports.selectedUI = selectedUI;
  exports.hoverSelectedUI = hoverSelectedUI;
  exports.hoverDanger = hoverDanger;
  exports.activeDanger = activeDanger;
  exports.hoverRow = hoverRow;
  exports.visitedLink = visitedLink;
  exports.disabled01 = disabled01;
  exports.disabled02 = disabled02;
  exports.disabled03 = disabled03;
  exports.highlight = highlight;
  exports.skeleton01 = skeleton01;
  exports.skeleton02 = skeleton02;
  exports.brand01 = brand01;
  exports.brand02 = brand02;
  exports.brand03 = brand03;
  exports.active01 = active01;
  exports.hoverField = hoverField;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
