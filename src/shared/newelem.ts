class NewElem<T extends HTMLElement = HTMLElement> {
  readonly elem: T;

  // node: parent node
  // tag: string type of new element
  // classes: class names (space divided) for new element
  constructor(node: HTMLElement, tag: keyof HTMLElementTagNameMap = 'div', classes?: string, text?: string) {
    this.elem = <T>document.createElement(tag);
    if (classes) {
      let tempClass: string[] = [];
      if (/\s/.test(classes)) tempClass = classes.split(' ');
      this.elem.classList.add(...(tempClass.length ? tempClass : [classes]));
    }
    if (text) this.elem.innerHTML = text;
    node.appendChild(this.elem);
  }
}

export default NewElem;
