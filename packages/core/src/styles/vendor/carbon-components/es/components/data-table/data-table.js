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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
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

var DataTable = /*#__PURE__*/function (_mixin) {
  _inherits(DataTable, _mixin);

  var _super = _createSuper(DataTable);
  /**
   * Data Table
   * @extends CreateComponent
   * @extends InitComponentBySearch
   * @extends   EventedState
   * @param {HTMLElement} element The root element of tables
   * @param {object} [options] the... options
   * @param {string} [options.selectorInit] selector initialization
   * @param {string} [options.selectorExpandCells] css selector for expand
   * @param {string} [options.expandableRow] css selector for expand
   * @param {string} [options.selectorParentRows] css selector for rows housing expansion
   * @param {string} [options.selectorTableBody] root css for table body
   * @param {string} [options.eventTrigger] selector for event bubble capture points
   * @param {string} [options.eventParentContainer] used find the bubble container
   */


  function DataTable(_element, options) {
    var _this;

    _classCallCheck(this, DataTable);

    _this = _super.call(this, _element, options);

    _this._sortToggle = function (detail) {
      var element = detail.element,
          previousValue = detail.previousValue;
      toArray(_this.tableHeaders).forEach(function (header) {
        var sortEl = header.querySelector(_this.options.selectorTableSort);

        if (sortEl !== null && sortEl !== element) {
          sortEl.classList.remove(_this.options.classTableSortActive);
          sortEl.classList.remove(_this.options.classTableSortAscending);
        }
      });

      if (!previousValue) {
        element.dataset.previousValue = 'ascending';
        element.classList.add(_this.options.classTableSortActive);
        element.classList.add(_this.options.classTableSortAscending);
      } else if (previousValue === 'ascending') {
        element.dataset.previousValue = 'descending';
        element.classList.add(_this.options.classTableSortActive);
        element.classList.remove(_this.options.classTableSortAscending);
      } else if (previousValue === 'descending') {
        element.removeAttribute('data-previous-value');
        element.classList.remove(_this.options.classTableSortActive);
        element.classList.remove(_this.options.classTableSortAscending);
      }
    };

    _this._selectToggle = function (detail) {
      var element = detail.element;
      var checked = element.checked; // increment the  count

      _this.state.checkboxCount += checked ? 1 : -1;
      _this.countEl.textContent = _this.state.checkboxCount;
      var row = element.parentNode.parentNode;
      row.classList.toggle(_this.options.classTableSelected); // toggle on/off batch action bar

      _this._actionBarToggle(_this.state.checkboxCount > 0);
    };

    _this._selectAllToggle = function (_ref) {
      var element = _ref.element;
      var checked = element.checked;
      var inputs = toArray(_this.element.querySelectorAll(_this.options.selectorCheckbox));
      _this.state.checkboxCount = checked ? inputs.length - 1 : 0;
      inputs.forEach(function (item) {
        item.checked = checked;
        var row = item.parentNode.parentNode;

        if (checked && row) {
          row.classList.add(_this.options.classTableSelected);
        } else {
          row.classList.remove(_this.options.classTableSelected);
        }
      });

      _this._actionBarToggle(_this.state.checkboxCount > 0);

      if (_this.batchActionEl) {
        _this.countEl.textContent = _this.state.checkboxCount;
      }
    };

    _this._actionBarCancel = function () {
      var inputs = toArray(_this.element.querySelectorAll(_this.options.selectorCheckbox));
      var row = toArray(_this.element.querySelectorAll(_this.options.selectorTableSelected));
      row.forEach(function (item) {
        item.classList.remove(_this.options.classTableSelected);
      });
      inputs.forEach(function (item) {
        item.checked = false;
      });
      _this.state.checkboxCount = 0;

      _this._actionBarToggle(false);

      if (_this.batchActionEl) {
        _this.countEl.textContent = _this.state.checkboxCount;
      }
    };

    _this._actionBarToggle = function (toggleOn) {
      var handleTransitionEnd;

      var transition = function transition(evt) {
        if (handleTransitionEnd) {
          handleTransitionEnd = _this.unmanage(handleTransitionEnd).release();
        }

        if (evt.target.matches(_this.options.selectorActions)) {
          if (_this.batchActionEl.dataset.active === 'false') {
            _this.batchActionEl.setAttribute('tabIndex', -1);
          } else {
            _this.batchActionEl.setAttribute('tabIndex', 0);
          }
        }
      };

      if (toggleOn) {
        _this.batchActionEl.dataset.active = true;

        _this.batchActionEl.classList.add(_this.options.classActionBarActive);
      } else if (_this.batchActionEl) {
        _this.batchActionEl.dataset.active = false;

        _this.batchActionEl.classList.remove(_this.options.classActionBarActive);
      }

      if (_this.batchActionEl) {
        handleTransitionEnd = _this.manage(on(_this.batchActionEl, 'transitionend', transition));
      }
    };

    _this._rowExpandToggle = function (_ref2) {
      var element = _ref2.element,
          forceExpand = _ref2.forceExpand;
      var parent = element.closest(_this.options.eventParentContainer); // NOTE: `data-previous-value` keeps UI state before this method makes change in style
      // eslint-disable-next-line eqeqeq

      var shouldExpand = forceExpand != null ? forceExpand : element.dataset.previousValue === undefined || element.dataset.previousValue === 'expanded';

      if (shouldExpand) {
        element.dataset.previousValue = 'collapsed';
        parent.classList.add(_this.options.classExpandableRow);
      } else {
        parent.classList.remove(_this.options.classExpandableRow);
        element.dataset.previousValue = 'expanded';

        var expandHeader = _this.element.querySelector(_this.options.selectorExpandHeader);

        if (expandHeader) {
          expandHeader.dataset.previousValue = 'expanded';
        }
      }
    };

    _this._rowExpandToggleAll = function (_ref3) {
      var element = _ref3.element; // NOTE: `data-previous-value` keeps UI state before this method makes change in style

      var shouldExpand = element.dataset.previousValue === undefined || element.dataset.previousValue === 'expanded';
      element.dataset.previousValue = shouldExpand ? 'collapsed' : 'expanded';

      var expandCells = _this.element.querySelectorAll(_this.options.selectorExpandCells);

      Array.prototype.forEach.call(expandCells, function (cell) {
        _this._rowExpandToggle({
          element: cell,
          forceExpand: shouldExpand
        });
      });
    };

    _this._expandableHoverToggle = function (evt) {
      var element = eventMatches(evt, _this.options.selectorChildRow);

      if (element) {
        element.previousElementSibling.classList.toggle(_this.options.classExpandableRowHover, evt.type === 'mouseover');
      }
    };

    _this._toggleState = function (element, evt) {
      var data = element.dataset;
      var label = data.label ? data.label : '';
      var previousValue = data.previousValue ? data.previousValue : '';
      var initialEvt = evt;

      _this.changeState({
        group: data.event,
        element: element,
        label: label,
        previousValue: previousValue,
        initialEvt: initialEvt
      });
    };

    _this._keydownHandler = function (evt) {
      var searchContainer = _this.element.querySelector(_this.options.selectorToolbarSearchContainer);

      var searchEvent = eventMatches(evt, _this.options.selectorSearchMagnifier);
      var activeSearch = searchContainer.classList.contains(_this.options.classToolbarSearchActive);

      if (evt.which === 27) {
        _this._actionBarCancel();
      }

      if (searchContainer && searchEvent && evt.which === 13) {
        _this.activateSearch(searchContainer);
      }

      if (activeSearch && evt.which === 27) {
        _this.deactivateSearch(searchContainer, evt);
      }
    };

    _this.refreshRows = function () {
      var newExpandCells = toArray(_this.element.querySelectorAll(_this.options.selectorExpandCells));
      var newExpandableRows = toArray(_this.element.querySelectorAll(_this.options.selectorExpandableRows));
      var newParentRows = toArray(_this.element.querySelectorAll(_this.options.selectorParentRows)); // check if this is a refresh or the first time

      if (_this.parentRows.length > 0) {
        var diffParentRows = newParentRows.filter(function (newRow) {
          return !_this.parentRows.some(function (oldRow) {
            return oldRow === newRow;
          });
        }); // check if there are expandable rows

        if (newExpandableRows.length > 0) {
          var diffExpandableRows = diffParentRows.map(function (newRow) {
            return newRow.nextElementSibling;
          });
          var mergedExpandableRows = [].concat(_toConsumableArray(toArray(_this.expandableRows)), _toConsumableArray(toArray(diffExpandableRows)));
          _this.expandableRows = mergedExpandableRows;
        }
      } else if (newExpandableRows.length > 0) {
        _this.expandableRows = newExpandableRows;
      }

      _this.expandCells = newExpandCells;
      _this.parentRows = newParentRows;
    };

    _this.container = _element.parentNode;
    _this.toolbarEl = _this.element.querySelector(_this.options.selectorToolbar);
    _this.batchActionEl = _this.element.querySelector(_this.options.selectorActions);
    _this.countEl = _this.element.querySelector(_this.options.selectorCount);
    _this.cancelEl = _this.element.querySelector(_this.options.selectorActionCancel);
    _this.tableHeaders = _this.element.querySelectorAll('th');
    _this.tableBody = _this.element.querySelector(_this.options.selectorTableBody);
    _this.expandCells = [];
    _this.expandableRows = [];
    _this.parentRows = [];

    _this.refreshRows();

    _this.manage(on(_this.element, 'mouseover', _this._expandableHoverToggle));

    _this.manage(on(_this.element, 'mouseout', _this._expandableHoverToggle));

    _this.manage(on(_this.element, 'click', function (evt) {
      var eventElement = eventMatches(evt, _this.options.eventTrigger);

      var searchContainer = _this.element.querySelector(_this.options.selectorToolbarSearchContainer);

      if (eventElement) {
        _this._toggleState(eventElement, evt);
      }

      if (searchContainer) {
        _this._handleDocumentClick(evt);
      }
    }));

    _this.manage(on(_this.element, 'keydown', _this._keydownHandler));

    _this.state = {
      checkboxCount: 0
    };
    return _this;
  }

  _createClass(DataTable, [{
    key: "_handleDocumentClick",
    value: function _handleDocumentClick(evt) {
      var searchContainer = this.element.querySelector(this.options.selectorToolbarSearchContainer);
      var searchEvent = eventMatches(evt, this.options.selectorSearchMagnifier);
      var activeSearch = searchContainer.classList.contains(this.options.classToolbarSearchActive);

      if (searchContainer && searchEvent) {
        this.activateSearch(searchContainer);
      }

      if (activeSearch) {
        this.deactivateSearch(searchContainer, evt);
      }
    }
  }, {
    key: "activateSearch",
    value: function activateSearch(container) {
      var input = container.querySelector(this.options.selectorSearchInput);
      container.classList.add(this.options.classToolbarSearchActive);
      input.focus();
    }
  }, {
    key: "deactivateSearch",
    value: function deactivateSearch(container, evt) {
      var trigger = container.querySelector(this.options.selectorSearchMagnifier);
      var input = container.querySelector(this.options.selectorSearchInput);
      var svg = trigger.querySelector('svg');

      if (input.value.length === 0 && evt.target !== input && evt.target !== trigger && evt.target !== svg) {
        container.classList.remove(this.options.classToolbarSearchActive);
        trigger.focus();
      }

      if (evt.which === 27 && evt.target === input) {
        container.classList.remove(this.options.classToolbarSearchActive);
        trigger.focus();
      }
    }
  }, {
    key: "_changeState",
    value: function _changeState(detail, callback) {
      this[this.constructor.eventHandlers[detail.group]](detail);
      callback();
    }
  }], [{
    key: "options",
    get: function get() {
      var prefix = settings.prefix;
      return {
        selectorInit: "[data-table]",
        selectorToolbar: ".".concat(prefix, "--table--toolbar"),
        selectorActions: ".".concat(prefix, "--batch-actions"),
        selectorCount: '[data-items-selected]',
        selectorActionCancel: ".".concat(prefix, "--batch-summary__cancel"),
        selectorCheckbox: ".".concat(prefix, "--checkbox"),
        selectorExpandHeader: "th.".concat(prefix, "--table-expand"),
        selectorExpandCells: "td.".concat(prefix, "--table-expand"),
        selectorExpandableRows: ".".concat(prefix, "--expandable-row"),
        selectorParentRows: ".".concat(prefix, "--parent-row"),
        selectorChildRow: '[data-child-row]',
        selectorTableBody: 'tbody',
        selectorTableSort: ".".concat(prefix, "--table-sort"),
        selectorTableSelected: ".".concat(prefix, "--data-table--selected"),
        selectorToolbarSearchContainer: ".".concat(prefix, "--toolbar-search-container-expandable"),
        selectorSearchMagnifier: ".".concat(prefix, "--search-magnifier"),
        selectorSearchInput: ".".concat(prefix, "--search-input"),
        classExpandableRow: "".concat(prefix, "--expandable-row"),
        classExpandableRowHidden: "".concat(prefix, "--expandable-row--hidden"),
        classExpandableRowHover: "".concat(prefix, "--expandable-row--hover"),
        classTableSortAscending: "".concat(prefix, "--table-sort--ascending"),
        classTableSortActive: "".concat(prefix, "--table-sort--active"),
        classToolbarSearchActive: "".concat(prefix, "--toolbar-search-container-active"),
        classActionBarActive: "".concat(prefix, "--batch-actions--active"),
        classTableSelected: "".concat(prefix, "--data-table--selected"),
        eventBeforeExpand: "data-table-beforetoggleexpand",
        eventAfterExpand: "data-table-aftertoggleexpand",
        eventBeforeExpandAll: "data-table-beforetoggleexpandall",
        eventAfterExpandAll: "data-table-aftertoggleexpandall",
        eventBeforeSort: "data-table-beforetogglesort",
        eventAfterSort: "data-table-aftertogglesort",
        eventTrigger: '[data-event]',
        eventParentContainer: '[data-parent-row]'
      };
    }
  }]);

  DataTable.components = new WeakMap();
  DataTable.eventHandlers = {
    expand: '_rowExpandToggle',
    expandAll: '_rowExpandToggleAll',
    sort: '_sortToggle',
    select: '_selectToggle',
    'select-all': '_selectAllToggle',
    'action-bar-cancel': '_actionBarCancel'
  };
  return DataTable;
}(mixin(createComponent, initComponentBySearch, eventedState, handles));

export default DataTable;