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

var toArray = function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};

var StructuredList = /*#__PURE__*/function (_mixin) {
  _inherits(StructuredList, _mixin);

  var _super = _createSuper(StructuredList);
  /**
   * StructuredList
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends Handles
   * @param {HTMLElement} element The root element of tables
   * @param {object} [options] the... options
   * @param {string} [options.selectorInit] selector initialization
   * @param {string} [options.selectorRow] css selector for selected row
   */


  function StructuredList(element, options) {
    var _this;

    _classCallCheck(this, StructuredList);

    _this = _super.call(this, element, options);

    _this.manage(on(_this.element, 'keydown', function (evt) {
      if (evt.which === 37 || evt.which === 38 || evt.which === 39 || evt.which === 40) {
        _this._handleKeydownArrow(evt);
      }

      if (evt.which === 13 || evt.which === 32) {
        _this._handleKeydownChecked(evt);
      }
    }));

    _this.manage(on(_this.element, 'click', function (evt) {
      _this._handleClick(evt);
    }));

    return _this;
  }

  _createClass(StructuredList, [{
    key: "_direction",
    value: function _direction(evt) {
      return {
        37: -1,
        // backward
        38: -1,
        // backward
        39: 1,
        // forward
        40: 1 // forward

      }[evt.which];
    }
  }, {
    key: "_nextIndex",
    value: function _nextIndex(array, arrayItem, direction) {
      return array.indexOf(arrayItem) + direction; // returns -1, 0, 1, 2, 3, 4...
    }
  }, {
    key: "_getInput",
    value: function _getInput(index) {
      var rows = toArray(this.element.querySelectorAll(this.options.selectorRow));
      return this.element.ownerDocument.querySelector(this.options.selectorListInput(rows[index].getAttribute('for')));
    }
  }, {
    key: "_handleInputChecked",
    value: function _handleInputChecked(index) {
      var rows = this.element.querySelectorAll(this.options.selectorRow);
      var input = this.getInput(index) || rows[index].querySelector('input');
      input.checked = true;
    }
  }, {
    key: "_handleClick",
    value: function _handleClick(evt) {
      var _this2 = this;

      var selectedRow = eventMatches(evt, this.options.selectorRow);
      toArray(this.element.querySelectorAll(this.options.selectorRow)).forEach(function (row) {
        return row.classList.remove(_this2.options.classActive);
      });

      if (selectedRow) {
        selectedRow.classList.add(this.options.classActive);
      }
    } // Handle Enter or Space keydown events for selecting <label> rows

  }, {
    key: "_handleKeydownChecked",
    value: function _handleKeydownChecked(evt) {
      var _this3 = this;

      evt.preventDefault(); // prevent spacebar from scrolling page

      var selectedRow = eventMatches(evt, this.options.selectorRow);
      toArray(this.element.querySelectorAll(this.options.selectorRow)).forEach(function (row) {
        return row.classList.remove(_this3.options.classActive);
      });

      if (selectedRow) {
        selectedRow.classList.add(this.options.classActive);
        var input = selectedRow.querySelector(this.options.selectorListInput(selectedRow.getAttribute('for'))) || selectedRow.querySelector('input');
        input.checked = true;
      }
    } // Handle up and down keydown events for selecting <label> rows

  }, {
    key: "_handleKeydownArrow",
    value: function _handleKeydownArrow(evt) {
      var _this4 = this;

      evt.preventDefault(); // prevent arrow keys from scrolling

      var selectedRow = eventMatches(evt, this.options.selectorRow);

      var direction = this._direction(evt);

      if (direction && selectedRow !== undefined) {
        var rows = toArray(this.element.querySelectorAll(this.options.selectorRow));
        rows.forEach(function (row) {
          return row.classList.remove(_this4.options.classActive);
        });
        var firstIndex = 0;

        var nextIndex = this._nextIndex(rows, selectedRow, direction);

        var lastIndex = rows.length - 1;

        var getSelectedIndex = function getSelectedIndex() {
          switch (nextIndex) {
            case -1:
              return lastIndex;

            case rows.length:
              return firstIndex;

            default:
              return nextIndex;
          }
        };

        var selectedIndex = getSelectedIndex();
        rows[selectedIndex].classList.add(this.options.classActive);
        rows[selectedIndex].focus();

        this._handleInputChecked(selectedIndex);
      }
    }
  }], [{
    key: "options",
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: '[data-structured-list]',
        selectorRow: "[data-structured-list] .".concat(prefix, "--structured-list-tbody > label.").concat(prefix, "--structured-list-row"),
        selectorListInput: function selectorListInput(id) {
          return "#".concat(id, ".").concat(prefix, "--structured-list-input");
        },
        classActive: "".concat(prefix, "--structured-list-row--selected")
      };
    }
  }]);

  StructuredList.components = new WeakMap();
  return StructuredList;
}(mixin(createComponent, initComponentBySearch, handles));

export default StructuredList;