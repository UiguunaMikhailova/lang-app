import './cards.css';
import { URL } from '../../shared/constants';
import Img from '../../shared/img';
import NewElem from '../../shared/newelem';
import {
  TxtBkWord, ICON, DIFFICULTY,
} from '../../shared/types';
import Button from '../../shared/button';
import Sound from '../../shared/sound';
import SVG from '../../shared/svgLib';

// type for unused variables
type Unused = NewElem | Img | Button;

class Card extends NewElem {
  // current audio id
  private audioId: number;

  // audio playing state
  private isPlaying: boolean;

  // storage for audio
  private allAudio: Sound[];

  // click event place for audio
  private speaker: NewElem;

  private btnDifficult: HTMLButtonElement | null = null;

  private btnLearn: HTMLButtonElement | null = null;

  private word: TxtBkWord;

  // node: parent node
  // word: TxtBkWord object
  // userState: true for known user
  constructor(node: HTMLElement, word: TxtBkWord, userState: boolean) {
    // known user, styling card according the options
    let cardStyle = '';
    if (userState) {
      cardStyle = `${word.difficulty === DIFFICULTY.HARD ? ' difficult' : ''}${word.difficulty === DIFFICULTY.LEARN ? ' studied' : ''}`;
    }

    super(node, 'div', `card${cardStyle}`);

    this.word = word;

    const imgBlock = new NewElem(this.elem, 'div', 'card__img-wrapper');
    let _: Unused = new Img(imgBlock.elem, 'card__img', `${URL}${word.image}`, word.word);
    const cardCont = new NewElem(this.elem, 'div', 'card__content');

    const cardItemWord = new NewElem(cardCont.elem, 'div', 'card__item word-content');

    const wordBlock = new NewElem(cardItemWord.elem, 'div', 'word-content__word-wrapper word-wrapper');
    _ = new NewElem(wordBlock.elem, 'span', 'word-wrapper__word', word.word);
    _ = new NewElem(wordBlock.elem, 'span', 'word-wrapper__transcription', word.transcription);
    _ = new NewElem(cardItemWord.elem, 'div', 'word-content__translation', word.wordTranslate);

    this.speaker = new NewElem(cardItemWord.elem, 'div', 'word-content__audio-block');
    this.speaker.elem.innerHTML = this.speakerSVG();

    this.allAudio = [];
    this.allAudio.push(new Sound(this.speaker.elem, 'audio-block__audio', `${URL}${word.audio}`));
    this.allAudio.push(new Sound(this.speaker.elem, 'audio-block__audio', `${URL}${word.audioMeaning}`));
    this.allAudio.push(new Sound(this.speaker.elem, 'audio-block__audio', `${URL}${word.audioExample}`));

    const cardItemMeaning = new NewElem(cardCont.elem, 'div', 'card__item meaning');
    _ = new NewElem(cardItemMeaning.elem, 'div', 'meaning__en', word.textMeaning);
    _ = new NewElem(cardItemMeaning.elem, 'div', 'meaning__ru', word.textMeaningTranslate);

    const cardItemExample = new NewElem(cardCont.elem, 'div', 'card__item example');
    _ = new NewElem(cardItemExample.elem, 'div', 'example__en', word.textExample);
    _ = new NewElem(cardItemExample.elem, 'div', 'example__ru', word.textExampleTranslate);

    // known user, show buttons, show progress
    if (userState) {
      const cardItemBtnsProgress = new NewElem(cardCont.elem, 'div', 'card__item card-btns-progress');
      const cardBtns = new NewElem(cardItemBtnsProgress.elem, 'div', 'card-btns');
      this.btnDifficult = new Button(
        cardBtns.elem,
        'Сложное',
        `btn btn-difficult${word.difficulty === DIFFICULTY.HARD ? ' btn--yellow' : ''}`,
      ).elem;
      this.btnLearn = new Button(
        cardBtns.elem,
        'Изученное',
        `btn btn-studied${word.difficulty === DIFFICULTY.LEARN ? ' btn--yellow' : ''}`,
      ).elem;
      this.addBtnListeners();
      const cardProgress = new NewElem(cardItemBtnsProgress.elem, 'div', 'progress');
      _ = new NewElem(cardProgress.elem, 'div', 'progress__wins', `Угадано: ${word.wins ?? 0}`);
      _ = new NewElem(cardProgress.elem, 'div', 'progress__fails', `Ошибки: ${word.fails ?? 0}`);
    } else {
      this.isPlaying = false;
    }

    // 0..2 audio id
    this.audioId = 0;
    // isPlaying audio now?
    this.isPlaying = false;
    this.addSpeakerClickListener();
  }

  addBtnListeners(): void {
    this.btnDifficult?.addEventListener('click', () => this.dispatchClickOnBtns(DIFFICULTY.HARD));
    this.btnLearn?.addEventListener('click', () => this.dispatchClickOnBtns(DIFFICULTY.LEARN));
  }

  dispatchClickOnBtns(diffToSet: DIFFICULTY): void {
    const { id } = this.word;
    const difficulty = this.word.difficulty === diffToSet ? DIFFICULTY.NONE : diffToSet;
    const event = new CustomEvent('setDifficulty', { detail: { id, difficulty } });
    if (difficulty === DIFFICULTY.HARD) {
      this.btnDifficult?.classList.add('btn--yellow');
    } else {
      this.btnDifficult?.classList.remove('btn--yellow');
    }
    if (difficulty === DIFFICULTY.LEARN) {
      this.btnLearn?.classList.add('btn--yellow');
    } else {
      this.btnLearn?.classList.remove('btn--yellow');
    }
    document.dispatchEvent(event);
  }

  // Add click listener on speaker icon
  private addSpeakerClickListener(): void {
    this.speaker.elem.addEventListener('click', () => this.audioPlay());
  }

  // play audio
  private audioPlay(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.allAudio[this.audioId].elem.addEventListener('ended', () => this.audioPrepareNext(), { once: true });
      this.allAudio[this.audioId].run();
    }
  }

  // cycling audio id 0>1>2>0...
  private audioPrepareNext(): void {
    this.isPlaying = false;
    this.audioId = (this.audioId === 2 ? 0 : this.audioId + 1);
  }

  private removeSpeakerClickListener(): void {
    this.speaker.elem.removeEventListener('click', () => this.audioPlay());
  }

  // return: speaker svg
  private speakerSVG(): string {
    const result = SVG(ICON.SPEAKER);
    return result;
  }
}

export default Card;
