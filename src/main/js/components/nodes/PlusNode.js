import React, {memo} from 'react';
import {Handle} from "react-flow-renderer";
import {Icon} from "semantic-ui-react";

export default memo(({ data, isConnectable }) => {
    console.log('data', data)
    return (
        <>
            <Handle
                type="target"
                position="left"
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <div>
                <h1>{data.displayedFrom.data.label}</h1>
                <Icon plus/>
            </div>
            <Handle
                type="source"
                position="right"
                id="a"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position="right"
                id="b"
                style={{ bottom: 10, top: 'auto', background: '#555' }}
                isConnectable={isConnectable}
            />
        </>
    );
})