import './textbookPage.css';
import { TxtBkWord, PAGE } from '../../shared/types';
import BaseComponent from '../baseComponent/baseComponent';
import Card from '../card/card';
import { pageColors } from '../../shared/constants';

// TODO: show 7th group for known user
class TextbookPage extends BaseComponent {
  inner = `
        <div class="container textbook">
        <div class="textbook__games">
            <a href="#/games/audiocall" class="game-card game-card_audio">
              <img src="./assets/icons/audiochallenge.png" alt="audio-game" class="game-card__img">
              <span class="game-card__name">Аудиовызов</span>
            </a>
            <a href="#/games/sprint" class="game-card game-card_sprint">
              <img src="./assets/icons/sprint.png" alt="sprint-game" class="game-card__img">
              <span class="game-card__name">Спринт</span>
            </a>
          </div>
          <div class="textbook__level">
            <h3 class="textbook__level-title">Выберите  уровень сложности:</h3>
            <div class="textbook__level-buttons">
              <a class="textbook__button button_level button_level-1" href="/#/textbook/1">1</a>
              <a class="textbook__button button_level button_level-2" href="/#/textbook/2">2</a>
              <a class="textbook__button button_level button_level-3" href="/#/textbook/3">3</a>
              <a class="textbook__button button_level button_level-4" href="/#/textbook/4">4</a>
              <a class="textbook__button button_level button_level-5" href="/#/textbook/5">5</a>
              <a class="textbook__button button_level button_level-6" href="/#/textbook/6">6</a>
              <a class="textbook__button button_level button_difficult hide" href="/#/textbook/7">Сложные слова</a>
            </div>
          </div>
          <div class="textbook__cards"></div>
          <div class="textbook__pagination-buttons">
            <a class="textbook__button button_transparent button_start" href="/#/textbook/1/1">&lt;&lt;</a>
            <a class="textbook__button button_transparent button_prev" href="/#/textbook/1/1">&lt;</a>
            <a class="textbook__button button_transparent button_number" onclick="return false;">1</a>
            <a class="textbook__button button_transparent button_next" href="/#/textbook/1/2">&gt;</a>
            <a class="textbook__button button_transparent button_end" href="/#/textbook/1/30">&gt;&gt;</a>
          </div>
        </div>`;

  constructor() {
    super('main', 'main main-textbook', 'textbook');
  }

  drawCards(data: TxtBkWord[], userState: boolean): void {
    const cards: HTMLElement | null = document.querySelector('.textbook__cards');
    const btnSeven: HTMLElement | null = document.querySelector('.button_difficult');
    if (userState) {
      btnSeven?.classList.remove('hide');
    }
    if (cards) {
      const _ = data.map((item) => new Card(cards, item, userState));
    }
  }

  setPagination(grp: number, pg: number): void {
    // in DB group and page start from 0
    const group = grp + 1;
    const page = pg + 1;
    // for elements created from html template
    const btnSprint = <HTMLLinkElement>document.querySelector('.game-card_sprint');
    const btnAudiocall = <HTMLLinkElement>document.querySelector('.game-card_audio');
    if (group === 7) {
      const pgnDiv = document.querySelector('.textbook__pagination-buttons');
      pgnDiv?.remove();
      // pgnDiv?.classList.add('hide');
      btnSprint.href = `/#/${PAGE.PLAYSPRINT}/7`;
      btnAudiocall.href = `/#/${PAGE.PLAYAUDIOCALL}/7`;
    } else {
      const btnStart = <HTMLLinkElement>document.querySelector('.button_start');
      const btnPrev = <HTMLLinkElement>document.querySelector('.button_prev');
      const btnPgNum = <HTMLLinkElement>document.querySelector('.button_number');
      const btnNext = <HTMLLinkElement>document.querySelector('.button_next');
      const btnEnd = <HTMLLinkElement>document.querySelector('.button_end');

      btnPgNum.textContent = `${page}`;
      if (page === 1) {
        btnStart.classList.add('button_disabled');
        btnPrev.classList.add('button_disabled');
      }
      if (page === 30) {
        btnNext.classList.add('button_disabled');
        btnEnd.classList.add('button_disabled');
      }
      btnStart.href = `/#/${PAGE.TEXTBOOK}/${group}/1`;
      btnPrev.href = `/#/${PAGE.TEXTBOOK}/${group}/${page - 1}`;
      btnNext.href = `/#/${PAGE.TEXTBOOK}/${group}/${page + 1}`;
      btnEnd.href = `/#/${PAGE.TEXTBOOK}/${group}/30`;
      btnSprint.href = `/#/${PAGE.PLAYSPRINT}/${group}/${page}`;
      btnAudiocall.href = `/#/${PAGE.PLAYAUDIOCALL}/${group}/${page}`;
    }
  }

  changeBcgColor(grp: number): void {
    const textbook = document.getElementById('textbook') as HTMLElement;
    const color = pageColors[grp];
    textbook.style.backgroundColor = color;
  }
}

export default TextbookPage;
