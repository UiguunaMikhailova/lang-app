import './modal.css';
import NewElem from '../../shared/newelem';

// create modal window attached to document body
// classes: optional class names (space divided)
class Modal extends NewElem {
  content: NewElem;

  constructor(classes = '') {
    super(document.body, 'div', classes);
    this.elem.classList.add('modal__shadow');
    this.content = new NewElem(this.elem, 'div', 'modal__window');
    document.body.classList.add('stop-scrolling');
    this.initListeners();
  }

  // remove listeners and window node
  destroy(): void {
    this.elem.removeEventListener('click', (e: Event) => this.onClick(e));
    window.removeEventListener('keyup', (e: KeyboardEvent) => this.onEscPress(e));
    document.body.classList.remove('stop-scrolling');
    this.elem.remove();
  }

  // init listeners
  initListeners(): void {
    this.elem.addEventListener('click', (e: Event) => this.onClick(e));
    window.addEventListener('keyup', (e: KeyboardEvent) => this.onEscPress(e));
  }

  // check: if click on shadow do close
  onClick(e: Event): void {
    const { classList } = (<HTMLElement>e.target);
    if (classList.contains('modal__shadow')) {
      this.destroy();
    }
  }

  // check: if esc pressed do close
  onEscPress(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.destroy();
  }
}

export default Modal;
