'use strict';

import {Icon, Segment, Sidebar, Menu, Grid} from 'semantic-ui-react'
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
		this.state = {
			books: [],
			activeItem: "books"};
		this.handleItemClick = this.handleItemClick.bind(this);
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/books'}).done(response => {
			this.setState({books: response.entity._embedded.books});
		});
	}

	handleItemClick (e, name) {
		this.setState({ activeItem: name })
	}

	render() {
		const activeItem = this.state.activeItem
		console.log(activeItem)

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
								visible={true}
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
