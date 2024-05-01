import './searchable-list.css';
import { createElement } from '../../utils/create-element';
import { UserItem } from '../../types';

export class SearchableList {
  public itemElements: HTMLDivElement[] = [];

  private readonly searchInput: HTMLInputElement;

  private readonly itemList: HTMLDivElement;

  constructor() {
    this.searchInput = createElement('input', ['search-input']);
    this.searchInput.type = 'text';
    this.itemList = createElement('div', ['item-list']);
  }

  createItemElement(item: UserItem): HTMLDivElement {
    const itemElement = createElement(
      'div',
      [item.isLogined ? 'active-user' : 'inactive', 'searchable-list-item'],
      item.login,
    );
    const countContainer = createElement('span', ['count-container', 'hidden'], '0');

    itemElement.append(countContainer);
    this.itemElements.push(itemElement);

    return itemElement;
  }

  updateItemElement(
    item: UserItem,
    unreadMessagesCount: number = 0,
    shouldIncrement: boolean = false,
    shouldDecrement: boolean = false,
  ): void {
    const itemElementToUpdate = this.itemElements.find(
      (el) => el.childNodes[0].textContent === item.login,
    );

    if (itemElementToUpdate) {
      itemElementToUpdate.classList.toggle('active-user', item.isLogined);

      const countContainer = itemElementToUpdate.children[0];

      if (unreadMessagesCount) {
        countContainer.textContent = `${unreadMessagesCount}`;
        countContainer.classList.remove('hidden');
      } else if (shouldIncrement && countContainer.textContent) {
        countContainer.textContent = `${parseInt(countContainer.textContent, 10) + 1}`;
        countContainer.classList.remove('hidden');
      } else if (shouldDecrement && countContainer.textContent) {
        const newCount = parseInt(countContainer.textContent, 10) - 1;

        countContainer.textContent = `${newCount}`;

        if (!newCount) {
          countContainer.classList.add('hidden');
        }
      }
    }
  }

  addItem(item: UserItem): void {
    const itemElement = this.createItemElement(item);

    this.itemList.append(itemElement);
  }

  displayItems(items: UserItem[]): void {
    this.itemElements = [];
    items.forEach((item) => this.createItemElement(item));
    this.itemList.innerHTML = '';
    this.itemList.append(...this.itemElements);
  }

  addSearchInputListener(): void {
    this.searchInput.addEventListener('input', () => {
      this.itemElements.forEach((el) => {
        el.classList.toggle('hidden', !el.innerText.includes(this.searchInput.value));
      });
    });
  }

  render(): HTMLDivElement {
    const searhableList = createElement('div', ['searchable-list']);
    const header = createElement('h2', ['list-header'], 'Available  users:');

    this.addSearchInputListener();
    searhableList.append(header, this.searchInput, this.itemList);

    return searhableList;
  }
}
