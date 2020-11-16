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


import mixin from '../../globals/js/misc/mixin';
import createComponent from '../../globals/js/mixins/create-component';
import initComponentByLauncher from '../../globals/js/mixins/init-component-by-launcher';
import eventedShowHideState from '../../globals/js/mixins/evented-show-hide-state';
import handles from '../../globals/js/mixins/handles';
import eventedState from '../../globals/js/mixins/evented-state';
import toggleAttribute from '../../globals/js/misc/toggle-attribute';
import settings from '../../globals/js/settings';

var NavigationMenuPanel = /*#__PURE__*/function (_mixin) {
  _inherits(NavigationMenuPanel, _mixin);

  var _super = _createSuper(NavigationMenuPanel);

  function NavigationMenuPanel() {
    var _this;

    _classCallCheck(this, NavigationMenuPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this.createdByLauncher = function (event) {
      var isExpanded = !_this.element.hasAttribute('hidden');
      var newState = isExpanded ? 'collapsed' : 'expanded';
      _this.triggerButton = event.delegateTarget;

      _this.changeState(newState);
    };

    _this.shouldStateBeChanged = function (state) {
      return state === 'expanded' === _this.element.hasAttribute('hidden');
    };

    _this._changeState = function (state, callback) {
      toggleAttribute(_this.element, 'hidden', state !== 'expanded');

      if (_this.triggerButton) {
        if (state === 'expanded') {
          var focusableMenuItems = _this.element.querySelector(_this.options.selectorFocusableMenuItem);

          if (focusableMenuItems) {
            focusableMenuItems.focus();
          }
        }

        var label = state === 'expanded' ? _this.triggerButton.getAttribute(_this.options.attribLabelCollapse) : _this.triggerButton.getAttribute(_this.options.attribLabelExpand);

        _this.triggerButton.classList.toggle(_this.options.classNavigationMenuPanelHeaderActionActive, state === 'expanded');

        _this.triggerButton.setAttribute('aria-label', label);

        _this.triggerButton.setAttribute('title', label);
      }

      callback();
    };

    return _this;
  }

  _createClass(NavigationMenuPanel, null, [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode NavigationMenuPanel.create .create()}, or
     * {@linkcode NavigationMenuPanel.init .init()},
     * properties in this object are overriden for the instance being create and
     * how {@linkcode NavigationMenuPanel.init .init()} works.
     * @member NavigationMenuPanel.options
     * @type {object}
     * @property {string} selectorInit The CSS class to find popup navs.
     * @property {string} attribInitTarget The attribute name in the launcher buttons to find target popup nav.
     * @property {string[]} initEventNames The events that the component will handles
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        initEventNames: ['click'],
        eventBeforeExpanded: 'navigation-menu-being-expanded',
        eventAfterExpanded: 'navigation-menu-expanded',
        eventBeforeCollapsed: 'navigation-menu-being-collapsed',
        eventAfterCollapsed: 'navigation-menu-collapsed',
        selectorFocusableMenuItem: ".".concat(prefix, "--navigation__category-toggle, .").concat(prefix, "--navigation-link"),
        classNavigationMenuPanelHeaderActionActive: "".concat(prefix, "--header__action--active"),
        attribLabelExpand: 'data-navigation-menu-panel-label-expand',
        attribLabelCollapse: 'data-navigation-menu-panel-label-collapse'
      };
    }
  }]);

  NavigationMenuPanel.components = new WeakMap();
  return NavigationMenuPanel;
}(mixin(createComponent, initComponentByLauncher, eventedShowHideState, handles, eventedState));

export { NavigationMenuPanel as default };