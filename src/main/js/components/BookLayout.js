import React, {Component} from "react"
import {Card, CardGroup, Grid, Image} from "semantic-ui-react";
import {BookProgress} from "./BookProgress";

class BookLayout extends Component {
    render() {
        const booksCards = this.props.books.map(book =>
            <Card color={book.starred ? 'pink' : 'grey'}>
                <Image src={book.coverUrl} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{book.title}</Card.Header>
                </Card.Content>
                <BookProgress book={book}/>
            </Card>
        );

        return <Grid.Row textAlign="center">
            <Grid.Column style={{paddingBottom: "5em", paddingTop: "5em"}}>
                <CardGroup>
                    {booksCards}
                </CardGroup>
            </Grid.Column>
        </Grid.Row>;
    }
}

export default BookLayout