import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import SigninComponent from '../components/signin/signin.jsx';

class Signin extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
        ]);
        this.state = {
        };
    }
    render () {
        return (
            <SigninComponent
            onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

Signin.propTypes = {
    onRequestClose: PropTypes.func.isRequired,
};

export default Signin;
