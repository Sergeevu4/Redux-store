import React from 'react';
import { BookstoreServiceConsumer } from '../bookstore-service-context';

const withBookstoreService = () => (Wrapped) =>
  function WithBookstoreService(props) {
    return (
      // Получаю доступ к Класс Сервису через внутреннюю функцию которая принимает сервис
      // который мы передаем через BookstoreServiceProvider (REACT CONTEXT)
      <BookstoreServiceConsumer>
        {(bookstoreService) => {
          return <Wrapped {...props} bookstoreService={bookstoreService} />;
        }}
      </BookstoreServiceConsumer>
    );
  };

export default withBookstoreService;
