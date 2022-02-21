import React, {useEffect, useState} from "react"
import {Canvas, Node, useSelection} from "reaflow";
import useDidMount from "../api/useDidMount";

export default function RoadmapLayout (props) {
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])

    const loadEdges = () => {
        setEdges(props.roadmap.edges.map(edge => {
            return ({
                id: edge.id,
                from: edge.edgeFrom,
                to: edge.edgeTo
            })
        }))
    }

    const loadNodes = () => {
        setNodes(props.roadmap.nodes.map(node => {
            return ({
                id: node.id,
                height: node.height,
                width: node.width,
                data: {
                    type: node.type,
                    title: node.title
                }
            })}))
    }

    const findNode = (nodeId) => {
        return nodes != null && nodes.find((node) => nodeId === node.id)
    }

    const findEdgesFromNode = (nodeId) => {
        return edges != null && edges.filter(edge => edge.from === nodeId)
    }

    const findEdgesToNode = (nodeId) => {
        return edges != null && edges.filter(edge => edge.to === nodeId)
    }

    const createEdge = (parentId, childrenId) => {
        return ({
            id: parentId + '-' + childrenId,
            from: parentId,
            to: childrenId
        })
    }

    const createNode = (id, title) => {
        return ({
            id: id,
            height: 25,
            width: 25,
            data: {
                type: "PLUS",
                title: title
            }
        })
    }

    const {selections, onClick} = useSelection({
            nodes,
            edges,
            selections,
            onSelection: (s) => {
                // if only one node is selected
                if (s.length === 1 && !s[0].endsWith('+')) {
                    // Finds a temporary node (the plus node) to delete it
                    const nodeToDelete = nodes.filter(node => node.data.type === "PLUS")
                    const selectedNode = findNode(s[0])
                    const newNodeId = selectedNode.id + '+'

                    // If not selecting the node twice
                    if (nodeToDelete.length === 0 || nodeToDelete[0].id !== newNodeId) {
                        let tempNodes = nodes
                        let tempEdges = edges

                        if (nodeToDelete.length > 0) {
                            // Creates a new edge in order to restore the old connection between the selected node and its old children
                            const plusNodeParentEdge = findEdgesToNode(nodeToDelete[0].id)
                            const plusNodeChildrenEdges = findEdgesFromNode(nodeToDelete[0].id)
                            // If not removing a leaf node
                            if (plusNodeChildrenEdges.length > 0)
                                tempEdges = tempEdges.concat(createEdge(plusNodeParentEdge[0].from, plusNodeChildrenEdges[0].to))

                            // Deletes both edges in plus node
                            tempEdges = tempEdges.filter(edge => (edge !== plusNodeParentEdge[0]) && (plusNodeChildrenEdges.length === 0 || edge !== plusNodeChildrenEdges[0]))

                            // Deletes the plus node & edge from plus node
                            tempNodes = nodes.filter(node => node !== nodeToDelete[0])
                        }
                        // Adds a button with a plus symbol as a temporary node
                        tempNodes = tempNodes.concat(createNode(newNodeId, "+"))

                        // Adds an edge from the selected node to the new plus node
                        tempEdges = tempEdges.concat(createEdge(selectedNode.id, newNodeId))

                        // Replace edge from selected node to the selected node's children to plus node to selected node's children
                        const edgesToDelete = findEdgesFromNode(s[0])
                        // If it isn't a leaf node
                        if (edgesToDelete.length > 0) {
                            tempEdges = tempEdges.concat(createEdge(newNodeId, edgesToDelete[0].to))
                            tempEdges = tempEdges.filter(childrenEdge => childrenEdge !== edgesToDelete[0])
                        }

                        // Save
                        setEdges(tempEdges)
                        setNodes(tempNodes)
                    }
                }
            }
        });

    const loadRoadmapData = () => {
        if (props.roadmap != null) {
            loadEdges()
            loadNodes()
        }
    }

        const didMount = useDidMount()
        useEffect(() => {
                if (!didMount) { loadRoadmapData() }
            }, [didMount, props.roadmap])

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
                    selection={selections}
                    node={
                        <Node
                            onClick = {(event, node) => {
                            console.log('Selecting Node', event, node);
                            onClick(event, node);
                        }}>
                            {event => (
                                <foreignObject height={event.height} width={event.width} x={0} y={0} pointerEvents="none">
                                    {event.node.data.type === "MAIN_TOPIC" &&
                                    <div style={{padding: 10, textAlign: 'center'}}>
                                        <h3 style={{color: 'white'}}>{event.node.data.title}</h3>
                                        <input type="range" min="1" max="100" value={event.node.data.value}/>
                                    </div>
                                    }
                                    {event.node.data.type === "START" &&
                                    <div style={{
                                        padding: 10,
                                        textAlign: 'center',
                                        borderRadius: "5px 5px 0px 0px"
                                    }}>
                                        <h3 style={{color: 'white'}}>{event.node.data.title}</h3>
                                    </div>
                                    }
                                    {event.node.data.type === "PLUS" &&
                                        <div style={{textAlign: 'center', backgroundColor: "#8b9395", border: "none"}}>
                                        <h3 style={{color: 'dark grey'}}>{event.node.data.title}</h3>
                                        </div>
                                    }
                                    }
                                </foreignObject>
                            )}
                        </Node>
                    }
                />
            </div>
        }
}