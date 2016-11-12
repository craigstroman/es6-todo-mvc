(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _controller = require('./controller/controller');

var _controller2 = _interopRequireDefault(_controller);

var _helpers = require('./helpers/helpers');

var _template = require('./template/template');

var _template2 = _interopRequireDefault(_template);

var _store = require('./store/store');

var _store2 = _interopRequireDefault(_store);

var _view = require('./view/view');

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = new _store2.default('todos-vanilla-es6');

var template = new _template2.default();
var view = new _view2.default(template);

/**
 * @type {Controller}
 */
var controller = new _controller2.default(store, view);

var setView = function setView() {
  return controller.setView(document.location.hash);
};
(0, _helpers.$on)(window, 'load', setView);
(0, _helpers.$on)(window, 'hashchange', setView);

},{"./controller/controller":2,"./helpers/helpers":3,"./store/store":5,"./template/template":6,"./view/view":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line no-unused-vars


var _item = require('../item/item');

var _store = require('../store/store');

var _store2 = _interopRequireDefault(_store);

var _view = require('../view/view');

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-line no-unused-vars

var Controller = function () {
    /**
     * @param  {!Store} store A Store instance
     * @param  {!View} view A View instance
     */
    function Controller(store, view) {
        var _this = this;

        _classCallCheck(this, Controller);

        this.store = store;
        this.view = view;

        view.bindAddItem(this.addItem.bind(this));
        view.bindEditItemSave(this.editItemSave.bind(this));
        view.bindEditItemCancel(this.editItemCancel.bind(this));
        view.bindRemoveItem(this.removeItem.bind(this));
        view.bindToggleItem(function (id, completed) {
            _this.toggleCompleted(id, completed);
            _this._filter();
        });
        view.bindRemoveCompleted(this.removeCompletedItems.bind(this));
        view.bindToggleAll(this.toggleAll.bind(this));

        this._activeRoute = '';
        this._lastActiveRoute = null;
    }

    /**
     * Set and render the active route.
     *
     * @param {string} raw '' | '#/' | '#/active' | '#/completed'
     */


    _createClass(Controller, [{
        key: 'setView',
        value: function setView(raw) {
            var route = raw.replace(/^#\//, '');

            this._activeRoute = route;
            this._filter();
            this.view.updateFilterButtons(route);
        }

        /**
         * Add an Item to the Store and display it in the list.
         *
         * @param {!string} title Title of the new item
         */

    }, {
        key: 'addItem',
        value: function addItem(title) {
            var _this2 = this;

            this.store.insert({
                id: Date.now(),
                title: title,
                completed: false
            }, function () {
                _this2.view.clearNewTodo();
                _this2._filter(true);
            });
        }

        /**
         * Save an Item in edit.
         *
         * @param {number} id ID of the Item in edit
         * @param {!string} title New title for the Item in edit
         */

    }, {
        key: 'editItemSave',
        value: function editItemSave(id, title) {
            var _this3 = this;

            if (title.length) {
                this.store.update({ id: id, title: title }, function () {
                    _this3.view.editItemDone(id, title);
                });
            } else {
                this.removeItem(id);
            }
        }

        /**
         * Cancel the item editing mode.
         *
         * @param {!number} id ID of the Item in edit
         */

    }, {
        key: 'editItemCancel',
        value: function editItemCancel(id) {
            var _this4 = this;

            this.store.find({ id: id }, function (data) {
                var title = data[0].title;
                _this4.view.editItemDone(id, title);
            });
        }

        /**
         * Remove the data and elements related to an Item.
         *
         * @param {!number} id Item ID of item to remove
         */

    }, {
        key: 'removeItem',
        value: function removeItem(id) {
            var _this5 = this;

            this.store.remove({ id: id }, function () {
                _this5._filter();
                _this5.view.removeItem(id);
            });
        }

        /**
         * Remove all completed items.
         */

    }, {
        key: 'removeCompletedItems',
        value: function removeCompletedItems() {
            this.store.remove({ completed: true }, this._filter.bind(this));
        }

        /**
         * Update an Item in storage based on the state of completed.
         *
         * @param {!number} id ID of the target Item
         * @param {!boolean} completed Desired completed state
         */

    }, {
        key: 'toggleCompleted',
        value: function toggleCompleted(id, completed) {
            var _this6 = this;

            this.store.update({ id: id, completed: completed }, function () {
                _this6.view.setItemComplete(id, completed);
            });
        }

        /**
         * Set all items to complete or active.
         *
         * @param {boolean} completed Desired completed state
         */

    }, {
        key: 'toggleAll',
        value: function toggleAll(completed) {
            var _this7 = this;

            this.store.find({ completed: !completed }, function (data) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var id = _step.value.id;

                        _this7.toggleCompleted(id, completed);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            });

            this._filter();
        }

        /**
         * Refresh the list based on the current route.
         *
         * @param {boolean} [force] Force a re-paint of the list
         */

    }, {
        key: '_filter',
        value: function _filter(force) {
            var _this8 = this;

            var route = this._activeRoute;

            if (force || this._lastActiveRoute !== '' || this._lastActiveRoute !== route) {
                this.store.find({
                    '': _item.emptyItemQuery,
                    'active': { completed: false },
                    'completed': { completed: true }
                }[route], this.view.showItems.bind(this.view));
            }

            this.store.count(function (total, active, completed) {
                _this8.view.setItemsLeft(active);
                _this8.view.setClearCompletedButtonVisibility(completed);

                _this8.view.setCompleteAllCheckbox(completed === total);
                _this8.view.setMainVisibility(total);
            });

            this._lastActiveRoute = route;
        }
    }]);

    return Controller;
}();

exports.default = Controller;

},{"../item/item":4,"../store/store":5,"../view/view":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.qs = qs;
exports.$on = $on;
exports.$delegate = $delegate;
/**
 * querySelector wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
function qs(selector, scope) {
    // console.log('qs: ');
    // console.log('selector: ');
    // console.log(selector);
    return (scope || document).querySelector(selector);
}

/**
 * addEventListener wrapper
 *
 * @param {Element|Window} target Target Element
 * @param {string} type Event name to bind to
 * @param {Function} callback Event callback
 * @param {boolean} [capture] Capture the event
 */
function $on(target, type, callback, capture) {
    target.addEventListener(type, callback, !!capture);
}

/**
 * Attach a handler to an event for all elements matching a selector.
 *
 * @param {Element} target Element which the event must bubble to
 * @param {string} selector Selector to match
 * @param {string} type Event name
 * @param {Function} handler Function called when the event bubbles to target
 *                           from an element matching selector
 * @param {boolean} [capture] Capture the event
 */
function $delegate(target, selector, type, handler, capture) {
    var dispatchEvent = function dispatchEvent(event) {
        var targetElement = event.target;
        var potentialElements = target.querySelectorAll(selector);
        var i = potentialElements.length;

        while (i--) {
            if (potentialElements[i] === targetElement) {
                handler.call(targetElement, event);
                break;
            }
        }
    };

    $on(target, type, dispatchEvent, !!capture);
}

/**
 * Encode less-than and ampersand characters with entity codes to make user-
 * provided text safe to parse as HTML.
 *
 * @param {string} s String to escape
 *
 * @returns {string} String with unsafe characters escaped with entity codes
 */
var escapeForHTML = exports.escapeForHTML = function escapeForHTML(s) {
    return s.replace(/[&<]/g, function (c) {
        return c === '&' ? '&amp;' : '&lt;';
    });
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @typedef {!{id: number, completed: boolean, title: string}}
 */
var Item = exports.Item = undefined;

/**
 * @typedef {!Array<Item>}
 */
var ItemList = exports.ItemList = undefined;

/**
 * Enum containing a known-empty record type, matching only empty records unlike Object.
 *
 * @enum {Object}
 */
var Empty = {
  Record: {}
};

/**
 * Empty ItemQuery type, based on the Empty @enum.
 *
 * @typedef {Empty}
 */
var EmptyItemQuery = exports.EmptyItemQuery = undefined;

/**
 * Reference to the only EmptyItemQuery instance.
 *
 * @type {EmptyItemQuery}
 */
var emptyItemQuery = exports.emptyItemQuery = Empty.Record;

/**
 * @typedef {!({id: number}|{completed: boolean}|EmptyItemQuery)}
 */
var ItemQuery = exports.ItemQuery = undefined;

/**
 * @typedef {!({id: number, title: string}|{id: number, completed: boolean})}
 */
var ItemUpdate = exports.ItemUpdate = undefined;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _item = require('../item/item');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-line no-unused-vars

var Store = function () {
    /**
     * @param {!string} name Database name
     * @param {function()} [callback] Called when the Store is ready
     */
    function Store(name, callback) {
        _classCallCheck(this, Store);

        /**
         * @type {Storage}
         */
        var localStorage = window.localStorage;

        /**
         * @type {ItemList}
         */
        var liveTodos = void 0;

        /**
         * Read the local ItemList from localStorage.
         *
         * @returns {ItemList} Current array of todos
         */
        this.getLocalStorage = function () {
            return liveTodos || JSON.parse(localStorage.getItem(name) || '[]');
        };

        /**
         * Write the local ItemList to localStorage.
         *
         * @param {ItemList} todos Array of todos to write
         */
        this.setLocalStorage = function (todos) {
            localStorage.setItem(name, JSON.stringify(liveTodos = todos));
        };

        if (callback) {
            callback();
        }
    }

    /**
     * Find items with properties matching those on query.
     *
     * @param {ItemQuery} query Query to match
     * @param {function(ItemList)} callback Called when the query is done
     *
     * @example
     * db.find({completed: true}, data => {
     *   // data shall contain items whose completed properties are true
     * })
     */


    _createClass(Store, [{
        key: 'find',
        value: function find(query, callback) {
            var todos = this.getLocalStorage();
            var k = void 0;

            callback(todos.filter(function (todo) {
                for (k in query) {
                    if (query[k] !== todo[k]) {
                        return false;
                    }
                }
                return true;
            }));
        }

        /**
         * Update an item in the Store.
         *
         * @param {ItemUpdate} update Record with an id and a property to update
         * @param {function()} [callback] Called when partialRecord is applied
         */

    }, {
        key: 'update',
        value: function update(_update, callback) {
            var id = _update.id;
            var todos = this.getLocalStorage();
            var i = todos.length;
            var k = void 0;

            while (i--) {
                if (todos[i].id === id) {
                    for (k in _update) {
                        todos[i][k] = _update[k];
                    }
                    break;
                }
            }

            this.setLocalStorage(todos);

            if (callback) {
                callback();
            }
        }

        /**
         * Insert an item into the Store.
         *
         * @param {Item} item Item to insert
         * @param {function()} [callback] Called when item is inserted
         */

    }, {
        key: 'insert',
        value: function insert(item, callback) {
            var todos = this.getLocalStorage();
            todos.push(item);
            this.setLocalStorage(todos);

            if (callback) {
                callback();
            }
        }

        /**
         * Remove items from the Store based on a query.
         *
         * @param {ItemQuery} query Query matching the items to remove
         * @param {function(ItemList)|function()} [callback] Called when records matching query are removed
         */

    }, {
        key: 'remove',
        value: function remove(query, callback) {
            var k = void 0;

            var todos = this.getLocalStorage().filter(function (todo) {
                for (k in query) {
                    if (query[k] !== todo[k]) {
                        return true;
                    }
                }
                return false;
            });

            this.setLocalStorage(todos);

            if (callback) {
                callback(todos);
            }
        }

        /**
         * Count total, active, and completed todos.
         *
         * @param {function(number, number, number)} callback Called when the count is completed
         */

    }, {
        key: 'count',
        value: function count(callback) {
            this.find(_item.emptyItemQuery, function (data) {
                var total = data.length;

                var i = total;
                var completed = 0;

                while (i--) {
                    completed += data[i].completed;
                }
                callback(total, total - completed, completed);
            });
        }
    }]);

    return Store;
}();

exports.default = Store;

},{"../item/item":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line no-unused-vars

var _item = require('../item/item');

var _helpers = require('../helpers/helpers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Template = function () {
    function Template() {
        _classCallCheck(this, Template);
    }

    _createClass(Template, [{
        key: 'itemList',

        /**
         * Format the contents of a todo list.
         *
         * @param {ItemList} items Object containing keys you want to find in the template to replace.
         * @returns {!string} Contents for a todo list
         *
         * @example
         * view.show({
         *  id: 1,
         *  title: "Hello World",
         *  completed: false,
         * })
         */
        value: function itemList(items) {
            return items.reduce(function (a, item) {
                return a + ('\n<li data-id="' + item.id + '"' + (item.completed ? ' class="completed"' : '') + '>\n    <input class="toggle" type="checkbox" ' + (item.completed ? 'checked' : '') + '>\n    <label>' + (0, _helpers.escapeForHTML)(item.title) + '</label>\n    <button class="destroy"></button>\n</li>');
            }, '');
        }

        /**
         * Format the contents of an "items left" indicator.
         *
         * @param {number} activeTodos Number of active todos
         *
         * @returns {!string} Contents for an "items left" indicator
         */

    }, {
        key: 'itemCounter',
        value: function itemCounter(activeTodos) {
            return activeTodos + ' item' + (activeTodos !== 1 ? 's' : '') + ' left';
        }
    }]);

    return Template;
}();

exports.default = Template;

},{"../helpers/helpers":3,"../item/item":4}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line no-unused-vars


var _item = require('../item/item');

var _helpers = require('../helpers/helpers');

var _template = require('../template/template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-line no-unused-vars

var _itemId = function _itemId(element) {
    return parseInt(element.parentNode.dataset.id, 10);
};
var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

var View = function () {
    /**
     * @param {!Template} template A Template instance.
     */
    function View(template) {
        var _this = this;

        _classCallCheck(this, View);

        this.template = template;
        this.$todoList = (0, _helpers.qs)('.todo-list');
        this.$todoItemCounter = (0, _helpers.qs)('.todo-count');
        this.$clearCompleted = (0, _helpers.qs)('.clear-completed');
        this.$main = (0, _helpers.qs)('.main');
        this.$toggleAll = (0, _helpers.qs)('.toggle-all');
        this.$newTodo = (0, _helpers.qs)('.new-todo');
        (0, _helpers.$delegate)(this.$todoList, 'li label', 'dblclick', function (_ref) {
            var target = _ref.target;

            _this.editItem(target);
        });
    }

    /**
     * Put an item into edit mode.
     *
     * @param {!Element} target Target Item's label Element.
     */


    _createClass(View, [{
        key: 'editItem',
        value: function editItem(target) {
            var listItem = target.parentElement;

            listItem.classList.add('editing');

            var input = document.createElement('input');
            input.className = 'edit';

            input.value = target.innerText;
            listItem.appendChild(input);
            input.focus();
        }

        /**
         * Populate the todo list with a list of items.
         *
         * @param {ItemList} items Array of items to display.
         */

    }, {
        key: 'showItems',
        value: function showItems(items) {
            this.$todoList.innerHTML = this.template.itemList(items);
        }

        /**
         * Remove an item from the view.
         *
         * @param {number} id Item ID of the item to remove.
         */

    }, {
        key: 'removeItem',
        value: function removeItem(id) {
            var elem = (0, _helpers.qs)('[data-id="' + id + '"]');

            if (elem) {
                this.$todoList.removeChild(elem);
            }
        }

        /**
         * Set the number in the 'items left' display.
         *
         * @param {number} itemsLeft Number of items left.
         */

    }, {
        key: 'setItemsLeft',
        value: function setItemsLeft(itemsLeft) {
            this.$todoItemCounter.innerHTML = this.template.itemCounter(itemsLeft);
        }

        /**
         * Set the visibility of the "Clear completed" button.
         *
         * @param {boolean|number} visible Desired visibility of the button.
         */

    }, {
        key: 'setClearCompletedButtonVisibility',
        value: function setClearCompletedButtonVisibility(visible) {
            var display = !!visible;
            this.$clearCompleted.style.display = display ? 'block' : 'none';
        }

        /**
         * Set the visibility of the main content and footer.
         *
         * @param {boolean|number} visible Desired visibility.
         */

    }, {
        key: 'setMainVisibility',
        value: function setMainVisibility(visible) {
            var display = !!visible;
            this.$main.style.display = display ? 'block' : 'none';
        }

        /**
         * Set the checked state of the Complete All checkbox.
         *
         * @param {boolean|number} checked The desired checked state.
         */

    }, {
        key: 'setCompleteAllCheckbox',
        value: function setCompleteAllCheckbox(checked) {
            this.$toggleAll.checked = !!checked;
        }

        /**
         * Change the appearance of the filter buttons based on the route.
         *
         * @param {string} route The current route.
         */

    }, {
        key: 'updateFilterButtons',
        value: function updateFilterButtons(route) {
            (0, _helpers.qs)('.filters>.selected').className = ' ';
            (0, _helpers.qs)('.filters>[href="#/' + route + '"]').className = 'selected';
        }

        /**
         * Clear the new todo input
         */

    }, {
        key: 'clearNewTodo',
        value: function clearNewTodo() {
            this.$newTodo.value = '';
        }

        /**
         * Render an item as either completed or not.
         *
         * @param {!number} id Item ID.
         * @param {!boolean} completed True if the item is completed.
         */

    }, {
        key: 'setItemComplete',
        value: function setItemComplete(id, completed) {
            var listItem = (0, _helpers.qs)('[data-id="' + id + '"]');

            if (!listItem) {
                return;
            }

            listItem.className = completed ? 'completed' : '';

            // In case it was toggled from an event and not by clicking the checkbox.
            (0, _helpers.qs)('input', listItem).checked = completed;
        }

        /**
         * Bring an item out of edit mode.
         *
         * @param {!number} id Item ID of the item in edit.
         * @param {!string} title New title for the item in edit.
         */

    }, {
        key: 'editItemDone',
        value: function editItemDone(id, title) {
            var listItem = (0, _helpers.qs)('[data-id="' + id + '"]');

            var input = (0, _helpers.qs)('input.edit', listItem);
            listItem.removeChild(input);

            listItem.classList.remove('editing');

            (0, _helpers.qs)('label', listItem).textContent = title;
        }

        /**
         * @param {Function} handler Function called on synthetic event.
         */

    }, {
        key: 'bindAddItem',
        value: function bindAddItem(handler) {
            (0, _helpers.$on)(this.$newTodo, 'change', function (_ref2) {
                var target = _ref2.target;

                var title = target.value.trim();
                if (title) {
                    handler(title);
                }
            });
        }

        /**
         * @param {Function} handler Function called on synthetic event.
         */

    }, {
        key: 'bindRemoveCompleted',
        value: function bindRemoveCompleted(handler) {
            (0, _helpers.$on)(this.$clearCompleted, 'click', handler);
        }

        /**
         * @param {Function} handler Function called on synthetic event.
         */

    }, {
        key: 'bindToggleAll',
        value: function bindToggleAll(handler) {
            (0, _helpers.$on)(this.$toggleAll, 'click', function (_ref3) {
                var target = _ref3.target;

                handler(target.checked);
            });
        }

        /**
         * @param {Function} handler Function called on synthetic event.
         */

    }, {
        key: 'bindRemoveItem',
        value: function bindRemoveItem(handler) {
            (0, _helpers.$delegate)(this.$todoList, '.destroy', 'click', function (_ref4) {
                var target = _ref4.target;

                handler(_itemId(target));
            });
        }

        /**
         * @param {Function} handler Function called on synthetic event.
         */

    }, {
        key: 'bindToggleItem',
        value: function bindToggleItem(handler) {
            (0, _helpers.$delegate)(this.$todoList, '.toggle', 'click', function (_ref5) {
                var target = _ref5.target;

                handler(_itemId(target), target.checked);
            });
        }

        /**
         * @param {Function} handler Function called on synthetic event.
         */

    }, {
        key: 'bindEditItemSave',
        value: function bindEditItemSave(handler) {
            (0, _helpers.$delegate)(this.$todoList, 'li .edit', 'blur', function (_ref6) {
                var target = _ref6.target;

                if (!target.dataset.iscanceled) {
                    handler(_itemId(target), target.value.trim());
                }
            }, true);

            // Remove the cursor from the input when you hit enter just like if it were a real form.
            (0, _helpers.$delegate)(this.$todoList, 'li .edit', 'keypress', function (_ref7) {
                var target = _ref7.target,
                    keyCode = _ref7.keyCode;

                if (keyCode === ENTER_KEY) {
                    target.blur();
                }
            });
        }

        /**
         * @param {Function} handler Function called on synthetic event.
         */

    }, {
        key: 'bindEditItemCancel',
        value: function bindEditItemCancel(handler) {
            (0, _helpers.$delegate)(this.$todoList, 'li .edit', 'keyup', function (_ref8) {
                var target = _ref8.target,
                    keyCode = _ref8.keyCode;

                if (keyCode === ESCAPE_KEY) {
                    target.dataset.iscanceled = true;
                    target.blur();

                    handler(_itemId(target));
                }
            });
        }
    }]);

    return View;
}();

exports.default = View;

},{"../helpers/helpers":3,"../item/item":4,"../template/template":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbnRyb2xsZXIvY29udHJvbGxlci5qcyIsInNyYy9qcy9oZWxwZXJzL2hlbHBlcnMuanMiLCJzcmMvanMvaXRlbS9pdGVtLmpzIiwic3JjL2pzL3N0b3JlL3N0b3JlLmpzIiwic3JjL2pzL3RlbXBsYXRlL3RlbXBsYXRlLmpzIiwic3JjL2pzL3ZpZXcvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sUUFBUSxvQkFBVSxtQkFBVixDQUFkOztBQUVBLElBQU0sV0FBVyx3QkFBakI7QUFDQSxJQUFNLE9BQU8sbUJBQVMsUUFBVCxDQUFiOztBQUVBOzs7QUFHQSxJQUFNLGFBQWEseUJBQWUsS0FBZixFQUFzQixJQUF0QixDQUFuQjs7QUFFQSxJQUFNLFVBQVUsU0FBVixPQUFVO0FBQUEsU0FBTSxXQUFXLE9BQVgsQ0FBbUIsU0FBUyxRQUFULENBQWtCLElBQXJDLENBQU47QUFBQSxDQUFoQjtBQUNBLGtCQUFJLE1BQUosRUFBWSxNQUFaLEVBQW9CLE9BQXBCO0FBQ0Esa0JBQUksTUFBSixFQUFZLFlBQVosRUFBMEIsT0FBMUI7Ozs7Ozs7OztxakJDakJtQzs7O0FBRG5DOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBQWdDOztJQUVYLFU7QUFDakI7Ozs7QUFJQSx3QkFBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCO0FBQUE7O0FBQUE7O0FBQ3JCLGFBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxhQUFLLElBQUwsR0FBWSxJQUFaOztBQUVBLGFBQUssV0FBTCxDQUFpQixLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLElBQWxCLENBQWpCO0FBQ0EsYUFBSyxnQkFBTCxDQUFzQixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FB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LENBQWUsVUFBcEIsRUFBZ0M7QUFDNUIsNEJBQVEsUUFBUSxNQUFSLENBQVIsRUFBeUIsT0FBTyxLQUFQLENBQWEsSUFBYixFQUF6QjtBQUNIO0FBQ0osYUFKRCxFQUlHLElBSkg7O0FBTUE7QUFDQSxvQ0FBVSxLQUFLLFNBQWYsRUFBMEIsVUFBMUIsRUFBc0MsVUFBdEMsRUFBa0QsaUJBQXVCO0FBQUEsb0JBQXJCLE1BQXFCLFNBQXJCLE1BQXFCO0FBQUEsb0JBQWIsT0FBYSxTQUFiLE9BQWE7O0FBQ3JFLG9CQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDdkIsMkJBQU8sSUFBUDtBQUNIO0FBQ0osYUFKRDtBQUtIOztBQUVEOzs7Ozs7MkNBR21CLE8sRUFBUztBQUN4QixvQ0FBVSxLQUFLLFNBQWYsRUFBMEIsVUFBMUIsRUFBc0MsT0FBdEMsRUFBK0MsaUJBQXVCO0FBQUEsb0JBQXJCLE1BQXFCLFNBQXJCLE1BQXFCO0FBQUEsb0JBQWIsT0FBYSxTQUFiLE9BQWE7O0FBQ2xFLG9CQUFJLFlBQVksVUFBaEIsRUFBNEI7QUFDeEIsMkJBQU8sT0FBUCxDQUFlLFVBQWYsR0FBNEIsSUFBNUI7QUFDQSwyQkFBTyxJQUFQOztBQUVBLDRCQUFRLFFBQVEsTUFBUixDQUFSO0FBQ0g7QUFDSixhQVBEO0FBUUg7Ozs7OztrQkFqT2dCLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVyL2NvbnRyb2xsZXInO1xuaW1wb3J0IHskb259IGZyb20gJy4vaGVscGVycy9oZWxwZXJzJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlL3RlbXBsYXRlJztcbmltcG9ydCBTdG9yZSBmcm9tICcuL3N0b3JlL3N0b3JlJztcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldy92aWV3JztcblxuY29uc3Qgc3RvcmUgPSBuZXcgU3RvcmUoJ3RvZG9zLXZhbmlsbGEtZXM2Jyk7XG5cbmNvbnN0IHRlbXBsYXRlID0gbmV3IFRlbXBsYXRlKCk7XG5jb25zdCB2aWV3ID0gbmV3IFZpZXcodGVtcGxhdGUpO1xuXG4vKipcbiAqIEB0eXBlIHtDb250cm9sbGVyfVxuICovXG5jb25zdCBjb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIoc3RvcmUsIHZpZXcpO1xuXG5jb25zdCBzZXRWaWV3ID0gKCkgPT4gY29udHJvbGxlci5zZXRWaWV3KGRvY3VtZW50LmxvY2F0aW9uLmhhc2gpO1xuJG9uKHdpbmRvdywgJ2xvYWQnLCBzZXRWaWV3KTtcbiRvbih3aW5kb3csICdoYXNoY2hhbmdlJywgc2V0Vmlldyk7IiwiaW1wb3J0IHtlbXB0eUl0ZW1RdWVyeX0gZnJvbSAnLi4vaXRlbS9pdGVtJztcbmltcG9ydCBTdG9yZSBmcm9tICcuLi9zdG9yZS9zdG9yZSc7Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlldy92aWV3JzsvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xsZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSAgeyFTdG9yZX0gc3RvcmUgQSBTdG9yZSBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSAgeyFWaWV3fSB2aWV3IEEgVmlldyBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0b3JlLCB2aWV3KSB7XG4gICAgICAgIHRoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcblxuICAgICAgICB2aWV3LmJpbmRBZGRJdGVtKHRoaXMuYWRkSXRlbS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdmlldy5iaW5kRWRpdEl0ZW1TYXZlKHRoaXMuZWRpdEl0ZW1TYXZlLmJpbmQodGhpcykpO1xuICAgICAgICB2aWV3LmJpbmRFZGl0SXRlbUNhbmNlbCh0aGlzLmVkaXRJdGVtQ2FuY2VsLmJpbmQodGhpcykpO1xuICAgICAgICB2aWV3LmJpbmRSZW1vdmVJdGVtKHRoaXMucmVtb3ZlSXRlbS5iaW5kKHRoaXMpKTtcbiAgICAgICAgdmlldy5iaW5kVG9nZ2xlSXRlbSgoaWQsIGNvbXBsZXRlZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVDb21wbGV0ZWQoaWQsIGNvbXBsZXRlZCk7XG4gICAgICAgICAgICB0aGlzLl9maWx0ZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZpZXcuYmluZFJlbW92ZUNvbXBsZXRlZCh0aGlzLnJlbW92ZUNvbXBsZXRlZEl0ZW1zLmJpbmQodGhpcykpO1xuICAgICAgICB2aWV3LmJpbmRUb2dnbGVBbGwodGhpcy50b2dnbGVBbGwuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5fYWN0aXZlUm91dGUgPSAnJztcbiAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVJvdXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYW5kIHJlbmRlciB0aGUgYWN0aXZlIHJvdXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJhdyAnJyB8ICcjLycgfCAnIy9hY3RpdmUnIHwgJyMvY29tcGxldGVkJ1xuICAgICAqL1xuICAgIHNldFZpZXcocmF3KSB7XG4gICAgICAgIGNvbnN0IHJvdXRlID0gcmF3LnJlcGxhY2UoL14jXFwvLywgJycpO1xuXG4gICAgICAgIHRoaXMuX2FjdGl2ZVJvdXRlID0gcm91dGU7XG4gICAgICAgIHRoaXMuX2ZpbHRlcigpO1xuICAgICAgICB0aGlzLnZpZXcudXBkYXRlRmlsdGVyQnV0dG9ucyhyb3V0ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIEl0ZW0gdG8gdGhlIFN0b3JlIGFuZCBkaXNwbGF5IGl0IGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHshc3RyaW5nfSB0aXRsZSBUaXRsZSBvZiB0aGUgbmV3IGl0ZW1cbiAgICAgKi9cbiAgICBhZGRJdGVtKHRpdGxlKSB7XG4gICAgICAgIHRoaXMuc3RvcmUuaW5zZXJ0KHtcbiAgICAgICAgICAgIGlkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IGZhbHNlXG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlldy5jbGVhck5ld1RvZG8oKTtcbiAgICAgICAgICAgIHRoaXMuX2ZpbHRlcih0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2F2ZSBhbiBJdGVtIGluIGVkaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQgSUQgb2YgdGhlIEl0ZW0gaW4gZWRpdFxuICAgICAqIEBwYXJhbSB7IXN0cmluZ30gdGl0bGUgTmV3IHRpdGxlIGZvciB0aGUgSXRlbSBpbiBlZGl0XG4gICAgICovXG4gICAgZWRpdEl0ZW1TYXZlKGlkLCB0aXRsZSkge1xuICAgICAgICBpZiAodGl0bGUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZSh7aWQsIHRpdGxlfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5lZGl0SXRlbURvbmUoaWQsIHRpdGxlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtKGlkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbmNlbCB0aGUgaXRlbSBlZGl0aW5nIG1vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyFudW1iZXJ9IGlkIElEIG9mIHRoZSBJdGVtIGluIGVkaXRcbiAgICAgKi9cbiAgICBlZGl0SXRlbUNhbmNlbChpZCkge1xuICAgICAgICB0aGlzLnN0b3JlLmZpbmQoe2lkfSwgZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IGRhdGFbMF0udGl0bGU7XG4gICAgICAgICAgICB0aGlzLnZpZXcuZWRpdEl0ZW1Eb25lKGlkLCB0aXRsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGUgZGF0YSBhbmQgZWxlbWVudHMgcmVsYXRlZCB0byBhbiBJdGVtLlxuICAgICAqXG4gICAgICogQHBhcmFtIHshbnVtYmVyfSBpZCBJdGVtIElEIG9mIGl0ZW0gdG8gcmVtb3ZlXG4gICAgICovXG4gICAgcmVtb3ZlSXRlbShpZCkge1xuICAgICAgICB0aGlzLnN0b3JlLnJlbW92ZSh7aWR9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9maWx0ZXIoKTtcbiAgICAgICAgICAgIHRoaXMudmlldy5yZW1vdmVJdGVtKGlkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFsbCBjb21wbGV0ZWQgaXRlbXMuXG4gICAgICovXG4gICAgcmVtb3ZlQ29tcGxldGVkSXRlbXMoKSB7XG4gICAgICAgIHRoaXMuc3RvcmUucmVtb3ZlKHtjb21wbGV0ZWQ6IHRydWV9LCB0aGlzLl9maWx0ZXIuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGFuIEl0ZW0gaW4gc3RvcmFnZSBiYXNlZCBvbiB0aGUgc3RhdGUgb2YgY29tcGxldGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHshbnVtYmVyfSBpZCBJRCBvZiB0aGUgdGFyZ2V0IEl0ZW1cbiAgICAgKiBAcGFyYW0geyFib29sZWFufSBjb21wbGV0ZWQgRGVzaXJlZCBjb21wbGV0ZWQgc3RhdGVcbiAgICAgKi9cbiAgICB0b2dnbGVDb21wbGV0ZWQoaWQsIGNvbXBsZXRlZCkge1xuICAgICAgICB0aGlzLnN0b3JlLnVwZGF0ZSh7aWQsIGNvbXBsZXRlZH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlldy5zZXRJdGVtQ29tcGxldGUoaWQsIGNvbXBsZXRlZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBhbGwgaXRlbXMgdG8gY29tcGxldGUgb3IgYWN0aXZlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjb21wbGV0ZWQgRGVzaXJlZCBjb21wbGV0ZWQgc3RhdGVcbiAgICAgKi9cbiAgICB0b2dnbGVBbGwoY29tcGxldGVkKSB7XG4gICAgICAgIHRoaXMuc3RvcmUuZmluZCh7Y29tcGxldGVkOiAhY29tcGxldGVkfSwgZGF0YSA9PiB7XG4gICAgICAgICAgICBmb3IgKGxldCB7aWR9IG9mIGRhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUNvbXBsZXRlZChpZCwgY29tcGxldGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fZmlsdGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVmcmVzaCB0aGUgbGlzdCBiYXNlZCBvbiB0aGUgY3VycmVudCByb3V0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZvcmNlXSBGb3JjZSBhIHJlLXBhaW50IG9mIHRoZSBsaXN0XG4gICAgICovXG4gICAgX2ZpbHRlcihmb3JjZSkge1xuICAgICAgICBjb25zdCByb3V0ZSA9IHRoaXMuX2FjdGl2ZVJvdXRlO1xuXG4gICAgICAgIGlmIChmb3JjZSB8fCB0aGlzLl9sYXN0QWN0aXZlUm91dGUgIT09ICcnIHx8IHRoaXMuX2xhc3RBY3RpdmVSb3V0ZSAhPT0gcm91dGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmUuZmluZCh7XG4gICAgICAgICAgICAgICAgJyc6IGVtcHR5SXRlbVF1ZXJ5LFxuICAgICAgICAgICAgICAgICdhY3RpdmUnOiB7Y29tcGxldGVkOiBmYWxzZX0sXG4gICAgICAgICAgICAgICAgJ2NvbXBsZXRlZCc6IHtjb21wbGV0ZWQ6IHRydWV9XG4gICAgICAgICAgICB9W3JvdXRlXSwgdGhpcy52aWV3LnNob3dJdGVtcy5iaW5kKHRoaXMudmlldykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yZS5jb3VudCgodG90YWwsIGFjdGl2ZSwgY29tcGxldGVkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuc2V0SXRlbXNMZWZ0KGFjdGl2ZSk7XG4gICAgICAgICAgICB0aGlzLnZpZXcuc2V0Q2xlYXJDb21wbGV0ZWRCdXR0b25WaXNpYmlsaXR5KGNvbXBsZXRlZCk7XG5cbiAgICAgICAgICAgIHRoaXMudmlldy5zZXRDb21wbGV0ZUFsbENoZWNrYm94KGNvbXBsZXRlZCA9PT0gdG90YWwpO1xuICAgICAgICAgICAgdGhpcy52aWV3LnNldE1haW5WaXNpYmlsaXR5KHRvdGFsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVJvdXRlID0gcm91dGU7XG4gICAgfVxufSIsIi8qKlxuICogcXVlcnlTZWxlY3RvciB3cmFwcGVyXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIFNlbGVjdG9yIHRvIHF1ZXJ5XG4gKiBAcGFyYW0ge0VsZW1lbnR9IFtzY29wZV0gT3B0aW9uYWwgc2NvcGUgZWxlbWVudCBmb3IgdGhlIHNlbGVjdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBxcyhzZWxlY3Rvciwgc2NvcGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygncXM6ICcpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdzZWxlY3RvcjogJyk7XG4gICAgLy8gY29uc29sZS5sb2coc2VsZWN0b3IpO1xuICAgIHJldHVybiAoc2NvcGUgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xufVxuXG4vKipcbiAqIGFkZEV2ZW50TGlzdGVuZXIgd3JhcHBlclxuICpcbiAqIEBwYXJhbSB7RWxlbWVudHxXaW5kb3d9IHRhcmdldCBUYXJnZXQgRWxlbWVudFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgRXZlbnQgbmFtZSB0byBiaW5kIHRvXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBFdmVudCBjYWxsYmFja1xuICogQHBhcmFtIHtib29sZWFufSBbY2FwdHVyZV0gQ2FwdHVyZSB0aGUgZXZlbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uICRvbih0YXJnZXQsIHR5cGUsIGNhbGxiYWNrLCBjYXB0dXJlKSB7XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssICEhY2FwdHVyZSk7XG59XG5cbi8qKlxuICogQXR0YWNoIGEgaGFuZGxlciB0byBhbiBldmVudCBmb3IgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIGEgc2VsZWN0b3IuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXQgRWxlbWVudCB3aGljaCB0aGUgZXZlbnQgbXVzdCBidWJibGUgdG9cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWxlY3RvciBTZWxlY3RvciB0byBtYXRjaFxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgRXZlbnQgbmFtZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBGdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgYnViYmxlcyB0byB0YXJnZXRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbSBhbiBlbGVtZW50IG1hdGNoaW5nIHNlbGVjdG9yXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtjYXB0dXJlXSBDYXB0dXJlIHRoZSBldmVudFxuICovXG5leHBvcnQgZnVuY3Rpb24gJGRlbGVnYXRlKHRhcmdldCwgc2VsZWN0b3IsIHR5cGUsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICBjb25zdCBkaXNwYXRjaEV2ZW50ID0gZXZlbnQgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICBjb25zdCBwb3RlbnRpYWxFbGVtZW50cyA9IHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICAgICAgbGV0IGkgPSBwb3RlbnRpYWxFbGVtZW50cy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKHBvdGVudGlhbEVsZW1lbnRzW2ldID09PSB0YXJnZXRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRhcmdldEVsZW1lbnQsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkb24odGFyZ2V0LCB0eXBlLCBkaXNwYXRjaEV2ZW50LCAhIWNhcHR1cmUpO1xufVxuXG4vKipcbiAqIEVuY29kZSBsZXNzLXRoYW4gYW5kIGFtcGVyc2FuZCBjaGFyYWN0ZXJzIHdpdGggZW50aXR5IGNvZGVzIHRvIG1ha2UgdXNlci1cbiAqIHByb3ZpZGVkIHRleHQgc2FmZSB0byBwYXJzZSBhcyBIVE1MLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzIFN0cmluZyB0byBlc2NhcGVcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBTdHJpbmcgd2l0aCB1bnNhZmUgY2hhcmFjdGVycyBlc2NhcGVkIHdpdGggZW50aXR5IGNvZGVzXG4gKi9cbmV4cG9ydCBjb25zdCBlc2NhcGVGb3JIVE1MID0gcyA9PiBzLnJlcGxhY2UoL1smPF0vZywgYyA9PiBjID09PSAnJicgPyAnJmFtcDsnIDogJyZsdDsnKTsiLCIvKipcbiAqIEB0eXBlZGVmIHshe2lkOiBudW1iZXIsIGNvbXBsZXRlZDogYm9vbGVhbiwgdGl0bGU6IHN0cmluZ319XG4gKi9cbmV4cG9ydCB2YXIgSXRlbTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7IUFycmF5PEl0ZW0+fVxuICovXG5leHBvcnQgdmFyIEl0ZW1MaXN0O1xuXG4vKipcbiAqIEVudW0gY29udGFpbmluZyBhIGtub3duLWVtcHR5IHJlY29yZCB0eXBlLCBtYXRjaGluZyBvbmx5IGVtcHR5IHJlY29yZHMgdW5saWtlIE9iamVjdC5cbiAqXG4gKiBAZW51bSB7T2JqZWN0fVxuICovXG5jb25zdCBFbXB0eSA9IHtcbiAgICBSZWNvcmQ6IHt9XG59O1xuXG4vKipcbiAqIEVtcHR5IEl0ZW1RdWVyeSB0eXBlLCBiYXNlZCBvbiB0aGUgRW1wdHkgQGVudW0uXG4gKlxuICogQHR5cGVkZWYge0VtcHR5fVxuICovXG5leHBvcnQgdmFyIEVtcHR5SXRlbVF1ZXJ5O1xuXG4vKipcbiAqIFJlZmVyZW5jZSB0byB0aGUgb25seSBFbXB0eUl0ZW1RdWVyeSBpbnN0YW5jZS5cbiAqXG4gKiBAdHlwZSB7RW1wdHlJdGVtUXVlcnl9XG4gKi9cbmV4cG9ydCBjb25zdCBlbXB0eUl0ZW1RdWVyeSA9IEVtcHR5LlJlY29yZDtcblxuLyoqXG4gKiBAdHlwZWRlZiB7ISh7aWQ6IG51bWJlcn18e2NvbXBsZXRlZDogYm9vbGVhbn18RW1wdHlJdGVtUXVlcnkpfVxuICovXG5leHBvcnQgdmFyIEl0ZW1RdWVyeTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7ISh7aWQ6IG51bWJlciwgdGl0bGU6IHN0cmluZ318e2lkOiBudW1iZXIsIGNvbXBsZXRlZDogYm9vbGVhbn0pfVxuICovXG5leHBvcnQgdmFyIEl0ZW1VcGRhdGU7IiwiaW1wb3J0IHtJdGVtLCBJdGVtTGlzdCwgSXRlbVF1ZXJ5LCBJdGVtVXBkYXRlLCBlbXB0eUl0ZW1RdWVyeX0gZnJvbSAnLi4vaXRlbS9pdGVtJzsvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0geyFzdHJpbmd9IG5hbWUgRGF0YWJhc2UgbmFtZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gW2NhbGxiYWNrXSBDYWxsZWQgd2hlbiB0aGUgU3RvcmUgaXMgcmVhZHlcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjYWxsYmFjaykge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge1N0b3JhZ2V9XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdCBsb2NhbFN0b3JhZ2UgPSB3aW5kb3cubG9jYWxTdG9yYWdlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7SXRlbUxpc3R9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgbGl2ZVRvZG9zO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWFkIHRoZSBsb2NhbCBJdGVtTGlzdCBmcm9tIGxvY2FsU3RvcmFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge0l0ZW1MaXN0fSBDdXJyZW50IGFycmF5IG9mIHRvZG9zXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmdldExvY2FsU3RvcmFnZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBsaXZlVG9kb3MgfHwgSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShuYW1lKSB8fCAnW10nKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JpdGUgdGhlIGxvY2FsIEl0ZW1MaXN0IHRvIGxvY2FsU3RvcmFnZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtJdGVtTGlzdH0gdG9kb3MgQXJyYXkgb2YgdG9kb3MgdG8gd3JpdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlID0gKHRvZG9zKSA9PiB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShuYW1lLCBKU09OLnN0cmluZ2lmeShsaXZlVG9kb3MgPSB0b2RvcykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgaXRlbXMgd2l0aCBwcm9wZXJ0aWVzIG1hdGNoaW5nIHRob3NlIG9uIHF1ZXJ5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtJdGVtUXVlcnl9IHF1ZXJ5IFF1ZXJ5IHRvIG1hdGNoXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihJdGVtTGlzdCl9IGNhbGxiYWNrIENhbGxlZCB3aGVuIHRoZSBxdWVyeSBpcyBkb25lXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRiLmZpbmQoe2NvbXBsZXRlZDogdHJ1ZX0sIGRhdGEgPT4ge1xuICAgICAqICAgLy8gZGF0YSBzaGFsbCBjb250YWluIGl0ZW1zIHdob3NlIGNvbXBsZXRlZCBwcm9wZXJ0aWVzIGFyZSB0cnVlXG4gICAgICogfSlcbiAgICAgKi9cbiAgICBmaW5kKHF1ZXJ5LCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCB0b2RvcyA9IHRoaXMuZ2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgIGxldCBrO1xuXG4gICAgICAgIGNhbGxiYWNrKHRvZG9zLmZpbHRlcih0b2RvID0+IHtcbiAgICAgICAgICAgIGZvciAoayBpbiBxdWVyeSkge1xuICAgICAgICAgICAgICAgIGlmIChxdWVyeVtrXSAhPT0gdG9kb1trXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgYW4gaXRlbSBpbiB0aGUgU3RvcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0l0ZW1VcGRhdGV9IHVwZGF0ZSBSZWNvcmQgd2l0aCBhbiBpZCBhbmQgYSBwcm9wZXJ0eSB0byB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCl9IFtjYWxsYmFja10gQ2FsbGVkIHdoZW4gcGFydGlhbFJlY29yZCBpcyBhcHBsaWVkXG4gICAgICovXG4gICAgdXBkYXRlKHVwZGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgaWQgPSB1cGRhdGUuaWQ7XG4gICAgICAgIGNvbnN0IHRvZG9zID0gdGhpcy5nZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgbGV0IGkgPSB0b2Rvcy5sZW5ndGg7XG4gICAgICAgIGxldCBrO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmICh0b2Rvc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvZG9zW2ldW2tdID0gdXBkYXRlW2tdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHRvZG9zKTtcblxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgYW4gaXRlbSBpbnRvIHRoZSBTdG9yZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SXRlbX0gaXRlbSBJdGVtIHRvIGluc2VydFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKX0gW2NhbGxiYWNrXSBDYWxsZWQgd2hlbiBpdGVtIGlzIGluc2VydGVkXG4gICAgICovXG4gICAgaW5zZXJ0KGl0ZW0sIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IHRvZG9zID0gdGhpcy5nZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgdG9kb3MucHVzaChpdGVtKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UodG9kb3MpO1xuXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBpdGVtcyBmcm9tIHRoZSBTdG9yZSBiYXNlZCBvbiBhIHF1ZXJ5LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtJdGVtUXVlcnl9IHF1ZXJ5IFF1ZXJ5IG1hdGNoaW5nIHRoZSBpdGVtcyB0byByZW1vdmVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKEl0ZW1MaXN0KXxmdW5jdGlvbigpfSBbY2FsbGJhY2tdIENhbGxlZCB3aGVuIHJlY29yZHMgbWF0Y2hpbmcgcXVlcnkgYXJlIHJlbW92ZWRcbiAgICAgKi9cbiAgICByZW1vdmUocXVlcnksIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBrO1xuXG4gICAgICAgIGNvbnN0IHRvZG9zID0gdGhpcy5nZXRMb2NhbFN0b3JhZ2UoKS5maWx0ZXIodG9kbyA9PiB7XG4gICAgICAgICAgICBmb3IgKGsgaW4gcXVlcnkpIHtcbiAgICAgICAgICAgICAgICBpZiAocXVlcnlba10gIT09IHRvZG9ba10pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh0b2Rvcyk7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjayh0b2Rvcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3VudCB0b3RhbCwgYWN0aXZlLCBhbmQgY29tcGxldGVkIHRvZG9zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihudW1iZXIsIG51bWJlciwgbnVtYmVyKX0gY2FsbGJhY2sgQ2FsbGVkIHdoZW4gdGhlIGNvdW50IGlzIGNvbXBsZXRlZFxuICAgICAqL1xuICAgIGNvdW50KGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZmluZChlbXB0eUl0ZW1RdWVyeSwgZGF0YSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b3RhbCA9IGRhdGEubGVuZ3RoO1xuXG4gICAgICAgICAgICBsZXQgaSA9IHRvdGFsO1xuICAgICAgICAgICAgbGV0IGNvbXBsZXRlZCA9IDA7XG5cbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWQgKz0gZGF0YVtpXS5jb21wbGV0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsYmFjayh0b3RhbCwgdG90YWwgLSBjb21wbGV0ZWQsIGNvbXBsZXRlZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iLCJpbXBvcnQge0l0ZW1MaXN0fSBmcm9tICcuLi9pdGVtL2l0ZW0nOy8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuaW1wb3J0IHtlc2NhcGVGb3JIVE1MfSBmcm9tICcuLi9oZWxwZXJzL2hlbHBlcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZSB7XG4gICAgLyoqXG4gICAgICogRm9ybWF0IHRoZSBjb250ZW50cyBvZiBhIHRvZG8gbGlzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SXRlbUxpc3R9IGl0ZW1zIE9iamVjdCBjb250YWluaW5nIGtleXMgeW91IHdhbnQgdG8gZmluZCBpbiB0aGUgdGVtcGxhdGUgdG8gcmVwbGFjZS5cbiAgICAgKiBAcmV0dXJucyB7IXN0cmluZ30gQ29udGVudHMgZm9yIGEgdG9kbyBsaXN0XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZpZXcuc2hvdyh7XG4gICAgICogIGlkOiAxLFxuICAgICAqICB0aXRsZTogXCJIZWxsbyBXb3JsZFwiLFxuICAgICAqICBjb21wbGV0ZWQ6IGZhbHNlLFxuICAgICAqIH0pXG4gICAgICovXG4gICAgaXRlbUxpc3QoaXRlbXMpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zLnJlZHVjZSgoYSwgaXRlbSkgPT4gYSArIGBcbjxsaSBkYXRhLWlkPVwiJHtpdGVtLmlkfVwiJHtpdGVtLmNvbXBsZXRlZCA/ICcgY2xhc3M9XCJjb21wbGV0ZWRcIicgOiAnJ30+XG4gICAgPGlucHV0IGNsYXNzPVwidG9nZ2xlXCIgdHlwZT1cImNoZWNrYm94XCIgJHtpdGVtLmNvbXBsZXRlZCA/ICdjaGVja2VkJyA6ICcnfT5cbiAgICA8bGFiZWw+JHtlc2NhcGVGb3JIVE1MKGl0ZW0udGl0bGUpfTwvbGFiZWw+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImRlc3Ryb3lcIj48L2J1dHRvbj5cbjwvbGk+YCwgJycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvcm1hdCB0aGUgY29udGVudHMgb2YgYW4gXCJpdGVtcyBsZWZ0XCIgaW5kaWNhdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjdGl2ZVRvZG9zIE51bWJlciBvZiBhY3RpdmUgdG9kb3NcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHshc3RyaW5nfSBDb250ZW50cyBmb3IgYW4gXCJpdGVtcyBsZWZ0XCIgaW5kaWNhdG9yXG4gICAgICovXG4gICAgaXRlbUNvdW50ZXIoYWN0aXZlVG9kb3MpIHtcbiAgICAgICAgcmV0dXJuIGAke2FjdGl2ZVRvZG9zfSBpdGVtJHthY3RpdmVUb2RvcyAhPT0gMSA/ICdzJyA6ICcnfSBsZWZ0YDtcbiAgICB9XG59IiwiaW1wb3J0IHtJdGVtTGlzdH0gZnJvbSAnLi4vaXRlbS9pdGVtJzsvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5pbXBvcnQge3FzLCAkb24sICRkZWxlZ2F0ZX0gZnJvbSAnLi4vaGVscGVycy9oZWxwZXJzJztcbmltcG9ydCBUZW1wbGF0ZSBmcm9tICcuLi90ZW1wbGF0ZS90ZW1wbGF0ZSc7Ly8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuXG5jb25zdCBfaXRlbUlkID0gZWxlbWVudCA9PiBwYXJzZUludChlbGVtZW50LnBhcmVudE5vZGUuZGF0YXNldC5pZCwgMTApO1xuY29uc3QgRU5URVJfS0VZID0gMTM7XG5jb25zdCBFU0NBUEVfS0VZID0gMjc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7IVRlbXBsYXRlfSB0ZW1wbGF0ZSBBIFRlbXBsYXRlIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbiAgICAgICAgdGhpcy4kdG9kb0xpc3QgPSBxcygnLnRvZG8tbGlzdCcpO1xuICAgICAgICB0aGlzLiR0b2RvSXRlbUNvdW50ZXIgPSBxcygnLnRvZG8tY291bnQnKTtcbiAgICAgICAgdGhpcy4kY2xlYXJDb21wbGV0ZWQgPSBxcygnLmNsZWFyLWNvbXBsZXRlZCcpO1xuICAgICAgICB0aGlzLiRtYWluID0gcXMoJy5tYWluJyk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZUFsbCA9IHFzKCcudG9nZ2xlLWFsbCcpO1xuICAgICAgICB0aGlzLiRuZXdUb2RvID0gcXMoJy5uZXctdG9kbycpO1xuICAgICAgICAkZGVsZWdhdGUodGhpcy4kdG9kb0xpc3QsICdsaSBsYWJlbCcsICdkYmxjbGljaycsICh7dGFyZ2V0fSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lZGl0SXRlbSh0YXJnZXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFB1dCBhbiBpdGVtIGludG8gZWRpdCBtb2RlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHshRWxlbWVudH0gdGFyZ2V0IFRhcmdldCBJdGVtJ3MgbGFiZWwgRWxlbWVudC5cbiAgICAgKi9cbiAgICBlZGl0SXRlbSh0YXJnZXQpIHtcbiAgICAgICAgY29uc3QgbGlzdEl0ZW0gPSB0YXJnZXQucGFyZW50RWxlbWVudDtcblxuICAgICAgICBsaXN0SXRlbS5jbGFzc0xpc3QuYWRkKCdlZGl0aW5nJyk7XG5cbiAgICAgICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBpbnB1dC5jbGFzc05hbWUgPSAnZWRpdCc7XG5cbiAgICAgICAgaW5wdXQudmFsdWUgPSB0YXJnZXQuaW5uZXJUZXh0O1xuICAgICAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG9wdWxhdGUgdGhlIHRvZG8gbGlzdCB3aXRoIGEgbGlzdCBvZiBpdGVtcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SXRlbUxpc3R9IGl0ZW1zIEFycmF5IG9mIGl0ZW1zIHRvIGRpc3BsYXkuXG4gICAgICovXG4gICAgc2hvd0l0ZW1zKGl0ZW1zKSB7XG4gICAgICAgIHRoaXMuJHRvZG9MaXN0LmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUuaXRlbUxpc3QoaXRlbXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBpdGVtIGZyb20gdGhlIHZpZXcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaWQgSXRlbSBJRCBvZiB0aGUgaXRlbSB0byByZW1vdmUuXG4gICAgICovXG4gICAgcmVtb3ZlSXRlbShpZCkge1xuICAgICAgICBjb25zdCBlbGVtID0gcXMoYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcblxuICAgICAgICBpZiAoZWxlbSkge1xuICAgICAgICAgICAgdGhpcy4kdG9kb0xpc3QucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIG51bWJlciBpbiB0aGUgJ2l0ZW1zIGxlZnQnIGRpc3BsYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXRlbXNMZWZ0IE51bWJlciBvZiBpdGVtcyBsZWZ0LlxuICAgICAqL1xuICAgIHNldEl0ZW1zTGVmdChpdGVtc0xlZnQpIHtcbiAgICAgICAgdGhpcy4kdG9kb0l0ZW1Db3VudGVyLmlubmVySFRNTCA9IHRoaXMudGVtcGxhdGUuaXRlbUNvdW50ZXIoaXRlbXNMZWZ0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHZpc2liaWxpdHkgb2YgdGhlIFwiQ2xlYXIgY29tcGxldGVkXCIgYnV0dG9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufG51bWJlcn0gdmlzaWJsZSBEZXNpcmVkIHZpc2liaWxpdHkgb2YgdGhlIGJ1dHRvbi5cbiAgICAgKi9cbiAgICBzZXRDbGVhckNvbXBsZXRlZEJ1dHRvblZpc2liaWxpdHkodmlzaWJsZSkge1xuICAgICAgICBsZXQgZGlzcGxheSA9ICEhdmlzaWJsZTtcbiAgICAgICAgdGhpcy4kY2xlYXJDb21wbGV0ZWQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXkgPyAnYmxvY2snIDogJ25vbmUnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgbWFpbiBjb250ZW50IGFuZCBmb290ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW58bnVtYmVyfSB2aXNpYmxlIERlc2lyZWQgdmlzaWJpbGl0eS5cbiAgICAgKi9cbiAgICBzZXRNYWluVmlzaWJpbGl0eSh2aXNpYmxlKSB7XG4gICAgICAgIGxldCBkaXNwbGF5ID0gISF2aXNpYmxlO1xuICAgICAgICB0aGlzLiRtYWluLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5ID8gJ2Jsb2NrJyA6ICdub25lJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGNoZWNrZWQgc3RhdGUgb2YgdGhlIENvbXBsZXRlIEFsbCBjaGVja2JveC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxudW1iZXJ9IGNoZWNrZWQgVGhlIGRlc2lyZWQgY2hlY2tlZCBzdGF0ZS5cbiAgICAgKi9cbiAgICBzZXRDb21wbGV0ZUFsbENoZWNrYm94KGNoZWNrZWQpIHtcbiAgICAgICAgdGhpcy4kdG9nZ2xlQWxsLmNoZWNrZWQgPSAhIWNoZWNrZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBhcHBlYXJhbmNlIG9mIHRoZSBmaWx0ZXIgYnV0dG9ucyBiYXNlZCBvbiB0aGUgcm91dGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcm91dGUgVGhlIGN1cnJlbnQgcm91dGUuXG4gICAgICovXG4gICAgdXBkYXRlRmlsdGVyQnV0dG9ucyhyb3V0ZSkge1xuICAgICAgICBxcygnLmZpbHRlcnM+LnNlbGVjdGVkJykuY2xhc3NOYW1lID0gJyAnO1xuICAgICAgICBxcyhgLmZpbHRlcnM+W2hyZWY9XCIjLyR7cm91dGV9XCJdYCkuY2xhc3NOYW1lID0gJ3NlbGVjdGVkJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhciB0aGUgbmV3IHRvZG8gaW5wdXRcbiAgICAgKi9cbiAgICBjbGVhck5ld1RvZG8oKSB7XG4gICAgICAgIHRoaXMuJG5ld1RvZG8udmFsdWUgPSAnJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXIgYW4gaXRlbSBhcyBlaXRoZXIgY29tcGxldGVkIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7IW51bWJlcn0gaWQgSXRlbSBJRC5cbiAgICAgKiBAcGFyYW0geyFib29sZWFufSBjb21wbGV0ZWQgVHJ1ZSBpZiB0aGUgaXRlbSBpcyBjb21wbGV0ZWQuXG4gICAgICovXG4gICAgc2V0SXRlbUNvbXBsZXRlKGlkLCBjb21wbGV0ZWQpIHtcbiAgICAgICAgY29uc3QgbGlzdEl0ZW0gPSBxcyhgW2RhdGEtaWQ9XCIke2lkfVwiXWApO1xuXG4gICAgICAgIGlmICghbGlzdEl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RJdGVtLmNsYXNzTmFtZSA9IGNvbXBsZXRlZCA/ICdjb21wbGV0ZWQnIDogJyc7XG5cbiAgICAgICAgLy8gSW4gY2FzZSBpdCB3YXMgdG9nZ2xlZCBmcm9tIGFuIGV2ZW50IGFuZCBub3QgYnkgY2xpY2tpbmcgdGhlIGNoZWNrYm94LlxuICAgICAgICBxcygnaW5wdXQnLCBsaXN0SXRlbSkuY2hlY2tlZCA9IGNvbXBsZXRlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmluZyBhbiBpdGVtIG91dCBvZiBlZGl0IG1vZGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyFudW1iZXJ9IGlkIEl0ZW0gSUQgb2YgdGhlIGl0ZW0gaW4gZWRpdC5cbiAgICAgKiBAcGFyYW0geyFzdHJpbmd9IHRpdGxlIE5ldyB0aXRsZSBmb3IgdGhlIGl0ZW0gaW4gZWRpdC5cbiAgICAgKi9cbiAgICBlZGl0SXRlbURvbmUoaWQsIHRpdGxlKSB7XG4gICAgICAgIGNvbnN0IGxpc3RJdGVtID0gcXMoYFtkYXRhLWlkPVwiJHtpZH1cIl1gKTtcblxuICAgICAgICBjb25zdCBpbnB1dCA9IHFzKCdpbnB1dC5lZGl0JywgbGlzdEl0ZW0pO1xuICAgICAgICBsaXN0SXRlbS5yZW1vdmVDaGlsZChpbnB1dCk7XG5cbiAgICAgICAgbGlzdEl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnZWRpdGluZycpO1xuXG4gICAgICAgIHFzKCdsYWJlbCcsIGxpc3RJdGVtKS50ZXh0Q29udGVudCA9IHRpdGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgRnVuY3Rpb24gY2FsbGVkIG9uIHN5bnRoZXRpYyBldmVudC5cbiAgICAgKi9cbiAgICBiaW5kQWRkSXRlbShoYW5kbGVyKSB7XG4gICAgICAgICRvbih0aGlzLiRuZXdUb2RvLCAnY2hhbmdlJywgKHt0YXJnZXR9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aXRsZSA9IHRhcmdldC52YWx1ZS50cmltKCk7XG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKHRpdGxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBGdW5jdGlvbiBjYWxsZWQgb24gc3ludGhldGljIGV2ZW50LlxuICAgICAqL1xuICAgIGJpbmRSZW1vdmVDb21wbGV0ZWQoaGFuZGxlcikge1xuICAgICAgICAkb24odGhpcy4kY2xlYXJDb21wbGV0ZWQsICdjbGljaycsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgRnVuY3Rpb24gY2FsbGVkIG9uIHN5bnRoZXRpYyBldmVudC5cbiAgICAgKi9cbiAgICBiaW5kVG9nZ2xlQWxsKGhhbmRsZXIpIHtcbiAgICAgICAgJG9uKHRoaXMuJHRvZ2dsZUFsbCwgJ2NsaWNrJywgKHt0YXJnZXR9KSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVyKHRhcmdldC5jaGVja2VkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBGdW5jdGlvbiBjYWxsZWQgb24gc3ludGhldGljIGV2ZW50LlxuICAgICAqL1xuICAgIGJpbmRSZW1vdmVJdGVtKGhhbmRsZXIpIHtcbiAgICAgICAgJGRlbGVnYXRlKHRoaXMuJHRvZG9MaXN0LCAnLmRlc3Ryb3knLCAnY2xpY2snLCAoe3RhcmdldH0pID0+IHtcbiAgICAgICAgICAgIGhhbmRsZXIoX2l0ZW1JZCh0YXJnZXQpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBGdW5jdGlvbiBjYWxsZWQgb24gc3ludGhldGljIGV2ZW50LlxuICAgICAqL1xuICAgIGJpbmRUb2dnbGVJdGVtKGhhbmRsZXIpIHtcbiAgICAgICAgJGRlbGVnYXRlKHRoaXMuJHRvZG9MaXN0LCAnLnRvZ2dsZScsICdjbGljaycsICh7dGFyZ2V0fSkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlcihfaXRlbUlkKHRhcmdldCksIHRhcmdldC5jaGVja2VkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBGdW5jdGlvbiBjYWxsZWQgb24gc3ludGhldGljIGV2ZW50LlxuICAgICAqL1xuICAgIGJpbmRFZGl0SXRlbVNhdmUoaGFuZGxlcikge1xuICAgICAgICAkZGVsZWdhdGUodGhpcy4kdG9kb0xpc3QsICdsaSAuZWRpdCcsICdibHVyJywgKHt0YXJnZXR9KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRhcmdldC5kYXRhc2V0LmlzY2FuY2VsZWQpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKF9pdGVtSWQodGFyZ2V0KSwgdGFyZ2V0LnZhbHVlLnRyaW0oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgY3Vyc29yIGZyb20gdGhlIGlucHV0IHdoZW4geW91IGhpdCBlbnRlciBqdXN0IGxpa2UgaWYgaXQgd2VyZSBhIHJlYWwgZm9ybS5cbiAgICAgICAgJGRlbGVnYXRlKHRoaXMuJHRvZG9MaXN0LCAnbGkgLmVkaXQnLCAna2V5cHJlc3MnLCAoe3RhcmdldCwga2V5Q29kZX0pID0+IHtcbiAgICAgICAgICAgIGlmIChrZXlDb2RlID09PSBFTlRFUl9LRVkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuYmx1cigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIEZ1bmN0aW9uIGNhbGxlZCBvbiBzeW50aGV0aWMgZXZlbnQuXG4gICAgICovXG4gICAgYmluZEVkaXRJdGVtQ2FuY2VsKGhhbmRsZXIpIHtcbiAgICAgICAgJGRlbGVnYXRlKHRoaXMuJHRvZG9MaXN0LCAnbGkgLmVkaXQnLCAna2V5dXAnLCAoe3RhcmdldCwga2V5Q29kZX0pID0+IHtcbiAgICAgICAgICAgIGlmIChrZXlDb2RlID09PSBFU0NBUEVfS0VZKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmRhdGFzZXQuaXNjYW5jZWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmJsdXIoKTtcblxuICAgICAgICAgICAgICAgIGhhbmRsZXIoX2l0ZW1JZCh0YXJnZXQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSJdfQ==
