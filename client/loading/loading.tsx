import React from 'react';

import './loading.css';

export class Loading extends React.Component {
    render() {
        return (
            <div className="loading">
                <div className="loading-inner">
                    <span className="loading-image"></span>
                    <span className="loading-text">Ładowanie...</span>
                </div>
            </div>    
        );
    }
}