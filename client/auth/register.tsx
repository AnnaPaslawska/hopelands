import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import Axios from 'axios';

import './register.css';

type RegisterState = {
    password: string;
    confirmPassword: string;
    success: boolean;
    error: Error;
};

export class Register extends React.Component<{}, RegisterState> {
    state: RegisterState;

    constructor(props: {}) {
        super(props);
    }

    registerUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const target = event.target as typeof event.target & {
            username: { value: string };
            email: { value: string };
            password: { value: string };
            roles: { value: Array<string> };
        };
        const username = target.username.value;
        const email = target.email.value;
        const password = target.password.value;
        const roles = target.roles.value;

        Axios.post('/api/auth/signup', {
            username,
            email,
            password,
            roles
        })
            .then(() => {
                this.setState({ success: true });
            })
            .catch(reason => {
                this.setState({ error: reason.response.data });
            });
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: event.target.value });
    }

    comparePasswords = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ confirmPassword: event.target.value });

        if (this.state.password !== event.target.value) {
            event.target.setCustomValidity('Passwords do not match');
        } else {
            event.target.setCustomValidity('');
        }
    }

    render() {
        const { success, error } = this.state;

        return (
            <div id="hplns-register">
                <div className="hplns-form">
                    {error && (<p className="error">{error.message}</p>)}
                    {success && (
                        <Navigate to="/login" />
                    )}
                    <form onSubmit={this.registerUser}>
                        <div className="hplns-form-field">
                            <label htmlFor="username">Nazwa użytkownika:</label>
                            <input id="username" type="text" name="username" required />
                        </div>
                        <div className="hplns-form-field">
                            <label htmlFor="email">E-mail:</label>
                            <input id="email" type="email" name="email" required />
                        </div>
                        <div className="hplns-form-field">
                            <label htmlFor="password">Hasło:</label>
                            <input id="password" type="password" name="password" onChange={this.handleChange} required />
                        </div>
                        <div className="hplns-form-field">
                            <label htmlFor="password-confirm">Powtórz hasło:</label>
                            <input id="password-confirm" type="password" onChange={this.comparePasswords} required />
                        </div>
                        <input type="hidden" name="roles[]" value="player" />
                        <input type="submit" value="Zarejestruj" />
                        <p className="hplns-text-small hplns-text-center">Masz już konto?</p>
                        <p className="hplns-text-small hplns-text-center"><Link to="/">Zaloguj się</Link>.</p>
                    </form>
                </div>
            </div>
        );
    }
}