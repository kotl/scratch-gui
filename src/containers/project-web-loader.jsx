import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import analytics from '../lib/analytics';
import log from '../lib/log';
import { MenuItem, MenuSection } from '../components/menu/menu.jsx';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import xhr from 'xhr';

import {
    openProjectLibrary,
    closeProjectLibrary,
    openProgressDialog,
    closeProgressDialog,
} from '../reducers/modals';

import {
    closeFileMenu,
} from '../reducers/menus';

import { setProgressDescription, setProjectList,setProgressError } from '../reducers/profile';

class ProjectWebLoader extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'onClick',
        ]);
        this.state = {}
    }

    onClick() {
        this.props.closeFileMenu();
        // TODO: i18n
        this.props.setProgressDescription('Loading list of projects');
        this.props.openProgressDialog();
        const me = this;
        xhr({
            method: 'POST',
            uri: `/api/list?username=${this.props.username}`,
            body: {},
            json: true
        }, (error, response) => {
            const hasError = error || response.statusCode !== 200;
            const result = hasError ? { result: 'NOPE'} : response.body;
            if (error || response.statusCode !== 200 || !result || result.result != 'OK') {
                // TODO: i18n:
                const displayError = error ? error : response.body;
                this.props.setProgressError('Loading list of projects failed: '+ displayError);
                setTimeout(() => {
                    this.props.closeProgressDialog();
                }, 5000);
                return;
            }
            this.props.closeProgressDialog();
            this.props.setProjectList(result.projects);
            this.props.openProjectLibrary();
        });
    }
    render() {
        return (<MenuItem
            onClick={this.onClick}
        >
            <FormattedMessage
                defaultMessage="Open"
                description="Menu bar item for selecting existing project in your profile"
                id="gui.menuBar.openFromProfile"
            />
        </MenuItem>);

    }
}

ProjectWebLoader.propTypes = {
    openLoadingState: PropTypes.func,
    setProgressError: PropTypes.func,
    openProjectLibrary: PropTypes.func,
    closeProjectLibrary: PropTypes.func,
    setProgressDescription: PropTypes.func,
    setProjectList: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    }),
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    username: state.scratchGui.profile.username,
});

const mapDispatchToProps = dispatch => ({
    openProjectLibrary: () => dispatch(openProjectLibrary()),
    closeProjectLibrary: () => dispatch(closeProjectLibrary()),
    openProgressDialog: () => dispatch(openProgressDialog()),
    closeProgressDialog: () => dispatch(closeProgressDialog()),
    setProgressDescription: (description) => dispatch(setProgressDescription(description)),
    setProjectList: (value) => dispatch(setProjectList(value)),
    closeFileMenu: () => dispatch(closeFileMenu()),
    setProgressError: (error) => dispatch(setProgressError(error)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ProjectWebLoader));
