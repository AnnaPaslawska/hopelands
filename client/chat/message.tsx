import React from 'react';
import { TIMEZONE_OFFSET } from '../utils/common';
import { ChatMessageType } from '../utils/types';

import './message.css';

type MessageProps = { item: ChatMessageType };

export class Message extends React.Component<MessageProps> {
    constructor(props: MessageProps) {
        super(props);
    }

    render() {
        const item = this.props.item;
        const formatTime = (timestamp: number) => new Date(timestamp - TIMEZONE_OFFSET).toLocaleString();
        const decodeMessage = (message: string) => {
            return decodeURIComponent(message).replace(/(<([^>]+)>)/gi, '').replace(/\n/gi, '<br/>');
        };

        return (
            <div className="message">
                <div className="message-header">
                    <i><small>[{formatTime(item.timestamp)}]</small></i> <b>{item.username}</b>
                </div>
                <div className="message-avatar"></div>
                <div className="message-core" dangerouslySetInnerHTML={{ __html: decodeMessage(item.message) }}></div>
            </div>
        );
    }
}