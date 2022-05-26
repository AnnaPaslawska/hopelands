import React from 'react';
import Select from 'react-select';
import Axios from 'axios';
import { withRouter } from '../utils/withRouter';
import { getUser } from '../utils/common';
import { SessionType, UserType } from '../utils/types';

import './sessionProperties.css';

type SessionPropertiesProps = {
	router: any;
	updateSession: Function;
};

type SessionPropertiesState = {
	_id: string;
	users: Array<UserType>;
	error: Error;
	name: string;
	players: Array<UserType>;
	mgs: Array<UserType>;
};

class SessionProperties extends React.Component<SessionPropertiesProps, SessionPropertiesState> {
	user: UserType;
	state: SessionPropertiesState = {
		_id: '',
		users: null,
		error: null,
		name: '',
		players: null,
		mgs: null
	};

	constructor(props: SessionPropertiesProps) {
		super(props);
	}

	componentDidMount() {
		const sessionId = this.props.router.params.sessionId;

		this.user = getUser();
		this.getAllPlayers();

		if (sessionId) {
			this.getSessionData(sessionId);
		}
	}

	getAllPlayers() {
		Axios.post('/api/user/getAll')
			.then(response => {
				this.setState({ users: response.data });
			})
			.catch(reason => {
				this.setState({ error: reason.response.data });
			});
	}

	getSessionData(sessionId: string) {
		Axios.post('/api/session/get', { sessionId })
			.then(response => {
				const data = response.data;

				this.setState({
					_id: data.session._id,
					name: data.session.name,
					players: data.players,
					mgs: data.mgs
				});
			})
			.catch(reason => {
				this.setState({ error: reason.response.data });
			});
	}

	onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const { name, players } = this.state;
		let mgs = this.state.mgs;

		if (!mgs) {
			mgs = [].concat(this.user);
		} else if (!mgs.some(user => user._id === this.user._id)) {
			mgs.push(this.user);
		}

		this.props.updateSession({ name, players, mgs });
	}

	getId = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ _id: event.target.value });
	}

	getName = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ name: event.target.value });
	}

	getPlayers = (options: any) => {
		this.setState({ players: options });
	}

	getMgs = (options: any) => {
		this.setState({ mgs: options });
	}

	render() {
		const players = this.state.users;

		return (
			<div className="session-properties hplns-form">
				<form className="session-properties-form" onSubmit={this.onSubmit}>
					<input type="hidden" id="_id" name="_id" value={this.state._id} onChange={this.getId} />
					<div className="hplns-form-field">
						<label htmlFor="name">Nazwa sesji:</label>
						<input id="name" type="text" name="name" value={this.state.name} onChange={this.getName} required />
					</div>
					<div className="hplns-form-field">
						<label htmlFor="players">Gracze:</label>
						<Select
							options={players}
							name="players"
							isMulti
							value={this.state.players}
							getOptionLabel={option => option.username}
							getOptionValue={option => option._id}
							onChange={this.getPlayers}
						/>
					</div>
					<div className="hplns-form-field">
						<label htmlFor="mgs">MG:</label>
						<Select
							options={players}
							name="mgs"
							isMulti
							value={this.state.mgs}
							getOptionLabel={option => option.username}
							getOptionValue={option => option._id}
							onChange={this.getMgs}
						/>
					</div>
					<input type="submit" value="Zapisz" />
				</form>
			</div>	
		);
	}
}

export default withRouter(SessionProperties);