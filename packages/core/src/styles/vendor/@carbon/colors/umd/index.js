(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CarbonColors = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var black = '#000000';
  var black100 = black;
  var blackHover = '#212121';
  var white = '#ffffff';
  var white0 = white;
  var whiteHover = '#e8e8e8';
  var yellow10 = '#fcf4d6';
  var yellow20 = '#fddc69';
  var yellow30 = '#f1c21b';
  var yellow40 = '#d2a106';
  var yellow50 = '#b28600';
  var yellow60 = '#8e6a00';
  var yellow70 = '#684e00';
  var yellow80 = '#483700';
  var yellow90 = '#302400';
  var yellow100 = '#1c1500';
  var unstable_yellow = {
    10: yellow10,
    20: yellow20,
    30: yellow30,
    40: yellow40,
    50: yellow50,
    60: yellow60,
    70: yellow70,
    80: yellow80,
    90: yellow90,
    100: yellow100
  };
  var yellow = yellow30;
  var yellow10Hover = '#f8e6a0';
  var yellow20Hover = '#fccd27';
  var yellow30Hover = '#ddb00e';
  var yellow40Hover = '#bc9005';
  var yellow50Hover = '#9e7700';
  var yellow60Hover = '#755800';
  var yellow70Hover = '#806000';
  var yellow80Hover = '#5c4600';
  var yellow90Hover = '#3d2e00';
  var yellow100Hover = '#332600';
  var yellowHover = {
    10: yellow10Hover,
    20: yellow20Hover,
    30: yellow30Hover,
    40: yellow40Hover,
    50: yellow50Hover,
    60: yellow60Hover,
    70: yellow70Hover,
    80: yellow80Hover,
    90: yellow90Hover,
    100: yellow100Hover
  };
  var orange10 = '#fff2e8';
  var orange20 = '#ffd9be';
  var orange30 = '#ffb784';
  var orange40 = '#ff832b';
  var orange50 = '#eb6200';
  var orange60 = '#ba4e00';
  var orange70 = '#8a3800';
  var orange80 = '#5e2900';
  var orange90 = '#3e1a00';
  var orange100 = '#231000';
  var orange = orange40;
  var unstable_orange = {
    10: orange10,
    20: orange20,
    30: orange30,
    40: orange40,
    50: orange50,
    60: orange60,
    70: orange70,
    80: orange80,
    90: orange90,
    100: orange100
  };
  var orange10Hover = '#ffe2cc';
  var orange20Hover = '#ffc69e';
  var orange30Hover = '#ff9d57';
  var orange40Hover = '#fa6800';
  var orange50Hover = '#cc5500';
  var orange60Hover = '#9e4200';
  var orange70Hover = '#a84400';
  var orange80Hover = '#753300';
  var orange90Hover = '#522200';
  var orange100Hover = '#421e00';
  var orangeHover = {
    10: orange10Hover,
    20: orange20Hover,
    30: orange30Hover,
    40: orange40Hover,
    50: orange50Hover,
    60: orange60Hover,
    70: orange70Hover,
    80: orange80Hover,
    90: orange90Hover,
    100: orange100Hover
  };
  var red10 = '#fff1f1';
  var red20 = '#ffd7d9';
  var red30 = '#ffb3b8';
  var red40 = '#ff8389';
  var red50 = '#fa4d56';
  var red60 = '#da1e28';
  var red70 = '#a2191f';
  var red80 = '#750e13';
  var red90 = '#520408';
  var red100 = '#2d0709';
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
  var red100Hover = '#540d11';
  var red90Hover = '#66050a';
  var red80Hover = '#921118';
  var red70Hover = '#c21e25';
  var red60Hover = '#b81922';
  var red50Hover = '#ee0713';
  var red40Hover = '#ff6168';
  var red30Hover = '#ff99a0';
  var red20Hover = '#ffc2c5';
  var red10Hover = '#ffe0e0';
  var redHover = {
    100: red100Hover,
    90: red90Hover,
    80: red80Hover,
    70: red70Hover,
    60: red60Hover,
    50: red50Hover,
    40: red40Hover,
    30: red30Hover,
    20: red20Hover,
    10: red10Hover
  };
  var magenta10 = '#fff0f7';
  var magenta20 = '#ffd6e8';
  var magenta30 = '#ffafd2';
  var magenta40 = '#ff7eb6';
  var magenta50 = '#ee5396';
  var magenta60 = '#d02670';
  var magenta70 = '#9f1853';
  var magenta80 = '#740937';
  var magenta90 = '#510224';
  var magenta100 = '#2a0a18';
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
  var magenta100Hover = '#53142f';
  var magenta90Hover = '#68032e';
  var magenta80Hover = '#8e0b43';
  var magenta70Hover = '#bf1d63';
  var magenta60Hover = '#b0215f';
  var magenta50Hover = '#e3176f';
  var magenta40Hover = '#ff57a0';
  var magenta30Hover = '#ff94c3';
  var magenta20Hover = '#ffbdda';
  var magenta10Hover = '#ffe0ef';
  var magentaHover = {
    100: magenta100Hover,
    90: magenta90Hover,
    80: magenta80Hover,
    70: magenta70Hover,
    60: magenta60Hover,
    50: magenta50Hover,
    40: magenta40Hover,
    30: magenta30Hover,
    20: magenta20Hover,
    10: magenta10Hover
  };
  var purple10 = '#f6f2ff';
  var purple20 = '#e8daff';
  var purple30 = '#d4bbff';
  var purple40 = '#be95ff';
  var purple50 = '#a56eff';
  var purple60 = '#8a3ffc';
  var purple70 = '#6929c4';
  var purple80 = '#491d8b';
  var purple90 = '#31135e';
  var purple100 = '#1c0f30';
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
  var purple100Hover = '#341c59';
  var purple90Hover = '#40197b';
  var purple80Hover = '#5b24ad';
  var purple70Hover = '#7c3dd6';
  var purple60Hover = '#7822fb';
  var purple50Hover = '#9352ff';
  var purple40Hover = '#ae7aff';
  var purple30Hover = '#c5a3ff';
  var purple20Hover = '#dcc7ff';
  var purple10Hover = '#ede5ff';
  var purpleHover = {
    100: purple100Hover,
    90: purple90Hover,
    80: purple80Hover,
    70: purple70Hover,
    60: purple60Hover,
    50: purple50Hover,
    40: purple40Hover,
    30: purple30Hover,
    20: purple20Hover,
    10: purple10Hover
  };
  var blue10 = '#edf5ff';
  var blue20 = '#d0e2ff';
  var blue30 = '#a6c8ff';
  var blue40 = '#78a9ff';
  var blue50 = '#4589ff';
  var blue60 = '#0f62fe';
  var blue70 = '#0043ce';
  var blue80 = '#002d9c';
  var blue90 = '#001d6c';
  var blue100 = '#001141';
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
  var blue100Hover = '#001f75';
  var blue90Hover = '#00258a';
  var blue80Hover = '#0039c7';
  var blue70Hover = '#0053ff';
  var blue60Hover = '#0050e6';
  var blue50Hover = '#1f70ff';
  var blue40Hover = '#5c97ff';
  var blue30Hover = '#8ab6ff';
  var blue20Hover = '#b8d3ff';
  var blue10Hover = '#dbebff';
  var blueHover = {
    100: blue100Hover,
    90: blue90Hover,
    80: blue80Hover,
    70: blue70Hover,
    60: blue60Hover,
    50: blue50Hover,
    40: blue40Hover,
    30: blue30Hover,
    20: blue20Hover,
    10: blue10Hover
  };
  var cyan10 = '#e5f6ff';
  var cyan20 = '#bae6ff';
  var cyan30 = '#82cfff';
  var cyan40 = '#33b1ff';
  var cyan50 = '#1192e8';
  var cyan60 = '#0072c3';
  var cyan70 = '#00539a';
  var cyan80 = '#003a6d';
  var cyan90 = '#012749';
  var cyan100 = '#061727';
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
  var cyan10Hover = '#cceeff';
  var cyan20Hover = '#99daff';
  var cyan30Hover = '#57beff';
  var cyan40Hover = '#059fff';
  var cyan50Hover = '#0f7ec8';
  var cyan60Hover = '#005fa3';
  var cyan70Hover = '#0066bd';
  var cyan80Hover = '#00498a';
  var cyan90Hover = '#013360';
  var cyan100Hover = '#0b2947';
  var cyanHover = {
    10: cyan10Hover,
    20: cyan20Hover,
    30: cyan30Hover,
    40: cyan40Hover,
    50: cyan50Hover,
    60: cyan60Hover,
    70: cyan70Hover,
    80: cyan80Hover,
    90: cyan90Hover,
    100: cyan100Hover
  };
  var teal10 = '#d9fbfb';
  var teal20 = '#9ef0f0';
  var teal30 = '#3ddbd9';
  var teal40 = '#08bdba';
  var teal50 = '#009d9a';
  var teal60 = '#007d79';
  var teal70 = '#005d5d';
  var teal80 = '#004144';
  var teal90 = '#022b30';
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
  var teal10Hover = '#acf6f6';
  var teal20Hover = '#57e5e5';
  var teal30Hover = '#25cac8';
  var teal40Hover = '#07aba9';
  var teal50Hover = '#008a87';
  var teal60Hover = '#006b68';
  var teal70Hover = '#007070';
  var teal80Hover = '#005357';
  var teal90Hover = '#033940';
  var teal100Hover = '#0f3034';
  var tealHover = {
    10: teal10Hover,
    20: teal20Hover,
    30: teal30Hover,
    40: teal40Hover,
    50: teal50Hover,
    60: teal60Hover,
    70: teal70Hover,
    80: teal80Hover,
    90: teal90Hover,
    100: teal100Hover
  };
  var green10 = '#defbe6';
  var green20 = '#a7f0ba';
  var green30 = '#6fdc8c';
  var green40 = '#42be65';
  var green50 = '#24a148';
  var green60 = '#198038';
  var green70 = '#0e6027';
  var green80 = '#044317';
  var green90 = '#022d0d';
  var green100 = '#071908';
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
  var green10Hover = '#b6f6c8';
  var green20Hover = '#74e792';
  var green30Hover = '#36ce5e';
  var green40Hover = '#3bab5a';
  var green50Hover = '#208e3f';
  var green60Hover = '#166f31';
  var green70Hover = '#11742f';
  var green80Hover = '#05521c';
  var green90Hover = '#033b11';
  var green100Hover = '#0d300f';
  var greenHover = {
    10: green10Hover,
    20: green20Hover,
    30: green30Hover,
    40: green40Hover,
    50: green50Hover,
    60: green60Hover,
    70: green70Hover,
    80: green80Hover,
    90: green90Hover,
    100: green100Hover
  };
  var coolGray10 = '#f2f4f8';
  var coolGray20 = '#dde1e6';
  var coolGray30 = '#c1c7cd';
  var coolGray40 = '#a2a9b0';
  var coolGray50 = '#878d96';
  var coolGray60 = '#697077';
  var coolGray70 = '#4d5358';
  var coolGray80 = '#343a3f';
  var coolGray90 = '#21272a';
  var coolGray100 = '#121619';
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
  var coolGray10Hover = '#e4e9f1';
  var coolGray20Hover = '#cdd3da';
  var coolGray30Hover = '#adb5bd';
  var coolGray40Hover = '#9199a1';
  var coolGray50Hover = '#757b85';
  var coolGray60Hover = '#585e64';
  var coolGray70Hover = '#5d646a';
  var coolGray80Hover = '#434a51';
  var coolGray90Hover = '#2b3236';
  var coolGray100Hover = '#222a2f';
  var coolGrayHover = {
    10: coolGray10Hover,
    20: coolGray20Hover,
    30: coolGray30Hover,
    40: coolGray40Hover,
    50: coolGray50Hover,
    60: coolGray60Hover,
    70: coolGray70Hover,
    80: coolGray80Hover,
    90: coolGray90Hover,
    100: coolGray100Hover
  };
  var gray10 = '#f4f4f4';
  var gray20 = '#e0e0e0';
  var gray30 = '#c6c6c6';
  var gray40 = '#a8a8a8';
  var gray50 = '#8d8d8d';
  var gray60 = '#6f6f6f';
  var gray70 = '#525252';
  var gray80 = '#393939';
  var gray90 = '#262626';
  var gray100 = '#161616';
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
  var gray10Hover = '#e8e8e8';
  var gray20Hover = '#d1d1d1';
  var gray30Hover = '#b5b5b5';
  var gray40Hover = '#999999';
  var gray50Hover = '#7a7a7a';
  var gray60Hover = '#5e5e5e';
  var gray70Hover = '#636363';
  var gray80Hover = '#474747';
  var gray90Hover = '#333333';
  var gray100Hover = '#292929';
  var grayHover = {
    10: gray10Hover,
    20: gray20Hover,
    30: gray30Hover,
    40: gray40Hover,
    50: gray50Hover,
    60: gray60Hover,
    70: gray70Hover,
    80: gray80Hover,
    90: gray90Hover,
    100: gray100Hover
  };
  var warmGray10 = '#f7f3f2';
  var warmGray20 = '#e5e0df';
  var warmGray30 = '#cac5c4';
  var warmGray40 = '#ada8a8';
  var warmGray50 = '#8f8b8b';
  var warmGray60 = '#726e6e';
  var warmGray70 = '#565151';
  var warmGray80 = '#3c3838';
  var warmGray90 = '#272525';
  var warmGray100 = '#171414';
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
  var warmGray10Hover = '#f0e8e6';
  var warmGray20Hover = '#d8d0cf';
  var warmGray30Hover = '#b9b3b1';
  var warmGray40Hover = '#9c9696';
  var warmGray50Hover = '#7f7b7b';
  var warmGray60Hover = '#605d5d';
  var warmGray70Hover = '#696363';
  var warmGray80Hover = '#4c4848';
  var warmGray90Hover = '#343232';
  var warmGray100Hover = '#2c2626';
  var warmGrayHover = {
    10: warmGray10Hover,
    20: warmGray20Hover,
    30: warmGray30Hover,
    40: warmGray40Hover,
    50: warmGray50Hover,
    60: warmGray60Hover,
    70: warmGray70Hover,
    80: warmGray80Hover,
    90: warmGray90Hover,
    100: warmGray100Hover
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
    orange: unstable_orange,
    purple: purple,
    red: red,
    teal: teal,
    warmGray: warmGray,
    white: {
      0: white
    },
    yellow: unstable_yellow
  };
  var unstable_hoverColors = {
    whiteHover: whiteHover,
    blackHover: blackHover,
    blueHover: blueHover,
    coolGrayHover: coolGrayHover,
    cyanHover: cyanHover,
    grayHover: grayHover,
    greenHover: greenHover,
    magentaHover: magentaHover,
    orangeHover: orangeHover,
    purpleHover: purpleHover,
    redHover: redHover,
    tealHover: tealHover,
    warmGrayHover: warmGrayHover,
    yellowHover: yellowHover
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

  exports.black = black;
  exports.black100 = black100;
  exports.blackHover = blackHover;
  exports.blue = blue;
  exports.blue10 = blue10;
  exports.blue100 = blue100;
  exports.blue100Hover = blue100Hover;
  exports.blue10Hover = blue10Hover;
  exports.blue20 = blue20;
  exports.blue20Hover = blue20Hover;
  exports.blue30 = blue30;
  exports.blue30Hover = blue30Hover;
  exports.blue40 = blue40;
  exports.blue40Hover = blue40Hover;
  exports.blue50 = blue50;
  exports.blue50Hover = blue50Hover;
  exports.blue60 = blue60;
  exports.blue60Hover = blue60Hover;
  exports.blue70 = blue70;
  exports.blue70Hover = blue70Hover;
  exports.blue80 = blue80;
  exports.blue80Hover = blue80Hover;
  exports.blue90 = blue90;
  exports.blue90Hover = blue90Hover;
  exports.blueHover = blueHover;
  exports.colors = colors;
  exports.coolGray = coolGray;
  exports.coolGray10 = coolGray10;
  exports.coolGray100 = coolGray100;
  exports.coolGray100Hover = coolGray100Hover;
  exports.coolGray10Hover = coolGray10Hover;
  exports.coolGray20 = coolGray20;
  exports.coolGray20Hover = coolGray20Hover;
  exports.coolGray30 = coolGray30;
  exports.coolGray30Hover = coolGray30Hover;
  exports.coolGray40 = coolGray40;
  exports.coolGray40Hover = coolGray40Hover;
  exports.coolGray50 = coolGray50;
  exports.coolGray50Hover = coolGray50Hover;
  exports.coolGray60 = coolGray60;
  exports.coolGray60Hover = coolGray60Hover;
  exports.coolGray70 = coolGray70;
  exports.coolGray70Hover = coolGray70Hover;
  exports.coolGray80 = coolGray80;
  exports.coolGray80Hover = coolGray80Hover;
  exports.coolGray90 = coolGray90;
  exports.coolGray90Hover = coolGray90Hover;
  exports.coolGrayHover = coolGrayHover;
  exports.cyan = cyan;
  exports.cyan10 = cyan10;
  exports.cyan100 = cyan100;
  exports.cyan100Hover = cyan100Hover;
  exports.cyan10Hover = cyan10Hover;
  exports.cyan20 = cyan20;
  exports.cyan20Hover = cyan20Hover;
  exports.cyan30 = cyan30;
  exports.cyan30Hover = cyan30Hover;
  exports.cyan40 = cyan40;
  exports.cyan40Hover = cyan40Hover;
  exports.cyan50 = cyan50;
  exports.cyan50Hover = cyan50Hover;
  exports.cyan60 = cyan60;
  exports.cyan60Hover = cyan60Hover;
  exports.cyan70 = cyan70;
  exports.cyan70Hover = cyan70Hover;
  exports.cyan80 = cyan80;
  exports.cyan80Hover = cyan80Hover;
  exports.cyan90 = cyan90;
  exports.cyan90Hover = cyan90Hover;
  exports.cyanHover = cyanHover;
  exports.gray = gray;
  exports.gray10 = gray10;
  exports.gray100 = gray100;
  exports.gray100Hover = gray100Hover;
  exports.gray10Hover = gray10Hover;
  exports.gray20 = gray20;
  exports.gray20Hover = gray20Hover;
  exports.gray30 = gray30;
  exports.gray30Hover = gray30Hover;
  exports.gray40 = gray40;
  exports.gray40Hover = gray40Hover;
  exports.gray50 = gray50;
  exports.gray50Hover = gray50Hover;
  exports.gray60 = gray60;
  exports.gray60Hover = gray60Hover;
  exports.gray70 = gray70;
  exports.gray70Hover = gray70Hover;
  exports.gray80 = gray80;
  exports.gray80Hover = gray80Hover;
  exports.gray90 = gray90;
  exports.gray90Hover = gray90Hover;
  exports.grayHover = grayHover;
  exports.green = green;
  exports.green10 = green10;
  exports.green100 = green100;
  exports.green100Hover = green100Hover;
  exports.green10Hover = green10Hover;
  exports.green20 = green20;
  exports.green20Hover = green20Hover;
  exports.green30 = green30;
  exports.green30Hover = green30Hover;
  exports.green40 = green40;
  exports.green40Hover = green40Hover;
  exports.green50 = green50;
  exports.green50Hover = green50Hover;
  exports.green60 = green60;
  exports.green60Hover = green60Hover;
  exports.green70 = green70;
  exports.green70Hover = green70Hover;
  exports.green80 = green80;
  exports.green80Hover = green80Hover;
  exports.green90 = green90;
  exports.green90Hover = green90Hover;
  exports.greenHover = greenHover;
  exports.magenta = magenta;
  exports.magenta10 = magenta10;
  exports.magenta100 = magenta100;
  exports.magenta100Hover = magenta100Hover;
  exports.magenta10Hover = magenta10Hover;
  exports.magenta20 = magenta20;
  exports.magenta20Hover = magenta20Hover;
  exports.magenta30 = magenta30;
  exports.magenta30Hover = magenta30Hover;
  exports.magenta40 = magenta40;
  exports.magenta40Hover = magenta40Hover;
  exports.magenta50 = magenta50;
  exports.magenta50Hover = magenta50Hover;
  exports.magenta60 = magenta60;
  exports.magenta60Hover = magenta60Hover;
  exports.magenta70 = magenta70;
  exports.magenta70Hover = magenta70Hover;
  exports.magenta80 = magenta80;
  exports.magenta80Hover = magenta80Hover;
  exports.magenta90 = magenta90;
  exports.magenta90Hover = magenta90Hover;
  exports.magentaHover = magentaHover;
  exports.orange = orange;
  exports.orange10 = orange10;
  exports.orange100 = orange100;
  exports.orange100Hover = orange100Hover;
  exports.orange10Hover = orange10Hover;
  exports.orange20 = orange20;
  exports.orange20Hover = orange20Hover;
  exports.orange30 = orange30;
  exports.orange30Hover = orange30Hover;
  exports.orange40 = orange40;
  exports.orange40Hover = orange40Hover;
  exports.orange50 = orange50;
  exports.orange50Hover = orange50Hover;
  exports.orange60 = orange60;
  exports.orange60Hover = orange60Hover;
  exports.orange70 = orange70;
  exports.orange70Hover = orange70Hover;
  exports.orange80 = orange80;
  exports.orange80Hover = orange80Hover;
  exports.orange90 = orange90;
  exports.orange90Hover = orange90Hover;
  exports.orangeHover = orangeHover;
  exports.purple = purple;
  exports.purple10 = purple10;
  exports.purple100 = purple100;
  exports.purple100Hover = purple100Hover;
  exports.purple10Hover = purple10Hover;
  exports.purple20 = purple20;
  exports.purple20Hover = purple20Hover;
  exports.purple30 = purple30;
  exports.purple30Hover = purple30Hover;
  exports.purple40 = purple40;
  exports.purple40Hover = purple40Hover;
  exports.purple50 = purple50;
  exports.purple50Hover = purple50Hover;
  exports.purple60 = purple60;
  exports.purple60Hover = purple60Hover;
  exports.purple70 = purple70;
  exports.purple70Hover = purple70Hover;
  exports.purple80 = purple80;
  exports.purple80Hover = purple80Hover;
  exports.purple90 = purple90;
  exports.purple90Hover = purple90Hover;
  exports.purpleHover = purpleHover;
  exports.red = red;
  exports.red10 = red10;
  exports.red100 = red100;
  exports.red100Hover = red100Hover;
  exports.red10Hover = red10Hover;
  exports.red20 = red20;
  exports.red20Hover = red20Hover;
  exports.red30 = red30;
  exports.red30Hover = red30Hover;
  exports.red40 = red40;
  exports.red40Hover = red40Hover;
  exports.red50 = red50;
  exports.red50Hover = red50Hover;
  exports.red60 = red60;
  exports.red60Hover = red60Hover;
  exports.red70 = red70;
  exports.red70Hover = red70Hover;
  exports.red80 = red80;
  exports.red80Hover = red80Hover;
  exports.red90 = red90;
  exports.red90Hover = red90Hover;
  exports.redHover = redHover;
  exports.rgba = rgba;
  exports.teal = teal;
  exports.teal10 = teal10;
  exports.teal100 = teal100;
  exports.teal100Hover = teal100Hover;
  exports.teal10Hover = teal10Hover;
  exports.teal20 = teal20;
  exports.teal20Hover = teal20Hover;
  exports.teal30 = teal30;
  exports.teal30Hover = teal30Hover;
  exports.teal40 = teal40;
  exports.teal40Hover = teal40Hover;
  exports.teal50 = teal50;
  exports.teal50Hover = teal50Hover;
  exports.teal60 = teal60;
  exports.teal60Hover = teal60Hover;
  exports.teal70 = teal70;
  exports.teal70Hover = teal70Hover;
  exports.teal80 = teal80;
  exports.teal80Hover = teal80Hover;
  exports.teal90 = teal90;
  exports.teal90Hover = teal90Hover;
  exports.tealHover = tealHover;
  exports.unstable_hoverColors = unstable_hoverColors;
  exports.warmGray = warmGray;
  exports.warmGray10 = warmGray10;
  exports.warmGray100 = warmGray100;
  exports.warmGray100Hover = warmGray100Hover;
  exports.warmGray10Hover = warmGray10Hover;
  exports.warmGray20 = warmGray20;
  exports.warmGray20Hover = warmGray20Hover;
  exports.warmGray30 = warmGray30;
  exports.warmGray30Hover = warmGray30Hover;
  exports.warmGray40 = warmGray40;
  exports.warmGray40Hover = warmGray40Hover;
  exports.warmGray50 = warmGray50;
  exports.warmGray50Hover = warmGray50Hover;
  exports.warmGray60 = warmGray60;
  exports.warmGray60Hover = warmGray60Hover;
  exports.warmGray70 = warmGray70;
  exports.warmGray70Hover = warmGray70Hover;
  exports.warmGray80 = warmGray80;
  exports.warmGray80Hover = warmGray80Hover;
  exports.warmGray90 = warmGray90;
  exports.warmGray90Hover = warmGray90Hover;
  exports.warmGrayHover = warmGrayHover;
  exports.white = white;
  exports.white0 = white0;
  exports.whiteHover = whiteHover;
  exports.yellow = yellow;
  exports.yellow10 = yellow10;
  exports.yellow100 = yellow100;
  exports.yellow100Hover = yellow100Hover;
  exports.yellow10Hover = yellow10Hover;
  exports.yellow20 = yellow20;
  exports.yellow20Hover = yellow20Hover;
  exports.yellow30 = yellow30;
  exports.yellow30Hover = yellow30Hover;
  exports.yellow40 = yellow40;
  exports.yellow40Hover = yellow40Hover;
  exports.yellow50 = yellow50;
  exports.yellow50Hover = yellow50Hover;
  exports.yellow60 = yellow60;
  exports.yellow60Hover = yellow60Hover;
  exports.yellow70 = yellow70;
  exports.yellow70Hover = yellow70Hover;
  exports.yellow80 = yellow80;
  exports.yellow80Hover = yellow80Hover;
  exports.yellow90 = yellow90;
  exports.yellow90Hover = yellow90Hover;
  exports.yellowHover = yellowHover;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
