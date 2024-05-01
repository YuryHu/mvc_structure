import './chat-page.css';
import { createElement } from '../../utils/create-element';
import { Button, Footer, OneFieldForm, SearchableList, OneFieldEditForm } from '../../components';
import { UserItem, MessageOnCreating, Message, MessageStatus } from '../../types';
import { MessageContainer } from '../../components/message-container/message-container';
import { DateFormatter } from '../../utils/date-formatter';

export class ChatPage {
  public readonly pageElement: HTMLDivElement;

  public readonly dialogWrapper: HTMLDivElement;

  public readonly userList: SearchableList;

  public readonly chatErrorBlock: HTMLDivElement;

  public readonly cotalkerContainer: HTMLDivElement;

  public currentCotalkerLogin: string = '';

  private readonly toUsersButton: HTMLDivElement;

  private readonly userListElement: HTMLDivElement;

  public readonly messageForm: OneFieldForm;

  public readonly editForm: OneFieldEditForm;

  private readonly dateFormatter: DateFormatter;

  public readonly dialogContainer: HTMLDivElement;

  private readonly initialDialogMessageContainer: HTMLDivElement;

  public lastCreatedMessageContainer: HTMLDivElement | null = null;

  private messageContainerInstances: MessageContainer[] = [];

  public readonly messageFormElement: HTMLDivElement;

  private readonly editFormElement: HTMLDivElement;

  constructor() {
    this.pageElement = createElement('div', ['chat-page', 'page']);
    this.cotalkerContainer = createElement('div', ['cotalker-container']);
    this.userList = new SearchableList();
    this.userListElement = this.userList.render();
    this.dialogWrapper = createElement('div', ['dialog-wrapper', 'hidden']);
    this.toUsersButton = new Button(['button', 'functional-button'], 'To user list').render();
    this.toUsersButton.addEventListener('click', this.handleToUsersButtonClick.bind(this));
    this.chatErrorBlock = createElement('div', ['chat-error-block', 'hidden']);
    this.messageForm = new OneFieldForm('send', 'Message...');
    this.dateFormatter = new DateFormatter();
    this.dialogContainer = createElement('div', ['dialog-container']);
    this.initialDialogMessageContainer = createElement('div', [
      'initial-dialog-message-container',
      'hidden',
    ]);
    this.editForm = new OneFieldEditForm();
    this.messageFormElement = this.messageForm.render();
    this.editFormElement = this.editForm.render();
  }

  handleToUsersButtonClick(): void {
    this.toggleViews();
    this.currentCotalkerLogin = '';
  }

  showChatWithUser(userItem: UserItem): void {
    this.dialogContainer.innerHTML = '';
    this.dialogContainer.append(this.initialDialogMessageContainer);
    this.currentCotalkerLogin = userItem.login;
    this.toggleViews();
    this.cotalkerContainer.innerText = userItem.login;
    this.cotalkerContainer.classList.toggle('active-user', userItem.isLogined);
  }

  toggleViews(): void {
    this.userListElement.classList.toggle('hidden');
    this.dialogWrapper.classList.toggle('hidden');
  }

  createMain(): HTMLElement {
    const main = createElement('main', ['main']);
    const header = createElement('div', ['dialog-header']);
    const messageFormWrapper = createElement('div', ['message-form-wrapper']);

    messageFormWrapper.append(this.messageFormElement, this.editFormElement);
    header.append(this.toUsersButton, this.cotalkerContainer);
    this.dialogWrapper.append(
      header,
      this.dialogContainer,
      messageFormWrapper,
      this.chatErrorBlock,
    );
    main.append(this.userListElement, this.dialogWrapper);

    return main;
  }

  addMessageToDialogContainer(message: Message, isMyMessage: boolean): void {
    const messageContainerInstance = new MessageContainer(message, isMyMessage, this.dateFormatter);

    this.messageContainerInstances.push(messageContainerInstance);
    this.lastCreatedMessageContainer = messageContainerInstance.render();
    this.dialogContainer.append(this.lastCreatedMessageContainer);
    this.chatErrorBlock.classList.add('hidden');
  }

  getMessageData(): MessageOnCreating {
    return {
      addressee: `${this.cotalkerContainer.textContent}`,
      text: this.messageForm.input.value,
    };
  }

  displayChatError(message: string): void {
    this.chatErrorBlock.innerText = message;
    this.chatErrorBlock.classList.remove('hidden');
  }

  displayInitialDialogMessage(cotalkerLogin: string): void {
    this.initialDialogMessageContainer.innerText = `Write anything to ${cotalkerLogin}`;
    this.initialDialogMessageContainer.classList.remove('hidden');
  }

  hideInitialDialogMessageContainer(): void {
    this.initialDialogMessageContainer.classList.add('hidden');
  }

  updateMessageStatus(messageId: string, newStatus: MessageStatus): void {
    const messageContainerInstanceToUpdate = this.messageContainerInstances.find(
      (instance) => instance.id === messageId,
    );

    if (messageContainerInstanceToUpdate) {
      messageContainerInstanceToUpdate.updateMessageStatus(newStatus);
    }
  }

  displayEditForm(message: Message): void {
    this.editForm.input.value = message.text;
    this.editForm.deleteButton.setAttribute('data-message-id', message.id);
    this.editForm.editButton.setAttribute('data-message-id', message.id);
    this.messageFormElement.classList.add('hidden');
    this.editFormElement.classList.remove('hidden');
  }

  hideEditForm(): void {
    this.messageFormElement.classList.remove('hidden');
    this.editFormElement.classList.add('hidden');
    this.editForm.resetForm();
  }

  deleteMessageFromDialog(messageId: string): void {
    const messageContainerToDelete = this.messageContainerInstances.find(
      (instance) => instance.id === messageId,
    );

    if (messageContainerToDelete) {
      messageContainerToDelete.deleteMessageContainerElement();
    }
  }

  editMessageInDialog(messageId: string, editedText: string): void {
    const messageContainerToUpdate = this.messageContainerInstances.find(
      (instance) => instance.id === messageId,
    );

    if (messageContainerToUpdate) {
      messageContainerToUpdate.updateMessageContainerElement(editedText);
    }
  }

  getEditedText(): string {
    return this.editForm.input.value;
  }

  render(): HTMLDivElement {
    const footer = new Footer().render();

    this.pageElement.append(this.createMain(), footer);

    return this.pageElement;
  }
}
