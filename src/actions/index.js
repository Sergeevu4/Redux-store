// ! Action Creator

/*
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
*/

const booksLoaded = (newBooks) => ({
  type: 'BOOKS_LOADED',
  payload: newBooks,
});

const booksRequested = () => ({
  type: 'BOOKS_REQUESTED',
});

const booksError = (error) => ({
  type: 'BOOKS_ERROR',
  payload: error,
});

export { booksLoaded, booksRequested, booksError };
