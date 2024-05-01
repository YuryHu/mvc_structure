import { WebSocketService } from '../../../services/web-socket-service';
import { User, UserItem } from '../../../types';

export class UserModel {
  private readonly socketService: WebSocketService;

  public otherUsers: UserItem[] = [];

  public currentUser: User = { login: '', password: '' };

  public loginRequestId: string = '';

  public logoutRequestId: string = '';

  public authenticatedUsersRequestId: string = '';

  public unauthorizedUsersRequestId: string = '';

  constructor(socketService: WebSocketService) {
    this.socketService = socketService;
  }

  authenticateUser(user: User): void {
    this.currentUser = user;
    this.loginRequestId = `${Date.now()}`;
    this.socketService.sendUserLoginRequest(this.loginRequestId, user);
    this.authenticatedUsersRequestId = `${Date.now() + 1}`;
    this.socketService.sendAuthenticatedUsersRequest(this.authenticatedUsersRequestId);
    this.unauthorizedUsersRequestId = `${Date.now() + 2}`;
    this.socketService.sendUnauthorizedUsersRequest(this.unauthorizedUsersRequestId);
  }

  logoutUser(): void {
    this.logoutRequestId = `${Date.now()}`;
    this.socketService.sendUserLogoutRequest(this.logoutRequestId, this.currentUser);
  }

  getUserByLogin(login: string): UserItem | undefined {
    return this.otherUsers.find((user) => user.login === login);
  }

  updateUserStatus(user: UserItem) {
    const userToUpdate = this.otherUsers.find((otherUser) => otherUser.login === user.login);

    if (userToUpdate) {
      userToUpdate.isLogined = user.isLogined;
    }
  }

  addNewUser(user: UserItem): void {
    this.otherUsers.push(user);
  }
}
