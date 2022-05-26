import React from 'react';

import { Message } from './message';

import { ChatBufferType } from '../utils/types';

import './messageWindow.css';

type MessageWindowProps = {
    buffer: ChatBufferType
};

export class MessageWindow extends React.Component<MessageWindowProps> {
    messagesEnd: HTMLDivElement;

    constructor(props: MessageWindowProps) {
        super(props);
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

	render() {
		return (
            <div className="message-window">
                <ul>
                    {this.props.buffer && this.props.buffer.map((item, index) => (
                        <li key={index}><Message item={item} /></li>
                    ))}
                </ul>
                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>
		);
	}
}