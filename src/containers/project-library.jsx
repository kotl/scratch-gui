import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import LibraryComponent from '../components/library/library.jsx';

import {connect} from 'react-redux';

import {
    openProjectLibrary,
    openProgressDialog,
    closeProgressDialog,
    closeProjectLibrary,
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';

import {setProjectId, setProjectName, setProgressDescription, setProgressError} from '../reducers/profile';
import xhr from 'xhr';

const messages = defineMessages({
    ProjectLibraryTitle: {
        defaultMessage: 'Choose a Project',
        description: 'Heading for the list of users\'s projects',
        id: 'gui.ProjectLibrary.tutorials'
    }
});

class ProjectLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
    }
    handleItemSelect (item) {
        this.props.closeProjectLibrary();
        const id = item.id;
        const title = item.name;
        this.props.setProgressDescription('Loading project');
        this.props.openProgressDialog();
        const me = this;
        xhr({
            method: 'POST',
            uri: '/api/load?id=' + id,
            body: '',
            json: false,
            responseType: 'arraybuffer',
        }, (error, response) => {
            const hasError = error || response.statusCode !== 200;
            if (error || response.statusCode !== 200) {
                // TODO: i18n:
                this.props.setProgressError('Lading project failed. May be you need to sign in?');
                setTimeout(() => {
                    this.props.closeProgressDialog();
                }, 5000);
                return;
            }
            me.props.setProjectId(id);
            me.props.setProjectName(title);
            this.props.closeProgressDialog();
            this.props.openLoadingState();
            this.props.vm.loadProject(response.body)
                .then(() => {
                    this.props.closeLoadingState();
                })
                .catch(error => {
                    console.log(error);
                    this.props.closeLoadingState();
                });
        });
    }

    render () {
        const projectsData = this.props.projects.map(project => ({
            id: project.projectId,
            name: project.title,
            featured: true,
        }));

        return (
            <LibraryComponent
                data={projectsData}
                filterable={true}
                id="ProjectLibrary"
                title={this.props.intl.formatMessage(messages.ProjectLibraryTitle)}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

ProjectLibrary.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    }),
    closeProjectLibrary: PropTypes.func,
};

const mapStateToProps = state => ({
    visible: state.scratchGui.modals.ProjectLibrary,
    projects: state.scratchGui.profile.projects,
    vm: state.scratchGui.vm,
});

const mapDispatchToProps = dispatch => ({
    onRequestClose: () => dispatch(closeProjectLibrary()),
    closeProjectLibrary: () => dispatch(closeProjectLibrary()),
    openProgressDialog: () => dispatch(openProgressDialog()),
    closeProgressDialog: () => dispatch(closeProgressDialog()),
    closeLoadingState: () => dispatch(closeLoadingProject()),
    openLoadingState: () => dispatch(openLoadingProject()),

    setProgressDescription: (description) => dispatch(setProgressDescription(description)),
    setProgressError: (error) => dispatch(setProgressError(error)),
    setProjectName: (id) => dispatch(setProjectName(id)),
    setProjectId: (id) => dispatch(setProjectId(id)),
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectLibrary));
