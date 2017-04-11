import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import BasePageComponent from '../../BasePageComponent';
import Dashboard from './Dashboard';

// Action
import { onLogout, getProfile, redeemGiftCard, getStoreCredit } from '../../../actions/user';
import { getAddress } from '../../../actions/address';
import { setHeaderProps, resetMessages, toggleLoader } from '../../../actions/page';
import { getAllOrders } from '../../../actions/order';

const mapStateToProps = ((state) => (
  {
    loggedIn: state.user.loggedIn,
    shipping: state.address.shipping,
    billing: state.address.billing,
    orders: state.orders.orders,
    messages: state.page.messages,
    isError: state.page.isError,
    profile: state.user.profile,
    creditInfo: state.user.creditInfo
  }
));

const mapDispatchToProps = ((dispatch) => (
  {
    setHeaderProps: (props) => dispatch(setHeaderProps(props)),
    toggleLoader: (props) => dispatch(toggleLoader(props)),
    onLogout: () => dispatch(onLogout()),
    getAddress: () => dispatch(getAddress()),
    resetMessages: () => dispatch(resetMessages()),
    getAllOrders: () => dispatch(getAllOrders()),
    getProfile: () => dispatch(getProfile()),
    onRedeemGiftCard: (code) => dispatch(redeemGiftCard(code)),
    getStoreCredit: () => dispatch(getStoreCredit())
  }
));

class DashboardWrapper extends BasePageComponent {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    shipping: PropTypes.object.isRequired,
    billing: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired,
    setHeaderProps: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    getAddress: PropTypes.func.isRequired,
    getAllOrders: PropTypes.func.isRequired,
    orders: PropTypes.object.isRequired,
    messages: PropTypes.array.isRequired,
    isError: PropTypes.bool.isRequired,
    resetMessages: PropTypes.func.isRequired,
    route: PropTypes.object,
    profile: PropTypes.object.isRequired,
    onRedeemGiftCard: PropTypes.func.isRequired,
    getStoreCredit: PropTypes.func.isRequired,
    creditInfo: PropTypes.object.isRequired
  };

  componentWillMount = () => {
    window.scrollTo(0, 0);
    if (!this.props.loggedIn) {
      browserHistory.push('/my-account');
    }
    const props = {
      headerClass: 'colored',
      activeSlug: '/my-account'
    };
    this.props.setHeaderProps(props);
    if (!this.props.shipping.isLoaded && !this.props.billing.isLoaded) {
      this.props.getAddress();
    }
    if (!this.props.orders.isLoaded) {
      this.props.getAllOrders();
    }
    if (!this.props.profile.isLoaded) {
      this.props.getProfile();
    }
    if (!this.props.creditInfo.isLoaded) {
      this.props.getStoreCredit();
    }
  };

  componentDidMount = () => {
    const billingLoaded = this.props.billing.isLoaded;
    const shippingLoaded = this.props.shipping.isLoaded;
    if (billingLoaded && shippingLoaded) {
      setTimeout(() => {
        this.props.toggleLoader(false);
      }, 500);
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const billingLoaded = nextProps.billing.isLoaded;
    const shippingLoaded = nextProps.shipping.isLoaded;
    const profileLoaded = nextProps.profile.isLoaded;
    if (profileLoaded && billingLoaded && shippingLoaded) {
      setTimeout(() => {
        this.props.toggleLoader(false);
      }, 250);
    }
  };

  componentWillUnmount = () => {
    this.props.toggleLoader(true);
    this.props.resetMessages();
  };

  onLogout = (event) => {
    event.preventDefault();
    this.props.onLogout();
  };

  render() {
    if (!this.props.profile.isLoaded) {
      return null;
    }
    const addresses = {
      shippAddress: this.props.shipping,
      billAddress: this.props.billing
    };
    const orders = this.props.orders;
    return (
      <Dashboard
        loggedIn={this.props.loggedIn}
        onLogout={this.onLogout}
        addresses={addresses}
        orders={orders}
        messages={this.props.messages}
        isError={this.props.isError}
        breadcrumbs={this.props.route.breadcrumbs}
        profile={this.props.profile}
        resetMessages={this.props.resetMessages}
        onRedeemGiftCard={this.props.onRedeemGiftCard}
        creditInfo={this.props.creditInfo}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWrapper);
