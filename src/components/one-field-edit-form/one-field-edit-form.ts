import './one-field-edit-form.css';
import { Button } from '../../components';
import { createElement } from '../../utils/create-element';

export class OneFieldEditForm {
  public form: HTMLDivElement;

  public editButton: HTMLDivElement;

  public deleteButton: HTMLDivElement;

  public input: HTMLInputElement;

  constructor() {
    this.form = createElement('div', ['one-field-edit-form', 'hidden']);
    this.editButton = new Button(
      ['button', 'edit-button', 'functional-button', 'disabled'],
      'edit',
    ).render();
    this.deleteButton = new Button(['button', 'delete-button'], 'delete').render();
    this.input = createElement('input', ['single-input']);
    this.addInputChangeListener();
  }

  addInputChangeListener(): void {
    this.input.addEventListener('input', () => {
      this.editButton.classList.toggle('disabled', !this.input.value.length);
    });
  }

  resetForm(): void {
    this.input.value = '';
    this.editButton.classList.add('disabled');
  }

  render(): HTMLDivElement {
    this.form.append(this.input, this.editButton, this.deleteButton);

    return this.form;
  }
}
