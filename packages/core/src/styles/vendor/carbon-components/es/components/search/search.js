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
import svgToggleClass from '../../globals/js/misc/svg-toggle-class';

var toArray = function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var Search = /*#__PURE__*/function (_mixin) {
  _inherits(Search, _mixin);

  var _super = _createSuper(Search);
  /**
   * Search with Options.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as the search component.
   * @param {object} [options] The component options
   * @property {string} [options.selectorInit]
   *   The selector to find search UIs with options.
   * @property {string} [options.selectorSearchView]
   *   The selector to find the search view icon containers.
   * @property {string} [options.selectorSearchInput]
   *   The selector to find the search input.
   * @property {string} [options.selectorClearIcon]
   *   The selector for the clear icon that clears the search box.
   * @property {string} [options.selectorIconContainer] The data attribute selector for the icon layout container.
   * @property {string} [options.classClearHidden] The class used to hide the clear icon.
   * @property {string} [options.classLayoutHidden] The class used to hide nonselected layout view.
   */


  function Search(element, options) {
    var _this;

    _classCallCheck(this, Search);

    _this = _super.call(this, element, options);

    var closeIcon = _this.element.querySelector(_this.options.selectorClearIcon);

    var input = _this.element.querySelector(_this.options.selectorSearchInput);

    if (!input) {
      throw new Error('Cannot find the search input.');
    }

    if (closeIcon) {
      _this.manage(on(closeIcon, 'click', function () {
        svgToggleClass(closeIcon, _this.options.classClearHidden, true);
        input.value = '';
        input.focus();
      }));
    }

    _this.manage(on(_this.element, 'click', function (evt) {
      var toggleItem = eventMatches(evt, _this.options.selectorIconContainer);
      if (toggleItem) _this.toggleLayout(toggleItem);
    }));

    _this.manage(on(input, 'input', function (evt) {
      if (closeIcon) _this.showClear(evt.target.value, closeIcon);
    }));

    return _this;
  }
  /**
   * Toggles between the grid and list layout.
   * @param {HTMLElement} element The element contining the layout toggle.
   */


  _createClass(Search, [{
    key: "toggleLayout",
    value: function toggleLayout(element) {
      var _this2 = this;

      toArray(element.querySelectorAll(this.options.selectorSearchView)).forEach(function (item) {
        item.classList.toggle(_this2.options.classLayoutHidden);
      });
    }
    /**
     * Toggles the clear icon visibility
     * @param {HTMLElement} value The element serving as the search input.
     * @param {HTMLElement} icon The element serving as close icon.
     */

  }, {
    key: "showClear",
    value: function showClear(value, icon) {
      svgToggleClass(icon, this.options.classClearHidden, value.length === 0);
    }
    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode Search.create .create()}, or {@linkcode Search.init .init()},
     * properties in this object are overriden for the instance being created
     * and how {@linkcode Search.init .init()} works.
     * @member Search.options
     * @type {object}
     * @property {string} [options.selectorInit]
     *   The selector to find search UIs with options.
     * @property {string} [options.selectorSearchView]
     *   The selector to find the search view icon containers.
     * @property {string} [options.selectorSearchInput]
     *   The selector to find the search input.
     * @property {string} [options.selectorClearIcon]
     *   The selector for the clear icon that clears the search box.
     * @property {string} [options.selectorIconContainer] The data attribute selector for the icon layout container.
     * @property {string} [options.classClearHidden] The class used to hide the clear icon.
     * @property {string} [options.classLayoutHidden] The class used to hide nonselected layout view.
     */

  }], [{
    key: "options",
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-search]',
        selectorSearchView: '[data-search-view]',
        selectorSearchInput: ".".concat(prefix, "--search-input"),
        selectorClearIcon: ".".concat(prefix, "--search-close"),
        selectorIconContainer: ".".concat(prefix, "--search-button[data-search-toggle]"),
        classClearHidden: "".concat(prefix, "--search-close--hidden"),
        classLayoutHidden: "".concat(prefix, "--search-view--hidden")
      };
    }
    /**
     * The map associating DOM element and search instance.
     * @member Search.components
     * @type {WeakMap}
     */

  }]);

  Search.components = new WeakMap();
  return Search;
}(mixin(createComponent, initComponentBySearch, handles));

export default Search;