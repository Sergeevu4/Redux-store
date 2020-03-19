import React, { Component } from 'react';
import BookListItem from '../book-list-item';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withBookstoreService } from '../hoc';
import { fetchBooks, booksAddedToCart } from '../../actions';
import { compose } from '../../utils';

import './book-list.css';
import Spinner from '../spinner';
import ErrorIndicator from '../error-indicator';

/*
  # connect() - компонент высшего порядка HOC, который передает значения из store в компонент
  connect(Конфигурация)(Компонент) - получить доступ к целому store в Provider.
    Работает так же как и SwapiServiceConsumer
    connect возвращает новый компонент который знает об Redux:
      переданный компонент оборачивается, и теперь он будет брать данный из store.

    # Конфигурация:
      * 1) mapStateToProps:
          (Функция) - нужна чтобы получить только нужные значения из Redux Store и передать их в Компонент через props

      * 2) mapDispatchToProps:
          (Функция ИЛИ ОБЪЕКТ) - созданные функции Action Creator будут передан в компонент.
          Таким способом компонент может обновить состояние в store
          ! Если в качестве второго аргумента connect передать mapDispatchToProps ~ объект,
          ! то connect выполнит код за нас: bindActionCreators(actions, dispatch);

        * Использовать объект, необходимо когда все, что нужно сделать, это взять actions Creator и "обернуть"
          их при помощи bindActionCreators.
          Если коде mapDispatchToProps более сложная логика, то нужно использовать функцию.

   # bindActionCreators(actionCreators, dispatch) - связывает функцию action creator c функцией dispath()
      ! dispatch - всегда работает с тем store на котором он был создан
      Созданные таким способом функции делают сразу два действия - вызов действия в action creator и отправка его в dispatch()

    * actionCreators(Функция или Объект ~ через * import):
        один action creator или объект со значениями которые являются actions creators.

    * Возвращается в зависимости от того, что передали во внутрь actionCreators (Функцию или Объект):
        Объект с теме же ключами, что и переданный, но свойства вместо оригинальный функций action creator,
        получаем обернутую версию в которой они уже вызваны внутри dispatch

        Если вы передаете единственную функцию (один action creator),
        возвращаемое значение также будет единственной функцией которая обернута и вызвана в dispatch

  # mapStateToProps и mapDispatchToProps есть вторгой аргумент: ownProps
    ownProps - это props которые пришли от родительского компонента.
      Props которые перешли от HOC функции withBookstoreService()
      которая получит обернутый компонент connect(mapStateToProps, mapDispatchToProps)
      тем самым внутри mapStateToProps, mapDispatchToProps можно получить те props
      которые мы передали из withBookstoreService

  # Component Container - Паттерн React-Redux - разделения логики и орисовки
      Можно вынести все контейнеры в отдельную папку containers или PersonContainer и там держать все компоненты контайнеры
      Компоненты-контайнеры работают с Redux, реализуют loading, error, другую Логику

  ! Функция mapStateToProps выполняется всегда, когда запускается процесс рендеринга
   компонента, даже если его данные не изменились (но изменились для каких-то других компонентов в этой же части дерева компонентов)
*/

// # (Презентационный) Компонент отвечает за отображение элементов - (ничего не знает о Логике)
const Booklist = ({ books, onAddedToCart }) => {
  return (
    <ul className='book-list'>
      {books.map((book) => (
        <li key={book.id}>
          <BookListItem book={book} onAddedToCart={(id) => onAddedToCart(book.id)} />
        </li>
      ))}
    </ul>
  );
};

// # Компонент Контейнер - отвечает за Логику, но не за отображения
class BookListContainer extends Component {
  componentDidMount() {
    this.props.fetchBooks();
  }

  render() {
    // Props из Redux Store через mapStateToProps
    // # 4) После обновления state, через dispatch action,
    // загружаются данные и обновляется компонент с этими данными
    const { books, loading, error, onAddedToCart } = this.props;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <ErrorIndicator />;
    }

    return <Booklist books={books} onAddedToCart={onAddedToCart} />;
  }
}

// * Чтение данных из Redux Store
// state - который определен в Reducer
const mapStateToProps = ({ bookList: { books, loading, error } }) => {
  return { books, loading, error };
};

// * Отправка действий в Redux Store
// Вся Логика работы с данными объединена в одной функции,и передается в компонент
// fetchBooks включает себя три Action Creator и находится там же
const mapDispatchToProps = (dispatch, ownProps) => {
  // ownProps - это те props которые мы отправили из withBookstoreService -> bookstoreService
  const { bookstoreService } = ownProps;

  // ! Вызов Thunk через bindActionCreators
  return bindActionCreators(
    {
      fetchBooks: fetchBooks(bookstoreService),
      onAddedToCart: booksAddedToCart,
    },
    dispatch
  );

  /*
    // ! Явный Thunk
    return {
      // * Через обычную функцию
      // fetchBooks: fetchBooks(dispatch, bookstoreService),
      // * Через Thunk
      fetchBooks: () => dispatch(fetchBooks(bookstoreService)()),
      onAddedToCart: (id) => dispatch(booksAddedToCart(id)),
    };
  */
};

// Возвращает обернутый HOC компонент получает доступ к Класс-Сервису
// И через connect умеет брать данные из Redux и так же через Actions их изменять
export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookListContainer);

/*
  // ES5
  // state - определен в Reducer
  const mapStateToProps = (state) => {
    return {
      books: state.books,
      loading: state.loading,
      error: state.error,
    };
  };

  // БЕЗ ACTION CREATOR
  const mapDispatchToProps = (dispatch) => {
    return {
      booksLoaded: (newBooks) => {
        dispatch({
          type: 'BOOKS_LOADED',
          payload: newBooks,
        });
      },
    };
  };

  // БЕЗ bindActionsCreator c ACTION CREATOR
  const mapDispatchToProps = (dispatch) => {
  return {
    booksLoaded: (newBooks) => {
      dispatch(booksLoaded(newBooks));
      },
    };
  };

  // С bindActionsCreator, без Рефакторинга
  const mapDispatchToProps = (dispatch) => {
  const booksLoaded = bindActionCreators(booksLoaded, dispatch);
    return {
      booksLoaded: booksLoaded, ~ es5
    };
  };

  // С bindActionsCreator, с Рефакторингом
  const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ booksLoaded ~ es6}, dispatch);
  };

  // БЕЗ Рефакторинга mapDispatchToProps + (работа с данными внутри componentDidMount)

  // Передача объекта вторым агументом в connect
  // REDUX сделает за нас bindActionCreators({ booksLoaded }, dispatch);
  const mapDispatchToProps = {
    booksLoaded, // Запись в state в Redux
    booksRequested, // Сбросить state
    booksError, // Обработка ошибки
  };

  componentDidMount() {
    // bookstoreService Класс-Сервиса, который передаются через React Context
    // booksLoaded - Active Creator обернутый в dispath передаются через Connect
    const { bookstoreService, booksLoaded, booksRequested, booksError } = this.props;

    // # 0) Сбрасываю Redux state в первоначальное состояние
    booksRequested();
    // # 1) Получаю данные (Promise)
    // # 2) Передать действия (dispatch action)
    // в React Store, он вызывает c переданным action.type Reducer
    // который обновляет состояние state
    // # 3) Обработка ошибки, и запись ее в Redux state
    bookstoreService
      .getBooks()
      .then((data) => booksLoaded(data))
      .catch((error) => booksError(error));
  }
*/
