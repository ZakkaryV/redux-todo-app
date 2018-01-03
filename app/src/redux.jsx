// REDUCERS

const todo = (
    state,
    action
) => {
    switch (action.type) {
        case 'ADD_TO_DO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case 'TOGGLE_TO_DO':
            if ( action.id !== state.id) {
                return state;
            }
            return {
                ...state, 
                completed: !state.completed
            }
            
            return state;
    }
}

const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER': 
            return action.filter;
        default:
            return state;
    }
}

const todos = (
    state = [],
    action
) => {
    
        switch (action.type) {
            case 'ADD_TO_DO':
                return [
                    ...state,
                    todo(undefined, action)
                ]
            case 'TOGGLE_TO_DO':
                return state.map( t =>  todo(t, action))
            default: 
                return state;
        }
    
    }



// REDUX
const createStore = (reducer) => {

    let state;
    let listeners = [];
    
    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    }

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
        
    }

    dispatch({
        type: 'ADD_TO_DO',
        id: 0,
        text: 'Learn Redux', 
        completed: false
    })

    dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: 'SHOW_ALL'
    })

    console.log(getState())

    return { getState, dispatch, subscribe };
}

const combineReducers = (reducers) => {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](
                    state[key],
                    action
                );
                return nextState;
            },
            {}
        )
    }    
}

const todoApp = combineReducers({
    todos, 
    visibilityFilter
});
    

const store = createStore(todoApp);

store.subscribe( () => {
    render();
    console.log(store.getState());
});


// VIEW

let nextTodoId = 1;

const FilterLink = (
    props
) => {

    let { filter, children } = props; 
    
    return (
        <a href={''} 
           onClick={ e => { 
               e.preventDefault();
               store.dispatch({ type: 'SET_VISIBILITY_FILTER', filter: filter })
           } } >
            { children }
        </a>
    )
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let { todos, visibilityFilter } = this.props;


        return (
            <div>
                <form onSubmit={ e => { e.preventDefault(); e.target.children[0].value = ''; } }>
                    <input 
                        ref={ node => {
                        this.input = node;
                    }}>
                    </input>
                    <button onClick={() => {store.dispatch({
                        type: 'ADD_TO_DO', id: nextTodoId++, text: this.input.value
                    } ) }}>
                        TestButton
                    </button>
                    <ul>
                        { todos.map( ( todo, index ) => {
                            return (
                                <li key={ todo.id }
                                    onClick={() => {
                                        store.dispatch({ 
                                            type: 'TOGGLE_TO_DO',
                                            id: todo.id    
                                        })
                                    }}
                                    style={{
                                        textDecoration: todo.completed ? 
                                            'line-through': 
                                            'none'
                                    }}>
                                    { todo.text }
                                </li>
                            )
                        })}
                    </ul>
                </form>
                <p>
                        Show:
                        {' '}
                        <FilterLink 
                            filter="SHOW_ALL"
                            currentFilter={ visibilityFilter } > All
                        </FilterLink>,
                        <FilterLink 
                            filter="SHOW_ACTIVE"
                            currentFilter={ visibilityFilter } > Active
                        </FilterLink>,
                        <FilterLink 
                            filter="SHOW_COMPLETED"
                            currentFilter={ visibilityFilter } > Completed
                        </FilterLink>
                        

                </p>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render([
        <TodoApp 
            todos={ store.getState().todos }/>
    ],
        document.getElementById('root')
    );
}

render();