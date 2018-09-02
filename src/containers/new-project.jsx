import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {MenuItem, MenuSection} from '../components/menu/menu.jsx';
import projectJson from '../lib/default-project/project.json';

import {
    setProjectName,
    setProjectId
} from '../reducers/profile';
  
import {
    closeFileMenu,
} from '../reducers/menus';

class NewProject extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'onClick',
        ]);
    }
    onClick() {
        this.props.closeFileMenu();        
        this.props.setProjectId('');
        this.props.setProjectName('');
        this.props.vm.loadProject(projectJson);
    }
    render () {
        return (
        <MenuItem
          onClick={this.onClick}
        >
        <FormattedMessage
            defaultMessage="New"
            description="Menu bar item for creating a new project"
            id="gui.menuBar.new"
        />
    </MenuItem>);
    }
}

NewProject.propTypes = {
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.scratchGui.vm
});

const mapDispatchToProps = dispatch => ({
    closeFileMenu: () => dispatch(closeFileMenu()),
    setProjectName: (projectName) => dispatch(setProjectName(projectName)),
    setProjectId: (id) => dispatch(setProjectName(id)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(NewProject));
