import React, { PropTypes, Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AddToCart.css';
// Components
import ProductQuantity from '../ProductQuantity';
import SingleVariant from '../SingleVariant';
import MultiVariant from '../MultiVariant';
import GiftCardSelector from '../SingleVariant/GiftCardSelector';
// Helpers
import checkQuantities from '../../helpers/quantity';

class CartCta extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
    cartItems: PropTypes.array.isRequired,
    setMessage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      quantity: 1,
      variant_id: null
    };
  }

  // componentWillReceiveProps = (nextProps) => {
  //   if (nextProps.product.isLoaded) {
  //     this.setState({
  //       quantity: 1,
  //       variant_id: null
  //     });
  //   }
  // };

  setVariant = (variant) => {
    this.setState({
      variant_id: variant
    });
  };

  getVariant = () => {
    const { product } = this.props.product;
    if (product.has_variants) {
      if (product.option_types.length > 1) {
        return (
          <MultiVariant
            variants={product.variants}
            action={this.setVariant}
          />
        );
      }
      if (product.option_types.length > 0) {
        if (product.classifications[0].taxon.name === 'Gifts') {
          return (
            <GiftCardSelector
              variants={product.variants}
              onAddToCart={this.props.onSubmit}
            />
          );
        }
        return (
          <SingleVariant
            variants={product.variants}
            action={this.setVariant}
            price={Number(product.price)}
          />
        );
      }
    }
    return null;
  };

  updateQuantity = (value) => {
    this.setState({ quantity: parseInt(value, 10) });
  }

  subQuantity = () => {
    let value = this.state.quantity;
    if (value >= 2) {
      value -= 1;
      this.setState({
        quantity: value
      });
    }
  };

  addQuantity = () => {
    let value = this.state.quantity;
    const maxValue = this.props.product.product.max_quantity_allowed_in_cart;
    if (value < maxValue) {
      value += 1;
    }
    this.setState({
      quantity: value
    });
  };

  addToCart = (e) => {
    e.preventDefault();
    const { product } = this.props.product;
    const variantId = product.has_variants ? this.state.variant_id : product.master.id;
    const quantity = this.state.quantity;
    const { cartItems } = this.props;
    const data = {
      id: variantId,
      quantity
    };
    const flag = checkQuantities({
      ...data,
      items: cartItems
    });
    if (!flag) {
      const messages = this.props.product.product.max_quantity_allowed_in_cart === 0 ?
      [
        "We're sorry but the product is not available at the moment."
      ]
      :
      [
        `You may only purchase a maximum
         ${product.max_quantity_allowed_in_cart}
         ${product.name} at one time`
      ];
      this.props.setMessage({
        isError: true,
        messages
      });
    } else {
      this.props.onSubmit(data);
    }
  };

  render() {
    const { product } = this.props.product;
    return (
      <form
        className={s.cartform}
        onSubmit={this.addToCart}
      >
        { this.getVariant() }
        {
          product.classifications[0].taxon.name !== 'Gifts' &&
            [
              <ProductQuantity
                key="quantity1"
                sizingClass="quantitybig"
                quantity={this.state.quantity}
                addQuantity={this.addQuantity}
                subQuantity={this.subQuantity}
                maxQuantity={product.max_quantity_allowed_in_cart}
                updateQuantity={this.updateQuantity}
              />,
              <button type="submit" className={s.addtocart} key="button1">Add to cart</button>
            ]
        }
      </form>
    );
  }
}

export default withStyles(s)(CartCta);
