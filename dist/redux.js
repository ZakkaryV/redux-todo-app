'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// REDUCERS

var todo = function todo(state, action) {
    switch (action.type) {
        case 'ADD_TO_DO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TO_DO':
            if (action.id !== state.id) {
                return state;
            }
            return _extends({}, state, {
                completed: !state.completed
            });

            return state;
    }
};

var visibilityFilter = function visibilityFilter() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'SHOW_ALL';
    var action = arguments[1];

    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

var todos = function todos() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];


    switch (action.type) {
        case 'ADD_TO_DO':
            return [].concat(_toConsumableArray(state), [todo(undefined, action)]);
        case 'TOGGLE_TO_DO':
            return state.map(function (t) {
                return todo(t, action);
            });
        default:
            return state;
    }
};

// REDUX
var createStore = function createStore(reducer) {

    var state = void 0;
    var listeners = [];

    var getState = function getState() {
        return state;
    };

    var dispatch = function dispatch(action) {
        state = reducer(state, action);
        listeners.forEach(function (listener) {
            return listener();
        });
    };

    var subscribe = function subscribe(listener) {
        listeners.push(listener);
        return function () {
            listeners = listeners.filter(function (l) {
                return l !== listener;
            });
        };
    };

    dispatch({
        type: 'ADD_TO_DO',
        id: 0,
        text: 'Learn Redux',
        completed: false
    });

    dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: 'SHOW_ALL'
    });

    console.log(getState());

    return { getState: getState, dispatch: dispatch, subscribe: subscribe };
};

var combineReducers = function combineReducers(reducers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var action = arguments[1];

        return Object.keys(reducers).reduce(function (nextState, key) {
            nextState[key] = reducers[key](state[key], action);
            return nextState;
        }, {});
    };
};

var todoApp = combineReducers({
    todos: todos,
    visibilityFilter: visibilityFilter
});

var store = createStore(todoApp);

store.subscribe(function () {
    render();
    console.log(store.getState());
});

// VIEW

var nextTodoId = 1;

var FilterLink = function FilterLink(props) {
    var filter = props.filter,
        children = props.children;


    return React.createElement(
        'a',
        { href: '',
            onClick: function onClick(e) {
                e.preventDefault();
                store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: filter });
            } },
        children
    );
};

var TodoApp = function (_React$Component) {
    _inherits(TodoApp, _React$Component);

    function TodoApp(props) {
        _classCallCheck(this, TodoApp);

        return _possibleConstructorReturn(this, (TodoApp.__proto__ || Object.getPrototypeOf(TodoApp)).call(this, props));
    }

    _createClass(TodoApp, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                todos = _props.todos,
                visibilityFilter = _props.visibilityFilter;


            return React.createElement(
                'div',
                null,
                React.createElement(
                    'form',
                    { onSubmit: function onSubmit(e) {
                            e.preventDefault();e.target.children[0].value = '';
                        } },
                    React.createElement('input', {
                        ref: function ref(node) {
                            _this2.input = node;
                        } }),
                    React.createElement(
                        'button',
                        { onClick: function onClick() {
                                store.dispatch({
                                    type: 'ADD_TO_DO', id: nextTodoId++, text: _this2.input.value
                                });
                            } },
                        'TestButton'
                    ),
                    React.createElement(
                        'ul',
                        null,
                        todos.map(function (todo, index) {
                            return React.createElement(
                                'li',
                                { key: todo.id,
                                    onClick: function onClick() {
                                        store.dispatch({
                                            type: 'TOGGLE_TO_DO',
                                            id: todo.id
                                        });
                                    },
                                    style: {
                                        textDecoration: todo.completed ? 'line-through' : 'none'
                                    } },
                                todo.text
                            );
                        })
                    )
                ),
                React.createElement(
                    'p',
                    null,
                    'Show:',
                    ' ',
                    React.createElement(
                        FilterLink,
                        {
                            filter: 'SHOW_ALL',
                            currentFilter: visibilityFilter },
                        ' All'
                    ),
                    ',',
                    React.createElement(
                        FilterLink,
                        {
                            filter: 'SHOW_ACTIVE',
                            currentFilter: visibilityFilter },
                        ' Active'
                    ),
                    ',',
                    React.createElement(
                        FilterLink,
                        {
                            filter: 'SHOW_COMPLETED',
                            currentFilter: visibilityFilter },
                        ' Completed'
                    )
                )
            );
        }
    }]);

    return TodoApp;
}(React.Component);

var render = function render() {
    ReactDOM.render([React.createElement(TodoApp, {
        todos: store.getState().todos })], document.getElementById('root'));
};

render();