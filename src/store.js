import { createStore } from 'redux';
import { reducer } from './reducers';
// Для работы Redux c DevTools
import { composeWithDevTools } from 'redux-devtools-extension';

/*
   Redux Store - (Центральный объект) Координирует работы с данными в Redux - приложении.
    Компонент который организовывает работу функции Reducer и контролирует обновления state.
    Чтобы его создать достаточно иметь Reducer, так как у него в параметрах уже установлено дефолт state и он его возвращает.
*/

// Инициализация Redux Store
const store = createStore(reducer, composeWithDevTools());
export default store;
