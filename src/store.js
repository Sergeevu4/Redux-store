import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducer } from './reducers';
// # Для работы Redux c DevTools
import { composeWithDevTools } from 'redux-devtools-extension';

/*
   # Redux Store - (Центральный объект) Координирует работы с данными в Redux - приложении.
    Компонент который организовывает работу функции Reducer и контролирует обновления state.
    Чтобы его создать достаточно иметь Reducer, так как у него в параметрах уже установлено дефолт state и он его возвращает.

    Чаще всего у сторонних библиотек есть методы по расширению их базового функционала
      так как автор не может предусмотреть все варианты использования своей библиотекой,
      а разработчик предоставить функционал по расширению, изменению функционала.

   ! monkey patching - замены какого-то метода в api на свою собственную реализацию
      Применяется в крайних случаях когда сама библиотека не поддерживает никаких
      механизмов расширения.

  # В Redux есть возможность практически полностью изменять, расширять базовый функционал:
    * 1) Store Enhancer - это функция высшего порядка, управляет процессом создания store.
        Возвращает новую расширенную реализацию createStore подменяя оригинальную функцию createStore

        * Принимает орг. функцию createStore -> возвращаемое новую версию createStore
          const stringEnhancer = (createStore) => (...args) => {...}
          createStore(stringEnhancer)
      ! Если необходимо использовать несколько Store Enhancer, нужна функция compose от Redux

    * 2) Middleware - это функция высшего порядка, которая модифицируют только то, как работает функция dispatch.
      Middleware - промежуточный слой это кусок кода,
      который выполняется после отправки action, но перед вызовом reducer.

      Возвращает новый, расширенный dispatch подменяя тем самым, оригинальную функцию dispatch.
      Для того чтобы использовать Middleware мы используем функцию applyMiddleware.

      * АРГУМЕНТЫ:
        - store - не полный, в котором есть метод store.getState() и store.dispatch() - орг. dispath
        - dispatch ~ next - орг. функция dispatch или уже модифицированная версия
        - action - вызванный action creator
          возвращает новый модифицированный dispatch или передает его дальше в другой middleware
        * const strMiddleware = (store) => (dispatch или next) => (action) => {...}
          ИЛИ
        * const middleware = ({ dispatch, getState }) => (next) => (action) => {...}

      * ВЫЗОВ:
        const store = createStore(reducer, applyMiddleware(strMiddleware, logMiddleware));

      * applyMiddleware - это store enhancer
        единственный store enhancer, который идет в комплекте с Redux.
        Работает примерно как compose, передает один модифицированный dispath в следующий
          последняя модификация dispatch который передаст action в Reducer.
          ! Поэтому dispatch - называется как next
          ! В функцию applyMiddleware мы должны передать наши Middleware по очереди
        - здесь очередь имеет значение.

    ! Чаще всего менять механизм работы store не нужно (Store Enhancer),
      в основном такая необходимость только в изменении механики работы dispatch(Middleware)

    # Thunk (Middleware) - позволяет использовать функции в качестве action, вместо объекта
*/

const strMiddleware = (store) => (dispatch) => (action) => {
  if (typeof action === 'string') {
    return dispatch({ type: action });
  }
  return dispatch(action);
};

// store - не полный, в котором есть метод store.getState()
// dispatch ~ next - орг. функция dispatch
// action - вызванный action creator
// возвращает новый модифицированный dispatch или передает его дальше в другой
const logMiddleware = (store) => (dispatch) => (action) => {
  console.log(action.type);
  return dispatch(action);
};

// * Thunk
// getState - функция получения объекта state
const delayedActionCreator = (timeout) => (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: 'DELAYED_ACTION',
    });
  }, timeout);
};

// * Инициализация Redux Store
const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware, strMiddleware, logMiddleware))
);

store.dispatch(delayedActionCreator(3000));

// * Использования строки вместо объекта применение Middleware
store.dispatch('HELLO WORLD');

export default store;
