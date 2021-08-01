'use strict';

import {Container, Segment} from 'semantic-ui-react'
import BookLayout from "./components/BookLayout";

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
// end::vars[]

// tag::app[]
class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {books: []};
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/books'}).done(response => {
			this.setState({books: response.entity._embedded.books});
		});
	}

	render() {
		return (
			<Container>
				<Segment style={{padding: '8em 0em'}} vertical>
					<BookLayout books={this.state.books}/>
				</Segment>
			</Container>
		)
	}
}
// end::app[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
