import classNames from 'classnames';
import {connect} from 'react-redux';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';

import Signin from '../../containers/signin.jsx';
import ProjectName from '../../containers/project-name.jsx';
import NewProject from '../../containers/new-project.jsx';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import ProjectLoader from '../../containers/project-loader.jsx';
import Menu from '../../containers/menu.jsx';
import {MenuItem, MenuSection} from '../menu/menu.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';

import {openTipsLibrary} from '../../reducers/modals';
import {setPlayer} from '../../reducers/mode';
import {
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
} from '../../reducers/menus';

import {
    openSigninDialog,
    closeSigninDialog,
} from '../../reducers/modals';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import mystuffIcon from './icon--mystuff.png';
import feedbackIcon from './icon--feedback.svg';
import profileIcon from './icon--profile.png';
import communityIcon from './icon--see-community.svg';
import dropdownCaret from '../language-selector/dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';

import scratchLogo from './scratch-logo.svg';

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu'
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

const MenuItemTooltip = ({id, isRtl, children, className}) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool
};

const MenuBarMenu = ({
    children,
    onRequestClose,
    open,
    place = 'right'
}) => (
    <Menu
        className={styles.menu}
        open={open}
        place={place}
        onRequestClose={onRequestClose}
    >
        {children}
    </Menu>
);

MenuBarMenu.propTypes = {
    children: PropTypes.node,
    onRequestClose: PropTypes.func,
    open: PropTypes.bool,
    place: PropTypes.oneOf(['left', 'right'])
};
class MenuBar extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleLanguageMouseUp',
            'handleRestoreOption',
            'restoreOptionMessage',
        ]);
    }
    handleLanguageMouseUp (e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    handleRestoreOption (restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    restoreOptionMessage (deletedItem) {
        switch (deletedItem) {
        case 'Sprite':
            return (<FormattedMessage
                defaultMessage="Restore Sprite"
                description="Menu bar item for restoring the last deleted sprite."
                id="gui.menuBar.restoreSprite"
            />);
        case 'Sound':
            return (<FormattedMessage
                defaultMessage="Restore Sound"
                description="Menu bar item for restoring the last deleted sound."
                id="gui.menuBar.restoreSound"
            />);
        case 'Costume':
            return (<FormattedMessage
                defaultMessage="Restore Costume"
                description="Menu bar item for restoring the last deleted costume."
                id="gui.menuBar.restoreCostume"
            />);
        default: {
            return (<FormattedMessage
                defaultMessage="Restore"
                description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                id="gui.menuBar.restore"
            />);
        }
        }
    }
    render () {
        return (
            <Box className={styles.menuBar}>
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <div className={classNames(styles.menuBarItem)}>
                            <a
                                href="https://scratch.mit.edu"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <img
                                    alt="Scratch"
                                    className={styles.scratchLogo}
                                    draggable={false}
                                    src={scratchLogo}
                                />
                            </a>
                        </div>
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, styles.languageMenu)}
                        >
                            <div>
                                <img
                                    className={styles.languageIcon}
                                    src={languageIcon}
                                />
                                <img
                                    className={styles.languageCaret}
                                    src={dropdownCaret}
                                />
                            </div>
                            <LanguageSelector label={this.props.intl.formatMessage(ariaMessages.language)} />
                        </div>
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, {
                                [styles.active]: this.props.fileMenuOpen
                            })}
                            onMouseUp={this.props.onClickFile}
                        >
                            <div className={classNames(styles.fileMenu)}>
                                <FormattedMessage
                                    defaultMessage="File"
                                    description="Text for file dropdown menu"
                                    id="gui.menuBar.file"
                                />
                            </div>
                            <MenuBarMenu
                                open={this.props.fileMenuOpen}
                                place={this.props.isRtl ? 'left' : 'right'}
                                onRequestClose={this.props.onRequestCloseFile}
                            >
                                <NewProject
                                    id="new"
                                    isRtl={this.props.isRtl}>
                                </NewProject>
                                <MenuSection>
                                    <MenuItemTooltip
                                        id="save"
                                        isRtl={this.props.isRtl}
                                    >
                                        <MenuItem>
                                            <FormattedMessage
                                                defaultMessage="Save now"
                                                description="Menu bar item for saving now"
                                                id="gui.menuBar.saveNow"
                                            />
                                        </MenuItem>
                                    </MenuItemTooltip>
                                    <MenuItemTooltip
                                        id="copy"
                                        isRtl={this.props.isRtl}
                                    >
                                        <MenuItem>
                                            <FormattedMessage
                                                defaultMessage="Save as a copy"
                                                description="Menu bar item for saving as a copy"
                                                id="gui.menuBar.saveAsCopy"
                                            /></MenuItem>
                                    </MenuItemTooltip>
                                </MenuSection>
                                <MenuSection>
                                    <ProjectLoader>{(renderFileInput, loadProject, loadProps) => (
                                        <MenuItem
                                            onClick={loadProject}
                                            {...loadProps}
                                        >
                                            <FormattedMessage
                                                defaultMessage="Load from your computer"
                                                description="Menu bar item for uploading a project from your computer"
                                                id="gui.menuBar.uploadFromComputer"
                                            />
                                            {renderFileInput()}
                                        </MenuItem>
                                    )}</ProjectLoader>
                                    <ProjectSaver>{(saveProject, saveProps) => (
                                        <MenuItem
                                            onClick={saveProject}
                                            {...saveProps}
                                        >
                                            <FormattedMessage
                                                defaultMessage="Save to your computer"
                                                description="Menu bar item for downloading a project to your computer"
                                                id="gui.menuBar.downloadToComputer"
                                            />
                                        </MenuItem>
                                    )}</ProjectSaver>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                        <div
                            className={classNames(styles.menuBarItem, styles.hoverable, {
                                [styles.active]: this.props.editMenuOpen
                            })}
                            onMouseUp={this.props.onClickEdit}
                        >
                            <div className={classNames(styles.editMenu)}>
                                <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                />
                            </div>
                            <MenuBarMenu
                                open={this.props.editMenuOpen}
                                place={this.props.isRtl ? 'left' : 'right'}
                                onRequestClose={this.props.onRequestCloseEdit}
                            >
                                <DeletionRestorer>{(handleRestore, {restorable, deletedItem}) => (
                                    <MenuItem
                                        className={classNames({[styles.disabled]: !restorable})}
                                        onClick={this.handleRestoreOption(handleRestore)}
                                    >
                                        {this.restoreOptionMessage(deletedItem)}
                                    </MenuItem>
                                )}</DeletionRestorer>
                                <MenuSection>
                                    <TurboMode>{(toggleTurboMode, {turboMode}) => (
                                        <MenuItem onClick={toggleTurboMode}>
                                            {turboMode ? (
                                                <FormattedMessage
                                                    defaultMessage="Turn off Turbo Mode"
                                                    description="Menu bar item for turning off turbo mode"
                                                    id="gui.menuBar.turboModeOff"
                                                />
                                            ) : (
                                                <FormattedMessage
                                                    defaultMessage="Turn on Turbo Mode"
                                                    description="Menu bar item for turning on turbo mode"
                                                    id="gui.menuBar.turboModeOn"
                                                />
                                            )}
                                        </MenuItem>
                                    )}</TurboMode>
                                </MenuSection>
                            </MenuBarMenu>
                        </div>
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    <div
                        aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                        className={classNames(styles.menuBarItem, styles.hoverable)}
                        onClick={this.props.onOpenTipLibrary}
                    >
                        <img
                            className={styles.helpIcon}
                            src={helpIcon}
                        />
                        <FormattedMessage {...ariaMessages.tutorials} />
                    </div>
                    <Divider className={classNames(styles.divider)} />
                    <div className={classNames(styles.menuBarItem)}>
                            <ProjectName
                                className={classNames(styles.titleField)}
                                id="project-name"
                            />
                    </div>
                </div>
                <div className={classNames(styles.menuBarItem, styles.feedbackButtonWrapper)}>
                    <a
                        className={styles.feedbackLink}
                        href="https://scratch.mit.edu/discuss/topic/312261/"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <Button
                            className={styles.feedbackButton}
                            iconSrc={feedbackIcon}
                        >
                            <FormattedMessage
                                defaultMessage="Give Feedback"
                                description="Label for feedback form modal button"
                                id="gui.menuBar.giveFeedback"
                            />
                        </Button>
                    </a>
                </div>
                <div className={styles.accountInfoWrapper}>
                      <Button 
                          id="account-nav"
                          onClick={this.props.onSignin}
                          place={this.props.isRtl ? 'right' : 'left'}
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                styles.accountNavMenu
                            )}
                        >
                                     {this.props.username === '' ?
                                     (<FormattedMessage 
                                       defaultMessage="Sign in"
                                       description="Label for login in buton"
                                       id="gui.menuBar.signin"
                                       onClick={
                                         this.props.onSignin
                                     }
                                      />) :
                                      (<span>{this.props.username}</span>)
                                      }     
                        </Button>
                </div>
            </Box>
        );
    }
}

MenuBar.propTypes = {
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    username: PropTypes.string,
    languageMenuOpen: PropTypes.bool,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onSignin: PropTypes.func,
};

const mapStateToProps = state => ({
    fileMenuOpen: fileMenuOpen(state),
    editMenuOpen: editMenuOpen(state),
    isRtl: state.locales.isRtl,
    languageMenuOpen: languageMenuOpen(state),
    username: state.scratchGui.profile.username,
});

const mapDispatchToProps = dispatch => ({
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    onSignin: () => dispatch(openSigninDialog()),
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar));
