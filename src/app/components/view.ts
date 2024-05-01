import { createElement } from '../../utils/create-element';
import { Button } from '../../components';
import { LoginPage, AboutPage, ChatPage } from '../../pages';
import { Message, MessageOnCreating, MessageStatus, RouteData, UserItem } from '../../types';

export class View {
  public readonly routeData: RouteData;

  public readonly loginPage: LoginPage;

  private readonly aboutPage: AboutPage;

  public readonly chatPage: ChatPage;

  private readonly logoutBlock: HTMLDivElement;

  private readonly nameContainer: HTMLDivElement;

  private readonly logoutErrorBlock: HTMLDivElement;

  private readonly aboutButton: HTMLDivElement;

  public chosenMessageContainer: Element | undefined = undefined;

  constructor() {
    this.loginPage = new LoginPage();
    this.aboutPage = new AboutPage();
    this.chatPage = new ChatPage();
    this.routeData = {
      login: {
        path: 'login',
        page: this.loginPage.pageElement,
      },
      about: {
        path: 'about',
        page: this.aboutPage.pageElement,
      },
      chat: {
        path: 'chat',
        page: this.chatPage.pageElement,
      },
    };
    this.logoutBlock = createElement('div', ['logout-block', 'hidden']);
    this.nameContainer = createElement('div', ['name-block']);
    this.logoutErrorBlock = createElement('div', ['logout-error-block']);
    this.aboutButton = new Button(
      ['functional-button', 'about-button', 'button'],
      'About',
    ).render();
    this.createBaseMarkup();
  }

  createHeader(): HTMLElement {
    const appTitle = createElement('h1', ['app-title'], 'Fun Chat');
    const header = createElement('header', ['app-header']);
    const logoutButton = new Button(['logout-button', 'button'], 'Logout').render();

    this.logoutBlock.append(
      this.logoutErrorBlock,
      this.nameContainer,
      logoutButton,
      this.aboutButton,
    );
    header.append(appTitle, this.logoutBlock);

    return header;
  }

  createBaseMarkup(): void {
    const container = createElement('div', ['container']);

    container.append(
      this.createHeader(),
      this.loginPage.render(),
      this.aboutPage.render(),
      this.chatPage.render(),
    );

    if (document.body) {
      document.body.append(container);
    }
  }

  displayLogoutBlock(name: string): void {
    this.nameContainer.innerText = name;
    this.logoutBlock.classList.remove('hidden');
  }

  hideLogoutBlock(): void {
    this.logoutBlock.classList.add('hidden');
  }

  displayLoginError(message: string): void {
    const {
      loginForm: { errorBlock },
    } = this.loginPage;

    errorBlock.innerText = message;
    errorBlock.classList.remove('hidden');
  }

  displayLogoutError(message: string): void {
    this.logoutErrorBlock.innerText = message;
  }

  clearLogoutErrorBlock(): void {
    this.logoutErrorBlock.innerText = '';
  }

  clearLoginForm(): void {
    this.loginPage.loginForm.clearForm();
  }

  hideAboutButton(): void {
    this.aboutButton.classList.add('hidden');
  }

  displayAboutButton(): void {
    this.aboutButton.classList.remove('hidden');
  }

  addUserToUserList(user: UserItem): void {
    this.chatPage.userList.addItem(user);
  }

  updateUserInUserList(user: UserItem): void {
    this.chatPage.userList.updateItemElement(user);
  }

  updateUserInCoTalkerContainer(user: UserItem): void {
    const { cotalkerContainer } = this.chatPage;

    if (cotalkerContainer.textContent === user.login) {
      cotalkerContainer.classList.toggle('active-user', user.isLogined);
    }
  }

  displayUsers(users: UserItem[]): void {
    this.chatPage.userList.displayItems(users);
  }

  displayUserInChatView(user: UserItem): void {
    this.chatPage.showChatWithUser(user);
  }

  addMessageToDialogContainer(message: Message, isMyMessage: boolean): void {
    this.chatPage.addMessageToDialogContainer(message, isMyMessage);
    this.chatPage.messageForm.resetForm();
    this.chatPage.hideInitialDialogMessageContainer();
  }

  getMessageData(): MessageOnCreating {
    return this.chatPage.getMessageData();
  }

  displayChatError(message: string): void {
    this.chatPage.displayChatError(message);
  }

  displayUnreadMessagesCount(sender: UserItem, unreadMessagesCount: number): void {
    if (unreadMessagesCount) {
      this.chatPage.userList.updateItemElement(sender, unreadMessagesCount);
    }
  }

  incrementUnreadMessageCount(user: UserItem): void {
    this.chatPage.userList.updateItemElement(user, 0, true);
  }

  getCurrentCotalkerLogin(): string {
    return this.chatPage.currentCotalkerLogin;
  }

  displayInitialDialogMessage(cotalkerLogin: string): void {
    this.chatPage.displayInitialDialogMessage(cotalkerLogin);
  }

  scrollCreatedMessageToVisible(): void {
    const { lastCreatedMessageContainer } = this.chatPage;

    if (lastCreatedMessageContainer) {
      lastCreatedMessageContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateMessageStatus(messageId: string, newStatus: MessageStatus): void {
    this.chatPage.updateMessageStatus(messageId, newStatus);
  }

  setDeliveredStatusToMessagesToCotalcker(messageIds: string[]): void {
    messageIds.forEach((id) => this.chatPage.updateMessageStatus(id, 'delivered'));
  }

  getDialogContainer(): HTMLDivElement {
    return this.chatPage.dialogContainer;
  }

  decrementUnreadMessagesCountFromUser(user: UserItem | undefined): void {
    if (user) {
      this.chatPage.userList.updateItemElement(user, 0, false, true);
    }
  }

  displayEditForm(message: Message): void {
    this.chatPage.displayEditForm(message);
  }

  hideEditForm(): void {
    this.chatPage.hideEditForm();
  }

  deleteMessageFromDialog(messageId: string): void {
    this.chatPage.deleteMessageFromDialog(messageId);
  }

  getEditedText(): string {
    return this.chatPage.getEditedText();
  }

  editMessageInDialog(messageId: string, editedText: string): void {
    this.chatPage.editMessageInDialog(messageId, editedText);
  }

  selectMessageContainer(messageContainer: Element): void {
    this.chosenMessageContainer = messageContainer;
    this.chosenMessageContainer.classList.add('chosen-message');
  }

  cancelMessageSelection(): void {
    if (this.chosenMessageContainer) {
      this.chosenMessageContainer.classList.remove('chosen-message');
    }
  }

  isSendFormActive(): boolean {
    return (
      !this.chatPage.dialogWrapper.classList.contains('hidden') &&
      !this.chatPage.messageFormElement.classList.contains('hidden') &&
      this.chatPage.messageForm.isValid()
    );
  }

  isLoginFormActive(): boolean {
    return this.loginPage.loginForm.isFormValid();
  }
}
