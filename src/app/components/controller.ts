import { Router } from '../../router/router';
import { View } from './view';
import { WebSocketService } from '../../services/web-socket-service';
import { UserModel, MessageModel } from './model';
import { HistoryResponseData, Message, User, UserItem } from '../../types';

export class Controller {
  private readonly view: View;

  private readonly router: Router;

  private readonly socketService: WebSocketService;

  private readonly userModel: UserModel;

  private readonly messageModel: MessageModel;

  private usersAdditionsCount: 0 | 1 | 2 = 0;

  private isCurrentUserLogined: boolean = false;

  constructor() {
    this.socketService = new WebSocketService();
    this.view = new View();
    this.userModel = new UserModel(this.socketService);
    this.messageModel = new MessageModel(this.socketService);
    this.router = new Router(this.view.routeData);
    this.addListeners();
  }

  start(): void {
    this.isCurrentUserLogined = !!window.sessionStorage.getItem('isLogined');

    if (window.location.pathname === '/about') {
      this.router.redirect('about');
    } else {
      this.router.redirect(this.isCurrentUserLogined ? 'chat' : 'login');
    }
  }

  addListeners(): void {
    this.addBodyListeners();
    this.addEnterListeners();
    this.addSocketServiceListeners();

    this.view
      .getDialogContainer()
      .addEventListener('scrollend', () =>
        this.messageModel.setReadStatusToMessagesFromCotalcker(this.view.getCurrentCotalkerLogin()),
      );

    document.addEventListener('contextmenu', (e) => {
      const target = e.target as HTMLDivElement;
      const messageContainer = target.closest('.my-message');

      if (messageContainer) {
        e.preventDefault();
        this.view.selectMessageContainer(messageContainer);

        const messageId = (messageContainer as HTMLDivElement).dataset.id;

        if (messageId) {
          const messageData = this.messageModel.findMessageInHistoriesById(messageId);

          if (messageData) {
            this.view.displayEditForm(messageData);
          }
        }
      }
    });
  }

  addBodyListeners(): void {
    if (document.body) {
      document.body.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLDivElement;
        const aboutButton = target.closest('.about-button');

        if (aboutButton) {
          this.handleAboutButtonClick();
        }

        const loginButton = target.closest('.login-button');

        if (loginButton && !loginButton.classList.contains('disabled')) {
          this.handleLoginButtonClick();
        }

        const logoutButton = target.closest('.logout-button');

        if (logoutButton) {
          this.userModel.logoutUser();
        }

        const userListItem = target.closest('.searchable-list-item');

        if (userListItem) {
          this.handleUserListItemClick({
            login: `${userListItem.childNodes[0].textContent}`,
            isLogined: userListItem.classList.contains('active-user'),
          });
        }

        const sendButton = target.closest('.send-button');

        if (sendButton && !sendButton.classList.contains('disabled')) {
          this.handleSendButtonClick();
        }

        const dialogContainer = target.closest('.dialog-container');

        if (dialogContainer) {
          this.messageModel.setReadStatusToMessagesFromCotalcker(
            this.view.getCurrentCotalkerLogin(),
          );
          this.view.hideEditForm();
          this.view.cancelMessageSelection();
        }

        const goBackButton = target.closest('.go-back-button');

        if (goBackButton) {
          this.handleGoBackButtonClick();
        }

        const deleteButton = target.closest('.delete-button');

        if (deleteButton) {
          this.handleDeleteButtonClick(deleteButton);
        }

        const editButton = target.closest('.edit-button');

        if (editButton && !editButton.classList.contains('disabled')) {
          this.handleEditButtonClick(editButton);
        }
      });
    }
  }

  addEnterListeners(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (this.router.currentPage === 'login' && this.view.isLoginFormActive()) {
          this.handleLoginButtonClick();
        } else if (this.router.currentPage === 'chat' && this.view.isSendFormActive()) {
          this.handleSendButtonClick();
        }
      }
    });
  }

  handleLoginButtonClick(): void {
    const userData = Object.fromEntries(
      new FormData(this.view.loginPage.loginFormElement).entries(),
    );

    this.userModel.authenticateUser(userData as User);
  }

  handleSendButtonClick(): void {
    this.messageModel.sendMessageToUser(this.view.getMessageData());
    this.messageModel.setReadStatusToMessagesFromCotalcker(this.view.getCurrentCotalkerLogin());
  }

  handleAboutButtonClick(): void {
    this.router.redirect('about');

    if (this.isCurrentUserLogined) {
      this.view.hideAboutButton();
    }
  }

  handleGoBackButtonClick(): void {
    if (this.isCurrentUserLogined) {
      this.view.displayAboutButton();
      this.router.redirect('chat');
    } else {
      this.router.redirect('login');
    }
  }

  handleDeleteButtonClick(deleteButton: Element): void {
    const { messageId } = (deleteButton as HTMLDivElement).dataset;

    if (messageId) {
      this.messageModel.deleteMessage(messageId);
    }
  }

  handleEditButtonClick(editButton: Element): void {
    const { messageId } = (editButton as HTMLDivElement).dataset;

    if (messageId) {
      this.messageModel.editMessage(messageId, this.view.getEditedText());
    }
  }

  handleUserListItemClick(user: UserItem): void {
    this.view.displayUserInChatView(user);

    if (
      Object.hasOwn(this.messageModel.userHistories, user.login) &&
      this.messageModel.userHistories[user.login].length
    ) {
      this.messageModel.userHistories[user.login].forEach((message: Message) =>
        this.view.addMessageToDialogContainer(
          message,
          message.from === this.userModel.currentUser.login,
        ),
      );
    } else {
      this.view.displayInitialDialogMessage(user.login);
    }
  }

  addSocketServiceListeners(): void {
    this.socketService.connection.addEventListener('message', (event) => {
      const responseData = JSON.parse(event.data);
      const {
        payload: { user },
      } = responseData;
      const {
        payload: { message },
      } = responseData;

      switch (responseData.type) {
        case 'ERROR':
          this.handleErrorResponse(responseData.id, responseData.payload.error);
          break;
        case 'USER_LOGIN':
          this.handleLoggingIn();
          break;
        case 'USER_LOGOUT':
          this.handleLoggingOut();
          break;
        case 'USER_EXTERNAL_LOGIN':
          this.handleExternalLoggingIn(user);
          break;
        case 'USER_EXTERNAL_LOGOUT':
          this.handleExternalLogout(user);
          break;
        case 'MSG_SEND':
          this.handleMessageSending(message);
          break;
        case 'MSG_FROM_USER':
          this.handleUserHistoryResponse(responseData);
          break;
        case 'MSG_READ':
          this.handleMessageReadResponse(responseData.id, message);
          break;
        case 'MSG_DELETE':
          this.handleMessageDeleteResponse(responseData.id, message);
          break;
        case 'MSG_EDIT':
          this.handleMessageEditResponse(responseData.id, message);
          break;
        default:
          this.handleActiveOrInactiveUsersResponse(responseData.payload.users);
      }
    });
  }

  handleLoggingIn(): void {
    this.isCurrentUserLogined = true;
    window.sessionStorage.setItem('isLogined', 'true');
    this.view.displayLogoutBlock(this.userModel.currentUser.login);
    this.view.clearLogoutErrorBlock();
    this.router.redirect('chat');
  }

  handleLoggingOut(): void {
    this.isCurrentUserLogined = false;
    window.sessionStorage.setItem('isLogined', 'false');
    this.view.hideLogoutBlock();
    this.view.clearLoginForm();
    this.router.redirect('login');
    this.usersAdditionsCount = 0;
    this.userModel.otherUsers = [];
  }

  handleUserHistoryResponse(responseData: HistoryResponseData): void {
    const senderLogin = responseData.id.split('_')[0];
    const sender = this.userModel.getUserByLogin(senderLogin);

    this.messageModel.userHistories[senderLogin] = responseData.payload.messages;

    if (sender) {
      this.view.displayUnreadMessagesCount(
        sender,
        this.messageModel.getUnreadMessagesCount(senderLogin),
      );
    }
  }

  handleMessageSending(message: Message): void {
    if (message.from === this.userModel.currentUser.login) {
      this.messageModel.addMessageToUserHistory(message.to, message);
      this.view.addMessageToDialogContainer(message, true);
      this.view.scrollCreatedMessageToVisible();

      return undefined;
    }

    this.messageModel.addMessageToUserHistory(message.from, message);

    if (message.from === this.view.getCurrentCotalkerLogin()) {
      this.view.addMessageToDialogContainer(message, false);

      return this.view.scrollCreatedMessageToVisible();
    }

    const sender = this.userModel.getUserByLogin(message.from);

    if (sender) {
      return this.view.incrementUnreadMessageCount(sender);
    }

    return undefined;
  }

  handleExternalLoggingIn(user: UserItem): void {
    if (this.userModel.otherUsers.some((el) => el.login === user.login)) {
      this.view.updateUserInUserList(user);
      this.view.updateUserInCoTalkerContainer(user);
      this.userModel.updateUserStatus(user);
    } else {
      this.userModel.addNewUser(user);
      this.view.addUserToUserList(user);
    }

    this.messageModel.setDeliveredStatusToMessagesToUser(user);

    const currentCotalkerLogin = this.view.getCurrentCotalkerLogin();

    if (currentCotalkerLogin !== '') {
      this.view.setDeliveredStatusToMessagesToCotalcker(
        this.messageModel.getToCotalckerMessagesIds(currentCotalkerLogin),
      );
    }
  }

  handleExternalLogout(user: UserItem): void {
    this.view.updateUserInUserList(user);
    this.view.updateUserInCoTalkerContainer(user);
    this.userModel.updateUserStatus(user);
  }

  handleCurrentUserMarksCotalkerMessageAsRead(messageId: string): void {
    this.messageModel.setReadStatusInCurrentCotalkerHistory(
      this.view.getCurrentCotalkerLogin(),
      messageId,
    );
    this.view.updateMessageStatus(messageId, 'read');
    this.view.decrementUnreadMessagesCountFromUser(
      this.userModel.getUserByLogin(this.view.getCurrentCotalkerLogin()),
    );
  }

  handleOtherUserMarksCurrentUserMessageAsRead(messageId: string): void {
    const message = this.messageModel.findMessageInHistoriesById(messageId);

    if (message) {
      message.status.isReaded = true;

      if (message.to === this.view.getCurrentCotalkerLogin()) {
        this.view.updateMessageStatus(messageId, 'read');
      }
    }
  }

  handleCurrentUserDeleteHisMessageToCotalker(messageId: string): void {
    this.messageModel.deleteMessageFromUserHistory(messageId, this.view.getCurrentCotalkerLogin());
    this.view.deleteMessageFromDialog(messageId);
    this.view.hideEditForm();
  }

  handleOtherUserDeleteHisMessageToCurrentUser(messageId: string): void {
    const message = this.messageModel.findMessageInHistoriesById(messageId);

    if (message) {
      const senderLogin = message.from;

      if (senderLogin === this.view.getCurrentCotalkerLogin()) {
        this.view.deleteMessageFromDialog(messageId);
      }

      if (!message.status.isReaded) {
        this.view.decrementUnreadMessagesCountFromUser(this.userModel.getUserByLogin(senderLogin));
      }

      this.messageModel.deleteMessageFromUserHistory(messageId, senderLogin);
    }
  }

  handleCurrentUserEditHisMessageToCotalker(messageId: string, editedText: string): void {
    this.messageModel.editMessageInUserHistory(
      messageId,
      this.view.getCurrentCotalkerLogin(),
      editedText,
    );
    this.view.editMessageInDialog(messageId, editedText);
    this.view.hideEditForm();
  }

  handleOtherUserEditHisMessageToCurrentUser(messageId: string, editedText: string): void {
    const message = this.messageModel.findMessageInHistoriesById(messageId);

    if (message) {
      const senderLogin = message.from;

      if (senderLogin === this.view.getCurrentCotalkerLogin()) {
        this.view.editMessageInDialog(messageId, editedText);
      }

      this.messageModel.editMessageInUserHistory(messageId, senderLogin, editedText);
    }
  }

  handleMessageDeleteResponse(responseId: string | null, message: Message): void {
    if (responseId) {
      this.handleCurrentUserDeleteHisMessageToCotalker(message.id);
    } else {
      this.handleOtherUserDeleteHisMessageToCurrentUser(message.id);
    }
  }

  handleMessageEditResponse(responseId: string | null, message: Message): void {
    if (responseId) {
      this.handleCurrentUserEditHisMessageToCotalker(message.id, message.text);
    } else {
      this.handleOtherUserEditHisMessageToCurrentUser(message.id, message.text);
    }
  }

  handleMessageReadResponse(responseId: string | null, message: Message): void {
    if (responseId) {
      this.handleCurrentUserMarksCotalkerMessageAsRead(message.id);
    } else {
      this.handleOtherUserMarksCurrentUserMessageAsRead(message.id);
    }
  }

  handleErrorResponse(responseId: string, error: string): void {
    switch (responseId) {
      case this.userModel.loginRequestId:
        this.view.displayLoginError(error);
        break;
      case this.userModel.logoutRequestId:
        this.view.displayLogoutError(error);
        break;
      default:
        this.view.displayChatError(error);
    }
  }

  handleActiveOrInactiveUsersResponse(users: UserItem[]): void {
    this.usersAdditionsCount += 1;
    this.userModel.otherUsers = this.userModel.otherUsers.concat(
      users.filter((el: UserItem) => el.login !== this.userModel.currentUser.login),
    );

    if (this.usersAdditionsCount === 2) {
      this.view.displayUsers(this.userModel.otherUsers);
      this.messageModel.getCurrentAndOtherUserMessageHistories(this.userModel.otherUsers);
    }
  }
}
