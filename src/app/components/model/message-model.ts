import { WebSocketService } from '../../../services/web-socket-service';
import { Message, MessageOnCreating, UserItem } from '../../../types';

export class MessageModel {
  private readonly socketService: WebSocketService;

  public sendMessageRequestId: string = '';

  public userHistories: { [key: string]: Message[] } = {};

  constructor(socketService: WebSocketService) {
    this.socketService = socketService;
  }

  sendMessageToUser(message: MessageOnCreating): void {
    this.sendMessageRequestId = `${Date.now()}`;
    this.socketService.sendMessageToUserRequest({
      id: this.sendMessageRequestId,
      addressee: message.addressee,
      text: message.text,
    });
  }

  getCurrentAndOtherUserMessageHistories(users: UserItem[]): void {
    users.forEach((user, i) =>
      this.socketService.sendUserHistoryRequest(user.login, `${user.login}_${Date.now() + i}`),
    );
  }

  getUnreadMessagesCount(senderLogin: string): number {
    if (Object.hasOwn(this.userHistories, `${senderLogin}`)) {
      return this.userHistories[senderLogin].filter(
        (message) => !message.status.isReaded && message.from === senderLogin,
      ).length;
    }

    return 0;
  }

  addMessageToUserHistory(login: string, message: Message): void {
    if (Object.hasOwn(this.userHistories, login)) {
      this.userHistories[login].push(message);
    } else {
      this.userHistories[login] = [message];
    }
  }

  setReadStatusInCurrentCotalkerHistory(currentCotalkerLogin: string, messageId: string): void {
    const messageToUpdate = this.findMessageInUserHistory(currentCotalkerLogin, messageId);

    if (messageToUpdate) {
      messageToUpdate.status.isReaded = true;
    }
  }

  setDeliveredStatusToMessagesToUser(user: UserItem): void {
    if (Object.hasOwn(this.userHistories, user.login)) {
      this.userHistories[user.login].forEach((message) => {
        message.status.isDelivered = true;
      });
    }
  }

  setReadStatusToMessageFromCotalcker(messageId: string): void {
    this.socketService.sendRequestToSetReadStatus(messageId);
  }

  setReadStatusToMessagesFromCotalcker(cotalkerLogin: string): void {
    this.getUnreadFromCotalckerMessagesIds(cotalkerLogin).forEach((messageId) =>
      this.setReadStatusToMessageFromCotalcker(messageId),
    );
  }

  getToCotalckerMessagesIds(cotalkerLogin: string): string[] {
    if (Object.hasOwn(this.userHistories, cotalkerLogin)) {
      return this.userHistories[cotalkerLogin]
        .filter((message) => message.to === cotalkerLogin)
        .map((message) => message.id);
    }

    return [];
  }

  getUnreadFromCotalckerMessagesIds(cotalkerLogin: string): string[] {
    if (Object.hasOwn(this.userHistories, cotalkerLogin)) {
      return this.userHistories[cotalkerLogin]
        .filter((message) => message.from === cotalkerLogin && !message.status.isReaded)
        .map((message) => message.id);
    }

    return [];
  }

  findMessageInHistoriesById(messageId: string): Message | undefined {
    const userHistories = Object.values(this.userHistories);

    for (let i = 0; i < userHistories.length; i += 1) {
      const result = userHistories[i].find((message) => message.id === messageId);

      if (result) {
        return result;
      }
    }

    return undefined;
  }

  findMessageInUserHistory(login: string, messageId: string): Message | undefined {
    if (Object.hasOwn(this.userHistories, login)) {
      return this.userHistories[login].find((message) => message.id === messageId);
    }

    return undefined;
  }

  deleteMessage(messageId: string): void {
    this.socketService.sendDeleteRequest(messageId);
  }

  deleteMessageFromUserHistory(messageId: string, login: string): void {
    if (Object.hasOwn(this.userHistories, login)) {
      this.userHistories[login] = this.userHistories[login].filter(
        (message) => message.id !== messageId,
      );
    }
  }

  editMessage(messageId: string, editedText: string): void {
    this.socketService.sendEditRequest(messageId, editedText);
  }

  editMessageInUserHistory(messageId: string, login: string, editedText: string): void {
    const messageToUpdate = this.findMessageInUserHistory(login, messageId);

    if (messageToUpdate) {
      messageToUpdate.status.isEdited = true;
      messageToUpdate.text = editedText;
    }
  }
}
