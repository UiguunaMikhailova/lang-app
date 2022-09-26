import NewElem from './newelem';

// node: parent node
// classes: class names (space divided)
// src: image source
// alt: descriptrion
class Img extends NewElem<HTMLImageElement> {
  constructor(node: HTMLElement, classes: string, src: string, alt: string) {
    super(node, 'img', classes);
    this.elem.src = src;
    this.elem.alt = alt;
  }
}

export default Img;
