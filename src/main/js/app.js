import {Icon, Segment, Sidebar, Menu, Grid, Input, Dropdown, Button, Header} from 'semantic-ui-react'
import ItemLayout from "./components/ItemLayout";
import RoadmapLayout from "./components/RoadmapLayout";
import {Component} from "react";
import 'regenerator-runtime/runtime'

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
// end::vars[]

// tag::app[]
class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			activeItem: "books",
			roadmapList: [],
			attributes: [],
			links: {},
			activeRoadmap: null,
			isbn: "",
			submittedIsbn: ""
		};
		this.handleItemClick = this.handleItemClick.bind(this)
		this.getRoadmapList = this.getRoadmapList.bind(this);
		this.handleOpenRoadmap = this.handleOpenRoadmap.bind(this);
	}

	handleItemClick (e, name) {
		this.setState({ activeItem: name })
	}

	handleOpenRoadmap = (e, { value }) => this.setState({ activeRoadmap: value })

	handleAddNewItemChange = (e, { name, value }) => {
		this.setState({ [name]: value })}

	handleAddNewItemSubmit = () => {
		const { isbn } = this.state
		this.setState({ submittedIsbn: isbn })
	}

	getRoadmapList() {
		const follow = require('./follow'); // function to hop multiple links by "rel"
		const root = '/api';
		const client = require('./client');

		follow(client, root, [{rel: 'roadmaps', params: {size: 8}}]
		).then(roadmapCollection => {
			return client({
				method: 'GET',
				path: roadmapCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				return roadmapCollection;
			});
		}).done(roadmapCollection => {
			this.setState({
				roadmapList: roadmapCollection.entity._embedded.roadmaps,
				attributes: Object.keys(this.schema.properties),
				links: roadmapCollection.entity._links});
		});
	}

	render() {
		this.getRoadmapList()

		const { activeItem, isbn, submittedIsbn } = this.state
		const mainContent = (activeItem === 'books'
			? <Segment style={{padding: '8em 3em'}} vertical>
				<ItemLayout newItem={submittedIsbn} />
			</Segment>
			: <Segment vertical>
				<RoadmapLayout roadmap={this.state.roadmapList.find(roadmap => roadmap.name === this.state.activeRoadmap)}/>
			</Segment>)

		const options = [
			{
				key: 1,
				text: 'ISBN',
				value: 1,
				content: (
					<Header icon='book' content='ISBN' subheader='Add a book' />
				),
			}
		]
		const additionalMenu = (activeItem === 'books'
			? <Menu.Item as='a'
						 style={{
							 position: "absolute",
							 bottom: "0",
							 paddingLeft: "40px"
						 }}
			>
				<Input
					type='text'
					placeholder='Add a new item...'
					action
					size='mini'
					value={isbn}
					name="isbn"
					onChange={this.handleAddNewItemChange}
				>
					<input size='tiny'/>
					<Dropdown selection fluid options={options} defaultValue='ISBN' size='mini' />
					<Button type='submit' value={isbn} name="isbn" onClick={this.handleAddNewItemSubmit} size='small'> + </Button>
				</Input>
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
						   labelPosition='left corner'
						   onChange={this.handleOpenRoadmap}
					/>
						<datalist id='languages'>
							{ this.state.roadmapList.map( roadmap => { return <option value={roadmap.name}>{roadmap.name}</option> })}
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
