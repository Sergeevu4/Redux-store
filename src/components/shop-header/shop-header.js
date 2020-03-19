import React, { Component } from 'react';
import './shop-header.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const ShopHeader = ({ numItems, total }) => {
  return (
    <header className='shop-header'>
      <Link to='/' className='logo text-dark'>
        Redux Store
      </Link>

      <Link to='/cart/' className='shopping-cart'>
        <i className='cart-icon fa fa-shopping-cart' />
        {numItems} items (${total})
      </Link>
    </header>
  );
};

class ShopHeaderContainer extends Component {
  render() {
    return <ShopHeader {...this.props} />;
  }
}

const mapStateToProps = ({ shoppingCart: { cartItems, orderTotal } }) => {
  const numItems = cartItems.reduce((sum, { count }) => sum + count, 0);
  return {
    numItems,
    total: orderTotal,
  };
};

export default connect(mapStateToProps)(ShopHeaderContainer);
