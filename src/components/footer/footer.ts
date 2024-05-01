import './footer.css';
import { createElement } from '../../utils/create-element';
import { GithubLink } from '../../components';

export class Footer {
  render(): HTMLDivElement {
    const footer = createElement('div', ['footer']);
    const yearContainer = createElement('span', [], '2024');
    const rssLogo = createElement('div', ['rss-logo']);

    footer.append(new GithubLink().render(), yearContainer, rssLogo);

    return footer;
  }
}
