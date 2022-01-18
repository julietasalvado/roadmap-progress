import React, {Component} from "react"
import follow from "./../follow"
import client from "./../client"
import BookLayout from "./BookLayout"

class ItemLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            attributes: [],
            pageSize: 8,
            links: {}
        };
        this.loadFromServer = this.loadFromServer.bind(this);
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    loadFromServer(pageSize) {
        const follow = require('./../follow'); // function to hop multiple links by "rel"
        const root = '/api';
        const client = require('./../client');

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

    render() {
        return <BookLayout books={this.state.books}/>
    }

}
export default ItemLayout