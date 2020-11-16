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
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

var Accordion = /*#__PURE__*/function (_mixin) {
  _inherits(Accordion, _mixin);

  var _super = _createSuper(Accordion);
  /**
   * Accordion.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as an accordion.
   */


  function Accordion(element, options) {
    var _this;

    _classCallCheck(this, Accordion);

    _this = _super.call(this, element, options);

    _this.manage(on(_this.element, 'click', function (event) {
      var item = eventMatches(event, _this.options.selectorAccordionItem);

      if (item && !eventMatches(event, _this.options.selectorAccordionContent)) {
        _this._toggle(item);
      }
    }));
    /**
     *
     *  DEPRECATE in v8
     *
     *  Swapping to a button elemenet instead of a div
     *  automatically maps click events to keypress as well
     *  This event listener now is only added if user is using
     *  the older markup
     */


    if (!_this._checkIfButton()) {
      _this.manage(on(_this.element, 'keypress', function (event) {
        var item = eventMatches(event, _this.options.selectorAccordionItem);

        if (item && !eventMatches(event, _this.options.selectorAccordionContent)) {
          _this._handleKeypress(event);
        }
      }));
    }

    return _this;
  }

  _createClass(Accordion, [{
    key: "_checkIfButton",
    value: function _checkIfButton() {
      return this.element.firstElementChild.firstElementChild.nodeName === 'BUTTON';
    }
    /**
     * Handles toggling of active state of accordion via keyboard
     * @param {Event} event The event triggering this method.
     */

  }, {
    key: "_handleKeypress",
    value: function _handleKeypress(event) {
      if (event.which === 13 || event.which === 32) {
        this._toggle(event.target);
      }
    }
  }, {
    key: "_toggle",
    value: function _toggle(element) {
      var heading = element.querySelector(this.options.selectorAccordionItemHeading);
      var expanded = heading.getAttribute('aria-expanded');

      if (expanded !== null) {
        heading.setAttribute('aria-expanded', expanded === 'true' ? 'false' : 'true');
      }

      element.classList.toggle(this.options.classActive);
    }
    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode NumberInput.create .create()}, or {@linkcode NumberInput.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode NumberInput.init .init()} works.
     * @property {string} selectorInit The CSS selector to find accordion UIs.
     */

  }], [{
    key: "options",
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-accordion]',
        selectorAccordionItem: ".".concat(prefix, "--accordion__item"),
        selectorAccordionItemHeading: ".".concat(prefix, "--accordion__heading"),
        selectorAccordionContent: ".".concat(prefix, "--accordion__content"),
        classActive: "".concat(prefix, "--accordion__item--active")
      };
    }
    /**
     * The map associating DOM element and accordion UI instance.
     * @type {WeakMap}
     */

  }]);

  Accordion.components = new WeakMap();
  return Accordion;
}(mixin(createComponent, initComponentBySearch, handles));

export default Accordion;