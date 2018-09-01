import {defineMessages, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './signin.css';
import xhr from 'xhr';

import dropdownIcon from './icon--dropdown-caret.svg';

class SigninComponent extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'onCancel',
            'onOk',
            'onChangeUsername',
            'onChangePassword',
        ]);
        this.state = {};
    }
    onOk() {
            xhr({
                method: 'POST',
                uri: `/auth?u=${username}&p=${password}`,
                json: true
            }, (error, response) => {
                if (error || response.statusCode !== 200) {
                    return reject();
                }
            });
    }
    onCancel() {
        this.props.onRequestClose();
    }
    onChangeUsername(e) {
        this.state.username = e.target.value;
    }
    onChangePassword(e) {
        this.state.password = e.target.value;
    }

    render () { 
    return (<Modal
        className={styles.modalContent}
        contentLabel='Sign in'
        onRequestClose={this.onCancel}
    >
        <Box className={styles.body}>
            <Box className={styles.label}>
                Username
            </Box>
            <Box>
                <input
                    autoFocus
                    id="username"
                    className={styles.variableNameTextInput}
                    onChange={this.onChangeUsername}
                />
            </Box>
            <Box className={styles.label}>
                Password
            </Box>
            <Box>
                <input
                    id="password"
                    type="password"
                    className={styles.variableNameTextInput}
                    onChange={this.onChangePassword}
                />
            </Box>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={this.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button in prompt for cancelling the dialog"
                        id="gui.signin.cancel"
                    />
                </button>
                <button
                    className={styles.okButton}
                    onClick={this.onOk}
                >
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Button in prompt for confirming the dialog"
                        id="gui.signin.ok"
                    />
                </button>
            </Box>
        </Box>
    </Modal>);
  }
}

SigninComponent.propTypes = {
    onRequestClose: PropTypes.func.isRequired,
};

export default SigninComponent;
