// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */

import React, {useEffect, useState} from "react";
import {Input} from "semantic-ui-react";
import {css, jsx} from "@emotion/react";
import useDidMount from "../api/useDidMount";

export default function BlockPickerMenu(props) {
    const [isDisplayed, setIsDisplayed] = useState(false)

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
            <Input focus placeholder='Node name...' />
        </div>
    </div>);
}