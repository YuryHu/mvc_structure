export type User = {
  login: string;
  password: string;
};

export type UserItem = {
  login: string;
  isLogined: boolean;
};

export type MessageOnCreating = {
  addressee: string;
  text: string;
};

export type MessageOnSending = MessageOnCreating & {
  id: string;
};

export type Message = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
};

export type RouteData = {
  [key: string]: {
    path: string;
    page: HTMLDivElement;
  };
};

export type HistoryResponseData = {
  id: string;
  type: 'MSG_FROM_USER';
  payload: {
    messages: Message[];
  };
};

export type MessageStatus = 'pending' | 'delivered' | 'read';
