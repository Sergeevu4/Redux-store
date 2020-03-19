// * Отвечает только за обновления части state: объекта bookList
export const updateBookList = (state, action) => {
  // ! Инициализация собственной части state
  if (state === undefined) {
    // * bookList:
    return {
      books: [], // Данные с сервера
      loading: true,
      error: null,
    };
  }

  // ! ...state - больше не нужно передавать оставшиеся поля
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
