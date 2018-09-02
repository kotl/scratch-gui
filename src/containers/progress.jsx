import {defineMessages, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';

import Box from '../components/box/box.jsx';
import Modal from '../containers/modal.jsx';

import styles from './progress.css';
import { PacmanLoader } from 'react-spinners';

class Progress extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            'onClose',
        ]);
    }

    onClose() {
        // Proceed in case error is shown
        if (this.props.progressError) {
            this.props.onRequestClose();                                    
        }
    }


    render () { 
    return (<Modal
        id='progressDialog'
        className={styles.modalContent}
        contentLabel='Please wait...'
        onRequestClose={this.onClose}
        onClick={this.onClose}
    >
        <Box className={styles.body}>
          {this.props.progressError ? 
            (<Box className={styles.error}>
                {this.props.progressError}
            </Box>):(
                <div>
          <Box className={styles.label}>
            <div>{this.props.progressDescription}</div>
          </Box>
          <Box className={styles.progress}>
            <PacmanLoader sizeUnit={"px"}
          size={40} color="#4fff95"/>
          </Box> </div>)
          }
        </Box>
    </Modal>);
  }
}

Progress.propTypes = {
    progressDescription: PropTypes.string,
    progressError: PropTypes.string,
    onRequestClose: PropTypes.func,
};

export default Progress;
