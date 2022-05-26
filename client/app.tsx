import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Register } from './auth/register';
import { Login } from './auth/login';
import Sessions from './sessions/sessions';
import { NoPage } from './noPage';

import './main.css';

export class HopelandsApp extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/sessions/*" element={<Sessions />} />
                    <Route path="*" element={<NoPage />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<HopelandsApp />, document.getElementById('root'));