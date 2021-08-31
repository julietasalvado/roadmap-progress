'use strict';

import {Icon, Segment, Sidebar, Menu, Grid} from 'semantic-ui-react'
import BookLayout from "./components/BookLayout";

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"
const root = '/api';
// end::vars[]

// tag::app[]
class App extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			books: [],
			activeItem: "books",
			attributes: [],
			pageSize: 8,
			links: {}
		};
		this.handleItemClick = this.handleItemClick.bind(this);
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
			{rel: 'books', params: {size: pageSize}}]
		).then(booksCollection => {
			return client({
				method: 'GET',
				path: booksCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return booksCollection;
			});
		}).done(booksCollection => {
			this.setState({
				books: booksCollection.entity._embedded.books,
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: booksCollection.entity._links});
		});
	}

	handleItemClick (e, name) {
		this.setState({ activeItem: name })
	}

	render() {
		const activeItem = this.state.activeItem

		return (
				<Grid columns={1}>
					<Grid.Column>
						<Sidebar.Pushable as={Segment}>
							<Sidebar
								as={Menu}
								animation='slide along'
								icon='labeled'
								inverted
								vertical
								visible='true'
								width='thin'
							>
								<Menu.Item as='a'
										   active={activeItem === 'books'}
										   onClick={(e) => this.handleItemClick(e,'books')}
								>
									<Icon name='book' />
									Books
								</Menu.Item>
							</Sidebar>

							<Sidebar.Pusher>
								<Segment style={{padding: '8em 3em'}} vertical>
									<BookLayout books={this.state.books}/>
								</Segment>
							</Sidebar.Pusher>
						</Sidebar.Pushable>
					</Grid.Column>
				</Grid>
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
