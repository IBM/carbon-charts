(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@carbon/layout')) :
  typeof define === 'function' && define.amd ? define(['exports', '@carbon/layout'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CarbonType = {}, global.CarbonLayout));
}(this, (function (exports, layout) { 'use strict';

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  // Font family fallbacks for: IBM Plex Mono, IBM Plex Sans, IBM Plex Sans
  // Condensed, IBM Plex Sans Hebrew, and IBM Plex Serif
  var fontFamilies = {
    mono: "'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace",
    sans: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
    sansCondensed: "'IBM Plex Sans Condensed', 'Helvetica Neue', Arial, sans-serif",
    sansHebrew: "'IBM Plex Sans Hebrew', 'Helvetica Hebrew', 'Arial Hebrew', sans-serif",
    serif: "'IBM Plex Serif', 'Georgia', Times, serif"
  };
  function fontFamily(name) {
    if (!fontFamilies[name]) {
      throw new Error("Unable to find font family: `".concat(name, "`. Expected one of: ") + "[".concat(Object.keys(fontFamilies).join(', '), "]"));
    }

    return {
      fontFamily: fontFamilies[name]
    };
  }

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var fontWeights = {
    light: 300,
    regular: 400,
    semibold: 600
  };
  function fontWeight(weight) {
    if (!fontWeights[weight]) {
      throw new Error("Unable to find font weight: `".concat(weight, "`. Expected one of: ") + "[".concat(Object.keys(fontWeights).join(', '), "]"));
    }

    return {
      fontWeight: fontWeights[weight]
    };
  }

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  function print(block) {
    return Object.keys(block).reduce(function (acc, key, index) {
      // Short-circuit on the foreign key 'breakpoints'. This is used in our
      // tokens for fluid type and should not be printed. In the future, we should
      // tie this to media query outputs.
      if (key === 'breakpoints') {
        return acc;
      }

      var property = "".concat(paramCase(key), ": ").concat(block[key], ";");

      if (index === 0) {
        return property;
      }

      return acc + '\n' + property;
    }, '');
  }

  function paramCase(string) {
    var result = '';

    for (var i = 0; i < string.length; i++) {
      var character = string[i];

      if (character === character.toUpperCase()) {
        result += '-' + character.toLowerCase();
        continue;
      }

      result += character;
    }

    return result;
  }

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var reset = {
    html: {
      fontSize: layout.px(layout.baseFontSize)
    },
    body: {
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.regular,
      textRendering: 'optimizeLegibility',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale'
    },
    strong: {
      fontWeight: fontWeights.semibold
    },
    code: {
      fontFamily: fontFamilies.mono
    }
  };

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */

  /**
   * Get the type size for the given step
   * @param {number} step
   * @returns {number}
   */
  function getTypeSize(step) {
    if (step <= 1) {
      return 12;
    } // Yn = Yn-1 + {FLOOR[(n - 2) / 4] + 1} * 2


    return getTypeSize(step - 1) + Math.floor((step - 2) / 4 + 1) * 2;
  }
  /**
   * The default type scale for 23 steps. Inlined as an array here through running
   * the follow step:
   *
   * > Array.from({ length: 23 }, (_, i) => getTypeSize(i + 1))
   */

  var scale = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 68, 76, 84, 92, 102, 112, 122, 132, 144, 156];

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var caption01$1 = {
    fontSize: layout.rem(scale[0]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.34,
    letterSpacing: layout.px(0.32)
  };
  var caption02$1 = {
    fontSize: layout.rem(scale[1]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.29,
    letterSpacing: layout.px(0.32)
  };
  var label01$1 = {
    fontSize: layout.rem(scale[0]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.34,
    letterSpacing: layout.px(0.32)
  };
  var label02$1 = {
    fontSize: layout.rem(scale[1]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.29,
    letterSpacing: layout.px(0.32)
  };
  var helperText01$1 = {
    fontSize: layout.rem(scale[0]),
    lineHeight: 1.34,
    letterSpacing: layout.px(0.32)
  };
  var helperText02$1 = {
    fontSize: layout.rem(scale[1]),
    lineHeight: 1.29,
    letterSpacing: layout.px(0.32)
  };
  var bodyShort01$1 = {
    fontSize: layout.rem(scale[1]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.29,
    letterSpacing: layout.px(0.16)
  };
  var bodyLong01$1 = {
    fontSize: layout.rem(scale[1]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.43,
    letterSpacing: layout.px(0.16)
  };
  var bodyShort02$1 = {
    fontSize: layout.rem(scale[2]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.375,
    letterSpacing: 0
  };
  var bodyLong02$1 = {
    fontSize: layout.rem(scale[2]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.5,
    letterSpacing: 0
  };
  var code01$1 = {
    fontFamily: fontFamilies.mono,
    fontSize: layout.rem(scale[0]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.34,
    letterSpacing: layout.px(0.32)
  };
  var code02$1 = {
    fontFamily: fontFamilies.mono,
    fontSize: layout.rem(scale[1]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.43,
    letterSpacing: layout.px(0.32)
  };
  var heading01$1 = {
    fontSize: layout.rem(scale[1]),
    fontWeight: fontWeights.semibold,
    lineHeight: 1.29,
    letterSpacing: layout.px(0.16)
  };
  var productiveHeading01$1 = heading01$1;
  var heading02$1 = {
    fontSize: layout.rem(scale[2]),
    fontWeight: fontWeights.semibold,
    lineHeight: 1.375,
    letterSpacing: 0
  };
  var productiveHeading02$1 = heading02$1;
  var productiveHeading03$1 = {
    fontSize: layout.rem(scale[4]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.4,
    letterSpacing: 0
  };
  var productiveHeading04$1 = {
    fontSize: layout.rem(scale[6]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.29,
    letterSpacing: 0
  };
  var productiveHeading05$1 = {
    fontSize: layout.rem(scale[7]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.25,
    letterSpacing: 0
  };
  var productiveHeading06$1 = {
    fontSize: layout.rem(scale[9]),
    fontWeight: fontWeights.light,
    lineHeight: 1.199,
    letterSpacing: 0
  };
  var productiveHeading07$1 = {
    fontSize: layout.rem(scale[11]),
    fontWeight: fontWeights.light,
    lineHeight: 1.19,
    letterSpacing: 0
  };
  var expressiveHeading01$1 = _objectSpread2(_objectSpread2({}, heading01$1), {}, {
    lineHeight: 1.25
  });
  var expressiveHeading02$1 = _objectSpread2(_objectSpread2({}, heading02$1), {}, {
    lineHeight: 1.5
  });
  var expressiveHeading03$1 = {
    fontSize: layout.rem(scale[4]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.4,
    letterSpacing: 0,
    breakpoints: {
      xlg: {
        fontSize: layout.rem(scale[4]),
        lineHeight: 1.25
      },
      max: {
        fontSize: layout.rem(scale[5]),
        lineHeight: 1.334
      }
    }
  };
  var expressiveHeading04$1 = {
    fontSize: layout.rem(scale[6]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.29,
    letterSpacing: 0,
    breakpoints: {
      xlg: {
        fontSize: layout.rem(scale[6]),
        lineHeight: 1.25
      },
      max: {
        fontSize: layout.rem(scale[7])
      }
    }
  };
  var expressiveHeading05$1 = {
    fontSize: layout.rem(scale[7]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.25,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[8]),
        fontWeight: fontWeights.light,
        lineHeight: 1.22,
        letterSpacing: 0
      },
      lg: {
        fontSize: layout.rem(scale[9]),
        fontWeight: fontWeights.light,
        lineHeight: 1.19,
        letterSpacing: 0
      },
      xlg: {
        fontSize: layout.rem(scale[10]),
        fontWeight: fontWeights.light,
        lineHeight: 1.17,
        letterSpacing: 0
      },
      max: {
        fontSize: layout.rem(scale[12]),
        fontWeight: fontWeights.light,
        letterSpacing: 0
      }
    }
  };
  var expressiveHeading06$1 = {
    fontSize: layout.rem(scale[7]),
    fontWeight: fontWeights.semibold,
    lineHeight: 1.25,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[8]),
        fontWeight: fontWeights.semibold,
        lineHeight: 1.22,
        letterSpacing: 0
      },
      lg: {
        fontSize: layout.rem(scale[9]),
        fontWeight: fontWeights.semibold,
        lineHeight: 1.19,
        letterSpacing: 0
      },
      xlg: {
        fontSize: layout.rem(scale[10]),
        fontWeight: fontWeights.semibold,
        lineHeight: 1.17,
        letterSpacing: 0
      },
      max: {
        fontSize: layout.rem(scale[12]),
        fontWeight: fontWeights.semibold,
        letterSpacing: 0
      }
    }
  };
  var expressiveParagraph01$1 = {
    fontSize: layout.rem(scale[5]),
    fontWeight: fontWeights.light,
    lineHeight: 1.334,
    letterSpacing: 0,
    breakpoints: {
      lg: {
        fontSize: layout.rem(scale[6]),
        lineHeight: 1.29
      },
      max: {
        fontSize: layout.rem(scale[7]),
        lineHeight: 1.25
      }
    }
  };
  var quotation01$1 = {
    fontSize: layout.rem(scale[4]),
    fontWeight: fontWeights.regular,
    lineHeight: 1.3,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[4]),
        fontWeight: fontWeights.regular,
        letterSpacing: 0
      },
      lg: {
        fontSize: layout.rem(scale[5]),
        fontWeight: fontWeights.regular,
        lineHeight: 1.334,
        letterSpacing: 0
      },
      xlg: {
        fontSize: layout.rem(scale[6]),
        fontWeight: fontWeights.regular,
        lineHeight: 1.29,
        letterSpacing: 0
      },
      max: {
        fontSize: layout.rem(scale[7]),
        fontWeight: fontWeights.regular,
        lineHeight: 1.25,
        letterSpacing: 0
      }
    }
  };
  var quotation02$1 = {
    fontSize: layout.rem(scale[7]),
    fontWeight: fontWeights.light,
    lineHeight: 1.25,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[8]),
        lineHeight: 1.22
      },
      lg: {
        fontSize: layout.rem(scale[9]),
        lineHeight: 1.19
      },
      xlg: {
        fontSize: layout.rem(scale[10]),
        lineHeight: 1.17
      },
      max: {
        fontSize: layout.rem(scale[12])
      }
    }
  };
  var display01$1 = {
    fontSize: layout.rem(scale[9]),
    fontWeight: fontWeights.light,
    lineHeight: 1.19,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[9])
      },
      lg: {
        fontSize: layout.rem(scale[11])
      },
      xlg: {
        fontSize: layout.rem(scale[12]),
        lineHeight: 1.17
      },
      max: {
        fontSize: layout.rem(scale[14]),
        lineHeight: 1.13
      }
    }
  };
  var display02$1 = {
    fontSize: layout.rem(scale[9]),
    fontWeight: fontWeights.semibold,
    lineHeight: 1.19,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[9])
      },
      lg: {
        fontSize: layout.rem(scale[11])
      },
      xlg: {
        fontSize: layout.rem(scale[12]),
        lineHeight: 1.16
      },
      max: {
        fontSize: layout.rem(scale[14]),
        lineHeight: 1.13
      }
    }
  };
  var display03$1 = {
    fontSize: layout.rem(scale[9]),
    fontWeight: fontWeights.light,
    lineHeight: 1.19,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[13]),
        lineHeight: 1.15
      },
      lg: {
        fontSize: layout.rem(scale[16]),
        lineHeight: 1.11,
        letterSpacing: layout.px(-0.64)
      },
      xlg: {
        fontSize: layout.rem(scale[19]),
        lineHeight: 1.07
      },
      max: {
        fontSize: layout.rem(scale[22]),
        lineHeight: 1.05,
        letterSpacing: layout.px(-0.96)
      }
    }
  };
  var display04$1 = {
    fontSize: layout.rem(scale[9]),
    fontWeight: fontWeights.semibold,
    lineHeight: 1.19,
    letterSpacing: 0,
    breakpoints: {
      md: {
        fontSize: layout.rem(scale[13]),
        lineHeight: 1.15
      },
      lg: {
        fontSize: layout.rem(scale[16]),
        lineHeight: 1.11,
        letterSpacing: layout.px(-0.64)
      },
      xlg: {
        fontSize: layout.rem(scale[19]),
        lineHeight: 1.07,
        letterSpacing: layout.px(-0.64)
      },
      max: {
        fontSize: layout.rem(scale[22]),
        lineHeight: 1.05,
        letterSpacing: layout.px(-0.96)
      }
    }
  };

  var styles = /*#__PURE__*/Object.freeze({
    __proto__: null,
    caption01: caption01$1,
    caption02: caption02$1,
    label01: label01$1,
    label02: label02$1,
    helperText01: helperText01$1,
    helperText02: helperText02$1,
    bodyShort01: bodyShort01$1,
    bodyLong01: bodyLong01$1,
    bodyShort02: bodyShort02$1,
    bodyLong02: bodyLong02$1,
    code01: code01$1,
    code02: code02$1,
    heading01: heading01$1,
    productiveHeading01: productiveHeading01$1,
    heading02: heading02$1,
    productiveHeading02: productiveHeading02$1,
    productiveHeading03: productiveHeading03$1,
    productiveHeading04: productiveHeading04$1,
    productiveHeading05: productiveHeading05$1,
    productiveHeading06: productiveHeading06$1,
    productiveHeading07: productiveHeading07$1,
    expressiveHeading01: expressiveHeading01$1,
    expressiveHeading02: expressiveHeading02$1,
    expressiveHeading03: expressiveHeading03$1,
    expressiveHeading04: expressiveHeading04$1,
    expressiveHeading05: expressiveHeading05$1,
    expressiveHeading06: expressiveHeading06$1,
    expressiveParagraph01: expressiveParagraph01$1,
    quotation01: quotation01$1,
    quotation02: quotation02$1,
    display01: display01$1,
    display02: display02$1,
    display03: display03$1,
    display04: display04$1
  });

  var _excluded = ["breakpoints"];
  var breakpointNames = Object.keys(layout.breakpoints);

  function next(name) {
    return breakpointNames[breakpointNames.indexOf(name) + 1];
  }

  function fluid(selector) {
    var fluidBreakpoints = selector.breakpoints,
        styles = _objectWithoutProperties(selector, _excluded);

    if (_typeof(fluidBreakpoints) !== 'object') {
      return styles;
    }

    var fluidBreakpointNames = Object.keys(fluidBreakpoints);

    if (fluidBreakpointNames.length === 0) {
      return styles;
    }

    styles.fontSize = fluidTypeSize(styles, 'sm', fluidBreakpoints);
    fluidBreakpointNames.forEach(function (name) {
      styles[layout.breakpoint(name)] = _objectSpread2(_objectSpread2({}, fluidBreakpoints[name]), {}, {
        fontSize: fluidTypeSize(styles, name, fluidBreakpoints)
      });
    });
    return styles;
  }

  function fluidTypeSize(defaultStyles, fluidBreakpointName, fluidBreakpoints) {
    var breakpoint = layout.breakpoints[fluidBreakpointName];
    var fluidBreakpoint = fluidBreakpointName === 'sm' ? defaultStyles : fluidBreakpoints[fluidBreakpointName];
    var maxFontSize = defaultStyles.fontSize;
    var minFontSize = defaultStyles.fontSize;

    if (fluidBreakpoint.fontSize) {
      minFontSize = fluidBreakpoint.fontSize;
    }

    var maxViewportWidth = breakpoint.width;
    var minViewportWidth = breakpoint.width;
    var nextBreakpointAvailable = next(fluidBreakpointName);
    var nextFluidBreakpointName = null;

    while (nextBreakpointAvailable) {
      if (fluidBreakpoints[nextBreakpointAvailable]) {
        nextFluidBreakpointName = nextBreakpointAvailable;
        break;
      }

      nextBreakpointAvailable = next(nextBreakpointAvailable);
    }

    if (nextFluidBreakpointName) {
      var nextFluidBreakpoint = layout.breakpoints[nextFluidBreakpointName];
      maxFontSize = fluidBreakpoints[nextFluidBreakpointName].fontSize;
      maxViewportWidth = nextFluidBreakpoint.width;
      return "calc(".concat(minFontSize, " + ").concat(subtract(maxFontSize, minFontSize), " * ((100vw - ").concat(minViewportWidth, ") / ").concat(subtract(maxViewportWidth, minViewportWidth), "))");
    }

    return minFontSize;
  }

  function subtract(a, b) {
    return parseFloat(a) - parseFloat(b);
  }

  /**
   * Copyright IBM Corp. 2018, 2018
   *
   * This source code is licensed under the Apache-2.0 license found in the
   * LICENSE file in the root directory of this source tree.
   */
  // Unstable tokens
  var caption01 = 'caption01';
  var caption02 = 'caption02';
  var label01 = 'label01';
  var label02 = 'label02';
  var helperText01 = 'helperText01';
  var helperText02 = 'helperText02';
  var bodyShort01 = 'bodyShort01';
  var bodyLong01 = 'bodyLong01';
  var bodyShort02 = 'bodyShort02';
  var bodyLong02 = 'bodyLong02';
  var code01 = 'code01';
  var code02 = 'code02';
  var heading01 = 'heading01';
  var productiveHeading01 = 'productiveHeading01';
  var heading02 = 'heading02';
  var productiveHeading02 = 'productiveHeading02';
  var productiveHeading03 = 'productiveHeading03';
  var productiveHeading04 = 'productiveHeading04';
  var productiveHeading05 = 'productiveHeading05';
  var productiveHeading06 = 'productiveHeading06';
  var productiveHeading07 = 'productiveHeading07';
  var expressiveHeading01 = 'expressiveHeading01';
  var expressiveHeading02 = 'expressiveHeading02';
  var expressiveHeading03 = 'expressiveHeading03';
  var expressiveHeading04 = 'expressiveHeading04';
  var expressiveHeading05 = 'expressiveHeading05';
  var expressiveHeading06 = 'expressiveHeading06';
  var expressiveParagraph01 = 'expressiveParagraph01';
  var quotation01 = 'quotation01';
  var quotation02 = 'quotation02';
  var display01 = 'display01';
  var display02 = 'display02';
  var display03 = 'display03';
  var display04 = 'display04';
  var unstable_tokens = [caption01, caption02, label01, label02, helperText01, helperText02, bodyShort01, bodyLong01, bodyShort02, bodyLong02, code01, code02, heading01, productiveHeading01, heading02, productiveHeading02, productiveHeading03, productiveHeading04, productiveHeading05, productiveHeading06, productiveHeading07, expressiveHeading01, expressiveHeading02, expressiveHeading03, expressiveHeading04, expressiveHeading05, expressiveHeading06, expressiveParagraph01, quotation01, quotation02, display01, display02, display03, display04];

  exports.bodyLong01 = bodyLong01$1;
  exports.bodyLong02 = bodyLong02$1;
  exports.bodyShort01 = bodyShort01$1;
  exports.bodyShort02 = bodyShort02$1;
  exports.caption01 = caption01$1;
  exports.caption02 = caption02$1;
  exports.code01 = code01$1;
  exports.code02 = code02$1;
  exports.display01 = display01$1;
  exports.display02 = display02$1;
  exports.display03 = display03$1;
  exports.display04 = display04$1;
  exports.expressiveHeading01 = expressiveHeading01$1;
  exports.expressiveHeading02 = expressiveHeading02$1;
  exports.expressiveHeading03 = expressiveHeading03$1;
  exports.expressiveHeading04 = expressiveHeading04$1;
  exports.expressiveHeading05 = expressiveHeading05$1;
  exports.expressiveHeading06 = expressiveHeading06$1;
  exports.expressiveParagraph01 = expressiveParagraph01$1;
  exports.fluid = fluid;
  exports.fontFamilies = fontFamilies;
  exports.fontFamily = fontFamily;
  exports.fontWeight = fontWeight;
  exports.fontWeights = fontWeights;
  exports.getTypeSize = getTypeSize;
  exports.heading01 = heading01$1;
  exports.heading02 = heading02$1;
  exports.helperText01 = helperText01$1;
  exports.helperText02 = helperText02$1;
  exports.label01 = label01$1;
  exports.label02 = label02$1;
  exports.print = print;
  exports.productiveHeading01 = productiveHeading01$1;
  exports.productiveHeading02 = productiveHeading02$1;
  exports.productiveHeading03 = productiveHeading03$1;
  exports.productiveHeading04 = productiveHeading04$1;
  exports.productiveHeading05 = productiveHeading05$1;
  exports.productiveHeading06 = productiveHeading06$1;
  exports.productiveHeading07 = productiveHeading07$1;
  exports.quotation01 = quotation01$1;
  exports.quotation02 = quotation02$1;
  exports.reset = reset;
  exports.scale = scale;
  exports.styles = styles;
  exports.unstable_tokens = unstable_tokens;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
