import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import log from '../lib/log';

import {
  setProjectName
} from '../reducers/profile';

class ProjectName extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'onChange'
        ]);
    }
    onChange(e) {
        this.props.setProjectName(e.target.value);
    }
    render () {
        return (
            <input
            id="title-field"
            value={this.props.projectName}
            placeholder="Untitled-1"
            onChange={this.onChange}
        />
        );
    }
}

ProjectName.propTypes = {
  projectName: PropTypes.string,
};

const mapStateToProps = state => ({
    projectName: state.scratchGui.profile.projectName,
});

const mapDispatchToProps = dispatch => ({
    setProjectName: (projectName) => dispatch(setProjectName(projectName)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ProjectName));
