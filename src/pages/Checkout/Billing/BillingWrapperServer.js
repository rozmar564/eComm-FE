import React, { PropTypes } from 'react';
import Checkout from '../../../components/Checkout';
import Billing from './Billing';

class BillingWrapper extends React.Component {

  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    isError: PropTypes.bool.isRequired,
    addresses: PropTypes.object.isRequired,
    cartItems: PropTypes.object.isRequired,
    isPayPal: PropTypes.bool.isRequired,
    breadcrumbs: PropTypes.array
  };

  static defaultProps = {
    messages: [],
    isError: false
  };

  /**
   * Helper method to identify
   * the content type shown
   * @param props
   * @returns {*}
   */
  getBillingContent = (props) => {
    const { loggedIn, addresses } = props;
    return (addresses.isEmpty || !loggedIn) ? 'form' : 'list';
  };

  /**
   * Get selected address from user addresses
   * @param id
   * @param email
   * @returns object
   */
  /**
   * Returns the customer default address
   * @returns {number}
   */
  getDefaultAddressId = () => {
    const { addresses } = this.props;
    const address = addresses.addresses.find((elem) => elem.isBilling);
    return address ? address.id : 0;
  };

  /**
   * Returns the customer email address used in order
   * @returns {string}
   */
  getEmailAddress = () => {
    const { cartItems } = this.props;
    return cartItems.cart.email || '';
  };

  /**
   * Get when the cancel button should be show
   * @returns {boolean}
   */
  getShowCancel = () => {
    const { addresses, loggedIn } = this.props;
    const content = this.getBillingContent(this.props);
    return (content === 'form' && loggedIn && !addresses.isEmpty);
  };

  render() {
    const selectedAddress = this.getDefaultAddressId();
    const emailAddress = this.getEmailAddress();
    const showCancel = this.getShowCancel();

    return (
      <Checkout
        state={this.props.cartItems.cart.state}
        content="billing"
        isPayPal={this.props.isPayPal}
        loggedIn={this.props.loggedIn}
        breadcrumbs={this.props.breadcrumbs}
        messages={this.props.messages}
        isError={this.props.isError}
        forwardTo={() => (true)}
        onLogout={() => (true)}
        onLogin={() => (true)}
        applyPromoCode={() => (true)}
      >
        <Billing
          content={this.state.content}
          emailAddress={emailAddress}
          addresses={this.props.addresses.addresses}
          selectedAddress={selectedAddress}
          onSubmit={() => (true)}
          toggleContent={() => (true)}
          showCancel={showCancel}
        />
      </Checkout>
    );
  }
}

export default BillingWrapper;

