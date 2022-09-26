import {
  PAGE, GameStat, GAME, TUser, WordDifficulty,
} from './shared/types';
import AppView from './components/appView/appView';
import Model from './components/model/model';

class App {
  model: Model;

  view: AppView;

  constructor() {
    this.model = new Model();
    this.view = new AppView();
  }

  start(): void {
    this.view.create();
    this.getUserAuth();
    this.view.header.addListeners(() => this.showAuth());
    this.initOnHashChange();
    this.initLoginListener();
    this.initGameStatListener();
    this.initSetDifficultyListener();
  }

  // show auth form
  showAuth(): void {
    const linkAuth = <HTMLAnchorElement>document.querySelector('.nav__link_auth');
    if (linkAuth && this.model.isRegisteredUser) {
      // logout
      linkAuth.classList.remove('logged-in');
      linkAuth.textContent = 'Войти';
      this.model.logout();
      this.onHashChange(); // page refresh
    } else {
      this.view.authPage.create();
    }
  }

  initLoginListener(): void {
    document.addEventListener('userLogin', (event: Event) => this.onUserLogin(event));
  }

  initGameStatListener(): void {
    document.addEventListener('gameStatistic', (event: Event) => this.onGameStat(event));
  }

  initSetDifficultyListener(): void {
    document.addEventListener('setDifficulty', (event: Event) => this.onSetDifficulty(event));
  }

  getUserAuth(): void {
    if (localStorage.getItem('userId')) {
      this.model.userState = true;
      const linkAuth = <HTMLAnchorElement>document.querySelector('.nav__link_auth');
      if (linkAuth) {
        linkAuth.classList.add('logged-in');
        linkAuth.textContent = 'Выйти';
        this.onHashChange();
      }
    }
  }

  async onSetDifficulty(event: Event): Promise<void> {
    const { id, difficulty } = <WordDifficulty>(<CustomEvent>event).detail;
    if (this.model.isRegisteredUser) await this.model.setWordDifficulty(id, difficulty);
  }

  async onGameStat(event: Event): Promise<void> {
    const statistic = <GameStat>(<CustomEvent>event).detail;
    if (this.model.isRegisteredUser) this.model.saveStatFromGame(statistic);
  }

  async runGameFromTxtBk(game: GAME, group: number, page: number): Promise<void> {
    if (group > 0 && group < 7 && +group.toFixed(0) === group) {
      const dict = await this.model.getWordsFromTxtBk(game, group, page);
      const pageId = game === GAME.SPRINT ? PAGE.PLAYSPRINT : PAGE.PLAYAUDIOCALL;
      if (dict) this.view.renderPage(pageId, dict);
    } else {
      window.location.hash = 'error';
    }
  }

  async runGameFromGames(game: GAME, group: number): Promise<void> {
    if (group > 0 && group < 7 && +group.toFixed(0) === group) {
      const dict = await this.model.getWordsForGame(game, group);
      const page = game === GAME.SPRINT ? PAGE.PLAYSPRINT : PAGE.PLAYAUDIOCALL;
      if (dict) this.view.renderPage(page, dict);
    } else {
      window.location.hash = 'error';
      // throw new Error(`Get wrong level number while starting Sprint game: ${level}`);
    }
  }

  async onUserLogin(event: Event): Promise<void> {
    const userData = <TUser>(<CustomEvent>event).detail;
    const [result, error] = await this.model.userLogin(userData);
    if (error) {
      this.view.authPage.showErrorMsg(error);
    }
    if (result) {
      this.view.authPage.closeModal();
      const linkAuth = <HTMLAnchorElement>document.querySelector('.nav__link_auth');
      if (linkAuth) {
        linkAuth.classList.add('logged-in');
        linkAuth.textContent = 'Выйти';
        this.onHashChange();
      }
    }
  }

  async onHashChange(): Promise<void> {
    let hash = window.location.hash.substring(2);
    if (hash === '') hash = PAGE.HOME;
    const hashParts = hash.split('/');
    if (hashParts[0] === PAGE.TEXTBOOK) {
      // textbook
      let group = +(hashParts[1] ?? 0);
      if (group) group -= 1;
      let page = +(hashParts[2] ?? 0);
      if (page) page -= 1;
      const [words, error] = await this.model.getWords({ group, page });
      if (error) console.log(error); // TODO: remake it
      if (words) {
        this.view.renderPage(PAGE.TEXTBOOK, words, this.model.isRegisteredUser, group, page);
      }
    } else if (hashParts.length === 4 && hashParts[1] === GAME.SPRINT) {
      // run sprint
      this.runGameFromTxtBk(GAME.SPRINT, Number(hashParts[2]), Number(hashParts[3]));
    } else if (hashParts.length === 4 && hashParts[1] === GAME.AUDIOCALL) {
      // run audio call
      this.runGameFromTxtBk(GAME.AUDIOCALL, Number(hashParts[2]), Number(hashParts[3]));
    } else if (hashParts.length === 3 && hashParts[1] === GAME.SPRINT) {
      // run sprint
      this.runGameFromGames(GAME.SPRINT, Number(hashParts[2]));
    } else if (hashParts.length === 3 && hashParts[1] === GAME.AUDIOCALL) {
      // run audio call
      this.runGameFromGames(GAME.AUDIOCALL, Number(hashParts[2]));
    } else {
      // TODO: prepare some data if needed for page
      this.view.renderPage(hash, [], this.model.isRegisteredUser);
    }
  }

  initOnHashChange(): void {
    window.addEventListener('hashchange', () => this.onHashChange());
  }
}

export default App;
