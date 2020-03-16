/*
  ! Reducer - (Логика) Функция которая знает как обновлять глобальное состояние state,
    для любого события в приложении.
    Принимает два параметра:
      * 1) state - текущее состояние
      * 2) action - действие которое нужно совершить

    # Reducer должна вернуть полное состояние нового state
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
  */

// ! Нельзя мутировать (изменять)
// Первоначальный State
const initialState = {
  books: [], // Данные с сервера
  loading: true,
  error: null,
  cartItems: [], // Покупки
  orderTotal: 220,
};

// * Обновления списка покупок
// item - тот элемент который будем добавляться, или заменять (обновлять) существующий элемент
// idx - индекс найденой книги в массиве покупок
const updateCartItems = (cartItems, item, idx) => {
  // Добавленной новой книги если ее еще нету в массиве покупок
  if (idx === -1) {
    return [...cartItems, item];
  }

  // Значит книга уже есть в массиве покупок, ее следует обновить
  return [
    ...cartItems.slice(0, idx), // элементы до
    item,
    ...cartItems.slice(idx + 1), // элементы после
  ];
};

// * Добавления новой или обновления существующей книги в списке покупок
const updateCartItem = (book, item) => {
  // Книга есть в массиве покупок, ее нужно обновить
  if (item) {
    return {
      ...item,
      count: item.count + 1,
      price: item.price + item.price,
    };
  } else {
    // Значит книги нету в массиве покупок, создать новую
    // через преобразования в подходящую стуктуру данных
    return {
      id: book.id,
      title: book.title,
      count: 1,
      price: book.price,
    };
  }
};

// * Метод №2 Добавления новой или обновления существующей книги в списке покупок
// Вместо того, чтобы рассматривать, существует ли предыдущий элемент или нет
// Можно сказать, что предыдущий элемент существует всегда
// и через значения по умолчанию задавать ему значения
const updateCartItem2 = (book, item = {}) => {
  // Если item === undefined, тогда {}
  // и тогда его значения будут либо по умолчанию, либо:
  const { id = book.id, title = book.title, count = 0, price = 0 } = item;

  // Книга есть в массиве покупок, ее нужно обновить
  return {
    id,
    title,
    count: count + 1,
    price: price + book.price,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Начало загрузки книг, сброс state
    case 'FETCH_BOOKS_REQUEST':
      return {
        ...state, // Копируем все свойства, которые мы не меняем
        books: [],
        loading: true,
        error: null,
      };

    // Книги загружены, запись в state
    case 'FETCH_BOOKS_SUCCESS':
      return {
        ...state,
        books: action.payload,
        loading: false,
        error: null,
      };

    // В момент загрузки произошла ошибка
    case 'FETCH_BOOKS_FAILURE':
      return {
        ...state,
        books: [],
        loading: false,
        error: action.payload, // Объект ошибки
      };

    // Добавления (Обновление) полученой с сервера книги, в таблице покупок
    case 'BOOK_ADDED_TO_CART':
      // id выбранной книги
      const bookId = action.payload;
      // Выбранная книга из массива книг полученных с сервера
      const findBook = state.books.find((book) => book.id === bookId);
      // id выбранной книги в массиве покупок
      const itemIndex = state.cartItems.findIndex((book) => book.id === bookId);
      // Нахождения выбранной книги в массиве покупок
      const oldItem = state.cartItems[itemIndex];
      // Новая или обновленная книга
      const newItem = updateCartItem2(findBook, oldItem);

      return {
        ...state,
        cartItems: updateCartItems(state.cartItems, newItem, itemIndex),
      };

    default:
      return state;
  }
};

export { reducer };
