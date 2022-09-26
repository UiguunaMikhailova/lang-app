import './errorPage.css';
import BaseComponent from '../baseComponent/baseComponent';

class ErrorPage extends BaseComponent {
  inner = `<div class="container error-page">
              <h2 class="error-page__title">Страница не найдена!</h2>
            </div>`;

  constructor() {
    super('main', 'main', 'error');
  }
}

export default ErrorPage;
