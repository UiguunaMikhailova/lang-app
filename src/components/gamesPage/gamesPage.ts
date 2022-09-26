import './gamesPage.css';
import BaseComponent from '../baseComponent/baseComponent';
import Sprint from '../sprint/sprint';
import { Word } from '../../shared/types';
import AudioGame from '../audioGame/audioGame';

class GamesPage extends BaseComponent {
  private userState = false;

  inner = `<div class="games-page">        
        <h2 class="games-page__title">Выберите игру:</h2>
        <div class="games-page__cards">
        <div class="games-page__card">
          <img src="./assets/icons/audiochallenge.png" alt="audio-game" class="game-card__img">
          <p class="game-card__name">Аудиовызов</p>
          <p class="game-description">Проверьте свои навыки аудирования, пытаясь определить правильное слово по его произношению</p>
          <a class="game__btn btn btn_audiocall" id="btn-audiocall" href="/#/games/audiocall">Играть</a>
        </div>
        <div class="games-page__card">
          <img src="./assets/icons/sprint.png" alt="sprint-game" class="game-card__img">
          <p class="game-card__name">Спринт</p>
          <p class="game-description">Проверьте, сколько очков вы cможете набрать за одну минуту, пытаясь определить перевод слова</p>
          <a class="game__btn btn btn_sprint" id="btn-sprint" href="/#/games/sprint">Играть</a>
        </div>
        </div>
      </div>
      <div class="game__container"></div>`;

  constructor(userState: boolean) {
    super('main', 'main', 'games');
    this.userState = userState;
  }

  drawSprint(words: Word[]): void {
    this.container.innerHTML = '';
    const sprint = new Sprint(this.container);
    sprint.setWords(words);
  }

  drawAudio(words: Word[]): void {
    this.container.innerHTML = '';
    const audio = new AudioGame(this.container);
    audio.setWords(words);
  }
}

export default GamesPage;
