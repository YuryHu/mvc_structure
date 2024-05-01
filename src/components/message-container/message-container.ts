import './message-container.css';
import { createElement } from '../../utils/create-element';
import { Message, MessageStatus } from '../../types';
import { DateFormatter } from '../../utils/date-formatter';

export class MessageContainer {
  private readonly date: string;

  private readonly author: string;

  public editStatusContainer: HTMLSpanElement;

  public statusContainer: HTMLSpanElement;

  public messageContentContainer: HTMLDivElement;

  private readonly isMyMessage: boolean;

  public readonly id: string;

  public messageContainerElement: HTMLDivElement;

  constructor(message: Message, isMyMessage: boolean, dateFormatter: DateFormatter) {
    this.id = message.id;
    this.date = dateFormatter.formatTimeStamp(message.datetime);
    this.author = isMyMessage ? 'You' : message.from;
    this.editStatusContainer = createElement('span', ['edit-status-container']);
    this.statusContainer = createElement(
      'span',
      ['status-container', this.getStatus(message)],
      this.getStatus(message),
    );
    this.messageContentContainer = createElement('div', ['message-content'], message.text);
    this.isMyMessage = isMyMessage;
    this.messageContainerElement = this.createMessageContainer();
  }

  getStatus(messageData: Message): MessageStatus {
    if (messageData.status.isReaded) {
      return 'read';
    }

    if (messageData.status.isDelivered) {
      return 'delivered';
    }

    return 'pending';
  }

  createHeader(): HTMLDivElement {
    const header = createElement('div', ['message-header']);
    const authorContainer = createElement('span', ['author'], this.author);
    const dateContainer = createElement('span', [], this.date);

    header.append(authorContainer, dateContainer);

    return header;
  }

  updateMessageStatus(status: MessageStatus): void {
    if (status === 'read') {
      this.statusContainer.textContent = 'read';
      this.statusContainer.classList.replace('delivered', 'read');
    } else if (this.statusContainer.textContent === 'pending') {
      this.statusContainer.textContent = 'delivered';
      this.statusContainer.classList.replace('pending', 'delivered');
    }
  }

  createFooter(): HTMLDivElement {
    const footer = createElement('div', ['message-footer']);

    footer.append(this.editStatusContainer, this.statusContainer);

    return footer;
  }

  createMessageContainer(): HTMLDivElement {
    const messageContainerClasses = this.isMyMessage
      ? ['message-container', 'my-message']
      : ['message-container'];
    const messageContainer = createElement('div', messageContainerClasses);

    messageContainer.setAttribute('data-id', this.id);

    if (this.isMyMessage) {
      messageContainer.title = 'use right click to edit or delete message';
    }

    return messageContainer;
  }

  deleteMessageContainerElement(): void {
    this.messageContainerElement.remove();
  }

  updateMessageContainerElement(editedText: string): void {
    this.editStatusContainer.textContent = 'edited';
    this.messageContentContainer.textContent = editedText;
    this.messageContainerElement.classList.remove('chosen-message');
  }

  render(): HTMLDivElement {
    this.messageContainerElement.append(
      this.createHeader(),
      this.messageContentContainer,
      this.createFooter(),
    );

    return this.messageContainerElement;
  }
}
