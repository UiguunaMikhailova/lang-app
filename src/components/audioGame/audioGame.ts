/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import './audioGame.css';
import {
  Word, ICON, Group, SprintWord, GAME, AUDIOGAME, CUSTOMEVENT,
} from '../../shared/types';
import NewElem from '../../shared/newelem';
import Button from '../../shared/button';
import Sound from '../../shared/sound';
import SVG from '../../shared/svgLib';
import { URL } from '../../shared/constants';

class AudioGame extends NewElem {
  private gameContainer: HTMLElement;

  private gameDiv: HTMLElement;

  private audioIcon: HTMLElement | null = null;

  private audioElem: Sound | null = null;

  private wordText: HTMLElement | null = null;

  private counter: HTMLElement | null = null;

  private answerButtonsContainer: HTMLElement | null = null;

  private answerBtns: HTMLButtonElement[] = [];

  private nextButton: HTMLButtonElement | null = null;

  private words: SprintWord[] = [];

  private wordIdx = 0;

  private indexOfRightAnswer = 0;

  private counterNumber: number = AUDIOGAME.AMOUNTOFWORDS;

  private gameStatus = AUDIOGAME.STATUSWAITING;

  private rightAnswerSeries = 0;

  private maxRightAnswerSeries = 0;

  private percent = 0;

  private sound: Group<Sound>;

  private onPressKeyb: (e: KeyboardEvent) => void;

  constructor(node: HTMLElement) {
    super(node, 'div', 'audiocall');

    this.onPressKeyb = () => { };

    this.gameContainer = new NewElem(this.elem, 'div', 'audio-game-container').elem;
    this.gameDiv = new NewElem(this.gameContainer, 'div', 'audio-game').elem;

    this.sound = {
      click: new Sound(this.gameDiv, 'window__audio audio_click', './assets/audio/click.mp3'),
      start: new Sound(this.gameDiv, 'window__audio audio_start', './assets/audio/start.mp3'),
      right: new Sound(this.gameDiv, 'window__audio audio_right', './assets/audio/right.mp3'),
      wrong: new Sound(this.gameDiv, 'window__audio audio_wrong', './assets/audio/wrong.mp3'),
    };

    this.drawStartCountdown();
  }

  private startGame(): void {
    const closeBtn = new NewElem(this.gameDiv, 'div', 'audio-game__close').elem;
    closeBtn.innerHTML = `<a href="#/games">${SVG(ICON.CLOSE)}</a>`;
    this.audioIcon = new NewElem(this.gameDiv, 'div', 'audio-game__icon').elem;
    this.audioElem = new Sound(this.audioIcon, 'audio-game__sound', `${URL}${null}`);
    const audioSvg = new NewElem(this.audioIcon, 'div', 'audio-game__svg').elem;
    audioSvg.innerHTML = SVG(ICON.SPEAKER);
    this.wordText = new NewElem(this.gameDiv, 'div', 'audio-game__word').elem;
    const counterDiv = new NewElem(this.gameDiv, 'div', 'audio-game__counter-wrapper').elem;
    this.counter = new NewElem(counterDiv, 'div', 'audio-game__counter').elem;
    this.answerButtonsContainer = new NewElem(this.gameDiv, 'div', 'audio-game__buttons').elem;
    this.nextButton = new Button(this.gameDiv, 'button', 'button').elem;
    this.nextButton.textContent = `${AUDIOGAME.SHOWANSWER} (enter)`;

    for (let i = 0; i < AUDIOGAME.AMOUNTOFANSWERS; i += 1) {
      const btn = new Button(this.answerButtonsContainer, 'button', 'button-light audio-game__button').elem;
      btn.id = `${i + 1}`;
      this.answerBtns?.push(btn);
    }

    this.initAudioListener(this.audioIcon, this.audioElem);
    this.drawWord();
    this.onPressKeyb = (e: KeyboardEvent) => this.answerKeyboardHandler(e);
    this.initKeyboardListeners();
    this.initListenersAnswer();
    this.initListenerNextBtn();
  }

  setWords(words: Word[]): void {
    const wordsArray = words.map((item: Word): string => item.word);
    wordsArray.sort(() => Math.random() - 0.5);
    words.length = AUDIOGAME.AMOUNTOFWORDS;
    this.words = words.map((item: Word, idx: number): SprintWord => {
      const result = <SprintWord>item;
      result.wrong = Math.round(Math.random()) && item.word !== wordsArray[idx]
        ? wordsArray[idx]
        : undefined;
      return result;
    });
  }

  private countdown(node: HTMLElement, time: number, callback: () => void): void {
    const elem = node;
    elem.textContent = `${time}`;
    const nextTime = time - 1;

    setTimeout((): void => {
      if (nextTime) {
        this.countdown(node, nextTime, callback);
      } else {
        elem.remove();
        callback();
      }
    }, 1000);
  }

  private drawStartCountdown(): void {
    const counter = new NewElem(this.gameDiv, 'p', 'window__counter counter_begin').elem;
    this.sound.start.run();
    this.countdown(counter, 5, (): void => this.startGame());
  }

  private drawWord(): void {
    this.gameStatus = AUDIOGAME.STATUSWAITING;
    (this.counter as HTMLElement).textContent = `${this.counterNumber}`;
    this.counterNumber -= 1;
    (this.nextButton as HTMLButtonElement).textContent = `${AUDIOGAME.SHOWANSWER} (enter)`;
    (this.wordText as HTMLElement).innerText = '';

    const arrayOfIncorrectIndexes = this.getRandomIndexes();
    if (this.wordIdx < this.words.length) {
      if (this.audioElem) {
        this.audioElem.elem.src = `${URL}${this.words[this.wordIdx].audio}`;
        this.audioElem.run();
      }

      this.answerBtns.forEach((btn: HTMLButtonElement, index: number): void => {
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
        if (index === this.indexOfRightAnswer) {
          btn.textContent = `${index + 1} ${this.words[this.wordIdx].wordTranslate}`;
        } else {
          const indexOfIncorrectAnswer = arrayOfIncorrectIndexes.pop() as number;
          btn.textContent = `${index + 1} ${this.words[indexOfIncorrectAnswer].wordTranslate}`;
        }
      });
    } else {
      this.endGame();
    }
  }

  private getRandomIndexes(): unknown[] {
    const set = new Set();
    this.indexOfRightAnswer = Math.floor(Math.random() * (AUDIOGAME.AMOUNTOFANSWERS - 0));
    while (set.size < AUDIOGAME.AMOUNTOFANSWERS) {
      const randomNumber = Math.floor(Math.random() * (this.words.length - 0));
      if (randomNumber !== this.wordIdx) {
        set.add(randomNumber);
      }
    }
    return [...set.keys()];
  }

  private checkAnswer(btn: HTMLButtonElement): void {
    this.gameStatus = AUDIOGAME.STATUSDONE;

    if (btn.textContent?.split(' ').slice(1).join() === this.words[this.wordIdx].wordTranslate) {
      this.rightAnswerSeries += 1;
      if (this.rightAnswerSeries > this.maxRightAnswerSeries) {
        this.maxRightAnswerSeries = this.rightAnswerSeries;
      }
      btn.classList.add('correct');
      this.sound.right.run();
      this.words[this.wordIdx].answer = true;
    } else {
      this.rightAnswerSeries = 0;
      btn.classList.add('incorrect');
      this.answerBtns[this.indexOfRightAnswer].classList.add('correct');
      this.sound.wrong.run();
      this.words[this.wordIdx].answer = false;
    }

    this.answerBtns.forEach((button: HTMLButtonElement): void => {
      button.disabled = true;
    });

    if (this.counterNumber === 1) {
      (this.nextButton as HTMLButtonElement).textContent = `${AUDIOGAME.SHOWRESULTS} (enter)`;
    } else {
      (this.nextButton as HTMLButtonElement).textContent = `${AUDIOGAME.NEXTWORD} (enter)`;
    }
    (this.wordText as HTMLElement).innerText = `${this.words[this.wordIdx].word}`;
  }

  private initListenersAnswer(): void {
    this.answerBtns?.forEach((btn: HTMLButtonElement): void => {
      btn.addEventListener('click', (e: Event): void => this.checkAnswer(e.target as HTMLButtonElement));
    });
  }

  private initKeyboardListeners(): void {
    window.addEventListener('keyup', this.onPressKeyb);
  }

  private initListenerNextBtn(): void {
    this.nextButton?.addEventListener('click', this.nextButtonHandler.bind(this));
  }

  private initAudioListener(elem: HTMLElement, snd: Sound): void {
    elem.addEventListener('click', (): void => snd.run());
  }

  private answerKeyboardHandler(e: KeyboardEvent): void {
    e.preventDefault();
    switch (e.key) {
      case AUDIOGAME.SPACE: {
        if (this.audioElem) this.audioElem.run();
        break;
      }
      case AUDIOGAME.ENTER: {
        console.log('enter');
        this.nextButtonHandler();
        break;
      }
      default: {
        if (this.gameStatus === AUDIOGAME.STATUSWAITING) {
          this.answerBtns.forEach((btn) => {
            const button = btn as HTMLButtonElement;
            if (btn.id === e.key) {
              this.checkAnswer(button);
            }
          });
        }
      }
    }
  }

  private showCorrectAnswer(): void {
    this.gameStatus = AUDIOGAME.STATUSDONE;
    this.answerBtns.forEach((btn) => {
      if (btn.textContent?.split(' ').slice(1).join() === this.words[this.wordIdx].wordTranslate) btn.classList.add('correct');
      btn.disabled = true;
    });
    if (this.counterNumber === 1) {
      (this.nextButton as HTMLButtonElement).textContent = `${AUDIOGAME.SHOWRESULTS} (enter)`;
    } else {
      (this.nextButton as HTMLButtonElement).textContent = `${AUDIOGAME.NEXTWORD} (enter)`;
    }
  }

  private nextButtonHandler(): void {
    this.nextButton?.blur();
    if ((this.nextButton as HTMLButtonElement).textContent === `${AUDIOGAME.SHOWANSWER} (enter)`) {
      this.rightAnswerSeries = 0;
      this.sound.click.run();
      (this.wordText as HTMLElement).innerText = `${this.words[this.wordIdx].word}`;
      this.showCorrectAnswer();
      this.words[this.wordIdx].answer = false;
    } else {
      this.wordIdx += 1;
      this.drawWord();
    }
  }

  private endGame(): void {
    const rightAnswers = this.words.filter((item) => item.answer).length;
    const wrongAnswers = this.words.filter((item) => !item.answer).length;
    const percentOfRightAnswers = (rightAnswers / AUDIOGAME.AMOUNTOFWORDS) * 100;
    this.percent = percentOfRightAnswers;
    let _: HTMLElement;
    this.gameDiv.innerHTML = '';
    this.gameDiv.classList.add('nogap');
    const resTable = new NewElem(this.gameDiv, 'div', 'window__table').elem;

    window.removeEventListener('keyup', this.onPressKeyb);

    if (rightAnswers) {
      _ = new NewElem(resTable, 'div', 'table__header header_right', `Правильных ответов: ${rightAnswers}`).elem;
      this.words.forEach((item, index) => {
        if (this.words[index].answer) {
          this.drawTableRow(resTable, index, 'row_green');
        }
      });
    }

    if (wrongAnswers) {
      _ = new NewElem(resTable, 'div', 'table__header header_wrong', `Неправильных ответов: ${wrongAnswers}`).elem;
      this.words.forEach((item, index) => {
        if (!this.words[index].answer) {
          this.drawTableRow(resTable, index, 'row_red');
        }
      });
    }

    const resBtn = new Button(this.gameDiv, 'Играть заново', 'window__btn btn btn_replay').elem;
    this.dispatchGameStatisticEvent();
    this.initReplayListener(resBtn);
  }

  private dispatchGameStatisticEvent(): void {
    const game = GAME.AUDIOCALL;
    const words = this.words;
    const succession = this.maxRightAnswerSeries;
    const percent = this.percent;
    const event = new CustomEvent(CUSTOMEVENT.GAMESTATISTIC, {
      detail: {
        game, words, succession, percent,
      },
    });
    document.dispatchEvent(event);
  }

  private initReplayListener(elem: HTMLElement): void {
    elem.addEventListener('click', (): void => {
      this.sound.click.run();
      const reWords = this.words.map((item: SprintWord): SprintWord => {
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

  private initValues(): void {
    for (let i = this.gameDiv.childNodes.length - 1; i >= 0; i -= 1) {
      if (this.gameDiv.childNodes[i].nodeName !== 'AUDIO') this.gameDiv.childNodes[i].remove();
    }
    this.wordIdx = 0;
    this.indexOfRightAnswer = 0;
    this.counterNumber = AUDIOGAME.AMOUNTOFWORDS;
    this.answerBtns = [];
    this.rightAnswerSeries = 0;
    this.maxRightAnswerSeries = 0;
    this.gameStatus = AUDIOGAME.STATUSWAITING;
    this.percent = 0;
  }

  private drawTableRow(node: HTMLElement, index: number, css: string): void {
    const row = new NewElem(node, 'div', `table__row ${css}`).elem;
    const audioDiv = new NewElem(row, 'div', 'row__audio').elem;
    audioDiv.innerHTML = SVG(ICON.SPEAKER);
    const snd = new Sound(audioDiv, 'audio__sound', `${URL}${this.words[index].audio}`);
    this.initAudioListener(audioDiv, snd);
    let _ = new NewElem(row, 'div', 'row__word', `${this.words[index].word}`).elem;
    _ = new NewElem(row, 'div', 'row__translation', `${this.words[index].wordTranslate}`).elem;
  }
}

export default AudioGame;
