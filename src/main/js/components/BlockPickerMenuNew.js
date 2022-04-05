// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, Input, Popup} from "semantic-ui-react";
import {css, jsx} from "@emotion/react";
import useDidMount from "../api/useDidMount";

export default function BlockPickerMenuNew(props) {
    const [isDisplayed, setIsDisplayed] = useState(false)
    const [title, setTitle] = useState("")
    const [cover, setCover] = useState("")
    const [isFavorite, setIsFavorite] = useState(false)

    const handleFieldNewItemChange = (e, data) => {
        console.log("data", data)
        if (name === "title") setTitle(data.value)
        if (name === "cover") setCover(data.value)
        if (name === "isFavorite") setIsFavorite(data.value)
    }

    const didMount = useDidMount()
    useEffect(() => {
        setIsDisplayed(props.data.isDisplayed)
    }, [didMount, props.data])

    if (!isDisplayed) {
        return null;
    }

    return (<div
        css={css`
                z-index: 5;
                position: absolute;
                top: ${typeof props.data.top !== 'undefined' ? `${props.data.top}px` : `initial`};
                bottom: ${typeof props.data.top !== 'undefined' ? `initial` : `0`};
                left: ${typeof props.data.left !== 'undefined' ? `${props.data.left}px` : `calc(50% - 100px)`};
                width: 300px;
                height: 58px;
                background-color: white;
                border-radius: 5px;
                padding: 10px;
        
                .blocks-picker {
                  display: flex;
                  flex-wrap: nowrap;
                  justify-content: space-evenly;
                }
              `}
    >
        <div className={'blocks-picker'} >
            {props.data.displayedFrom.data.type === 'PLUS' && <Input
                focus
                placeholder='Node name...'
                onKeyPress={(e) => props.onConfirmation(e, props.data.displayedFrom)}
            />}
            {props.data.displayedFrom.data.type !== 'PLUS' &&
            <div>
                <Button>
                Book
                </Button>

                <Popup trigger={<Button>Course</Button>} flowing hoverable position='bottom center'>
                    <Form>
                        <Form.Field>
                            <label>Name</label>
                            <input placeholder='Course Name' onChange={(e) => {
                                handleFieldNewItemChange(e, {name: 'title', value: title})
                            }}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Cover URL</label>
                            <input placeholder='www...' value={cover} onChange={(e) => {
                                handleFieldNewItemChange(e, {name: 'cover', value: value})}} />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox label='Mark as favorite' onChange={(e) => {
                                handleFieldNewItemChange(e, {name: 'isFavorite', value: isFavorite})
                            }}/>
                        </Form.Field>
                        <Button
                            type='submit'
                            onClick={(e) => props.newItemOnSubmit(e,'COURSE', {title: title, cover_url: cover})}>
                            Submit
                        </Button>
                    </Form>
                </Popup>

                <Button>
                Article
                </Button>
            </div>
            }
        </div>
    </div>);
}