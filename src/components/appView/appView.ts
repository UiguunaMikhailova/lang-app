import {
  Word, GAME, PAGE, TxtBkWord,
} from '../../shared/types';
import './basic.css';
import AuthPage from '../authPage/authPage';
import ErrorPage from '../errorPage/errorPage';
import Footer from '../footer/footer';
import GamesPage from '../gamesPage/gamesPage';
import Header from '../header/header';
import HomePage from '../homePage/homePage';
import StatisticPage from '../statisticPage/statisticPage';
import TextbookPage from '../textbookPage/textbookPage';
import BurgerMenu from '../header/burgerMenu';
import GamesChooseLevel from '../gamesPage/gamesChooseLevel';

class AppView {
  header: Header;

  homePage: HomePage;

  authPage: AuthPage;

  textbookPage: TextbookPage;

  gamesPage: GamesPage;

  statisticPage: StatisticPage;

  errorPage: ErrorPage;

  footer: Footer;

  burgerMenu: BurgerMenu;

  gamesChooseLevel: GamesChooseLevel;

  constructor() {
    this.header = new Header();
    this.homePage = new HomePage();
    this.authPage = new AuthPage();
    this.gamesPage = new GamesPage(false);
    this.textbookPage = new TextbookPage();
    this.statisticPage = new StatisticPage();
    this.errorPage = new ErrorPage();
    this.footer = new Footer();
    this.burgerMenu = new BurgerMenu();
    this.gamesChooseLevel = new GamesChooseLevel();
  }

  renderPage(
    pageId: string,
    data?: Word[] | TxtBkWord[],
    userState?: boolean,
    group?: number,
    page?: number,
  ): void {
    const main: HTMLElement | null = document.querySelector('main');
    // don't remove main for auth
    if (main && pageId !== 'authorization') {
      main.remove();
    }
    switch (pageId) {
      case PAGE.HOME:
        this.homePage.create();
        break;
      case PAGE.TEXTBOOK:
        this.textbookPage.create();
        if (data) {
          this.textbookPage.drawCards(<TxtBkWord[]>data, userState ?? false);
          this.textbookPage.setPagination(group ?? 0, page ?? 0);
          this.textbookPage.changeBcgColor(group ?? 0);
        }
        break;
      case PAGE.GAMES:
        this.gamesPage.create();
        break;
      case PAGE.PLAYSPRINT:
        if (data) {
          this.gamesPage.create();
          this.gamesPage.drawSprint(<Word[]>data);
        }
        break;
      case PAGE.PLAYAUDIOCALL:
        if (data) {
          this.gamesPage.create();
          this.gamesPage.drawAudio(<Word[]>data);
        }
        break;
      case PAGE.GAMESPRINT:
        this.gamesChooseLevel.draw(GAME.SPRINT);
        break;
      case PAGE.GAMEAUDIOCALL:
        this.gamesChooseLevel.draw(GAME.AUDIOCALL);
        break;
      case PAGE.STATISTIC:
        this.statisticPage.create();
        break;
      default:
        this.errorPage.create();
    }
  }

  create(): void {
    this.header.create();
    this.homePage.create();
    this.footer.create();
    this.burgerMenu.addListeners();
  }
}

export default AppView;
