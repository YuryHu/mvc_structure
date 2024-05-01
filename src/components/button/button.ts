import './button.css';
import { createElement } from '../../utils/create-element';

export class Button {
  protected readonly classes: string[];

  protected readonly text: string;

  constructor(classes: string[], text: string) {
    this.classes = classes;
    this.text = text;
  }

  render(): HTMLDivElement {
    const button = createElement('div', this.classes, this.text);

    return button;
  }
}
