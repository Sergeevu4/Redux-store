import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/app';
import ErrorBoundry from './components/error-boundry';
import BookstoreService from './services/bookstore-service';
import { BookstoreServiceProvider } from './components/bookstore-service-context';
import store from './store';

/*
   Базовая структура папок в проекте:
    /services - сервис по работе с данными, backend
    /utils
    /actions
    /reducers
    index.js
    store.js

  /components
    /app
    /pages
    /spinner
    /error-indicator
    /error-boundry
    /hoc
    /bookstore-service-context - react context

    ! Центром Логики приложения является Redux поэтому самый верхний элемент Provider

    Provider делает store доступным всему дереву компонентов (через контекст)
      - работает так же React Context Provider
      Любой из компонентов вызовет dispatch над Store и обновит state
      Provider узнает об обновлении state и обновит приложения

      Компонент Provider отвечает за то, чтобы получать обновления из Store.
      Затем state передаётся через Context дереву React компонентов.
      С другой стороны функция connect получает state из Context и передаёт свойства из state
      нужному компоненту.
      Если данные в контексте изменяются, то это приводит к перерисовке.

    Каждый помпонент внутри App будет иметь доступ к роутеру, redux store, react-context,
    если произойдет ошибка она будет отловленна ErrorBoundry.
    Компоненты зависят от данный в redux store, они могут dispatch новые Action
*/

// Класс для работы с данными, backend
const bookstoreService = new BookstoreService();

// Запуская, инициализирует основные части приложения.
ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundry>
      <BookstoreServiceProvider value={bookstoreService}>
        <Router>
          <App />
        </Router>
      </BookstoreServiceProvider>
    </ErrorBoundry>
  </Provider>,
  document.getElementById('root')
);
