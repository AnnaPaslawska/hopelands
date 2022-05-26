import React from 'react';

import './noPage.css';

export class NoPage extends React.Component {
	render() {
		return (
			<div className="no-page">
				<h1>Wystąpił błąd</h1>
				<h3>Strona, którą usiłujesz otworzyć, nie istnieje.</h3>
			</div>
		);
	}
}