import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import xhr from 'xhr';

import {
    openProgressDialog,
    closeProgressDialog,
} from '../reducers/modals';

import {setProjectId, setProgressDescription, setProgressError} from '../reducers/profile';

import {
    closeFileMenu,
} from '../reducers/menus';

class ProjectWebSaver extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'saveProject'
        ]);
    }
    saveProject () {
        this.props.closeFileMenu();
        this.props.setProgressDescription('Saving project');
        this.props.openProgressDialog();
        const me = this;
        let projectId = this.props.projectId;
        if (this.props.useNewProjectId) {
            this.props.setProjectId('');
            projectId = '';
        }
        this.props.vm.saveProjectSb3().then(content => {
            xhr({
                method: 'POST',
                uri: `/api/save?title=${me.props.projectName}&id=${projectId}&username=${this.props.username}`,
                body: content,
                json: false,
            }, (error, response)  => {
                const hasError = error || response.statusCode !== 200;
                const result = hasError ? { result: 'NOPE'} : JSON.parse(response.body);
                if (error || response.statusCode !== 200 || !result || result.result != 'OK') {
                    // TODO: i18n:
                    const displayError = error ? error : response.body;
                    this.props.setProgressError('Saving project failed: ' + displayError);
                    setTimeout(() => {
                        this.props.closeProgressDialog();
                    }, 5000);
                    return;
                }
                me.props.setProjectId(result.id);
                this.props.closeProgressDialog();
            });

            });
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            children,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return this.props.children(this.saveProject, props);
    }
}

ProjectWebSaver.propTypes = {
    children: PropTypes.func,
    useNewProjectId: PropTypes.bool,
    setProgressDescription: PropTypes.func,
    setProgressError: PropTypes.func,
    vm: PropTypes.shape({
        saveProjectSb3: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    projectName: state.scratchGui.profile.projectName,
    username: state.scratchGui.profile.username,
    projectId: state.scratchGui.profile.projectId,
});

const mapDispatchToProps = dispatch => ({
    openProgressDialog: () => dispatch(openProgressDialog()),
    closeProgressDialog: () => dispatch(closeProgressDialog()),
    setProjectId: (id) => dispatch(setProjectId(id)),
    setProgressDescription: (description) => dispatch(setProgressDescription(description)),
    setProgressError: (error) => dispatch(setProgressError(error)),
    closeFileMenu: () => dispatch(closeFileMenu()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectWebSaver);
