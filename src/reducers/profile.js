const SET_USERNAME = 'scratch-gui/profile/SET_USERNAME';
const SET_PROJECTNAME = 'scratch-gui/profile/SET_PROJECTNAME';
const SET_PROJECTID = 'scratch-gui/profile/SET_PROJECTID';

const initialState = {
    username: '',
    projectName: '',
    id: '',
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_USERNAME:
        return Object.assign({}, state, {
            username: action.username
        });
    case SET_PROJECTNAME:
        return Object.assign({}, state, {
            projectName: action.projectName
        });
    case SET_PROJECTID:
        return Object.assign({}, state, {
            id: action.id
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

const setProjectName = function (projectName) {
    return {
        type: SET_PROJECTNAME,
        projectName: projectName
    };
};

const setProjectId = function (id) {
    return {
        type: SET_PROJECTNAME,
        id: id
    };
};

export {
    reducer as default,
    initialState as profileInitialState,
    setUsername,
    setProjectName,
    setProjectId,
};
