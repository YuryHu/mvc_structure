import './about-page.css';
import { createElement } from '../../utils/create-element';
import { Button, GithubLink } from '../../components';

export class AboutPage {
  public readonly pageElement: HTMLDivElement;

  constructor() {
    this.pageElement = createElement('div', ['about-page', 'page', 'hidden']);
  }

  createDescription(): HTMLDivElement {
    const description = createElement('div', ['about-message'], 'This is my chat application');

    return description;
  }

  render(): HTMLDivElement {
    const goBackButton = new Button(
      ['go-back-button', 'button', 'functional-button'],
      'Back',
    ).render();

    this.pageElement.append(this.createDescription(), new GithubLink().render(), goBackButton);

    return this.pageElement;
  }
}
