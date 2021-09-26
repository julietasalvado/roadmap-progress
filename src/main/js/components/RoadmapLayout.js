import React, {Component} from "react"
import {Canvas, Node} from "reaflow";

class RoadmapLayout extends Component {
    render() {
        const nodes = [
            {
                id: '1',
                height: 100,
                width: 250,
                data: {
                    type: "start"
                }
            },
            {
                id: '2',
                height: 125,
                width: 250,
                data: {
                    value: 25,
                    type: "main-topic"
                }
            }
        ];
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
                        edges={[
                            {
                                id: '1-2',
                                from: '1',
                                to: '2'
                            }
                        ]}
                        node={
                            <Node>
                                {event => (
                                    <foreignObject height={event.height} width={event.width} x={0} y={0}>
                                        { event.node.data.type === "main-topic" &&
                                        <div style={{ padding: 10, textAlign: 'center' }}>
                                            <h3 style={{ color: 'white' }}>Progress</h3>
                                            <input type="range" min="1" max="100" value={event.node.data.value} />
                                        </div>
                                        }
                                        { event.node.data.type === "start" &&
                                        <div style={{
                                            padding: 10,
                                            textAlign: 'center',
                                            borderRadius: "5px 5px 0px 0px"
                                        }}>
                                            <h3 style={{ color: 'white' }}>Java Roadmap</h3>
                                        </div>
                                        }
                                    </foreignObject>
                                )}
                            </Node>
                        }
                        onLayoutChange={layout => console.log('Layout', layout)}
                    />
        </div>
    }
}

export default RoadmapLayout