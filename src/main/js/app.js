import {Icon, Segment, Sidebar, Menu, Grid, Input} from 'semantic-ui-react'
import BookLayout from "./components/BookLayout";
import RoadmapLayout from "./components/RoadmapLayout";
import {Component} from "react";
import 'regenerator-runtime/runtime'

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow'); // function to hop multiple links by "rel"
const root = '/api';
// end::vars[]

// tag::app[]
class App extends Component {

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
			{rel: 'items', params: {size: pageSize}}]
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
				books: booksCollection.entity._embedded.items,
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
		const mainContent = (activeItem === 'books'
			? <Segment style={{padding: '8em 3em'}} vertical>
				<BookLayout books={this.state.books}/>
			</Segment>
			: <Segment vertical>
				<RoadmapLayout />
			</Segment>)

		const additionalMenu = (activeItem === 'books'
			? <Menu.Item as='a'
						 style={{
							 position: "absolute",
							 bottom: "0",
							 paddingLeft: "40px"
						 }}
			>
				<Icon name='save' />
				Menu
			</Menu.Item>
			: <div
						   style={{
							   position: "absolute",
							   bottom: "0",
							   paddingLeft: "40px"
						   }}
				>
				<Input
					action={{
						color: 'teal',
						labelPosition: 'left',
						icon: 'sitemap',
						content: 'Create',
					}}
					actionPosition='left'
					placeholder='Roadmap Name....'
				/>
				<div style={{padding: "10px 10px 10px 10px"}}>
					<Input list='languages'
						   placeholder='Open a Roadmap...'
						   label={{ icon: 'folder open' }}
						   labelPosition='left corner'/>
						<datalist id='languages'>
							<option value='Leadership'>Leadership</option>
							<option value='Java Developer'>Java Developer</option>
						</datalist>
				</div>
				</div>)

		return (
				<Grid columns={1}>
					<Grid.Column>
						<Sidebar.Pushable>
							<Sidebar
								as={Menu}
								animation='slide along'
								icon='labeled'
								inverted
								vertical
								visible={true}
								width='wide'
							>
								<Menu.Item as='a'
										   active={activeItem === 'books'}
										   onClick={(e) => this.handleItemClick(e,'books')}
								>
									<Icon name='book' size='huge'/>
									Books
								</Menu.Item>
								<Menu.Item as='a'
										   active={activeItem === 'roadmaps'}
										   onClick={(e) => this.handleItemClick(e,'roadmaps')}
								>
									<Icon name='map' />
									Roadmaps
								</Menu.Item>
								{additionalMenu}
							</Sidebar>

							<Sidebar.Pusher>
								<div style={{
									height: "100vh",
									overflow: "auto"
								}}>
									{mainContent}
								</div>
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
