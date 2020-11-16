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
import eventedState from '../../globals/js/mixins/evented-state';
import handles from '../../globals/js/mixins/handles';
import eventMatches from '../../globals/js/misc/event-matches';
import on from '../../globals/js/misc/on';

var toArray = function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var ContentSwitcher = /*#__PURE__*/function (_mixin) {
  _inherits(ContentSwitcher, _mixin);

  var _super = _createSuper(ContentSwitcher);
  /**
   * Set of content switcher buttons.
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends EventedState
   * @extends Handles
   * @param {HTMLElement} element The element working as a set of content switcher buttons.
   * @param {object} [options] The component options.
   * @param {string} [options.selectorButton] The CSS selector to find switcher buttons.
   * @param {string} [options.selectorButtonSelected] The CSS selector to find the selected switcher button.
   * @param {string} [options.classActive] The CSS class for switcher button's selected state.
   * @param {string} [options.eventBeforeSelected]
   *   The name of the custom event fired before a switcher button is selected.
   *   Cancellation of this event stops selection of content switcher button.
   * @param {string} [options.eventAfterSelected] The name of the custom event fired after a switcher button is selected.
   */


  function ContentSwitcher(element, options) {
    var _this;

    _classCallCheck(this, ContentSwitcher);

    _this = _super.call(this, element, options);

    _this.manage(on(_this.element, 'click', function (event) {
      _this._handleClick(event);
    }));

    return _this;
  }
  /**
   * Handles click on content switcher button set.
   * If the click is on a content switcher button, activates it.
   * @param {Event} event The event triggering this method.
   */


  _createClass(ContentSwitcher, [{
    key: "_handleClick",
    value: function _handleClick(event) {
      var button = eventMatches(event, this.options.selectorButton);

      if (button) {
        this.changeState({
          group: 'selected',
          item: button,
          launchingEvent: event
        });
      }
    }
    /**
     * Internal method of {@linkcode ContentSwitcher#setActive .setActive()}, to select a content switcher button.
     * @private
     * @param {object} detail The detail of the event trigging this action.
     * @param {HTMLElement} detail.item The button to be selected.
     * @param {Function} callback Callback called when change in state completes.
     */

  }, {
    key: "_changeState",
    value: function _changeState(_ref, callback) {
      var _this2 = this;

      var item = _ref.item; // `options.selectorLink` is not defined in this class itself, code here primary is for inherited classes

      var itemLink = item.querySelector(this.options.selectorLink);

      if (itemLink) {
        toArray(this.element.querySelectorAll(this.options.selectorLink)).forEach(function (link) {
          if (link !== itemLink) {
            link.setAttribute('aria-selected', 'false');
          }
        });
        itemLink.setAttribute('aria-selected', 'true');
      }

      var selectorButtons = toArray(this.element.querySelectorAll(this.options.selectorButton));
      selectorButtons.forEach(function (button) {
        if (button !== item) {
          button.setAttribute('aria-selected', false);
          button.classList.toggle(_this2.options.classActive, false);
          toArray(button.ownerDocument.querySelectorAll(button.dataset.target)).forEach(function (element) {
            element.setAttribute('hidden', '');
            element.setAttribute('aria-hidden', 'true');
          });
        }
      });
      item.classList.toggle(this.options.classActive, true);
      item.setAttribute('aria-selected', true);
      toArray(item.ownerDocument.querySelectorAll(item.dataset.target)).forEach(function (element) {
        element.removeAttribute('hidden');
        element.setAttribute('aria-hidden', 'false');
      });

      if (callback) {
        callback();
      }
    }
    /**
     * Selects a content switcher button.
     * If the selected button has `data-target` attribute, DOM elements it points to as a CSS selector will be shown.
     * DOM elements associated with unselected buttons in the same way will be hidden.
     * @param {HTMLElement} item The button to be selected.
     * @param {ChangeState~callback} callback The callback is called once selection is finished
     * or is canceled. Will only invoke callback if it's passed in.
     */

  }, {
    key: "setActive",
    value: function setActive(item, callback) {
      this.changeState({
        group: 'selected',
        item: item
      }, function (error) {
        if (error) {
          if (callback) {
            callback(Object.assign(error, {
              item: item
            }));
          }
        } else if (callback) {
          callback(null, item);
        }
      });
    }
    /**
     * The map associating DOM element and content switcher set instance.
     * @member ContentSwitcher.components
     * @type {WeakMap}
     */

  }], [{
    key: "options",

    /**
     * The component options.
     * If `options` is specified in the constructor,
     * {@linkcode ContentSwitcher.create .create()}, or {@linkcode ContentSwitcher.init .init()},
     * properties in this object are overriden for the instance being create and how {@linkcode ContentSwitcher.init .init()} works.
     * @member ContentSwitcher.options
     * @type {object}
     * @property {string} selectorInit The CSS selector to find content switcher button set.
     * @property {string} [selectorButton] The CSS selector to find switcher buttons.
     * @property {string} [selectorButtonSelected] The CSS selector to find the selected switcher button.
     * @property {string} [classActive] The CSS class for switcher button's selected state.
     * @property {string} [eventBeforeSelected]
     *   The name of the custom event fired before a switcher button is selected.
     *   Cancellation of this event stops selection of content switcher button.
     * @property {string} [eventAfterSelected] The name of the custom event fired after a switcher button is selected.
     */
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-content-switcher]',
        selectorButton: "input[type=\"radio\"], .".concat(prefix, "--content-switcher-btn"),
        classActive: "".concat(prefix, "--content-switcher--selected"),
        eventBeforeSelected: 'content-switcher-beingselected',
        eventAfterSelected: 'content-switcher-selected'
      };
    }
  }]);

  ContentSwitcher.components = new WeakMap();
  return ContentSwitcher;
}(mixin(createComponent, initComponentBySearch, eventedState, handles));

export default ContentSwitcher;