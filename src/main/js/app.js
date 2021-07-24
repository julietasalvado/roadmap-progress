'use strict';

import {Card, CardGroup, Container, Grid, Image, Segment} from 'semantic-ui-react'

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
			<BookList books={this.state.books}/>
		)
	}
}
// end::app[]

// tag::book-list[]
class BookList extends React.Component{
	render() {
		/*const books = this.props.books.map(book =>
			<Book key={book._links.self.href} book={book}/>
		);*/

		const booksCards = this.props.books.map(book =>

				<Card>
					<Image src={book.coverUrl} wrapped ui={false} />
					<Card.Content>
						<Card.Header>{book.title}</Card.Header>
					</Card.Content>
				</Card>
		);
		return (
			<Container>
				<Segment style={{ padding: '8em 0em' }} vertical>
					<Grid.Row textAlign='center'>
						<Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
							<CardGroup>
								{booksCards}
							</CardGroup>
						</Grid.Column>
					</Grid.Row>
				</Segment>
			</Container>
		)
	}
}
// end::book-list[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
