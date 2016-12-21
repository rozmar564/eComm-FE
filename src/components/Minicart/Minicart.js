import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Minicart.css';
import Link from '../Link';

class Minicart extends React.Component {
  static propTypes = {
    cartItems: PropTypes.object.isRequired,
    cartClass: PropTypes.string.isRequired,
  }
  render = () => {
    const cart = this.props.cartItems;
    return (
      <div className={cx(s.minicart, s[this.props.cartClass])}>
        <div className={s.cartcontent}>
          <p className={s.carttitle}>
            <span className={s.count}>{cart.total_quantity}</span> items in your cart
          </p>
          <div>
            <ul className={s.cartlist}>
              { cart.line_items.map((item) => (
                <li className={s.cartitem} key={item.id}>
                  <Link className={s.plink} to={`product/${item.variant.slug}`}>
                    <img
                      className={s.pimage}
                      src={item.variant.images[0].small_url}
                      alt={item.variant.name}
                    />
                    <span className={s.pname}>{item.variant.name}</span>
                    <span className={s.pprice}>
                      Price: <span>{item.display_amount}</span>
                    </span>
                    <span className={s.pquantity}>Quantity: {item.quantity}</span>
                  </Link>
                </li>))}
            </ul>
            <p className={s.total}>
              <strong>Subtotal:</strong><span className={s.amount}>{cart.display_item_total}</span>
            </p>
            <p className={s.buttons}>
              <Link to="/cart" className={cx(s.button, s.view)}>View Cart</Link>
              <Link to="/checkout" className={cx(s.button, s.checkout)}>Checkout</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Minicart);