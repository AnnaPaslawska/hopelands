export type ChatMessageType = {
    timestamp: number;
    username: string;
    message: string;
    session: string;
};

export type ChatBufferType = Array<ChatMessageType>;

export type UserType = {
    _id: string;
    username: string;
    email: string;
    password: string;
    roles: string[];
};

export type SessionType = {
    _id: string;
    name: string;
    players: Array<UserType>;
    mgs: Array<UserType>;
};

export type SessionListType = Array<SessionType>;