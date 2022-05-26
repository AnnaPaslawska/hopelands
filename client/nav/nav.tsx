import React from 'react';
import Axios from 'axios';
import { removeUserSession } from '../utils/common';
import { withRouter } from '../utils/withRouter';

import './nav.css';

type NavProps = {
    router: any;
};

class Nav extends React.Component<NavProps> {
    constructor(props: NavProps) {
        super(props);
    }

    logout = () => {
        Axios.post('/api/auth/signout')
            .then(() => {
                removeUserSession();

                this.props.router.navigate('/');
            });
    }

    render() {
        return (
            <React.Fragment>
                <div className="nav"><button onClick={this.logout}>&#10162; Wyloguj</button></div>
            </React.Fragment>
        );
    }
}

export default withRouter(Nav);