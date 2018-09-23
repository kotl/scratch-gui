import {defineMessages, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './signin.css';
import xhr from 'xhr';

class SigninComponent extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'onCancel',
            'onOk',
            'onChangeUsername',
            'onChangePassword',
            'setError',
            'showError',
        ]);
        this.state = { error: '', username: '', password: '' };
    }
    onOk() {
        let me = this;
        this.setError('');
        if (this.state.username.length === 0) {
            // TODO: use i18n
            this.setError('Please specify username');
            return;
        }
        if (this.state.password.length === 0) {
            // TODO: use i18n
            this.setError('Please specify password');
            return;
        }
        xhr({
                method: 'POST',
                uri: `/api/login`,
                body: {
                    username: this.state.username,
                    password: this.state.password,
                },
                json: true
            }, (error, response)  => {
                if (error || response.statusCode !== 200) {
                    me.setError(error ? error : response.body);
                    return;
                }
                try{
                    let result = response.body;
                    if (result.result === 'AUTHENTICATED') {
                        if (result.created == true) {
                            // TODO: i18n
                            this.setError("New user was created. Please remember this user/password next time.");
                            setTimeout( () => {
                                me.props.onRequestSuccess(me.state.username);
                            }, 4000);
                        } else {
                          me.props.onRequestSuccess(me.state.username);
                        }
                    }
                }
                catch(e) { console.log(e); }
            });
    }

    setError(message) {
        this.state.error = message;
        this.forceUpdate();
    }

    showError() {
        return this.state.error != '';
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
        id='signInDialog'
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
            {this.showError() ?
            (<Box className={styles.error}>
                {this.state.error}
            </Box>): null }
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
    onRequestSuccess: PropTypes.func.isRequired,
};

export default SigninComponent;
