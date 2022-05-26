import Axios from 'axios';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { setUserSession } from '../utils/common';
import { UserType } from '../utils/types';

import './login.css';

type LoginState = {
    user: UserType;
    error: Error;
};

export class Login extends React.Component<{}, LoginState> {
    state: LoginState = {
        user: null,
        error: null
    };

    constructor(props: {}) {
        super(props);
    }

    login = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
        };
        const email = target.email.value;
        const password = target.password.value;

        Axios.post('/api/auth/signin', { email, password })
            .then(response => {
                const { user, token } = response.data;

                setUserSession(user, token);

                this.setState({ user });
            })
            .catch(reason => {
                this.setState({ error: reason.response.data });
            });
    }

    render() {
        const { user, error } = this.state;

        return (
            <div id="hplns-login">
                <div className="hplns-form">
                    {error && (<p className="error">{error.message}</p>)}
                    {user && (
                        <Navigate to="/sessions" />
                    )}
                    <form onSubmit={this.login}>
                        <div className="hplns-form-field">
                            <label htmlFor="email">E-mail:</label>
                            <input id="email" type="email" name="email" required />
                        </div>
                        <div className="hplns-form-field">
                            <label htmlFor="password">Hasło:</label>
                            <input id="password" type="password" name="password" required />
                        </div>
                        <input type="submit" value="Zaloguj" />
                        <p className="hplns-text-small hplns-text-center">Nie masz jeszcze konta?</p>
                        <p className="hplns-text-small hplns-text-center"><Link to="/register">Zarejestruj się</Link>.</p>
                    </form>
                </div>
            </div>
        );
    }
}