import React, {useEffect, useState} from "react"
import {Card, CardGroup, Grid, Image, Label} from "semantic-ui-react"
import {BookProgress} from "./BookProgress"

export default function BookLayout (props) {
    const [filterBy, setFilterBy] = useState(null)
    const [data, setData] = useState()
    const [error, setError] = useState()

    const getTopics = (book) => {
        return book.topics.length > 0 && book.topics.map(topic =>
            <Label as='a' tag onClick={handleTopicClick}>
                {topic.title}
            </Label>
        )
    }
    const handleTopicClick = (e) => {
        console.log("click")
        // filter items
        setFilterBy("italian")
    }
    const getFilteredItemCards = (books, filtered) => {
        return books
            .filter(book => filtered === null || (book.topics.length > 0 && book.topics.filter(topic => topic.title === filtered)))
            .map(book =>
                <Card color={book.starred ? 'pink' : 'grey'}>
                    <Image src={book.coverUrl} wrapped ui={false}/>
                    <Card.Content>
                        <Card.Header>{book.title}</Card.Header>
                    </Card.Content>
                    <BookProgress book={book}/>
                    <div>
                        {getTopics(book)}
                    </div>
                </Card>
            );
    }

    const loadAsyncData = async (books) => {
        setError(null)

        try {
            console.log("painting")
            const itemsCards = getFilteredItemCards(books, filterBy)
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

    useEffect(() => {
        loadAsyncData(props.books).then(data =>
            setData(data));
    }, [props.books]);

    if(error) return (<p>Something went wrong</p>);
    else return <div>
        {data}
    </div>
}