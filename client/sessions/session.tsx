import React from 'react';
import { Link } from 'react-router-dom';
import { SessionType } from '../utils/types';
import { withRouter } from '../utils/withRouter';

import './session.css';

interface SessionProps {
	session: SessionType;
	router: any;
	onDeleteSession: Function;
	onEditSession: Function;
	onSelectSession: Function;
};

class Session extends React.Component<SessionProps> {
	constructor(props: SessionProps) {
		super(props);
	}

	handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const val = event.target.value;

		if (val === 'edit') {
			this.props.onEditSession(this.props.session);
		} else if (val === 'delete') {
			this.props.onDeleteSession(this.props.session);
		}
	}

	render() {
		return (
			<div className="session-item">
				<button onClick={() => this.props.onSelectSession(this.props.session)}>{this.props.session.name}</button>
				<select className="drop-down" onChange={this.handleChange}>
					<option></option>
					<option value="edit">Edytuj ustawienia</option>
					<option value="delete">Usuń sesję</option>
				</select>
			</div>
		);
	}
}

export default withRouter(Session);