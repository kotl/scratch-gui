const SET_USERNAME = 'scratch-gui/profile/SET_USERNAME';

const initialState = {
    username: '',
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_USERNAME:
        return Object.assign({}, state, {
            username: action.username
        });
    default:
        return state;
    }
};

const setUsername = function (username) {
    return {
        type: SET_USERNAME,
        username: username
    };
};

export {
    reducer as default,
    initialState as profileInitialState,
    setUsername,
};
