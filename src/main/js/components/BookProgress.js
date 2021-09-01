import React, {Component} from "react";
import {Card, Icon} from "semantic-ui-react";

export class BookProgress extends Component {
    render() {
        return <Card.Content extra>
            <a>
                <Icon name="book"/>
                {this.props.book.progress} %
            </a>
        </Card.Content>;
    }
}