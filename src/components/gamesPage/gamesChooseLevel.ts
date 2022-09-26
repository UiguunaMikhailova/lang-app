import './gamesChooseLevel.css';
import BaseComponent from '../baseComponent/baseComponent';
import { GAME, PAGE } from '../../shared/types';
import NewElem from '../../shared/newelem';
import Link from '../../shared/link';

class GamesChooseLevel extends BaseComponent {
  inner = '';

  constructor() {
    super('main', 'main main-game', 'games');
  }

  draw(game: GAME): void {
    this.create();
    let _: NewElem | Link = new NewElem(this.container, 'h2', 'main-game__title', game === GAME.SPRINT ? 'Спринт' : 'Аудиовызов');
    _ = new NewElem(this.container, 'div', 'game__info', this.getGameInfo(game));
    _ = new NewElem(this.container, 'div', 'game__lvl-header', 'Выберите уровень сложности:');
    const gameDiv = new NewElem(this.container, 'div', 'game__lvl-content').elem;
    for (let i = 1; i < 7; i += 1) {
      _ = new Link(gameDiv, `lvl-content__link game__btn lvl-btn link_${i}`, `/#/${PAGE.GAMES}/${game}/${i}`, `${i}`);
    }
  }

  getGameInfo(game: GAME): string {
    let result = '';
    switch (game) {
      case GAME.SPRINT:
        result = `
        Тренирует навык быстрого перевода с английского языка на русский.
        Вам нужно выбрать, соответствует ли перевод предложенному слову.
        Для управления можно использовать мышь или стрелки влево/вправо на клавиатуре
        `;
        break;
      case GAME.AUDIOCALL:
        result = `<p>«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.</p>
        <p>Для управления можно использовать мышь или клавиатуру:</p>
        <p>1) клавиши от 1 до 5 для выбора ответа</p>
        <p>2) пробел для повторного звучания слова</p>
        <p>3) Enter для подсказки или для перехода к следующему слову</p>
        `;
        break;
      default:
      // empty
    }
    return result;
  }
}

export default GamesChooseLevel;
