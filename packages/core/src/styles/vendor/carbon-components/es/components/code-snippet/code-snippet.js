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

var CodeSnippet = /*#__PURE__*/function (_mixin) {
  _inherits(CodeSnippet, _mixin);

  var _super = _createSuper(CodeSnippet);
  /**
   * CodeSnippet UI.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The element working as a CodeSnippet UI.
   */


  function CodeSnippet(element, options) {
    var _this;

    _classCallCheck(this, CodeSnippet);

    _this = _super.call(this, element, options);

    _this._initCodeSnippet();

    _this.element.querySelector(_this.options.classExpandBtn).addEventListener('click', function (evt) {
      return _this._handleClick(evt);
    });

    return _this;
  }

  _createClass(CodeSnippet, [{
    key: "_handleClick",
    value: function _handleClick() {
      var expandBtn = this.element.querySelector(this.options.classExpandText);
      this.element.classList.toggle(this.options.classExpanded);

      if (this.element.classList.contains(this.options.classExpanded)) {
        expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowLessText);
      } else {
        expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowMoreText);
      }
    }
  }, {
    key: "_initCodeSnippet",
    value: function _initCodeSnippet() {
      var expandBtn = this.element.querySelector(this.options.classExpandText);

      if (!expandBtn) {
        throw new TypeError('Cannot find the expand button.');
      }

      expandBtn.textContent = expandBtn.getAttribute(this.options.attribShowMoreText);

      if (this.element.offsetHeight < this.options.minHeight) {
        this.element.classList.add(this.options.classHideExpand);
      }
    }
    /**
     * The map associating DOM element and code snippet UI instance.
     * @member CodeSnippet.components
     * @type {WeakMap}
     */

  }], [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor, {@linkcode CodeSnippet.create .create()},
     * or {@linkcode CodeSnippet.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode CodeSnippet.init .init()} works.
     * @member CodeSnippet.options
     * @type {object}
     * @property {string} selectorInit The data attribute to find code snippet UIs.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-code-snippet]',
        attribShowMoreText: 'data-show-more-text',
        attribShowLessText: 'data-show-less-text',
        minHeight: 288,
        classExpanded: "".concat(prefix, "--snippet--expand"),
        classExpandBtn: ".".concat(prefix, "--snippet-btn--expand"),
        classExpandText: ".".concat(prefix, "--snippet-btn--text"),
        classHideExpand: "".concat(prefix, "--snippet-btn--expand--hide")
      };
    }
  }]);

  CodeSnippet.components = new WeakMap();
  return CodeSnippet;
}(mixin(createComponent, initComponentBySearch, handles));

export default CodeSnippet;