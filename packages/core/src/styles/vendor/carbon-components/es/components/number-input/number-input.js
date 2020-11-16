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

var NumberInput = /*#__PURE__*/function (_mixin) {
  _inherits(NumberInput, _mixin);

  var _super = _createSuper(NumberInput);
  /**
   * Number input UI.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a number input UI.
   */


  function NumberInput(element, options) {
    var _this;

    _classCallCheck(this, NumberInput);

    _this = _super.call(this, element, options); // Broken DOM tree is seen with up/down arrows <svg> in IE, which breaks event delegation.
    // <svg> does not have `Element.classList` in IE11

    _this.manage(on(_this.element.querySelector('.up-icon'), 'click', function (event) {
      _this._handleClick(event);
    }));

    _this.manage(on(_this.element.querySelector('.down-icon'), 'click', function (event) {
      _this._handleClick(event);
    }));

    return _this;
  }
  /**
   * Increase/decrease number by clicking on up/down icons.
   * @param {Event} event The event triggering this method.
   */


  _createClass(NumberInput, [{
    key: "_handleClick",
    value: function _handleClick(event) {
      var numberInput = this.element.querySelector(this.options.selectorInput);
      var target = event.currentTarget.getAttribute('class').split(' ');
      var min = Number(numberInput.min);
      var max = Number(numberInput.max);
      var step = Number(numberInput.step) || 1;

      if (target.indexOf('up-icon') >= 0) {
        var nextValue = Number(numberInput.value) + step;

        if (numberInput.max === '') {
          numberInput.value = nextValue;
        } else if (numberInput.value < max) {
          if (nextValue > max) {
            numberInput.value = max;
          } else if (nextValue < min) {
            numberInput.value = min;
          } else {
            numberInput.value = nextValue;
          }
        }
      } else if (target.indexOf('down-icon') >= 0) {
        var _nextValue = Number(numberInput.value) - step;

        if (numberInput.min === '') {
          numberInput.value = _nextValue;
        } else if (numberInput.value > min) {
          if (_nextValue < min) {
            numberInput.value = min;
          } else if (_nextValue > max) {
            numberInput.value = max;
          } else {
            numberInput.value = _nextValue;
          }
        }
      } // Programmatic change in value (including `stepUp()`/`stepDown()`) won't fire change event


      numberInput.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        cancelable: false
      }));
    }
    /**
     * The map associating DOM element and number input UI instance.
     * @member NumberInput.components
     * @type {WeakMap}
     */

  }], [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode NumberInput.create .create()}, or {@linkcode NumberInput.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode NumberInput.init .init()} works.
     * @member NumberInput.options
     * @type {object}
     * @property {string} selectorInit The CSS selector to find number input UIs.
     * @property {string} [selectorInput] The CSS selector to find the `<input>` element.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-numberinput]',
        selectorInput: ".".concat(prefix, "--number input")
      };
    }
  }]);

  NumberInput.components = new WeakMap();
  return NumberInput;
}(mixin(createComponent, initComponentBySearch, handles));

export default NumberInput;