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


import debounce from 'lodash.debounce';
import settings from '../../globals/js/settings';
import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentBySearch from '../../globals/js/mixins/init-component-by-search';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

var TooltipSimple = /*#__PURE__*/function (_mixin) {
  _inherits(TooltipSimple, _mixin);

  var _super = _createSuper(TooltipSimple);
  /**
   * Simple Tooltip.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element - The element functioning as a text field.
   */


  function TooltipSimple(element, options) {
    var _this;

    _classCallCheck(this, TooltipSimple);

    _this = _super.call(this, element, options);
    _this.tooltipFadeOut = debounce(function () {
      var tooltipTriggerButton = _this.getTooltipTriggerButton();

      if (tooltipTriggerButton) {
        tooltipTriggerButton.classList.remove(_this.options.classTooltipVisible);
      }
    }, 100);

    _this.getTooltipTriggerButton = function () {
      return _this.element.matches(_this.options.selectorTriggerButton) ? _this.element : _this.element.querySelector(_this.options.selectorTriggerButton);
    };

    _this.allowTooltipVisibility = function (_ref) {
      var visible = _ref.visible;

      var tooltipTriggerButton = _this.getTooltipTriggerButton();

      if (!tooltipTriggerButton) {
        return;
      }

      if (visible) {
        tooltipTriggerButton.classList.remove(_this.options.classTooltipHidden);
      } else {
        tooltipTriggerButton.classList.add(_this.options.classTooltipHidden);
      }
    };

    _this.manage(on(_this.element.ownerDocument, 'keydown', function (event) {
      // ESC
      if (event.which === 27) {
        _this.allowTooltipVisibility({
          visible: false
        });

        var tooltipTriggerButton = _this.getTooltipTriggerButton();

        if (tooltipTriggerButton) {
          tooltipTriggerButton.classList.remove(_this.options.classTooltipVisible);
        }
      }
    }));

    _this.manage(on(_this.element, 'mouseenter', function () {
      _this.tooltipFadeOut.cancel();

      _this.allowTooltipVisibility({
        visible: true
      });

      var tooltipTriggerButton = _this.getTooltipTriggerButton();

      if (tooltipTriggerButton) {
        tooltipTriggerButton.classList.add(_this.options.classTooltipVisible);
      }
    }));

    _this.manage(on(_this.element, 'mouseleave', _this.tooltipFadeOut));

    _this.manage(on(_this.element, 'focusin', function (event) {
      if (eventMatches(event, _this.options.selectorTriggerButton)) {
        _this.allowTooltipVisibility({
          visible: true
        });
      }
    }));

    return _this;
  }

  _createClass(TooltipSimple, null, [{
    key: "options",

    /**
     * The component options.
     *
     * If `options` is specified in the constructor,
     * {@linkcode TooltipSimple.create .create()},
     * or {@linkcode TooltipSimple.init .init()},
     * properties in this object are overriden for the instance being
     * created and how {@linkcode TooltipSimple.init .init()} works.
     * @property {string} selectorInit The CSS selector to find simple tooltip UIs.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-tooltip-definition],[data-tooltip-icon]',
        selectorTriggerButton: ".".concat(prefix, "--tooltip__trigger.").concat(prefix, "--tooltip--a11y"),
        classTooltipHidden: "".concat(prefix, "--tooltip--hidden"),
        classTooltipVisible: "".concat(prefix, "--tooltip--visible")
      };
    }
    /**
     * The map associating DOM element and simple tooltip UI instance.
     * @type {WeakMap}
     */

  }]);

  TooltipSimple.components = new WeakMap();
  return TooltipSimple;
}(mixin(createComponent, initComponentBySearch, handles));

export { TooltipSimple as default };