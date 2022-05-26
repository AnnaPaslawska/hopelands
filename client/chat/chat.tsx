import React, { ChangeEvent, FormEvent } from 'react';
import Axios from 'axios';
import * as io from 'socket.io-client';
import { getUser, TIMEZONE_OFFSET } from '../utils/common';
import { ChatMessageType, ChatBufferType, UserType, SessionType } from '../utils/types';

import { MessageWindow } from './messageWindow';
import { MessageForm } from './messageForm';

import './chat.css';

declare module "react" {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        type?: string;
    }
}

type ChatProps = {
    session: SessionType;
    sessionPosts: ChatBufferType;
};

type ChatState = {
    message: string;
    buffer: ChatBufferType;
    isLoading: boolean;
    sendOnEnter: boolean;
    sendDisabled: boolean;
};

export class Chat extends React.Component<ChatProps, ChatState> {
    socket: io.Socket = io.connect();
    user: UserType;
    state: ChatState = {
        message: '',
        buffer: this.props.sessionPosts,
        isLoading: true,
        sendOnEnter: true,
        sendDisabled: false
    };

    constructor(props: ChatProps) {
        super(props);
    }

    componentDidMount() {
        this.user = getUser();
        //this.getSessionPosts();
        document.addEventListener('keydown', this.onKeyDown);
        this.socket.on('hplns-chat-message', this.onChatMessage);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown);
        this.socket.off('hplns-chat-message', this.onChatMessage);

        this.user = null;
    }

    getSessionPosts = () => {
        this.setState({ isLoading: true });

        Axios.post('/api/post/getAllSessionPosts', {
            session: this.props.session
        })
            .then(result => {
                this.setState({
                    buffer: result.data
                });
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    onChatMessage = (message: ChatMessageType) => {
        const currentBuffer = this.state.buffer;
        const item = [message];

        if (!currentBuffer) {
            this.setState({ buffer: item });
        } else {
            this.setState({
                buffer: currentBuffer.concat(item)
            });
        }
    }

    onKeyDown = (event: KeyboardEvent) => {
        if ((event.code === 'Enter' || event.code === 'NumpadEnter') && this.state.sendOnEnter && !this.state.sendDisabled) {
            this.sendMessage();
        }
    }

    handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ message: event.target.value });
    }

    setEnter = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({ sendOnEnter: event.target.checked });
    }

    sendMessage = () => {
        if (this.state.message) {
            const message = encodeURIComponent(this.state.message.replace(/\*/gi, ''));
            const timestamp = Date.now() + TIMEZONE_OFFSET;
            const username = this.user.username;
            const session = this.props.session;

            const item = {
                timestamp,
                username,
                message,
                session
            };

            this.socket.emit('hplns-chat-message', item);
            this.setState({ message: '' });
        }
    }

    onMessageSubmit(event: FormEvent) {
        this.sendMessage();

        event.preventDefault();
    }

    render() {
        return (
            <div className="chat-window">
                <MessageWindow buffer={this.state.buffer} />
                <MessageForm
                    message={this.state.message}
                    sendDisabled={this.state.sendDisabled}
                    sendOnEnter={this.state.sendOnEnter}
                    onSubmit={this.onMessageSubmit}
                    onMessageChange={this.handleChange}
                    onSendOnEnterChange={this.setEnter} />
            </div>
        );
    }
}