import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import BasePageComponent from '../../BasePageComponent';
import Checkout from '../../../components/Checkout';
import Review from './Review';

// Actions
import { setHeaderProps, resetMessages, toggleLoader, toggleModal } from '../../../actions/page';
import { getCart } from '../../../actions/order';
import { onLogin, onLogout } from '../../../actions/user';
import { forwardTo } from '../../../actions/handler';
import { confirmOrder, confirmOrderNext, checkoutReset, makeToggleCreditRequest } from '../../../actions/payment/payment';
import { checkCartState } from '../../../utils/utils';

const mapDispatchToProps = ((dispatch) => (
  {
    setHeaderProps: (props) => dispatch(setHeaderProps(props)),
    toggleLoader: (toggle) => dispatch(toggleLoader(toggle)),
    toggleModal: (toggle) => dispatch(toggleModal(toggle)),
    onLogin: (data, checkout) => dispatch(onLogin(data, checkout)),
    onLogout: () => dispatch(onLogout()),
    resetMessages: () => dispatch(resetMessages()),
    confirmOrderNext: () => dispatch(confirmOrderNext()),
    checkoutReset: () => dispatch(checkoutReset()),
    getCart: (data) => dispatch(getCart(data)),
    confirmOrder: (useCredits, isCovered) => (dispatch(confirmOrder(useCredits, isCovered))),
    makeToggleCreditRequest: (value) => dispatch(makeToggleCreditRequest(value))
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
    isStoreCredit: state.checkout.isStoreCredit,
    canUseStoreCredit: state.checkout.canUseStoreCredit,
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
    isPayPal: PropTypes.bool.isRequired,
    isStoreCredit: PropTypes.bool.isRequired,
    canUseStoreCredit: PropTypes.bool.isRequired,
    confirmOrderNext: PropTypes.func.isRequired,
    isPending: PropTypes.bool.isRequired,
    isCartPending: PropTypes.bool.isRequired,
    getCart: PropTypes.func.isRequired,
    route: PropTypes.object,
    checkoutReset: PropTypes.func.isRequired
  };

  componentWillMount = () => {
    // Set the header styles
    this.setHeaderStyles();
    // This actions should happen only if the cart
    // is already loaded
    if (!this.props.cartItems.isCartPending) {
      this.props.getCart(false);
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.isCartPending && !nextProps.isPending && nextProps.cartItems.isLoaded) {
      const expectedState = checkCartState(nextProps);
      if (['checkout/promo', 'checkout/review'].includes(expectedState)) {
        // const useCredits = useStoreCredits({
        //   payments: nextProps.cartItems.cart.payments,
        //   isPayPal: nextProps.isPayPal
        // });
        // this.setState({ useCredits });
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

  checkoutSquare = (e) => {
    e.preventDefault();
    this.props.toggleModal(true);
  };

  confirmOrder = (e) => {
    e.preventDefault();
    const { covered_by_store_credit } = this.props.cartItems.cart;
    const { isStoredCredit, isPayPal } = this.props;
    const coveredByCredit = isStoredCredit && covered_by_store_credit;
    if (coveredByCredit || isPayPal) {
      return this.props.confirmOrderNext();
    }
    return this.props.confirmOrder();
  };

  toggleUseCredits = (event) => {
    console.log(event.target.checked);
    this.props.makeToggleCreditRequest(event.target.checked);
  };

  onLogin = (data) => {
    this.props.toggleLoader(true);
    this.props.resetMessages();
    this.props.onLogin(data, true);
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
          onLogin={this.onLogin}
          applyPromoCode={this.props.applyPromoCode}
        >
          <Review
            cartItems={this.props.cartItems}
            isPayPal={this.props.isPayPal}
            checkoutSquare={this.checkoutSquare}
            confirmOrder={this.confirmOrder}
            toggleUseCredits={this.toggleUseCredits}
            isStoreCredit={this.props.isStoreCredit}
            canUseStoreCredit={this.props.canUseStoreCredit}
            checkoutReset={this.props.checkoutReset}
            makeToggleCreditRequest={this.props.makeToggleCreditRequest}
          />
        </Checkout>
      );
    }
    return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewWrapper);

