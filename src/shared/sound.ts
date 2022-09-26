import NewElem from './newelem';

// node: parent node
// classes: class names (space divided)
// src: image source
class Sound extends NewElem<HTMLAudioElement> {
  constructor(node: HTMLElement, classes: string, src: string) {
    super(node, 'audio', classes);
    this.elem.src = src;
  }

  run(): void {
    this.elem.currentTime = 0;
    this.elem.play();
  }
}

export default Sound;
