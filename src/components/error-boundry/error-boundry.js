import React, { Component } from 'react';
import ErrorIndicator from '../error-indicator/';

// # Класс обработки ошибок в дочерних элементах, и вывода сообщения
export default class ErrorBoundry extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return this.props.children;
  }
}
