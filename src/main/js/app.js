'use strict';

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
		const books = this.props.books.map(book =>
			<Book key={book._links.self.href} book={book}/>
		);
		return (
			<table>
				<tbody>
					<tr>
						<th>Title</th>
						<th>Cover URL</th>
					</tr>
					{books}
				</tbody>
			</table>
		)
	}
}
// end::employee-list[]

// tag::employee[]
class Book extends React.Component{
	render() {
		return (
			<tr>
				<td>{this.props.book.title}</td>
				<td>{this.props.book.coverUrl}</td>
			</tr>
		)
	}
}
// end::employee[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
