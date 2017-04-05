import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import BasePageComponent from '../../BasePageComponent';
import Checkout from '../../../components/Checkout';
import Review from './Review';

// Actions
import { setHeaderProps, resetMessages, toggleLoader, toggleModal } from '../../../actions/page';
import { applyPromoCode } from '../../../actions/order';
import { onLogin, onLogout } from '../../../actions/user';
import { completePayPal } from '../../../actions/checkout';
import { forwardTo } from '../../../actions/handler';
import { confirmOrder } from '../../../actions/payment/payment';
import { checkCartState } from '../../../utils/utils';

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

  componentWillMount = () => {
    // Set the header styles
    this.setHeaderStyles();
    // This actions should happen only if the cart
    // is already loaded
    if (this.props.cartItems.isLoaded) {
      const expectedState = checkCartState(this.props);
      if (['checkout/promo', 'checkout/review'].includes(expectedState)) {
        setTimeout(() => {
          this.props.toggleLoader(false);
        }, 500);
      } else {
        forwardTo(expectedState);
      }
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.isCartPending && !nextProps.isPending && nextProps.cartItems.isLoaded) {
      const expectedState = checkCartState(nextProps);
      if (['checkout/promo', 'checkout/review'].includes(expectedState)) {
        setTimeout(() => {
          this.props.toggleLoader(false);
        }, 500);
      } else {
        forwardTo(expectedState);
      }
    }
  };

  componentWillUnmount = () => {
    this.props.toggleLoader(true);
    this.props.resetMessages();
  };

  /**
   * Helper Method to set the active nav item
   * and header styles
   */
  setHeaderStyles = () => {
    const props = {
      headerClass: 'colored',
      activeSlug: '/my-account'
    };
    this.props.setHeaderProps(props);
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
    if (this.props.cartItems.isLoaded) {
      return (
        <Checkout
          state={this.props.cartItems.cart.state}
          content="review"
          isPayPal={this.props.isPayPal}
          loggedIn={this.props.loggedIn}
          breadcrumbs={this.props.route.breadcrumbs}
          messages={this.props.messages}
          isError={this.props.isError}
          forwardTo={forwardTo}
          onLogout={this.props.onLogout}
          onLogin={this.props.onLogin}
          applyPromoCode={this.props.applyPromoCode}
        >
          <Review
            cartItems={this.props.cartItems}
            isPayPal={this.props.isPayPal}
            checkoutPayPal={this.checkoutPayPal}
            checkoutSquare={this.checkoutSquare}
            confirmOrder={this.confirmOrder}
          />
        </Checkout>
      );
    }
    return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewWrapper);

