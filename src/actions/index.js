/*
   ! Action Creator

    Action - (обычный объект) Интерфейс общения между компонентами приложения и объектом STORE,
    а так же его изменения.
    У этого объекта должно быть поле type: "СТРОКА которая описывает действие"
    Он так же может содержать дополнительные поля для использовании внутри функции Reducer.
      store.dispatch({
        type: 'USER_LOGGED_IN',
        name: 'Arnold',
        role: 'admin',
      })
    * Часто дополнительные параметры передают в поле payload

    ! dispatch - всегда работает с тем store на котором он был создан

    ! Могут быть не чистыми функциями, но лучше все таки были
    Функции по созданию Action Creator
    const userLoggedIn = (name, role) => {
      return { type: 'USER_LOGGED_IN', name, role }
    }
    store.dispatch(userLoggedIn('Arnold', 'admin'));

    # Если приложение большое, то строки type, лучше всего выносить const в отдельный файл action-types

    # Naming Convention для type, которые занимаются получением данных
      [тип запроса]_[объект]_[действие]

      FETCH - запрос на получение данных
      * FETCH_BOOKS_REQUEST - отправка запроса
      * FETCH_BOOKS_SUCCESS - получения результата
        (в payload передается полученные данные)
      * FETCH_BOOKS_FAILURE - получения (обработка) ошибки
        (в payload передается объект Error)

      UPDATE - запрос на обновления
      * UPDATE_BOOKS_REQEST

      # Thunk (Middleware)
        Thunk middleware - позволяет передавать в store функции, a не объекты Action.
        Такие функции принимают dispatch() и getState() - можно вытащить данные и передать на backend

          const getPerson = (id) => (dispatch, getState) => { // action creator
              dispatch({ type: ‘FETCH_PERSON_REQUEST' });
              fetchPerson(id) // асинхронное действие
                  .then((data) => dispatch({ type: ‘FETCH_PERSON_SUCCESS’ }))
                  .catch((error) => dispatch({ type: ‘FETCH_PERSON_FAILURE’, error}))
          }
*/

const booksRequested = () => ({
  type: 'FETCH_BOOKS_REQUEST',
});

const booksLoaded = (newBooks) => ({
  type: 'FETCH_BOOKS_SUCCESS',
  payload: newBooks,
});

const booksError = (error) => ({
  type: 'FETCH_BOOKS_FAILURE',
  payload: error,
});

const booksAddedToCart = (bookId) => ({
  type: 'BOOK_ADDED_TO_CART',
  payload: bookId,
});

const booksRemovedFromCart = (bookId) => ({
  type: 'BOOK_REMOVED_FROM_CART',
  payload: bookId,
});

const allBooksRemovedFromCart = (bookId) => ({
  type: 'ALL_BOOKS_REMOVED_FROM_CART',
  payload: bookId,
});

/*
  ! Так как Логика получения, записи, и обработки данных
  может быть понадобиться нескольким компонентам, ее можно вынести в Action.
  В ней можно объединить несколько Action Creator, тем самым передавая  только
  одну функцию с основно Логикой в mapDispatchToProps.
*/

// * Получения асинхронных данных через обычную функцию
// Используется внутри mapDispatchToProps
const fetchBooksOld = (dispatch, bookstoreService) => () => {
  // # 0) Сбрасываю Redux state в первоначальное состояние
  // # 1) Получаю данные (Promise) из Класс Сервиса
  // # 2) Передать действия (dispatch action)
  // в React Store, он вызывает c переданным action.type Reducer
  // который обновляет состояние state
  // # 3) Обработка ошибки, и запись ее в Redux state
  dispatch(booksRequested()); // 0
  bookstoreService
    .getBooks() // 1
    .then((data) => dispatch(booksLoaded(data))) // 2
    .catch((error) => dispatch(booksError(error))); // 3
};

// * Получения асинхронных данных через Thunk
const fetchBooks = (bookstoreService) => () => (dispatch) => {
  dispatch(booksRequested());

  bookstoreService
    .getBooks()
    .then((data) => dispatch(booksLoaded(data)))
    .catch((error) => dispatch(booksError(error)));
};

export { fetchBooks, booksAddedToCart, booksRemovedFromCart, allBooksRemovedFromCart };
