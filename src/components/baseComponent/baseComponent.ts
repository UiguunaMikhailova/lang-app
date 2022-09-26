class BaseComponent {
  container: HTMLElement;

  inner!: string;

  constructor(tagName: string, className: string, idName: string) {
    this.container = document.createElement(tagName);
    let tempClass: string[] = [];
    if (/\s/.test(className)) tempClass = className.split(' ');
    this.container.classList.add(...(tempClass.length ? tempClass : [className]));
    this.container.id = idName;
  }

  create(): void {
    const header = document.querySelector('header');
    if (header) {
      header.after(this.container);
    }
    this.container.innerHTML = this.inner;
  }
}

export default BaseComponent;
