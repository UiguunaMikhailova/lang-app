import NewElem from './newelem';

// node: parent node
// name: text in button
// classes: class names (space divided)
// disabled: on/off state
class Button extends NewElem<HTMLButtonElement> {
  constructor(node: HTMLElement, text: string, classes: string, disabled?: boolean) {
    super(node, 'button', classes, text);
    if (disabled) this.elem.disabled = true;
  }
}

export default Button;
