import React, { PropTypes } from 'react';
import Category from './Category';

class CategoryWrapper extends React.Component {

  static propTypes = {
    gridItems: PropTypes.object.isRequired,
    addToCart: PropTypes.func.isRequired,
  }

  static defaultProps = {
    gridItems: { isLoaded: false, products: [] },
  }

  render() {
    console.log('server');
    return (
      <Category gridItems={this.props.gridItems} addToCart={this.props.addToCart} />
    );
  }
}

export default CategoryWrapper;
