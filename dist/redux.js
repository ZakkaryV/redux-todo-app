var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// REDUCERS

const todo = (state, action) => {
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

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const todos = (state = [], action) => {

    switch (action.type) {
        case 'ADD_TO_DO':
            return [...state, todo(undefined, action)];
        case 'TOGGLE_TO_DO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

// REDUX
const createStore = reducer => {

    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = action => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    };

    const subscribe = listener => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
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

    return { getState, dispatch, subscribe };
};

const combineReducers = reducers => {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce((nextState, key) => {
            nextState[key] = reducers[key](state[key], action);
            return nextState;
        }, {});
    };
};

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

const store = createStore(todoApp);

store.subscribe(() => {
    render();
    console.log(store.getState());
});

// VIEW

let nextTodoId = 1;

const visibleTodos = (todos, visibilityFilter) => {

    switch (visibilityFilter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed);
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
};

const FilterLink = props => {

    let { filter, currentFilter, children, onClick } = props;

    if (filter === currentFilter) {
        return React.createElement(
            'span',
            null,
            children
        );
    }

    return React.createElement(
        'a',
        { href: '',
            onClick: e => {
                e.preventDefault();onClick(filter);
            } },
        children
    );
};

const AddTodo = ({
    onAddClick
}) => {
    let input;
    return React.createElement(
        'form',
        { onSubmit: e => {
                e.preventDefault();e.target.children[0].value = '';
            } },
        React.createElement('input', {
            ref: node => {
                input = node;
            } }),
        React.createElement(
            'button',
            { onClick: () => {
                    onAddClick(input.value);
                } },
            'Add Todo'
        )
    );
};

const Footer = ({
    visibilityFilter,
    onFilterClick
}) => {
    return React.createElement(
        'p',
        null,
        'Show:',
        ' ',
        React.createElement(
            FilterLink,
            {
                filter: 'SHOW_ALL',
                currentFilter: visibilityFilter,
                onClick: onFilterClick },
            ' All'
        ),
        ',',
        React.createElement(
            FilterLink,
            {
                filter: 'SHOW_ACTIVE',
                currentFilter: visibilityFilter,
                onClick: onFilterClick },
            ' Active'
        ),
        ',',
        React.createElement(
            FilterLink,
            {
                filter: 'SHOW_COMPLETED',
                currentFilter: visibilityFilter,
                onClick: onFilterClick },
            ' Completed'
        )
    );
};

const TodoList = ({
    filteredTodos
}) => {
    return React.createElement(
        'ul',
        null,
        filteredTodos.map((todo, index) => {
            return React.createElement(Todo, _extends({
                key: index
            }, todo));
        })
    );
};

const Todo = ({
    id,
    completed,
    text
}) => {

    return React.createElement(
        'li',
        { key: id,
            onClick: () => {
                store.dispatch({
                    type: 'TOGGLE_TO_DO',
                    id: id
                });
            },
            style: {
                textDecoration: completed ? 'line-through' : 'none'
            } },
        text
    );
};

class TodoApp extends React.Component {

    render() {

        let { visibilityFilter, todos } = this.props;

        let filteredTodos = visibleTodos(todos, visibilityFilter);

        return React.createElement(
            'div',
            null,
            React.createElement(AddTodo, {
                onAddClick: text => {
                    store.dispatch({
                        type: 'ADD_TO_DO', id: nextTodoId++, text
                    });
                } }),
            React.createElement(TodoList, {
                filteredTodos: filteredTodos }),
            React.createElement(Footer, {
                visibilityFilter: visibilityFilter,
                onFilterClick: filter => {
                    store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: filter });
                } })
        );
    }
}

const render = () => {
    ReactDOM.render([React.createElement(TodoApp, store.getState())], document.getElementById('root'));
};

render();