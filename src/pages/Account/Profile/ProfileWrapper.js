import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash.isempty';
import { browserHistory } from 'react-router';

import BasePageComponent from '../../BasePageComponent';
import Profile from './Profile';

// Action
import { onLogout, getProfile, updateProfile } from '../../../actions/user';
import { setHeaderProps, resetMessages, toggleLoader } from '../../../actions/page';

const mapStateToProps = ((state) => (
  {
    loggedIn: state.user.loggedIn,
    profile: state.user.profile,
    messages: state.page.messages,
    isError: state.page.isError
  }
));

const mapDispatchToProps = ((dispatch) => (
  {
    setHeaderProps: (props) => dispatch(setHeaderProps(props)),
    toggleLoader: (toggle) => dispatch(toggleLoader(toggle)),
    onLogout: () => dispatch(onLogout()),
    resetMessages: () => dispatch(resetMessages()),
    getProfile: () => dispatch(getProfile()),
    updateProfile: (data) => dispatch(updateProfile(data))
  }
));


class ProfileWrapper extends BasePageComponent {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
    setHeaderProps: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    route: PropTypes.object,
    getProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    isError: PropTypes.bool.isRequired
  }

  componentWillMount = () => {
    if (!this.props.loggedIn) {
      browserHistory.push('/my-account');
    }
    const props = {
      headerClass: 'colored',
      activeSlug: '/my-account'
    };
    this.props.setHeaderProps(props);
    if (isEmpty(this.props.profile)) {
      this.props.getProfile();
    }
  }

  componentDidMount = () => {
    setTimeout(() => {
      this.props.toggleLoader(false);
    }, 500);
  }

  componentWillUnmount = () => {
    console.log('remove');
    this.props.toggleLoader(true);
  }

  render() {
    return (
      <Profile
        profile={this.props.profile}
        loggedIn={this.props.loggedIn}
        onLogout={this.props.onLogout}
        onUpdateProfile={this.props.updateProfile}
        breadcrumbs={this.props.route.breadcrumbs}
        messages={this.props.messages}
        isError={this.props.isError}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileWrapper);

