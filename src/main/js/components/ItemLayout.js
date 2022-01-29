import React, {useEffect, useRef, useState} from "react"
import {Card, CardGroup, Grid, Image, Label} from "semantic-ui-react";
import {BookProgress} from "./BookProgress";

function useDidMount() {
    const didMountRef = useRef(true);

    useEffect(() => {
        didMountRef.current = false;
    }, []);
    return didMountRef.current;
};

export default function ItemLayout (props) {
    const [items, setItems] = useState([])
    const [attributes, setAttributes] = useState([])
    const [pageSize, setPageSize] = useState(8)
    const [links, setLinks] = useState([])
    const [filterBy, setFilterBy] = useState(null)
    const [filteredData, setFilteredData] = useState()
    const [error, setError] = useState()
    const [schema, setSchema] = useState()

    const getTopics = (book) => {
        return book.topics.length > 0 && book.topics.map(topic =>
            <Label as='a' tag onClick={(e) => { handleTopicClick(e, topic.title)}}>
                {topic.title}
            </Label>
        )
    }
    const handleTopicClick = (e, topic) => {
        // filter items
        setFilterBy(topic)
    }
    const getFilteredItemCards = () => {
        return items
            .filter(item => filterBy === null || (item.topics.length > 0 && item.topics.filter(topic => topic.title === filterBy)))
            .map(item =>
                <Card color={item.starred ? 'pink' : 'grey'}>
                    <Image src={item.coverUrl} wrapped ui={false}/>
                    <Card.Content>
                        <Card.Header>{item.title}</Card.Header>
                    </Card.Content>
                    <BookProgress book={item}/>
                    <div>
                        {getTopics(item)}
                    </div>
                </Card>
            );
    }

    const loadAsyncData = async () => {
        setError(null)

        try {
            const itemsCards = getFilteredItemCards(items)
            console.log(itemsCards)
            return <Grid.Row textAlign="center">
                <Grid.Column style={{paddingBottom: "5em", paddingTop: "5em"}}>
                    <CardGroup>
                        {itemsCards}
                    </CardGroup>
                </Grid.Column>
            </Grid.Row>
        } catch(e) {
            setError(e);
        }
    }

    const loadFromServer = (pageSize) => {
        const follow = require('./../follow'); // function to hop multiple links by "rel"
        const root = '/api';
        const client = require('./../client');

        follow(client, root, [
            {rel: 'items', params: {size: pageSize}}]
        ).then(itemsCollection => {
            return client({
                method: 'GET',
                path: itemsCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                setSchema(schema.entity)
                return itemsCollection;
            });
        }).done(itemsCollection => {
            setItems(itemsCollection.entity._embedded.items)
            setAttributes(Object.keys(schema?.properties))
            setPageSize(pageSize)
            setLinks(itemsCollection.entity._links)
        });
    }

    const didMount = useDidMount();

    useEffect(() => {
        if(!didMount)
            loadFromServer(pageSize)
    }, [didMount]);

    useEffect(() => {
        loadAsyncData().then(filteredData =>
            setFilteredData(filteredData));
    }, [items, filterBy]);

    if(error) return (<p>Something went wrong</p>);
    else return <div>
        {filteredData}
    </div>

}