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

// Первоначальный State
const initialState = {
  books: [],
  loading: true,
  error: null,
};

const reducer = (state = initialState, action) => {
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
        error: action.payload,
      };

    default:
      return state;
  }
};

export { reducer };
