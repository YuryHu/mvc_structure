import { MessageOnSending, User } from '../types';

const API_URL = 'ws://127.0.0.1:4000';

export class WebSocketService {
  public readonly connection: WebSocket;

  constructor() {
    this.connection = new WebSocket(API_URL);
  }

  sendUserLoginRequest(id: string, userData: User): void {
    this.connection.send(
      JSON.stringify({
        id,
        type: 'USER_LOGIN',
        payload: {
          user: userData,
        },
      }),
    );
  }

  sendUserLogoutRequest(id: string, userData: User): void {
    this.connection.send(
      JSON.stringify({
        id,
        type: 'USER_LOGOUT',
        payload: {
          user: userData,
        },
      }),
    );
  }

  sendAuthenticatedUsersRequest(id: string): void {
    this.connection.send(
      JSON.stringify({
        id,
        type: 'USER_ACTIVE',
        payload: null,
      }),
    );
  }

  sendUnauthorizedUsersRequest(id: string): void {
    this.connection.send(
      JSON.stringify({
        id,
        type: 'USER_INACTIVE',
        payload: null,
      }),
    );
  }

  sendMessageToUserRequest(message: MessageOnSending): void {
    this.connection.send(
      JSON.stringify({
        id: message.id,
        type: 'MSG_SEND',
        payload: {
          message: {
            to: message.addressee,
            text: message.text,
          },
        },
      }),
    );
  }

  sendUserHistoryRequest(login: string, requestId: string): void {
    this.connection.send(
      JSON.stringify({
        id: requestId,
        type: 'MSG_FROM_USER',
        payload: {
          user: {
            login,
          },
        },
      }),
    );
  }

  sendRequestToSetReadStatus(messageId: string): void {
    this.connection.send(
      JSON.stringify({
        id: messageId,
        type: 'MSG_READ',
        payload: {
          message: {
            id: messageId,
          },
        },
      }),
    );
  }

  sendDeleteRequest(messageId: string): void {
    this.connection.send(
      JSON.stringify({
        id: `${Date.now()}`,
        type: 'MSG_DELETE',
        payload: {
          message: {
            id: messageId,
          },
        },
      }),
    );
  }

  sendEditRequest(messageId: string, editedText: string): void {
    this.connection.send(
      JSON.stringify({
        id: `${Date.now()}`,
        type: 'MSG_EDIT',
        payload: {
          message: {
            id: messageId,
            text: editedText,
          },
        },
      }),
    );
  }
}
