import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage, CartPage } from '../pages';
import ShopHeader from '../shop-header';

import './app.css';

/*
  Подключение нового компоненты к Redux
  Создать новый презентационный компонент. Он не должен 'знать' о Redux.
  Обновить state в Reducer и добавить туда новые, необходимые поля для этого компонента
  Можно для начала заполнить их тестовыми данными в state
  Реализуйте функции для connect() и подключите компонент к Redux
*/

const App = () => {
  return (
    <main role='main' className='container'>
      <ShopHeader numItems={5} total={5} />
      <Switch>
        <Route path='/' exact component={HomePage} />
        <Route path='/cart' component={CartPage} />
      </Switch>
    </main>
  );
};

export default App;
