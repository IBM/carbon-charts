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


import eventMatches from '../misc/event-matches';
import on from '../misc/on';
export default function (ToMix) {
  /**
   * Mix-in class to instantiate components events on launcher button.
   * @class InitComponentByLauncher
   */
  var InitComponentByLauncher = /*#__PURE__*/function (_ToMix) {
    _inherits(InitComponentByLauncher, _ToMix);

    var _super = _createSuper(InitComponentByLauncher);

    function InitComponentByLauncher() {
      _classCallCheck(this, InitComponentByLauncher);

      return _super.apply(this, arguments);
    }

    _createClass(InitComponentByLauncher, null, [{
      key: "init",

      /**
       * `true` suggests that this component is lazily initialized upon an action/event, etc.
       * @type {boolean}
       */

      /**
       * Instantiates this component in the given element.
       * If the given element indicates that it's an component of this class, instantiates it.
       * Otherwise, instantiates this component by clicking on launcher buttons
       * (buttons with attribute that `options.attribInitTarget` points to) of this component in the given node.
       * @param {Node} target The DOM node to instantiate this component in. Should be a document or an element.
       * @param {object} [options] The component options.
       * @param {string} [options.selectorInit] The CSS selector to find this component.
       * @param {string} [options.attribInitTarget] The attribute name in the launcher buttons to find target component.
       * @returns {Handle} The handle to remove the event listener to handle clicking.
       */
      value: function init() {
        var _this = this;

        var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var effectiveOptions = Object.assign(Object.create(this.options), options);

        if (!target || target.nodeType !== Node.ELEMENT_NODE && target.nodeType !== Node.DOCUMENT_NODE) {
          throw new TypeError('DOM document or DOM element should be given to search for and initialize this widget.');
        }

        if (target.nodeType === Node.ELEMENT_NODE && target.matches(effectiveOptions.selectorInit)) {
          this.create(target, options);
        } else {
          var handles = effectiveOptions.initEventNames.map(function (name) {
            return on(target, name, function (event) {
              var launcher = eventMatches(event, "[".concat(effectiveOptions.attribInitTarget, "]"));

              if (launcher) {
                event.delegateTarget = launcher; // eslint-disable-line no-param-reassign

                var elements = launcher.ownerDocument.querySelectorAll(launcher.getAttribute(effectiveOptions.attribInitTarget));

                if (elements.length > 1) {
                  throw new Error('Target widget must be unique.');
                }

                if (elements.length === 1) {
                  if (launcher.tagName === 'A') {
                    event.preventDefault();
                  }

                  var component = _this.create(elements[0], options);

                  if (typeof component.createdByLauncher === 'function') {
                    component.createdByLauncher(event);
                  }
                }
              }
            });
          });
          return {
            release: function release() {
              for (var handle = handles.pop(); handle; handle = handles.pop()) {
                handle.release();
              }
            }
          };
        }

        return '';
      }
    }]);

    InitComponentByLauncher.forLazyInit = true;
    return InitComponentByLauncher;
  }(ToMix);

  return InitComponentByLauncher;
}