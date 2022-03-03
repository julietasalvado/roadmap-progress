import React, {memo, useState} from 'react';
import {Icon} from "reaflow";
import {Handle} from "react-flow-renderer";

export default memo(({ data, isConnectable }) => {
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
                <p>+</p>
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