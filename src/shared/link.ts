import NewElem from './newelem';

// node: parent node
// classes: class names (space divided)
// href: href
// text: link text
class Link extends NewElem<HTMLLinkElement> {
  constructor(node: HTMLElement, classes: string, href: string, text: string) {
    super(node, 'a', classes);
    this.elem.href = href;
    this.elem.textContent = text;
  }
}

export default Link;
