import React from 'react';

const {
  Provider: BookstoreServiceProvider, // Переименовываю
  Consumer: BookstoreServiceConsumer,
} = React.createContext();

export { BookstoreServiceProvider, BookstoreServiceConsumer };
