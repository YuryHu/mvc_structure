import './login-form.css';
import { createElement } from '../../utils/create-element';
import { LoginInputGroup, Button } from '../../components';

export class LoginForm {
  private readonly nameInputGroup: LoginInputGroup;

  private readonly passInputGroup: LoginInputGroup;

  private readonly submitButton: HTMLDivElement;

  public errorBlock: HTMLDivElement;

  constructor() {
    this.submitButton = new Button(
      ['login-button', 'submit-button', 'button', 'disabled'],
      'Log in',
    ).render();
    this.errorBlock = createElement('div', ['login-error-block', 'hidden']);
    this.nameInputGroup = new LoginInputGroup(
      'login',
      'Name',
      3,
      this.errorBlock,
      this.submitButton,
      'password',
      'text',
      true,
    );
    this.passInputGroup = new LoginInputGroup(
      'password',
      'Password',
      8,
      this.errorBlock,
      this.submitButton,
      'login',
      'password',
    );
  }

  clearForm(): void {
    const inputs = [this.nameInputGroup.input, this.passInputGroup.input];

    inputs.forEach((inputElement: HTMLInputElement) => {
      const input = inputElement;

      input.value = '';
      input.classList.remove('visited');
    });
    this.submitButton.classList.add('disabled');
  }

  isFormValid(): boolean {
    return this.nameInputGroup.isInputValid() && this.passInputGroup.isInputValid();
  }

  render(): HTMLFormElement {
    const loginForm = createElement('form', ['login-form']);
    const aboutButton = new Button(
      ['functional-button', 'about-button', 'button'],
      'About',
    ).render();

    loginForm.append(
      this.nameInputGroup.render(),
      this.passInputGroup.render(),
      this.errorBlock,
      aboutButton,
      this.submitButton,
    );

    return loginForm;
  }
}
