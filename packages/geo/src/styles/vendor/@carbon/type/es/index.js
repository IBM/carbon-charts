import { baseFontSize, px, breakpoint, breakpoints, rem } from '@carbon/layout';

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
    fontSize: px(baseFontSize)
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

function _typeof(obj) {
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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
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

var breakpointNames = Object.keys(breakpoints);

function next(name) {
  return breakpointNames[breakpointNames.indexOf(name) + 1];
}

function fluid(selector) {
  var fluidBreakpoints = selector.breakpoints,
      styles = _objectWithoutProperties(selector, ["breakpoints"]);

  if (_typeof(fluidBreakpoints) !== 'object') {
    return styles;
  }

  var fluidBreakpointNames = Object.keys(fluidBreakpoints);

  if (fluidBreakpointNames.length === 0) {
    return styles;
  }

  styles.fontSize = fluidTypeSize(styles, 'sm', fluidBreakpoints);
  fluidBreakpointNames.forEach(function (name) {
    styles[breakpoint(name)] = _objectSpread2({}, fluidBreakpoints[name], {
      fontSize: fluidTypeSize(styles, name, fluidBreakpoints)
    });
  });
  return styles;
}

function fluidTypeSize(defaultStyles, fluidBreakpointName, fluidBreakpoints) {
  var breakpoint$$1 = breakpoints[fluidBreakpointName];
  var fluidBreakpoint = fluidBreakpointName === 'sm' ? defaultStyles : fluidBreakpoints[fluidBreakpointName];
  var maxFontSize = defaultStyles.fontSize;
  var minFontSize = defaultStyles.fontSize;

  if (fluidBreakpoint.fontSize) {
    minFontSize = fluidBreakpoint.fontSize;
  }

  var maxViewportWidth = breakpoint$$1.width;
  var minViewportWidth = breakpoint$$1.width;
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
    var nextFluidBreakpoint = breakpoints[nextFluidBreakpointName];
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
var caption01 = {
  fontSize: rem(scale[0]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(16),
  letterSpacing: px(0.32)
};
var label01 = {
  fontSize: rem(scale[0]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(16),
  letterSpacing: px(0.32)
};
var helperText01 = {
  fontSize: rem(scale[0]),
  fontStyle: 'italic',
  lineHeight: rem(16),
  letterSpacing: px(0.32)
};
var bodyShort01 = {
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(18),
  letterSpacing: px(0.16)
};
var bodyLong01 = {
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(20),
  letterSpacing: px(0.16)
};
var bodyShort02 = {
  fontSize: rem(scale[2]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(22),
  letterSpacing: 0
};
var bodyLong02 = {
  fontSize: rem(scale[2]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(24),
  letterSpacing: 0
};
var code01 = {
  fontSize: rem(scale[0]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(16),
  letterSpacing: px(0.32)
};
var code02 = {
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(20),
  letterSpacing: px(0.32)
};
var heading01 = {
  fontSize: rem(scale[1]),
  fontWeight: fontWeights.semibold,
  lineHeight: rem(18),
  letterSpacing: px(0.16)
};
var productiveHeading01 = heading01;
var heading02 = {
  fontSize: rem(scale[2]),
  fontWeight: fontWeights.semibold,
  lineHeight: rem(22),
  letterSpacing: 0
};
var productiveHeading02 = heading02;
var productiveHeading03 = {
  fontSize: rem(scale[4]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(26),
  letterSpacing: 0
};
var productiveHeading04 = {
  fontSize: rem(scale[6]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(36),
  letterSpacing: 0
};
var productiveHeading05 = {
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.regular,
  lineHeight: rem(40),
  letterSpacing: 0
};
var productiveHeading06 = {
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.light,
  lineHeight: rem(50),
  letterSpacing: 0
};
var productiveHeading07 = {
  fontSize: rem(scale[11]),
  fontWeight: fontWeights.light,
  lineHeight: rem(64),
  letterSpacing: 0
};
var expressiveHeading01 = heading01;
var expressiveHeading02 = heading02;
var expressiveHeading03 = fluid({
  fontSize: rem(scale[4]),
  fontWeight: fontWeights.regular,
  lineHeight: '130%',
  letterSpacing: 0,
  breakpoints: {
    xlg: {
      fontSize: rem(scale[4]),
      lineHeight: '125%'
    },
    max: {
      fontSize: rem(scale[5])
    }
  }
});
var expressiveHeading04 = fluid({
  fontSize: rem(scale[6]),
  fontWeight: fontWeights.regular,
  lineHeight: '129%',
  letterSpacing: 0,
  breakpoints: {
    xlg: {
      fontSize: rem(scale[6]),
      lineHeight: '125%'
    },
    max: {
      fontSize: rem(scale[7])
    }
  }
});
var expressiveHeading05 = fluid({
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.regular,
  lineHeight: '125%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[8]),
      fontWeight: fontWeights.light,
      lineHeight: '122%',
      letterSpacing: 0
    },
    lg: {
      fontSize: rem(scale[9]),
      fontWeight: fontWeights.light,
      lineHeight: '119%',
      letterSpacing: 0
    },
    xlg: {
      fontSize: rem(scale[10]),
      fontWeight: fontWeights.light,
      lineHeight: '117%',
      letterSpacing: 0
    },
    max: {
      fontSize: rem(scale[12]),
      fontWeight: fontWeights.light,
      lineHeight: rem(70),
      letterSpacing: 0
    }
  }
});
var expressiveHeading06 = fluid({
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.semibold,
  lineHeight: '125%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[8]),
      fontWeight: fontWeights.semibold,
      lineHeight: '122%',
      letterSpacing: 0
    },
    lg: {
      fontSize: rem(scale[9]),
      fontWeight: fontWeights.semibold,
      lineHeight: '119%',
      letterSpacing: 0
    },
    xlg: {
      fontSize: rem(scale[10]),
      fontWeight: fontWeights.semibold,
      lineHeight: '117%',
      letterSpacing: 0
    },
    max: {
      fontSize: rem(scale[12]),
      fontWeight: fontWeights.semibold,
      lineHeight: rem(70),
      letterSpacing: 0
    }
  }
});
var expressiveParagraph01 = fluid({
  fontSize: rem(scale[5]),
  fontWeight: fontWeights.light,
  lineHeight: '125%',
  letterSpacing: 0,
  lg: {
    fontSize: rem(scale[6]),
    lineHeight: '129%'
  },
  max: {
    fontSize: rem(scale[7]),
    lineHeight: '125%'
  }
});
var quotation01 = fluid({
  fontSize: rem(scale[4]),
  fontWeight: fontWeights.regular,
  lineHeight: '130%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[4]),
      fontWeight: fontWeights.regular,
      letterSpacing: 0
    },
    lg: {
      fontSize: rem(scale[5]),
      fontWeight: fontWeights.regular,
      lineHeight: '125%',
      letterSpacing: 0
    },
    xlg: {
      fontSize: rem(scale[6]),
      fontWeight: fontWeights.regular,
      lineHeight: '129%',
      letterSpacing: 0
    },
    max: {
      fontSize: rem(scale[7]),
      fontWeight: fontWeights.regular,
      lineHeight: '125%',
      letterSpacing: 0
    }
  }
});
var quotation02 = fluid({
  fontSize: rem(scale[7]),
  fontWeight: fontWeights.light,
  lineHeight: '125%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[8]),
      lineHeight: '122%'
    },
    lg: {
      fontSize: rem(scale[9]),
      lineHeight: '119%'
    },
    xlg: {
      fontSize: rem(scale[10]),
      lineHeight: '117%'
    },
    max: {
      fontSize: rem(scale[12])
    }
  }
});
var display01 = fluid({
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.light,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[9])
    },
    lg: {
      fontSize: rem(scale[11])
    },
    xlg: {
      fontSize: rem(scale[12]),
      lineHeight: '117%'
    },
    max: {
      fontSize: rem(scale[14]),
      lineHeight: '113%'
    }
  }
});
var display02 = fluid({
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.semibold,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[9])
    },
    lg: {
      fontSize: rem(scale[11])
    },
    xlg: {
      fontSize: rem(scale[12]),
      lineHeight: '116%'
    },
    max: {
      fontSize: rem(scale[14]),
      lineHeight: '113%'
    }
  }
});
var display03 = fluid({
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.light,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[13]),
      lineHeight: '115%'
    },
    lg: {
      fontSize: rem(scale[16]),
      lineHeight: '111%',
      letterSpacing: px(-0.64)
    },
    xlg: {
      fontSize: rem(scale[19]),
      lineHeight: '107%'
    },
    max: {
      fontSize: rem(scale[22]),
      lineHeight: '105%',
      letterSpacing: px(-0.96)
    }
  }
});
var display04 = fluid({
  fontSize: rem(scale[9]),
  fontWeight: fontWeights.semibold,
  lineHeight: '119%',
  letterSpacing: 0,
  breakpoints: {
    md: {
      fontSize: rem(scale[13]),
      lineHeight: '115%'
    },
    lg: {
      fontSize: rem(scale[16]),
      lineHeight: '111%',
      letterSpacing: px(-0.64)
    },
    xlg: {
      fontSize: rem(scale[19]),
      lineHeight: '107%',
      letterSpacing: px(-0.64)
    },
    max: {
      fontSize: rem(scale[22]),
      lineHeight: '105%',
      letterSpacing: px(-0.96)
    }
  }
});

var styles = /*#__PURE__*/Object.freeze({
  caption01: caption01,
  label01: label01,
  helperText01: helperText01,
  bodyShort01: bodyShort01,
  bodyLong01: bodyLong01,
  bodyShort02: bodyShort02,
  bodyLong02: bodyLong02,
  code01: code01,
  code02: code02,
  heading01: heading01,
  productiveHeading01: productiveHeading01,
  heading02: heading02,
  productiveHeading02: productiveHeading02,
  productiveHeading03: productiveHeading03,
  productiveHeading04: productiveHeading04,
  productiveHeading05: productiveHeading05,
  productiveHeading06: productiveHeading06,
  productiveHeading07: productiveHeading07,
  expressiveHeading01: expressiveHeading01,
  expressiveHeading02: expressiveHeading02,
  expressiveHeading03: expressiveHeading03,
  expressiveHeading04: expressiveHeading04,
  expressiveHeading05: expressiveHeading05,
  expressiveHeading06: expressiveHeading06,
  expressiveParagraph01: expressiveParagraph01,
  quotation01: quotation01,
  quotation02: quotation02,
  display01: display01,
  display02: display02,
  display03: display03,
  display04: display04
});

/**
 * Copyright IBM Corp. 2018, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export { fontFamilies, fontFamily, fontWeights, fontWeight, print, reset, getTypeSize, scale, styles, caption01, label01, helperText01, bodyShort01, bodyLong01, bodyShort02, bodyLong02, code01, code02, heading01, productiveHeading01, heading02, productiveHeading02, productiveHeading03, productiveHeading04, productiveHeading05, productiveHeading06, productiveHeading07, expressiveHeading01, expressiveHeading02, expressiveHeading03, expressiveHeading04, expressiveHeading05, expressiveHeading06, expressiveParagraph01, quotation01, quotation02, display01, display02, display03, display04 };
