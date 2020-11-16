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
/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */


import warning from 'warning';
/**
 * @param {string} name The component name.
 * @returns {Function} A stub of removed component.
 */

var removedComponent = function removedComponent(name) {
  var _class, _temp;

  var didWarnAboutRemoval = false;

  var warn = function warn() {
    if (process.env.NODE_ENV !== "production") {
      process.env.NODE_ENV !== "production" ? warning(didWarnAboutRemoval, "The `".concat(name, "` component has been removed.")) : void 0;
      didWarnAboutRemoval = true;
    }
  };

  return _temp = _class = /*#__PURE__*/function () {
    function _class() {
      _classCallCheck(this, _class);

      warn();
    }

    _createClass(_class, null, [{
      key: "create",
      value: function create() {
        warn();
      }
    }, {
      key: "init",
      value: function init() {
        warn();
      }
    }]);

    return _class;
  }(), _class.components
  /* #__PURE_CLASS_PROPERTY__ */
  = new WeakMap(), _class.options
  /* #__PURE_CLASS_PROPERTY__ */
  = {}, _temp;
};

export default removedComponent;