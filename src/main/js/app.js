import {Icon, Segment, Sidebar, Menu, Grid, Input, Dropdown, Button, Header} from 'semantic-ui-react'
import ItemLayout from "./components/ItemLayout";
import RoadmapLayout from "./components/RoadmapLayout";
import {useEffect, useState} from "react";
import 'regenerator-runtime/runtime'

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
// end::vars[]

// tag::app[]
export default function App (props) {
	const [activeItem, setActiveItem] = useState("books")
	const [roadmapList, setRoadmapList] = useState([])
	const [attributes, setAttributes] = useState([])
	const [links, setLinks] = useState({})
	const [activeRoadmap, setActiveRoadmap] = useState(null)
	const [isbn, setIsbn] = useState("")
	const [submittedIsbn, setSubmittedIsbn] = useState("")
	const [schema, setSchema] = useState()

	const handleItemClick = (e, name) => setActiveItem(name)

	const handleOpenRoadmap = (e, { value }) => setActiveRoadmap(value)
	
	const handleAddNewItemChange = (e, { name, value }) => {
		// TODO this.setState({ [name]: value }) -> antes de migrar a hooks
		//{{`set${name}`}(value)}
	}

	const handleAddNewItemSubmit = () => setSubmittedIsbn(isbn)

	const getRoadmapList = () => {
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
				setSchema(schema.entity);
				return roadmapCollection;
			});
		}).done(roadmapCollection => {
			setRoadmapList(roadmapCollection.entity._embedded.roadmaps)
			setAttributes(Object.keys(schema?.properties))
			setLinks(roadmapCollection.entity._links)
		})
	}

		const mainContent = (activeItem === 'books'
			? <Segment style={{padding: '8em 3em'}} vertical>
				<ItemLayout newItem={submittedIsbn} />
			</Segment>
			: <Segment vertical>
				<RoadmapLayout roadmap={roadmapList.find(roadmap => roadmap.name === activeRoadmap)}/>
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
					onChange={handleAddNewItemChange}
				>
					<input size='tiny'/>
					<Dropdown selection fluid options={options} defaultValue='ISBN' size='mini' />
					<Button type='submit' value={isbn} name="isbn" onClick={handleAddNewItemSubmit} size='small'> + </Button>
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
						   onChange={handleOpenRoadmap}
					/>
						<datalist id='languages'>
							{ roadmapList.map( roadmap => { return <option value={roadmap.name}>{roadmap.name}</option> })}
						</datalist>
				</div>
				</div>)

	useEffect(() => {
		if(activeItem === "roadmaps")
			getRoadmapList()
	}, [activeItem]);

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
										   onClick={(e) => handleItemClick(e,'books')}
								>
									<Icon name='book' size='huge'/>
									Books
								</Menu.Item>
								<Menu.Item as='a'
										   active={activeItem === 'roadmaps'}
										   onClick={(e) => handleItemClick(e,'roadmaps')}
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
// end::app[]

// tag::render[]
ReactDOM.render(
	<App />,
	document.getElementById('react')
)
// end::render[]
