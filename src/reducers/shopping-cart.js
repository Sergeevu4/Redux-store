// * Обновления списка покупок
// item - тот элемент который будем добавляться, или заменять(обновлять) существующий элемент
// idx - индекс найденой книги в массиве покупок
const updateCartItems = (cartItems, item, idx) => {
  // Полностью удалить из таблицы покупок
  // Если количество книг равно 0
  if (item.count === 0) {
    return [
      ...cartItems.slice(0, idx), // до
      ...cartItems.slice(idx + 1), // после
    ];
  }

  // Добавленной новой книги если ее еще нету в массиве покупок
  if (idx === -1) {
    return [...cartItems, item];
  }

  // Значит книга уже есть, и ее и текущий state следует заменить(обновить)
  return [
    ...cartItems.slice(0, idx), // до
    item,
    ...cartItems.slice(idx + 1), // после
  ];
};

// * Добавления новой или обновления(+1, -1, -все) книги в таблице покупок
// Вместо того, чтобы рассматривать, существует ли предыдущий элемент или нет
// Можно сказать, что предыдущий элемент существует всегда
// и через значения по умолчанию задавать ему значения
const updateCartItem = (book, item = {}, quantity) => {
  // Если item === undefined, тогда {}
  // и тогда его значения будут либо по умолчанию, либо:
  const { id = book.id, title = book.title, count = 0, price = 0 } = item;

  // Книга есть в массиве покупок, ее нужно обновить
  return {
    id,
    title,
    count: count + quantity, // 1 + 1 || 1 + (-1)
    price: price + quantity * book.price, // 30 + (-1 * 30) = 30 - 30
  };
};

// * Обновления таблицы покупок
const updateOrder = (state, bookId, quantity) => {
  const {
    bookList: { books },
    shoppingCart: { cartItems, orderTotal },
  } = state;

  // Выбранная книга из массива книг полученных с сервера
  const findBook = books.find((book) => book.id === bookId);
  // id выбранной книги в массиве покупок
  const itemIndex = cartItems.findIndex((book) => book.id === bookId);
  // Нахождения выбранной книги в массиве покупок
  const oldItem = cartItems[itemIndex];
  // Новая или обновленная книга
  const newItem = updateCartItem(findBook, oldItem, quantity);
  // Обновленный массив покупок
  const newCartItems = updateCartItems(cartItems, newItem, itemIndex);

  return {
    cartItems: newCartItems,
    // 0 + 45 * 1 -> 45 + 45 + 1 -> 90 + 45 * -1
    orderTotal: orderTotal + findBook.price * quantity,
  };
};

// * Отвечает только за обновления части state: объекта shoppingCart
export const updateShoppingCart = (state, action) => {
  // ! Инициализация собственной части state
  if (state === undefined) {
    // * shoppingCart:
    return {
      cartItems: [], // Покупки
      orderTotal: 0, // Общий счет
      numItems: 0,
    };
  }

  switch (action.type) {
    // Добавления (Обновление) полученой с сервера книги, в таблице покупок
    case 'BOOK_ADDED_TO_CART':
      return updateOrder(state, action.payload, 1);

    case 'BOOK_REMOVED_FROM_CART':
      return updateOrder(state, action.payload, -1);

    case 'ALL_BOOKS_REMOVED_FROM_CART':
      const findItem = state.shoppingCart.cartItems.find(
        ({ id }) => id === action.payload
      );
      // -все книги
      return updateOrder(state, action.payload, -findItem.count);

    default:
      return state.shoppingCart;
  }
};
