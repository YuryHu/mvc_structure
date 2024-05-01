import './login-input-group.css';
import { createElement } from '../../utils/create-element';

const pattern: RegExp = /^[a-zA-Z0-9]+$/;

const passPattern: RegExp = /(?=.*?[0-9])(?=.*?[A-Za-z]).+/;

export class LoginInputGroup {
  private readonly inputName: string;

  private readonly labelText: string;

  private readonly autofocus?: boolean = false;

  public readonly input: HTMLInputElement;

  private readonly helpBlock: HTMLDivElement;

  private readonly submitButton: HTMLDivElement;

  private readonly errorBlock: HTMLDivElement;

  private readonly siblingName: string;

  private readonly type: 'text' | 'password';

  private pattern: RegExp;

  private allowedSymbolsMessage: string;

  constructor(
    inputName: string,
    labelText: string,
    minLength: number,
    errorBlock: HTMLDivElement,
    submitButton: HTMLDivElement,
    siblingName: string,
    type: 'text' | 'password',
    autofocus: boolean = false,
  ) {
    this.siblingName = siblingName;
    this.inputName = inputName;
    this.labelText = labelText;
    this.autofocus = autofocus;
    this.input = createElement('input', ['login-input']);
    this.type = type;
    this.configureInput(minLength);
    this.helpBlock = createElement('div', ['help-block', `${this.inputName}-help-block`]);
    this.submitButton = submitButton;
    this.errorBlock = errorBlock;

    if (type === 'password') {
      this.pattern = passPattern;
      this.allowedSymbolsMessage = 'Pass must contain at least one letter and at least one digit';
    } else {
      this.pattern = pattern;
      this.allowedSymbolsMessage = `${this.labelText} can contain only english letters and digits`;
    }
  }

  configureInput(minLength: number): void {
    this.input.name = this.inputName;
    this.input.setAttribute('id', this.inputName);
    this.input.setAttribute('type', this.type);
    this.input.setAttribute('required', '');
    this.input.setAttribute('minlength', `${minLength}`);

    if (this.autofocus) {
      this.input.setAttribute('autofocus', '');
    }
  }

  displayMessage(message: string): void {
    this.helpBlock.classList.add('exclamated');
    this.helpBlock.innerText = message;
  }

  hideMessage(): void {
    this.helpBlock.classList.remove('exclamated');
    this.helpBlock.innerText = '';
  }

  getErrorMessage(): string {
    if (this.input.value.length) {
      const matches = this.input.value.match(this.pattern);

      if (matches === null) {
        return this.allowedSymbolsMessage;
      }

      if (matches !== null && matches[0] !== this.input.value) {
        return this.allowedSymbolsMessage;
      }

      if (this.input.value.length < this.input.minLength) {
        return `${this.labelText} must not be shorter than ${this.input.minLength} symbols`;
      }

      return '';
    }

    return `${this.labelText} must not be shorter than ${this.input.minLength} symbols`;
  }

  addInputListener(): void {
    this.input.addEventListener('input', () => {
      this.errorBlock.classList.add('hidden');
      this.input.classList.add('visited');
      this.hideMessage();
      const message = this.getErrorMessage();

      if (message.length) {
        this.displayMessage(message);
      }

      this.submitButton.classList.toggle(
        'disabled',
        !(this.isInputValid() && this.isSiblingValid()),
      );
    });
  }

  isInputValid(): boolean {
    return this.helpBlock.innerText.length === 0 && this.input.value.length !== 0;
  }

  isSiblingValid(): boolean {
    const siblungInput = document.querySelector(`#${this.siblingName}`) as HTMLInputElement;
    const siblingHelpBlock = document.querySelector(
      `.${this.siblingName}-help-block`,
    ) as HTMLDivElement;

    return siblingHelpBlock.innerText.length === 0 && siblungInput.value.length !== 0;
  }

  render(): HTMLDivElement {
    const inputGroup = createElement('div', ['input-group']);
    const label = createElement('label', ['login-label'], this.labelText);

    label.htmlFor = this.inputName;
    label.setAttribute('title', 'Field is required');
    this.addInputListener();
    inputGroup.append(label);
    inputGroup.append(this.input);
    inputGroup.append(this.helpBlock);

    return inputGroup;
  }
}
