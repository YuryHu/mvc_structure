import './github-link.css';
import { createElement } from '../../utils/create-element';

export class GithubLink {
  private readonly linkText: string = 'YuryHu';

  private readonly url: string = 'https://github.com/YuryHu';

  render(): HTMLAnchorElement {
    const link = createElement('a', ['github-link'], this.linkText);

    link.href = this.url;

    return link;
  }
}
