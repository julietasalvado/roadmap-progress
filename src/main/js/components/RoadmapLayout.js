import React from "react"
import {Canvas, Node} from "reaflow";

function RoadmapLayout (props) {
    const edges = !(props.roadmap == null)  && props.roadmap.edges.map( edge => {
        return ({
            id: edge.id,
            from: edge.edgeFrom,
            to: edge.edgeTo
        })
    })

    const nodes = [
        {
            id: '1',
            height: 100,
            width: 250,
            data: {
                type: "start",
                title: "Java Roadmap"
            }
        },
        {
            id: '2',
            height: 125,
            width: 250,
            data: {
                value: 25,
                type: "main-topic",
                title: "Frameworks"
            }
        }
    ];

    if (props.roadmap == null)
        return <div/>
    else {

        return <div style={{
            height: "100vh",
            overflow: "auto",
            backgroundColor: "#f5f5f5",
            backgroundSize: "50px 50px",
            backgroundImage: "linear-gradient(90deg, #eaeaea 1px, transparent 0), linear-gradient(180deg, #eaeaea 1px, transparent 0)",
            backgroundPosition: "right -109px bottom -39px",
            transform: "scale(1)",
            zIndex: "-10000"
        }}>
            <Canvas
                direction="DOWN"
                nodes={nodes}
                edges={edges}
                node={
                    <Node>
                        {event => (
                            <foreignObject height={event.height} width={event.width} x={0} y={0}>
                                {event.node.data.type === "main-topic" &&
                                <div style={{padding: 10, textAlign: 'center'}}>
                                    <h3 style={{color: 'white'}}>{event.node.data.title}</h3>
                                    <input type="range" min="1" max="100" value={event.node.data.value}/>
                                </div>
                                }
                                {event.node.data.type === "start" &&
                                <div style={{
                                    padding: 10,
                                    textAlign: 'center',
                                    borderRadius: "5px 5px 0px 0px"
                                }}>
                                    <h3 style={{color: 'white'}}>{event.node.data.title}</h3>
                                </div>
                                }
                            </foreignObject>
                        )}
                    </Node>
                }
            />
        </div>
    }
}

export default RoadmapLayout