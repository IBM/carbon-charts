function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */


import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import on from '../../globals/js/misc/on';

var CopyButton = /*#__PURE__*/function (_mixin) {
  _inherits(CopyButton, _mixin);

  var _super = _createSuper(CopyButton);
  /**
   * CopyBtn UI.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a copy button UI.
   */


  function CopyButton(element, options) {
    var _this;

    _classCallCheck(this, CopyButton);

    _this = _super.call(this, element, options);

    _this.manage(on(_this.element, 'click', function () {
      return _this.handleClick();
    }));

    _this.manage(on(_this.element, 'animationend', function (event) {
      return _this.handleAnimationEnd(event);
    }));

    return _this;
  }
  /**
   * Cleanup animation classes
   */


  _createClass(CopyButton, [{
    key: "handleAnimationEnd",
    value: function handleAnimationEnd(event) {
      if (event.animationName === 'hide-feedback') {
        this.element.classList.remove(this.options.classAnimating);
        this.element.classList.remove(this.options.classFadeOut);
      }
    }
    /**
     * Show the feedback tooltip on click. Hide the feedback tooltip after specified timeout value.
     */

  }, {
    key: "handleClick",
    value: function handleClick() {
      var _this2 = this;

      var feedback = this.element.querySelector(this.options.feedbackTooltip);

      if (feedback) {
        feedback.classList.add(this.options.classShowFeedback);
        setTimeout(function () {
          feedback.classList.remove(_this2.options.classShowFeedback);
        }, this.options.timeoutValue);
      } else {
        this.element.classList.add(this.options.classAnimating);
        this.element.classList.add(this.options.classFadeIn);
        setTimeout(function () {
          _this2.element.classList.remove(_this2.options.classFadeIn);

          _this2.element.classList.add(_this2.options.classFadeOut);
        }, this.options.timeoutValue);
      }
    }
    /**
     * The map associating DOM element and copy button UI instance.
     * @member CopyBtn.components
     * @type {WeakMap}
     */

  }], [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode CopyBtn.create .create()}, or {@linkcode CopyBtn.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode CopyBtn.init .init()} works.
     * @member CopyBtn.options
     * @type {object}
     * @property {string} selectorInit The data attribute to find copy button UIs.
     * @property {string} feedbackTooltip The data attribute to find feedback tooltip.
     * @property {string} classShowFeedback The CSS selector for showing the feedback tooltip.
     * @property {number} timeoutValue The specified timeout value before the feedback tooltip is hidden.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-copy-btn]',
        feedbackTooltip: '[data-feedback]',
        classShowFeedback: "".concat(prefix, "--btn--copy__feedback--displayed"),
        classAnimating: "".concat(prefix, "--copy-btn--animating"),
        classFadeIn: "".concat(prefix, "--copy-btn--fade-in"),
        classFadeOut: "".concat(prefix, "--copy-btn--fade-out"),
        timeoutValue: 2000
      };
    }
  }]);

  CopyButton.components = new WeakMap();
  return CopyButton;
}(mixin(createComponent, initComponentBySearch, handles));

export default CopyButton;