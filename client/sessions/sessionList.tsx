import React from 'react';
import { Link } from 'react-router-dom';
import Session from './session';

import { SessionListType } from '../utils/types';

import './sessionList.css';

type SessionListProperties = {
    sessions: SessionListType;
    onDeleteSession: Function;
    onEditSession: Function;
    onSelectSession: Function;
};

export class SessionList extends React.Component<SessionListProperties> {
    constructor(props: SessionListProperties) {
        super(props);
    }

    render() {
        return (
            <div className="session-list">
                <ul>
                    {this.props.sessions && this.props.sessions.map((session, index) => (
                        <li key={index}>
                            <Session
                                session={session}
                                onEditSession={this.props.onEditSession}
                                onDeleteSession={this.props.onDeleteSession}
                                onSelectSession={this.props.onSelectSession} />
                        </li>
                    ))}
                </ul>
                <Link className="button action" to="add">Dodaj sesję</Link>
            </div>    
        );
    }
}