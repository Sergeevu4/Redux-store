/*
  ! Сперва стоит с 'формы' state, а затем писать для него reducers
    а не наоборот (начинать с функций и "подгонять" под них state).

  ! Reducer - (Логика) Функция которая знает как обновлять глобальное состояние state,
    для любого события в приложении.
    Принимает два параметра:
      * 1) state - текущее состояние
      * 2) action - действие которое нужно совершить

    # Reducer должен вернуть полное состояние нового state
        не только те ключи которые следует обновить, полностью весь объект который
        будет новым state, a не частичное как в setState({})

    # Если state (undefined), необходимо вернуть первоначальное состояние.
        В параметрах в Reducer state, выставить дефолт состояние: state = 0 - дефолтное значение

    # Если Reducer не знает какого-то действия (action.type), то необходимо вернуть
        state без изменения.

    ! Функция Reducer - должна быть чистой функцией:
      * 1. Возвращаемое значение зависит только от аргументов.
          Всегда возвращает одинаковое состояние при одинаковых переданных аргументах.

          Читая: (a, b) => a > b ? a : b
          Нет: (a) => Math.random() * a.
            Результат зависит от того какое число вернут Math.random

      * 2. У функции нет побочных эффектов
          (запись значения в глобальную переменную,
          обновления DOM дерева,
          запись значения в кеш, базу данных, localStore)

          Не может менять глобальное состояние и аргументы
          Может менять только собственные локальные состояние, собственные локальные переменные.

          Нет:
            const render () => document.getElementById('root').innerHTML = 'hi'
            Меняет внешнее значение NODE в document
          Нет: const render = (el) => el.innerHTML = 'hi' - Модифицирует аргумент

          Любые функции которые модифицируют DOM, вызывают server, устанавливают setTimeout,
            исп. Math.random, текущее время - НЕ ЯВЛЯЮТСЯ ЧИСТЫМИ, ОНИ ЗАВИСЯТ ОТ ВНЕШНИХ РЕСУРСОВ


    ! Не все функции, которые работают с redux обязаны быть reducer'ами.
      В reducer'е вы совершенно спокойно можете использовать обычные вспомогательные функции
      (при условии, что они чистые).

    # Как правильно организовать код Reducer при маштабировании
      1. Попытаться разделить действия по категориям
          - действия которые работают со списком книг (books)
          - действия которые работают со списком заказов (cartItems)

      2. Разбить Reducer на более мелкие функции
          Если действия взаимосвязанны между собой, и данные зависит от друг друга
          то его сам initialState и функция reducer остаются в одном файле.

      3. Combine Reducers работает, только когда reducer абсолютно независимы.
       У нас, одна "ветка" state зависела от другой "ветки" и поэтому combineReducers нам бы не помог.


    ! combineReducers -  работает, только когда reducer абсолютно независимы
    Главный аспект работы функции combineReducers - каждая функция это независимый reducer,
    и она должна работать как независимый reduser.

  */

// ! Первоначальный State, нельзя мутировать (изменять)

// * Обновления списка покупок
// item - тот элемент который будем добавляться, или заменять(обновлять) существующий элемент
// idx - индекс найденой книги в массиве покупок
const updateCartItems = (cartItems, item, idx) => {
  // Полностью удалить их таблицы покупок
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
    shoppingCart: { cartItems },
  } = state;

  // Выбранная книга из массива книг полученных с сервера
  const findBook = books.find((book) => book.id === bookId);
  // id выбранной книги в массиве покупок
  const itemIndex = cartItems.findIndex((book) => book.id === bookId);
  // Нахождения выбранной книги в массиве покупок
  const oldItem = cartItems[itemIndex];
  // Новая или обновленная книга
  const newItem = updateCartItem(findBook, oldItem, quantity);

  return {
    cartItems: updateCartItems(cartItems, newItem, itemIndex),
    orderTotal: 0,
  };
};

// * Отвечает только за обновления части state: bookList
const updateBookList = (state, action) => {
  // ! Инициализация собственной части state
  if (state === undefined) {
    // bookList:
    return {
      books: [], // Данные с сервера
      loading: true,
      error: null,
    };
  }

  // !...state - больше не нужно передавать оставшиеся поля
  // После разделения reduser, работаем только с bookList
  switch (action.type) {
    // Начало загрузки книг, сброс state
    case 'FETCH_BOOKS_REQUEST':
      return {
        books: [],
        loading: true,
        error: null,
      };

    // Книги загружены, запись в state
    case 'FETCH_BOOKS_SUCCESS':
      return {
        books: action.payload,
        loading: false,
        error: null,
      };

    // В момент загрузки произошла ошибка
    case 'FETCH_BOOKS_FAILURE':
      return {
        books: [],
        loading: false,
        error: action.payload, // Объект ошибки
      };

    // ! В функцию приходят action с updateShoppingCart
    // ! Так как она их не знает, возвращаем тот объект с которым работает
    default:
      return state.bookList;
  }
};

// * Отвечает только за обновления части state: shoppingCart
const updateShoppingCart = (state, action) => {
  // ! Инициализация собственной части state
  if (state === undefined) {
    // shoppingCart:
    return {
      cartItems: [], // Покупки
      orderTotal: 0,
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

// * Основной Reducer
// Reducer больше не отвечает за первоначальное состояние initialState
// Каждая часть state инициализируется внутри вспомогательных функции
const reducer = (state, action) => {
  // Использует две вспомогательные функции
  // Которые обрабатывают, обновляют только свою структуру state
  return {
    bookList: updateBookList(state, action),
    shoppingCart: updateShoppingCart(state, action),
  };
};

export { reducer };
