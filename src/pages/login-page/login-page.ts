import './login-page.css';
import { createElement } from '../../utils/create-element';
import { LoginForm } from '../../components';

export class LoginPage {
  public readonly pageElement: HTMLDivElement;

  public readonly loginForm: LoginForm;

  public readonly loginFormElement: HTMLFormElement;

  constructor() {
    this.pageElement = createElement('div', ['login-page', 'page']);
    this.loginForm = new LoginForm();
    this.loginFormElement = this.loginForm.render();
  }

  render(): HTMLDivElement {
    this.pageElement.append(this.loginFormElement);

    return this.pageElement;
  }
}
