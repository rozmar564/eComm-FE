import { NAV, ORDER_STATES } from '../constants/AppConsts';

function setNavigation(slug) {
  const navItems = [...NAV];
  Array.from(navItems).map((item) => (item.isActive = (slug === item.slug)));
  return navItems;
}

// Helper function - used to set order state
function getOrderStatus(state, refunded, shipment) {
  if (refunded || state === 'canceled') {
    return 'Canceled';
  }
  return ORDER_STATES[shipment] || '';
}

/**
 * Check and return the expected checkout step
 * based on cart state and payment method
 */
function checkCartState(props) {
  const { cartItems, isPayPal } = props;
  const state = cartItems.cart.state;
  let step;
  switch (state) {
    case 'cart':
      step = 'cart';
      break;
    case 'delivery':
      step = isPayPal ? 'checkout/review' : 'checkout/shipping';
      break;
    case 'payment':
      step = 'checkout/review';
      break;
    case 'confirm':
      step = 'checkout/review';
      break;
    default:
      step = 'checkout/billing';
      break;
  }
  return step;
}

/**
 * Helper method to determine if PayPal is used as payment method
 * @param cart
 * @returns {boolean}
 */
function checkIfPayPal(cart) {
  const paypal = cart.payments.find(({ payment_method, state }) => (state !== 'invalid' && payment_method.name === 'Paypal'));
  return Boolean(paypal);
}

export { setNavigation, getOrderStatus, checkCartState, checkIfPayPal };

