import './homePage.css';
import BaseComponent from '../baseComponent/baseComponent';

class HomePage extends BaseComponent {
  inner = `
        <div class="container homepage">
          <section class="section about">
            <div class="about__description">
              <h3 class="about__title">Выучить английский легко!</h3>
              <p class="about__text">
                RS Lang - это ваш помощник в изучении английского языка. Изучите 3600 часто употребляемых слов с помощью учебника и мини-игр, отслеживайте свой прогресс в разделе "Статистика". Регистрируйтесь и открывайте дополнительные возможности приложения!
              </p>
            </div>
            <div class="about__image">
              <img src="./assets/img/main.jpg" alt="" class="home__img">
            </div>
          </section>
          <section class="section advantages">
            <div class="advantages__card">
              <img src="./assets/icons/book.png" alt="textbook" class="advantages__img">
              <h3 class="advantages__title">Учебник</h3>
              <p class="advantages__text">Учебник состоит из шести разделов, в каждом разделе 30 страниц по 20 слов. Представлен перевод слова, транскрипция, картинка-ассоциация, а также произношение слова и предложений с ним.</p>
            </div>
            <div class="advantages__card">
              <img src="./assets/icons/games.png" alt="game" class="advantages__img">
              <h3 class="advantages__title">Мини-игры</h3>
              <p class="advantages__text">В нашем приложении доступны 2 мини-игры: "Аудиовызов" и "Спринт". Ваше обучение будет проходить эффективнее и веселее. С игровым подходом ежедневные занятия входят в привычку.</p>
            </div>
            <div class="advantages__card">
              <img src="./assets/icons/statistic.png" alt="statistic" class="advantages__img">
              <h3 class="advantages__title">Статистика</h3>
              <p class="advantages__text">Вам доступна краткосрочная статистика по мини-играм и по словам за каждый день изучения: количество новых слов, количество изученных слов, самая длинная серия правильных ответов, процент правильных ответов.</p>
            </div>
          </section>
          <section class="section video">
            <h2 class="video__section-title">Возможности приложения (будет видео)</h2>            
          </section>
          <section class="section team">
            <h2 class="team__section-title">Наша команда</h2>
            <div class="team__cards">
              <div class="team__card">
                <img src="./assets/img/avatar-stas.jpg" alt="avatar" class="team__card-img">
                <div class="team__card-description">
                  <a class="team__card-link" href="https://github.com/HamSilver" target="_blank" rel="noopener noreferrer">Cтанислав</a>            
                  <span class="team__card-role">Тимлид</span>
                  <p class="team__card-text">Настройка бэкенда, разработка архитектуры приложения, карточек слов, мини-игры "Спринт", статистики и части учебника</p>
                </div>
              </div>
              <div class="team__card">
                <img src="./assets/img/avatar-uiguuna.jpg" alt="avatar" class="team__card-img">
                <div class="team__card-description">
                  <a class="team__card-link" href="https://github.com/UiguunaMikhailova" target="_blank" rel="noopener noreferrer">Уйгууна</a>
                  <span class="team__card-role">Разработчик</span>
                  <p class="team__card-text">Реализация авторизации и регистрации пользователя, разработка мини-игры "Аудиовызов"</p>
                </div>
              </div>
              <div class="team__card">
                <img src="./assets/img/avatar-kris.jpg" alt="avatar" class="team__card-img">
                <div class="team__card-description">
                  <a class="team__card-link" href="https://github.com/KristiBo" target="_blank" rel="noopener noreferrer">Кристина</a>
                  <span class="team__card-role">Разработчик</span>
                  <p class="team__card-text">Реализация роутинга, главной страницы приложения с header и footer, части учебника, адаптивный дизайн приложения</p>
                </div>
              </div>
            </div>
          </section>
        </div>`;

  constructor() {
    super('main', 'main', 'home');
  }
}

export default HomePage;
