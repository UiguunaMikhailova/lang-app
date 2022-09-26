import './footer.css';
import BaseComponent from '../baseComponent/baseComponent';

class Footer extends BaseComponent {
  inner = `
        <div class="container footer__container">
          <a class="rs__link" href="https://rs.school/js/" target="_blank" rel="noopener noreferrer">
            <img src="./assets/icons/rsschool.svg" alt="RSSchool" class="rs__logo">
          </a>
          <div class="github">
            <a class="github__link" href="https://github.com/HamSilver" target="_blank" rel="noopener noreferrer">HamSilver</a>
            <a class="github__link" href="https://github.com/UiguunaMikhailova" target="_blank" rel="noopener noreferrer">UiguunaMikhailova</a>
            <a class="github__link" href="https://github.com/KristiBo" target="_blank" rel="noopener noreferrer">KristiBo</a>
          </div>
          <span class="year">© 2022</span>
        </div>`;

  constructor() {
    super('footer', 'footer', 'footer');
  }

  create(): void {
    document.body.append(this.container);
    this.container.innerHTML = this.inner;
  }
}

export default Footer;
