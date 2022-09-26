import './sprint.css';
import {
  Word, SprintWord, ANSWER, ICON, Group, GAME,
} from '../../shared/types';
import NewElem from '../../shared/newelem';
import Button from '../../shared/button';
import Sound from '../../shared/sound';
import SVG from '../../shared/svgLib';
import { URL } from '../../shared/constants';

class Sprint extends NewElem {
  private gameDiv: HTMLElement;

  private wordDiv: HTMLElement | null = null;

  private translateDiv: HTMLElement | null = null;

  private counter: HTMLElement | null = null;

  private score = 0;

  private scoreDiv: HTMLElement | null = null;

  private questionDiv: HTMLElement | null = null;

  private btns: {
    self: HTMLElement | null,
    left: HTMLElement | null,
    right: HTMLElement | null
  } = { self: null, left: null, right: null };

  private words: SprintWord[] = [];

  private wordIdx = 0;

  private rightAnswers = 0;

  private wrongAnswers = 0;

  private isGameNotOver = true;

  private onClickLeft: () => void;

  private onClickRight: () => void;

  private onPressKeyb: (e: KeyboardEvent) => void;

  private sound: Group<Sound>;

  private succession = 0;

  private maxSuccession = 0;

  constructor(node: HTMLElement) {
    super(node, 'div', 'sprint');
    this.gameDiv = new NewElem(this.elem, 'div', 'game__window modal__window').elem;
    this.onClickLeft = () => { };
    this.onClickRight = () => { };
    this.onPressKeyb = () => { };
    this.sound = {
      click: new Sound(this.gameDiv, 'window__audio audio_click', './assets/audio/click.mp3'),
      start: new Sound(this.gameDiv, 'window__audio audio_start', './assets/audio/start.mp3'),
      right: new Sound(this.gameDiv, 'window__audio audio_right', './assets/audio/right.mp3'),
      wrong: new Sound(this.gameDiv, 'window__audio audio_wrong', './assets/audio/wrong.mp3'),
      end: new Sound(this.gameDiv, 'window__audio audio_end', './assets/audio/end.mp3'),
    };
    this.drawStartCountdown();
  }

  private countdown(node: HTMLElement, time: number, callback: () => void): void {
    const elem = node;
    elem.textContent = `${time}`;
    const nextTime = time - 1;
    setTimeout(() => {
      if (nextTime) {
        this.countdown(node, nextTime, callback);
      } else {
        elem.remove();
        callback();
      }
    }, 1000);
  }

  private progressRing(node: HTMLElement, current = 0): void {
    const addAngle = 6; // angle increment
    const maxAngle = (59 - 1) * addAngle; // max progress ring angle for 59 sec
    const next = current + addAngle;
    setTimeout(() => {
      if (current < maxAngle) {
        const dot = new NewElem(node, 'div', 'progress__dot').elem;
        dot.style.transform = `translateY(-1.5rem) rotate(${current}deg)`;
        this.progressRing(node, next);
      } else {
        node.remove();
      }
    }, 1000);
  }

  private initValues(): void {
    // remove non-audio content
    for (let i = this.gameDiv.childNodes.length - 1; i >= 0; i -= 1) {
      if (this.gameDiv.childNodes[i].nodeName !== 'AUDIO') this.gameDiv.childNodes[i].remove();
    }
    this.wordIdx = 0;
    this.rightAnswers = 0;
    this.wrongAnswers = 0;
    this.score = 0;
    this.isGameNotOver = true;
    this.succession = 0;
    this.maxSuccession = 0;
  }

  private drawStartCountdown(): void {
    const counter = new NewElem(this.gameDiv, 'p', 'window__counter counter_begin').elem;
    this.sound.start.run();
    this.countdown(counter, 5, () => this.startGame()); // countdown for 5 sec
  }

  private drawWord(): void {
    if (this.wordIdx < this.words.length && this.isGameNotOver) {
      if (this.wordDiv) this.wordDiv.textContent = this.words[this.wordIdx].word;
      const wordTrans = this.words[this.wordIdx].wrong ?? this.words[this.wordIdx].wordTranslate;
      if (this.translateDiv) this.translateDiv.textContent = wordTrans;
    } else {
      this.endGame();
    }
  }

  private startGame(): void {
    this.scoreDiv = new NewElem<HTMLButtonElement>(this.gameDiv, 'div', 'window__score').elem;
    const wordBlock = new NewElem(this.gameDiv, 'div', 'window__word-block').elem;
    this.wordDiv = new NewElem(wordBlock, 'div', 'window__word').elem;
    const _ = new NewElem(wordBlock, 'div', 'window__equal', '➜').elem;
    this.translateDiv = new NewElem(wordBlock, 'div', 'window__translate').elem;
    this.questionDiv = new NewElem(this.gameDiv, 'div', 'window__question', 'Это правильный перевод?').elem;
    this.btns.self = new NewElem(this.gameDiv, 'div', 'window__btns').elem;
    this.btns.left = new Button(this.btns.self, '🠔 Нет', 'window__btn btn btn_left').elem;
    this.btns.right = new Button(this.btns.self, 'Да ➝', 'window__btn btn btn_right').elem;
    const counterDiv = new NewElem(this.gameDiv, 'div', 'window__counter counter_wrapper').elem;
    this.counter = new NewElem(counterDiv, 'div', 'window__counter counter_game').elem;
    this.progressRing(counterDiv);
    this.countdown(this.counter, 59, () => this.setGameOver()); // countdown for 59 sec
    this.drawWord();
    this.updateScore();
    if (this.btns.left) this.onClickLeft = () => this.onClick(<HTMLElement>(this.btns.left));
    if (this.btns.right) this.onClickRight = () => this.onClick(<HTMLElement>(this.btns.right));
    this.onPressKeyb = (e: KeyboardEvent) => this.onKeyPress(e);
    this.initListeners();
  }

  // init listeners
  private initListeners(): void {
    const { left } = this.btns;
    if (left) left.addEventListener('click', this.onClickLeft);
    const { right } = this.btns;
    if (right) right.addEventListener('click', this.onClickRight);
    window.addEventListener('keyup', this.onPressKeyb);
  }

  // remove listeners
  private removeListeners(): void {
    const { left } = this.btns;
    if (left) left.removeEventListener('click', this.onClickLeft);
    const { right } = this.btns;
    if (right) right.removeEventListener('click', this.onClickRight);
    window.removeEventListener('keyup', this.onPressKeyb);
  }

  private setGameOver(): void {
    this.isGameNotOver = false;
  }

  private updateScore(): void {
    if (this.scoreDiv) this.scoreDiv.textContent = `${this.score}`;
  }

  private endGame(): void {
    this.sound.end.run();
    let _: HTMLElement;
    if (this.counter) {
      this.counter.parentElement?.remove();
    }
    this.removeListeners();
    this.btns.self?.remove();
    this.scoreDiv?.remove();
    this.wordDiv?.parentElement?.remove();
    this.questionDiv?.remove();
    this.gameDiv.classList.add('nogap');
    _ = new NewElem(this.gameDiv, 'div', 'window__header', `Твой результат: <span>${this.score}</span> баллов`).elem;
    const resTable = new NewElem(this.gameDiv, 'div', 'window__table').elem;
    if (this.rightAnswers) {
      _ = new NewElem(resTable, 'div', 'table__header header_right', `Правильных ответов: ${this.rightAnswers}`).elem;
      this.words.forEach((item) => {
        if (item.answer) {
          this.drawTableRow(resTable, item, 'row_green');
        }
      });
    }
    if (this.wrongAnswers) {
      _ = new NewElem(resTable, 'div', 'table__header header_wrong', `Неправильных ответов: ${this.wrongAnswers}`).elem;
      this.words.forEach((item) => {
        if (item.answer === false) {
          this.drawTableRow(resTable, item, 'row_red');
        }
      });
    }
    const resBtn = new Button(this.gameDiv, 'Играть заново', 'window__btn btn btn_replay').elem;
    this.dispatchGameStatisticEvent();
    this.initReplayListener(resBtn);
  }

  private dispatchGameStatisticEvent(): void {
    const game = GAME.SPRINT;
    const words = this.words.filter((item) => item.answer !== undefined);
    const succession = this.maxSuccession;
    const event = new CustomEvent('gameStatistic', { detail: { game, words, succession } });
    document.dispatchEvent(event);
  }

  private drawTableRow(node: HTMLElement, word: SprintWord, css: string): void {
    const row = new NewElem(node, 'div', `table__row ${css}`).elem;
    // audio cell
    const audioDiv = new NewElem(row, 'div', 'row__audio').elem;
    audioDiv.innerHTML = SVG(ICON.SPEAKER);
    const snd = new Sound(audioDiv, 'audio__sound', `${URL}${word.audio}`);
    this.initAudioListener(audioDiv, snd);
    // word & translation cells
    let _ = new NewElem(row, 'div', 'row__word', `${word.word}`).elem;
    _ = new NewElem(row, 'div', 'row__translation', `${word.wordTranslate}`).elem;
  }

  private initAudioListener(elem: HTMLElement, snd: Sound): void {
    elem.addEventListener('click', () => snd.run());
  }

  private initReplayListener(elem: HTMLElement): void {
    elem.addEventListener('click', () => {
      this.sound.click.run();
      const reWords = this.words.map((item) => {
        const word = item;
        word.answer = undefined;
        word.wrong = undefined;
        return word;
      });
      this.setWords(reWords);
      this.initValues();
      this.gameDiv.classList.remove('nogap');
      this.drawStartCountdown();
    });
  }

  private processAnswer(answer: ANSWER): void {
    const goodAnswer = this.words[this.wordIdx].wrong ? ANSWER.WRONG : ANSWER.RIGHT;
    this.words[this.wordIdx].answer = (answer === goodAnswer);
    const classForAnswer = this.words[this.wordIdx].answer ? 'green-shadow' : 'red-shadow';
    if (this.words[this.wordIdx].answer) {
      this.succession += 1;
      if (this.maxSuccession < this.succession) this.maxSuccession = this.succession;
      this.sound.right.run();
      this.rightAnswers += 1;
      if (this.rightAnswers < 4) { // первые 3 ответа по 10 баллов
        this.score += 10;
      } else if (this.rightAnswers < 7) { // вторые 3 ответа по 20 баллов
        this.score += 20;
      } else if (this.rightAnswers < 10) { // ещё 3 ответа по 40 баллов
        this.score += 40;
      } else {
        this.score += 80; // остальные ответы по 80 баллов
      }
      this.updateScore();
    } else {
      this.succession = 0;
      this.sound.wrong.run();
      this.wrongAnswers += 1;
    }
    this.gameDiv.classList.add(classForAnswer);
    setTimeout(() => {
      this.gameDiv.classList.remove(classForAnswer);
    }, 150);
    this.wordIdx += 1;
    this.drawWord();
  }

  private onClick(node: HTMLElement): void {
    const { classList } = node;
    if (classList.contains('btn_left')) {
      this.processAnswer(ANSWER.WRONG);
    }
    if (classList.contains('btn_right')) {
      this.processAnswer(ANSWER.RIGHT);
    }
  }

  private animateClick(elem: HTMLElement): void {
    elem.classList.add('soft-click');
    setTimeout(() => {
      elem.classList.remove('soft-click');
    }, 150);
  }

  // check: if Left or Right key pressed
  private onKeyPress(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft' && this.btns.left) {
      this.animateClick(this.btns.left);
      this.btns.left.click();
    }
    if (e.key === 'ArrowRight' && this.btns.right) {
      this.animateClick(this.btns.right);
      this.btns.right.click();
    }
  }

  setWords(words: Word[]): void {
    const wordTrans = words.map((item) => item.wordTranslate);
    wordTrans.sort(() => Math.random() - 0.5); // shuffle array
    this.words = words.map((item, idx) => {
      const result = <SprintWord>item;
      result.wrong = Math.round(Math.random()) && item.wordTranslate !== wordTrans[idx]
        ? wordTrans[idx]
        : undefined;
      return result;
    });
  }
}

export default Sprint;
