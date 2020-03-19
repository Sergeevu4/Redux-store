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
        Как только reducer становится сложным - необходимо сразу упрощайте его
        работайте со структурой глобального state: объединяйте свойства в объекты,
        вынося логику обновления объектов из глобального state в отдельные функции

      Попытаться разделить действия по категориям и разбить Reducer на более мелкие функции
        - действия которые работают со списком книг (books)
        - действия которые работают со списком заказов (cartItems)

    # combineReducers -  работает, только когда reducer абсолютно независимы
      Главный аспект работы combineReducers - каждая функция reducer - независимая,
          и она должна работать как независимый reduser, ее initialState не завивист от другого

      ! В данном случае state завит от другой "ветки-объекта"
        и поэтому combineReducers использовать нельзя.
  */

// ! Первоначальный State, нельзя мутировать (изменять)

// * Вспомогательные функции, которы отвечают за свою часть state
import { updateBookList } from './book-list';
import { updateShoppingCart } from './shopping-cart';

/*
  * Так выглядит state
  initialState = {
    // Данные с сервера
    books: [],
      loading: true,
      error: null,
    },
    // Таблица покупок
    shoppingCart: {
      cartItems: [],
      orderTotal: 0,
    };
  }
*/

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
