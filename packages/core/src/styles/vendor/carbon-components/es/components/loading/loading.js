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

var Loading = /*#__PURE__*/function (_mixin) {
  _inherits(Loading, _mixin);

  var _super = _createSuper(Loading);
  /**
   * Spinner indicating loading state.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a spinner.
   * @param {object} [options] The component options.
   * @param {boolean} [options.active] `true` if this spinner should roll.
   */


  function Loading(element, options) {
    var _this;

    _classCallCheck(this, Loading);

    _this = _super.call(this, element, options);
    _this.active = _this.options.active; // Initialize spinner

    _this.set(_this.active);

    return _this;
  }
  /**
   * Sets active/inactive state.
   * @param {boolean} active `true` if this spinner should roll.
   */


  _createClass(Loading, [{
    key: "set",
    value: function set(active) {
      if (typeof active !== 'boolean') {
        throw new TypeError('set expects a boolean.');
      }

      this.active = active;
      this.element.classList.toggle(this.options.classLoadingStop, !this.active);
      /**
       * If overlay is the parentNode then toggle it too.
       */

      var parentNode = this.element.parentNode;

      if (parentNode && parentNode.classList.contains(this.options.classLoadingOverlay)) {
        parentNode.classList.toggle(this.options.classLoadingOverlayStop, !this.active);
      }

      return this;
    }
    /**
     * Toggles active/inactive state.
     */

  }, {
    key: "toggle",
    value: function toggle() {
      return this.set(!this.active);
    }
    /**
     * @returns {boolean} `true` if this spinner is rolling.
     */

  }, {
    key: "isActive",
    value: function isActive() {
      return this.active;
    }
    /**
     * Sets state to inactive and deletes the loading element.
     */

  }, {
    key: "end",
    value: function end() {
      var _this2 = this;

      this.set(false);
      var handleAnimationEnd = this.manage(on(this.element, 'animationend', function (evt) {
        if (handleAnimationEnd) {
          handleAnimationEnd = _this2.unmanage(handleAnimationEnd).release();
        }

        if (evt.animationName === 'rotate-end-p2') {
          _this2._deleteElement();
        }
      }));
    }
    /**
     * Delete component from the DOM.
     */

  }, {
    key: "_deleteElement",
    value: function _deleteElement() {
      var parentNode = this.element.parentNode;
      parentNode.removeChild(this.element);

      if (parentNode.classList.contains(this.options.selectorLoadingOverlay)) {
        parentNode.remove();
      }
    }
    /**
     * The map associating DOM element and spinner instance.
     * @member Loading.components
     * @type {WeakMap}
     */

  }], [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode Loading.create .create()}, or {@linkcode Loading.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode Loading.init .init()} works.
     * @member Loading.options
     * @type {object}
     * @property {string} selectorInit The CSS selector to find spinners.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-loading]',
        selectorLoadingOverlay: ".".concat(prefix, "--loading-overlay"),
        classLoadingOverlay: "".concat(prefix, "--loading-overlay"),
        classLoadingStop: "".concat(prefix, "--loading--stop"),
        classLoadingOverlayStop: "".concat(prefix, "--loading-overlay--stop"),
        active: true
      };
    }
  }]);

  Loading.components = new WeakMap();
  return Loading;
}(mixin(createComponent, initComponentBySearch, handles));

export default Loading;