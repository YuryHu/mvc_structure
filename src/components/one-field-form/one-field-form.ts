import './one-field-form.css';
import { Button } from '../../components';
import { createElement } from '../../utils/create-element';

export class OneFieldForm {
  public form: HTMLDivElement;

  public button: HTMLDivElement;

  public input: HTMLInputElement;

  constructor(buttonName: string, placeholder: string) {
    this.form = createElement('div', ['one-field-form']);
    this.button = new Button(
      ['button', `${buttonName}-button`, 'functional-button', 'disabled'],
      buttonName,
    ).render();
    this.input = createElement('input', ['single-input']);
    this.input.placeholder = placeholder;
    this.addInputChangeListener();
  }

  addInputChangeListener(): void {
    this.input.addEventListener('input', () => {
      this.button.classList.toggle('disabled', !this.input.value.length);
    });
  }

  resetForm(): void {
    this.input.value = '';
    this.button.classList.add('disabled');
  }

  isValid(): boolean {
    return !!this.input.value.length;
  }

  render(): HTMLDivElement {
    this.form.append(this.input, this.button);

    return this.form;
  }
}
