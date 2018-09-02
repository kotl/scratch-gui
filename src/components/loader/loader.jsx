import React from 'react';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import {injectIntl, intlShape, defineMessages} from 'react-intl';

import {FormattedMessage} from 'react-intl';
import styles from './loader.css';

import topBlock from './top-block.svg';
import middleBlock from './middle-block.svg';
import bottomBlock from './bottom-block.svg';

import LibraryComponent from '../../components/library/library.jsx';

import {connect} from 'react-redux';

import {
    openProgressDialog,
    closeProgressDialog,
    openLoadingProject,
    closeLoadingProject
} from '../../reducers/modals';

import {setProjectId, setProjectName, setProgressDescription, setProgressError} from '../../reducers/profile';
import xhr from 'xhr';

const messages = [
    {
        message: (
            <FormattedMessage
                defaultMessage="Creating blocks …"
                description="One of the loading messages"
                id="gui.loader.message1"
            />
        ),
        weight: 50
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Loading sprites …"
                description="One of the loading messages"
                id="gui.loader.message2"
            />
        ),
        weight: 50
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Loading sounds …"
                description="One of the loading messages"
                id="gui.loader.message3"
            />
        ),
        weight: 50
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Loading extensions …"
                description="One of the loading messages"
                id="gui.loader.message4"
            />
        ),
        weight: 50
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Creating blocks …"
                description="One of the loading messages"
                id="gui.loader.message1"
            />
        ),
        weight: 20
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Herding cats …"
                description="One of the loading messages"
                id="gui.loader.message5"
            />
        ),
        weight: 1
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Transmitting nanos …"
                description="One of the loading messages"
                id="gui.loader.message6"
            />
        ),
        weight: 1
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Inflating gobos …"
                description="One of the loading messages"
                id="gui.loader.message7"
            />
        ),
        weight: 1
    },
    {
        message: (
            <FormattedMessage
                defaultMessage="Preparing emojis …"
                description="One of the loading messages"
                id="gui.loader.message8"
            />
        ),
        weight: 1
    }
];

class LoaderComponent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            messageNumber: 0
        };
    }
    componentDidMount () {
        this.chooseRandomMessage();

        // Start an interval to choose a new message every 5 seconds
        this.intervalId = setInterval(() => {
            this.chooseRandomMessage();
        }, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
        if (window.location.hash.startsWith("#project")) {
            const id = window.location.hash.replace('#project','');
            window.location.hash = '';
            this.props.openLoadingState();
            const me = this;
            xhr({
                method: 'GET',
                uri: '/api/template/' + id,
                body: '',
                json: false,
                responseType: 'arraybuffer',
            }, (error, response) => {
                const hasError = error || response.statusCode !== 200;
                if (error || response.statusCode !== 200) {
                    // TODO: i18n:
                    this.props.closeLoadingState();
                    this.props.openProgressDialog();
                    this.props.setProgressError('Loading template project failed. May be it does not exist?');
                    setTimeout(() => {
                        this.props.closeProgressDialog();
                    }, 5000);
                    return;
                }
                const title = response.headers['project-title'];
                me.props.setProjectId('');
                me.props.setProjectName(title);
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
    }
    chooseRandomMessage () {
        let messageNumber;
        const sum = messages.reduce((acc, m) => acc + m.weight, 0);
        let rand = sum * Math.random();
        for (let i = 0; i < messages.length; i++) {
            rand -= messages[i].weight;
            if (rand <= 0) {
                messageNumber = i;
                break;
            }
        }
        this.setState({messageNumber});
    }
    render () {
        return (
            <div className={styles.background}>
                <div className={styles.container}>
                    <div className={styles.blockAnimation}>
                        <img
                            className={styles.topBlock}
                            src={topBlock}
                        />
                        <img
                            className={styles.middleBlock}
                            src={middleBlock}
                        />
                        <img
                            className={styles.bottomBlock}
                            src={bottomBlock}
                        />
                    </div>
                    <h1 className={styles.title}>
                        <FormattedMessage
                            defaultMessage="Loading Project"
                            description="Main loading message"
                            id="gui.loader.headline"
                        />
                    </h1>
                    <div className={styles.messageContainerOuter}>
                        <div
                            className={styles.messageContainerInner}
                            style={{transform: `translate(0, -${this.state.messageNumber * 25}px)`}}
                        >
                            {messages.map((m, i) => (
                                <div
                                    className={styles.message}
                                    key={i}
                                >
                                    {m.message}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

LoaderComponent.propTypes = {
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
)(LoaderComponent));
