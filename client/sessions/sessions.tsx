import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Axios, { AxiosResponse } from 'axios';

import { SessionList } from './sessionList';
import Nav from '../nav/nav';
import { Chat } from '../chat/chat';
import SessionProperties from '../sessions/sessionProperties';
import { Loading } from '../loading/loading';
import { NoPage } from '../noPage';

import { SessionListType, SessionType, UserType, ChatBufferType } from '../utils/types';
import { getUser } from '../utils/common';
import { withRouter } from '../utils/withRouter';

import './sessions.css';

type SessionsProps = {
    router: any;
};

type SessionsState = {
    session: SessionType;
    sessionList: SessionListType;
    sessionPosts: ChatBufferType;
    error: Error;
    isLoading: boolean;
};

class Sessions extends React.Component<SessionsProps, SessionsState> {
    isLoading: boolean;
    user: UserType;
    state: SessionsState = {
        session: null,
        sessionList: null,
        sessionPosts: null,
        error: null,
        isLoading: true
    };

    constructor(props: SessionsProps) {
        super(props);
    }

    componentDidMount() {
        this.user = getUser();
        this.refreshSessions();
    }

    componentWillUnmount() {
        this.user = null;
    }

    getUserSessions = (callback: Function) => {
        this.setState({ isLoading: true });

        Axios.post('/api/session/getAllUserSessions', {
            user: this.user
        })
            .then(response => {
                callback(response);
            })
            .catch(error => {
                this.setState({ error });
            })
            .finally(() => {
                this.setState({ isLoading: false });
			});
    }

    refreshSessions = () => {
        this.getUserSessions((response: AxiosResponse) => {
            const session = response.data[0];

            this.setState({
                session,
                sessionList: response.data
            });

            this.getSessionPosts(session);
        });
    }

    editSession = (session: SessionType) => {
        this.props.router.navigate(`edit/${session._id}`);
    }

    deleteSession = (session: SessionType) => {
        Axios.post('/api/session/remove', { session })
            .then(() => {
                this.refreshSessions();
            })
            .catch(error => {
                console.log(error);

                this.setState({ error });
            });
    }

    updateSession = (session: SessionType) => {
        const { _id, name, players, mgs } = session;

        Axios.post('/api/session/add', {
            name,
            players,
            mgs
        })
            .then(result => {
                this.getUserSessions((response: AxiosResponse) => {
                    this.setState({ session: result.data, sessionList: response.data });
                });
            })
            .catch(reason => {
                console.log(reason.response.data);
            });
    }

    selectSession = (session: SessionType) => {
        this.setState({ session });
        this.getSessionPosts(session);
        this.props.router.navigate(`/sessions`);
    }

    getSessionPosts = (session: SessionType) => {
        this.setState({ isLoading: true });

        Axios.post('/api/post/getAllSessionPosts', { session })
            .then(result => {
                this.setState({
                    sessionPosts: result.data
                });
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        const { session, sessionList, error, isLoading } = this.state;

        return (
            <div className="sessions">
                <Nav />
                <SessionList
                    sessions={sessionList}
                    onEditSession={this.editSession}
                    onDeleteSession={this.deleteSession}
                    onSelectSession={this.selectSession} />
                {
                    isLoading ? <Loading /> :
                        <Routes>
                            <Route index element={<Chat session={session} sessionPosts={this.state.sessionPosts} />} />
                            <Route path="add" element={<SessionProperties updateSession={this.updateSession} />} />
                            <Route path="edit/:sessionId" element={<SessionProperties updateSession={this.updateSession} />} />
                            <Route path="*" element={<NoPage />} />
                    </Routes>
                }
            </div>    
        );
    }
}

export default withRouter(Sessions);