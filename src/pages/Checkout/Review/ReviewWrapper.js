import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { CHECKOUT_TABS } from '../../../constants/AppConsts';
import BasePageComponent from '../../BasePageComponent';
import Review from './Review';

// Actions
import { setHeaderProps, resetMessages, toggleLoader, toggleModal } from '../../../actions/page';
import { applyPromoCode } from '../../../actions/order';
import { onLogin, onLogout } from '../../../actions/user';
import { completePayPal } from '../../../actions/checkout';
import { forwardTo } from '../../../actions/handler';
import { confirmOrder } from '../../../actions/payment/payment';

const mapDispatchToProps = ((dispatch) => (
  {
    setHeaderProps: (props) => dispatch(setHeaderProps(props)),
    toggleLoader: (toggle) => dispatch(toggleLoader(toggle)),
    toggleModal: (toggle) => dispatch(toggleModal(toggle)),
    onLogin: (data) => dispatch(onLogin(data)),
    onLogout: () => dispatch(onLogout()),
    resetMessages: () => dispatch(resetMessages()),
    applyPromoCode: (cart) => dispatch(applyPromoCode(cart)),
    completePayPal: () => dispatch(completePayPal()),
    confirmOrder: () => (dispatch(confirmOrder()))
  }
));

const mapStateToProps = ((state) => (
  {
    cartItems: state.cart.cartItems,
    isCartPending: state.cart.isCartPending,
    loggedIn: state.user.loggedIn,
    messages: state.page.messages,
    isError: state.page.isError,
    isPayPal: state.checkout.isPayPal,
    isPending: state.page.isPending
  }
));

class ReviewWrapper extends BasePageComponent {

  static propTypes = {
    setHeaderProps: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    cartItems: PropTypes.object.isRequired,
    onLogin: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    isError: PropTypes.bool.isRequired,
    applyPromoCode: PropTypes.func.isRequired,
    isPayPal: PropTypes.bool.isRequired,
    completePayPal: PropTypes.func.isRequired,
    isPending: PropTypes.bool.isRequired,
    isCartPending: PropTypes.bool.isRequired,
    route: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      content: 'review',
      showCouponFields: false,
      couponClassName: 'hide',
      message: PropTypes.string,
      isError: PropTypes.bool,
      showLoginFields: false,
      loginClassName: 'hide'
    };
  }

  componentWillMount = () => {
    const props = {
      headerClass: 'colored',
      activeSlug: '/my-account'
    };
    this.props.setHeaderProps(props);
    if (!this.props.isCartPending && this.props.cartItems.isEmpty) {
      browserHistory.push('/cart');
    }
  };

  componentDidMount = () => {
    setTimeout(() => {
      this.props.toggleLoader(false);
    }, 500);
  };

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.isCartPending && !nextProps.isPending && nextProps.cartItems) {
      setTimeout(() => {
        this.props.toggleLoader(false);
      }, 250);
    }
  };

  componentWillUnmount = () => {
    this.props.toggleLoader(true);
    this.props.resetMessages();
  };

  clickTab = (e) => {
    e.preventDefault();
    const target = e.target.id;
    forwardTo(`checkout/${target}`);
  };

  handleGiftCard = (e) => {
    e.preventDefault();
    this.setState({
      showCouponFields: !this.state.showCouponFields,
      couponClassName: !this.state.showCouponFields ? 'show' : 'hide'
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.setState({
      showLoginFields: !this.state.showLoginFields,
      loginClassName: !this.state.showLoginFields ? 'show' : 'hide'
    });
  };

  checkoutPayPal = (e) => {
    e.preventDefault();
    this.props.toggleLoader(true);
    this.props.completePayPal();
  };

  checkoutSquare = (e) => {
    e.preventDefault();
    this.props.toggleModal(true);
  };

  confirmOrder = (e) => {
    e.preventDefault();
    this.props.confirmOrder();
  };

  render() {
    if (!this.props.cartItems.isLoaded) {
      return null;
    }
    return (
      <Review
        cartItems={this.props.cartItems}
        loggedIn={this.props.loggedIn}
        onLogin={this.props.onLogin}
        onLogout={this.props.onLogout}
        handleGiftcard={this.handleGiftCard}
        couponClass={this.state.couponClassName}
        clickTab={this.clickTab}
        content={this.state.content}
        messages={this.props.messages}
        isError={this.props.isError}
        applyPromoCode={this.props.applyPromoCode}
        contentTabs={CHECKOUT_TABS}
        isPayPal={this.props.isPayPal}
        checkoutPayPal={this.checkoutPayPal}
        checkoutSquare={this.checkoutSquare}
        confirmOrder={this.confirmOrder}
        breadcrumbs={this.props.route.breadcrumbs}
        loginClass={this.state.loginClassName}
        handleLogin={this.handleLogin}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewWrapper);

