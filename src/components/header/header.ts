import './header.css';
import BaseComponent from '../baseComponent/baseComponent';

class Header extends BaseComponent {
  inner = `
        <div class="container header__container">
          <div class="header__logo logo">
            <a href="#/home" class="logo__link">
              <img src="./assets/icons/logo.png" alt="logo" class="logo__img">
            </a>          
            <h1 class="logo__title">RS Lang</h1>
          </div>
          <nav class="nav">
            <ul class="nav__list">
              <li class="nav__item">
                <a href="#/home" class="nav__link nav__link_home active">Главная</a>
              </li>
              <li class="nav__item">
                <a href="#/textbook" class="nav__link nav__link_book">Учебник</a>
              </li>
              <li class="nav__item">
                <a href="#/games" class="nav__link nav__link_games">Игры</a>
              </li>
              <li class="nav__item">
                <a href="#/statistic" class="nav__link nav__link_statistic">Статистика</a>
              </li>
              <li class="nav__item">
                <a href="#/authorization" class="nav__link header__button nav__link_auth">Войти</a>
              </li>
            </ul>
          </nav>
          <div class="burger-menu">
            <span></span>
          </div>
        </div>`;

  constructor() {
    super('header', 'header', 'header-container');
  }

  create(): void {
    document.body.append(this.container);
    this.container.innerHTML = this.inner;
  }

  // Сделано для демонстации изменения цвета, не забыть переделать под локалсторедж
  addListeners(callback?: () => void): void {
    const menuLinks: NodeListOf<HTMLElement> = document.querySelectorAll('.nav__link');
    menuLinks.forEach((el) => el.addEventListener('click', (event: Event) => {
      // if click on auth
      const target = <HTMLElement>event.target;
      if (target.classList.contains('nav__link_auth') && callback) {
        event.preventDefault();
        callback();
      }

      menuLinks.forEach((elem) => elem.classList.remove('active'));
      el.classList.add('active');
      let result: void;
      return result;
    }));
  }
}

export default Header;
