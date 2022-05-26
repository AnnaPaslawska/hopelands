import React, { ChangeEventHandler, FormEventHandler } from 'react';

import './messageForm.css';

type MessageFormProps = {
    onSubmit: FormEventHandler<HTMLFormElement>;
    onMessageChange: ChangeEventHandler<HTMLTextAreaElement>;
    onSendOnEnterChange: ChangeEventHandler<HTMLInputElement>;
    message: string;
    sendOnEnter: boolean;
    sendDisabled: boolean;
};

export class MessageForm extends React.Component<MessageFormProps> {
    constructor(props: MessageFormProps) {
        super(props);
    }

    render() {
        return (
            <form className="message-form" onSubmit={this.props.onSubmit}>
                <textarea type="text" value={this.props.message} onChange={this.props.onMessageChange} disabled={this.props.sendDisabled} />
                <div className="message-submit">
                    <input className="button" type="submit" value="Wyślij" disabled={this.props.sendDisabled} />
                    <input className="checkbox" type="checkbox" checked={this.props.sendOnEnter} onChange={this.props.onSendOnEnterChange} title="Enter wysyła wiadomość" />
                </div>
            </form>
        );
    }
}