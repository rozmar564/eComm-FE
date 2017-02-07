import React, { PropTypes, Component } from 'react';
import Cart from './Cart';

class CartWrapper extends Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    addQuantity: PropTypes.func.isRequired,
    subQuantity: PropTypes.func.isRequired,
    cartItems: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    updateCart: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    isError: PropTypes.bool.isRequired,
    updateQuantity: PropTypes.func.isRequired,
    applyPromoCode: PropTypes.func.isRequired,
  }

  /*
    * Set default action for server side renderring.
    * All the actions comes from Redux, client side.
  */
  static defaultProps = {
    onLogout: () => (true),
    onLogin: () => (true),
    removeItem: () => (true),
    addQuantity: () => (true),
    subQuantity: () => (true),
    updateCart: () => (true),
    updateQuantity: () => (true),
    applyPromoCode: () => (true),
    isError: false,
    messages: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      showCouponFields: false,
      showLoginFields: false,
      className: 'hide',
      loginClassName: 'hide',
    };
  }

  handleGiftCard = (e) => {
    e.preventDefault();
    this.setState({
      showCouponFields: !this.state.showCouponFields,
      className: !this.state.showCouponFields ? 'show' : 'hide',
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.setState({
      showLoginFields: !this.state.showLoginFields,
      loginClassName: !this.state.showLoginFields ? 'show' : 'hide',
    });
  };


  render() {
    return (
      <Cart
        removeItem={this.props.removeItem}
        addQuantity={this.props.addQuantity}
        subQuantity={this.props.subQuantity}
        cartItems={this.props.cartItems}
        loggedIn={this.props.loggedIn}
        couponClass={this.state.className}
        handleLogin={this.handleLogin}
        loginClass={this.state.loginClassName}
        onLogout={this.props.onLogout}
        onLogin={this.props.onLogin}
        handleGiftCard={this.handleGiftCard}
        messages={this.props.messages}
        isError={this.props.isError}
        applyPromoCode={this.props.applyPromoCode}
        updateCart={this.props.updateCart}
        updateQuantity={this.props.updateQuantity}
      />
    );
  }
}

export default CartWrapper;
