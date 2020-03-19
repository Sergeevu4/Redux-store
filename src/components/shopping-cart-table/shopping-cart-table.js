import React from 'react';
import { connect } from 'react-redux';
import {
  booksAddedToCart,
  booksRemovedFromCart,
  allBooksRemovedFromCart,
} from '../../actions';

import './shopping-cart-table.css';
const ShoppingCartTable = ({ items, total, onIncrease, onDecrease, onDelete }) => {
  // * Callback -> Элементы таблицы
  const renderRow = (item, i) => {
    const { id, title, count, price } = item;
    return (
      <tr key={id}>
        <td>{i + 1}</td>
        <td>{title}</td>
        <td>{count}</td>
        <td>${price}</td>
        <td>
          <button
            onClick={() => onDelete(id)}
            className='btn btn-outline-danger float-right'
          >
            <i className='fa fa-trash-o'></i>
          </button>

          <button
            onClick={() => onIncrease(id)}
            className='btn btn-outline-success float-right'
          >
            <i className='fa fa-plus-circle'></i>
          </button>

          <button
            onClick={() => onDecrease(id)}
            className='btn btn-outline-warning float-right'
          >
            <i className='fa fa-minus-circle'></i>
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className='shopping-cart-table'>
      <h2>Your Order</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Count</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{items.map(renderRow)}</tbody>
      </table>

      {/* Можно было было сделать так чтобы компонент сам считал total на основании других данных,
      но правильнее держать это Логику в Reducer. Таким образом если она станет сложнее,
      будет только одно место для изменения или обновления кода этой Логики.
      */}
      <div className='total'>Total: ${total}</div>
    </div>
  );
};

const mapStateToProps = ({ shoppingCart: { cartItems, orderTotal } }) => ({
  items: cartItems,
  total: orderTotal,
});

// REDUX сделает за нас bindActionCreators({...}, dispatch);
const mapDispatchToProps = {
  onIncrease: (id) => booksAddedToCart(id),
  onDecrease: (id) => booksRemovedFromCart(id),
  onDelete: (id) => allBooksRemovedFromCart(id),
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCartTable);
