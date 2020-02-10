(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.CarbonColors = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var black = '#000000';
  var black100 = black;
  var white = '#ffffff';
  var white0 = white;
  var yellow = '#fdd13a';
  var yellow20 = yellow;
  var orange = '#fc7b1e';
  var orange40 = orange;
  var red10 = '#fff0f1';
  var red20 = '#fcd0d3';
  var red30 = '#ffa4a9';
  var red40 = '#ff767c';
  var red50 = '#fb4b53';
  var red60 = '#da1e28';
  var red70 = '#a51920';
  var red80 = '#750e13';
  var red90 = '#570408';
  var red100 = '#2c080a';
  var red = {
    10: red10,
    20: red20,
    30: red30,
    40: red40,
    50: red50,
    60: red60,
    70: red70,
    80: red80,
    90: red90,
    100: red100
  };
  var magenta10 = '#fff0f6';
  var magenta20 = '#ffcfe1';
  var magenta30 = '#ffa0c2';
  var magenta40 = '#fa75a6';
  var magenta50 = '#ee538b';
  var magenta60 = '#d12765';
  var magenta70 = '#a11950';
  var magenta80 = '#760a3a';
  var magenta90 = '#57002b';
  var magenta100 = '#2a0a16';
  var magenta = {
    10: magenta10,
    20: magenta20,
    30: magenta30,
    40: magenta40,
    50: magenta50,
    60: magenta60,
    70: magenta70,
    80: magenta80,
    90: magenta90,
    100: magenta100
  };
  var purple10 = '#f7f1ff';
  var purple20 = '#e6d6ff';
  var purple30 = '#d0b0ff';
  var purple40 = '#bb8eff';
  var purple50 = '#a66efa';
  var purple60 = '#8a3ffc';
  var purple70 = '#6e32c9';
  var purple80 = '#4f2196';
  var purple90 = '#38146b';
  var purple100 = '#1e1033';
  var purple = {
    10: purple10,
    20: purple20,
    30: purple30,
    40: purple40,
    50: purple50,
    60: purple60,
    70: purple70,
    80: purple80,
    90: purple90,
    100: purple100
  };
  var blue10 = '#edf4ff';
  var blue20 = '#c9deff';
  var blue30 = '#97c1ff';
  var blue40 = '#6ea6ff';
  var blue50 = '#408bfc';
  var blue60 = '#0062ff';
  var blue70 = '#054ada';
  var blue80 = '#0530ad';
  var blue90 = '#061f80';
  var blue100 = '#051243';
  var blue = {
    10: blue10,
    20: blue20,
    30: blue30,
    40: blue40,
    50: blue50,
    60: blue60,
    70: blue70,
    80: blue80,
    90: blue90,
    100: blue100
  };
  var cyan10 = '#e3f6ff';
  var cyan20 = '#b3e6ff';
  var cyan30 = '#6ccaff';
  var cyan40 = '#30b0ff';
  var cyan50 = '#1191e6';
  var cyan60 = '#0072c3';
  var cyan70 = '#0058a1';
  var cyan80 = '#003d73';
  var cyan90 = '#002b50';
  var cyan100 = '#07192b';
  var cyan = {
    10: cyan10,
    20: cyan20,
    30: cyan30,
    40: cyan40,
    50: cyan50,
    60: cyan60,
    70: cyan70,
    80: cyan80,
    90: cyan90,
    100: cyan100
  };
  var teal10 = '#dbfbfb';
  var teal20 = '#92eeee';
  var teal30 = '#20d5d2';
  var teal40 = '#00bab6';
  var teal50 = '#009c98';
  var teal60 = '#007d79';
  var teal70 = '#006161';
  var teal80 = '#004548';
  var teal90 = '#003137';
  var teal100 = '#081a1c';
  var teal = {
    10: teal10,
    20: teal20,
    30: teal30,
    40: teal40,
    50: teal50,
    60: teal60,
    70: teal70,
    80: teal80,
    90: teal90,
    100: teal100
  };
  var green10 = '#dafbe4';
  var green20 = '#9deeb2';
  var green30 = '#56d679';
  var green40 = '#3dbb61';
  var green50 = '#24a148';
  var green60 = '#198038';
  var green70 = '#10642a';
  var green80 = '#054719';
  var green90 = '#01330f';
  var green100 = '#081b09';
  var green = {
    10: green10,
    20: green20,
    30: green30,
    40: green40,
    50: green50,
    60: green60,
    70: green70,
    80: green80,
    90: green90,
    100: green100
  };
  var coolGray10 = '#f2f4f8';
  var coolGray20 = '#d5d9e0';
  var coolGray30 = '#b9bfc7';
  var coolGray40 = '#9fa5ad';
  var coolGray50 = '#868d95';
  var coolGray60 = '#697077';
  var coolGray70 = '#50565b';
  var coolGray80 = '#373d42';
  var coolGray90 = '#242a2e';
  var coolGray100 = '#13171a';
  var coolGray = {
    10: coolGray10,
    20: coolGray20,
    30: coolGray30,
    40: coolGray40,
    50: coolGray50,
    60: coolGray60,
    70: coolGray70,
    80: coolGray80,
    90: coolGray90,
    100: coolGray100
  };
  var gray10 = '#f3f3f3';
  var gray20 = '#dcdcdc';
  var gray30 = '#bebebe';
  var gray40 = '#a4a4a4';
  var gray50 = '#8c8c8c';
  var gray60 = '#6f6f6f';
  var gray70 = '#565656';
  var gray80 = '#3d3d3d';
  var gray90 = '#282828';
  var gray100 = '#171717';
  var gray = {
    10: gray10,
    20: gray20,
    30: gray30,
    40: gray40,
    50: gray50,
    60: gray60,
    70: gray70,
    80: gray80,
    90: gray90,
    100: gray100
  };
  var warmGray10 = '#f7f3f1';
  var warmGray20 = '#e0dbda';
  var warmGray30 = '#c1bcbb';
  var warmGray40 = '#a7a2a2';
  var warmGray50 = '#8f8b8b';
  var warmGray60 = '#726e6e';
  var warmGray70 = '#595555';
  var warmGray80 = '#403c3c';
  var warmGray90 = '#2b2828';
  var warmGray100 = '#1a1717';
  var warmGray = {
    10: warmGray10,
    20: warmGray20,
    30: warmGray30,
    40: warmGray40,
    50: warmGray50,
    60: warmGray60,
    70: warmGray70,
    80: warmGray80,
    90: warmGray90,
    100: warmGray100
  };
  var colors = {
    black: {
      100: black
    },
    blue: blue,
    coolGray: coolGray,
    cyan: cyan,
    gray: gray,
    green: green,
    magenta: magenta,
    orange: {
      40: orange40
    },
    purple: purple,
    red: red,
    teal: teal,
    warmGray: warmGray,
    white: {
      0: white
    },
    yellow: {
      20: yellow20
    }
  };

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */

  /**
   * Parse a given hexcode string into an rgba statement with the given opacity
   * @param {string} hexcode
   * @param {number} opacity
   * @returns {string}
   */
  function rgba(hexcode, opacity) {
    var values = [hexcode.substring(1, 3), hexcode.substring(3, 5), hexcode.substring(5, 7)].map(function (string) {
      return parseInt(string, 16);
    });
    return "rgba(".concat(values[0], ", ").concat(values[1], ", ").concat(values[2], ", ").concat(opacity, ")");
  }

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */

  exports.black = black;
  exports.black100 = black100;
  exports.white = white;
  exports.white0 = white0;
  exports.yellow = yellow;
  exports.yellow20 = yellow20;
  exports.orange = orange;
  exports.orange40 = orange40;
  exports.red10 = red10;
  exports.red20 = red20;
  exports.red30 = red30;
  exports.red40 = red40;
  exports.red50 = red50;
  exports.red60 = red60;
  exports.red70 = red70;
  exports.red80 = red80;
  exports.red90 = red90;
  exports.red100 = red100;
  exports.red = red;
  exports.magenta10 = magenta10;
  exports.magenta20 = magenta20;
  exports.magenta30 = magenta30;
  exports.magenta40 = magenta40;
  exports.magenta50 = magenta50;
  exports.magenta60 = magenta60;
  exports.magenta70 = magenta70;
  exports.magenta80 = magenta80;
  exports.magenta90 = magenta90;
  exports.magenta100 = magenta100;
  exports.magenta = magenta;
  exports.purple10 = purple10;
  exports.purple20 = purple20;
  exports.purple30 = purple30;
  exports.purple40 = purple40;
  exports.purple50 = purple50;
  exports.purple60 = purple60;
  exports.purple70 = purple70;
  exports.purple80 = purple80;
  exports.purple90 = purple90;
  exports.purple100 = purple100;
  exports.purple = purple;
  exports.blue10 = blue10;
  exports.blue20 = blue20;
  exports.blue30 = blue30;
  exports.blue40 = blue40;
  exports.blue50 = blue50;
  exports.blue60 = blue60;
  exports.blue70 = blue70;
  exports.blue80 = blue80;
  exports.blue90 = blue90;
  exports.blue100 = blue100;
  exports.blue = blue;
  exports.cyan10 = cyan10;
  exports.cyan20 = cyan20;
  exports.cyan30 = cyan30;
  exports.cyan40 = cyan40;
  exports.cyan50 = cyan50;
  exports.cyan60 = cyan60;
  exports.cyan70 = cyan70;
  exports.cyan80 = cyan80;
  exports.cyan90 = cyan90;
  exports.cyan100 = cyan100;
  exports.cyan = cyan;
  exports.teal10 = teal10;
  exports.teal20 = teal20;
  exports.teal30 = teal30;
  exports.teal40 = teal40;
  exports.teal50 = teal50;
  exports.teal60 = teal60;
  exports.teal70 = teal70;
  exports.teal80 = teal80;
  exports.teal90 = teal90;
  exports.teal100 = teal100;
  exports.teal = teal;
  exports.green10 = green10;
  exports.green20 = green20;
  exports.green30 = green30;
  exports.green40 = green40;
  exports.green50 = green50;
  exports.green60 = green60;
  exports.green70 = green70;
  exports.green80 = green80;
  exports.green90 = green90;
  exports.green100 = green100;
  exports.green = green;
  exports.coolGray10 = coolGray10;
  exports.coolGray20 = coolGray20;
  exports.coolGray30 = coolGray30;
  exports.coolGray40 = coolGray40;
  exports.coolGray50 = coolGray50;
  exports.coolGray60 = coolGray60;
  exports.coolGray70 = coolGray70;
  exports.coolGray80 = coolGray80;
  exports.coolGray90 = coolGray90;
  exports.coolGray100 = coolGray100;
  exports.coolGray = coolGray;
  exports.gray10 = gray10;
  exports.gray20 = gray20;
  exports.gray30 = gray30;
  exports.gray40 = gray40;
  exports.gray50 = gray50;
  exports.gray60 = gray60;
  exports.gray70 = gray70;
  exports.gray80 = gray80;
  exports.gray90 = gray90;
  exports.gray100 = gray100;
  exports.gray = gray;
  exports.warmGray10 = warmGray10;
  exports.warmGray20 = warmGray20;
  exports.warmGray30 = warmGray30;
  exports.warmGray40 = warmGray40;
  exports.warmGray50 = warmGray50;
  exports.warmGray60 = warmGray60;
  exports.warmGray70 = warmGray70;
  exports.warmGray80 = warmGray80;
  exports.warmGray90 = warmGray90;
  exports.warmGray100 = warmGray100;
  exports.warmGray = warmGray;
  exports.colors = colors;
  exports.rgba = rgba;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
