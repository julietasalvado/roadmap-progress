import React, {useEffect, useState} from "react"
import {Canvas, Node, useSelection} from "reaflow";
import useDidMount from "../api/useDidMount";
import BlockPickerMenu from "./BlockPickerMenu";
import {translateXYToCanvasPosition} from "../api/TranslateXYToCanvasPosition";
import client from "./../client";

export default function RoadmapLayout (props) {
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const [roadmap, setRoadmap] = useState([])
    const [blockPickerMenu, setBlockPickerMenu] = useState({
        isDisplayed: false,
        left: 0,
        top: 0,
        displayedFrom: null
    })

    const convertEdges = (from) => {
        return from.map(edge => { return ({
            edgeId: edge.id,
            edgeFrom: edge.from,
            edgeTo: edge.to,
            roadmap: roadmap._links.self.href
        })})
    }

    const convertNodes = (from) => {
        return from.map(node => {
            return ({
                nodeId: node.id,
                height: node.height,
                width: node.width,
                type: node.data.type,
                title: node.data.title,
                roadmap: roadmap._links.self.href
            })})
    }

    const onCreationConfirmation = (e, displayedFrom) => {
        // Send new node to the backend
        if (e.key === "Enter") {
            const parentEdge = findEdgesToNode(displayedFrom.id);

            // Create edge & node
            const newNode = createNormalNode(nodes.length, e.target.value)
            const newEdge = createEdge(parentEdge[0].from, newNode.id)
            let tempNodes = nodes.concat(newNode)
            let tempEdges = edges.concat(newEdge)

            // Remove the plus node & edge
            tempEdges = tempEdges.filter(edge => edge !== parentEdge[0])
            tempNodes = tempNodes.filter(node => node.id !== displayedFrom.id)

            setNodes(tempNodes);
            setEdges(tempEdges);

            // Update roadmap element
            const tempRoadmap = roadmap
            tempRoadmap.nodes = convertNodes(tempNodes)
            tempRoadmap.edges = convertEdges(tempEdges)
            setRoadmap(tempRoadmap);

            // Send them to the backend
            onUpdate()
        }
    }

    const onUpdate = () => {
        client({
            method: 'PUT',
            path: roadmap._links.self.href,
            entity: roadmap,
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(response => {
            console.log("Updated")
        });
    }

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

    const createNormalNode = (id, title) => {
        return createNode(id + '', title, 'MAIN_TOPIC', 125, 250)
    }

    const createPlusNode = (id) => {
        return createNode(id, '+', 'PLUS', 25, 25)
    }

    const createNode = (id, title, type, height, width) => {
        return ({
            id: id,
            height: height,
            width: width,
            data: {
                type: type,
                title: title
            }
        })
    }

    const {selections, onClick} = useSelection({
            nodes,
            edges,
            selections,
            onSelection: (s) => {
                console.log('Selecting Node', s);
            }
        });

    const getRoadmapId = (href) => {
        return href.substr(href.lastIndexOf('/') + 1, href.length)
    }

    const loadRoadmapData = () => {
        if (props.roadmap != null) {
            loadEdges()
            loadNodes()
            const tempRoadmap = props.roadmap
            tempRoadmap.id = getRoadmapId(tempRoadmap._links.self.href)
            setRoadmap(tempRoadmap)
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
                <BlockPickerMenu data={blockPickerMenu} onConfirmation={onCreationConfirmation}/>
                <Canvas
                    direction="DOWN"
                    nodes={nodes}
                    edges={edges}
                    selection={selections}
                    node={
                        <Node
                            onClick = {(event, selectedNode) => {
                                    if (!selectedNode.id.endsWith('+')) {
                                        // Finds a temporary node (the plus node) to delete it
                                        const nodeToDelete = nodes.filter(node => node.data.type === "PLUS")
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
                                            tempNodes = tempNodes.concat(createPlusNode(newNodeId))

                                            // Adds an edge from the selected node to the new plus node
                                            tempEdges = tempEdges.concat(createEdge(selectedNode.id, newNodeId))

                                            // Replace edge from selected node to the selected node'selectedNode children to plus node to selected node'selectedNode children
                                            const edgesToDelete = findEdgesFromNode(selectedNode)
                                            // If it isn't a leaf node
                                            if (edgesToDelete.length > 0) {
                                                tempEdges = tempEdges.concat(createEdge(newNodeId, edgesToDelete[0].to))
                                                tempEdges = tempEdges.filter(childrenEdge => childrenEdge !== edgesToDelete[0])
                                            }

                                            // Save
                                            setEdges(tempEdges)
                                            setNodes(tempNodes)

                                            const tempRoadmap = roadmap
                                            tempRoadmap.nodes = nodes
                                            tempRoadmap.edges = edges
                                            setRoadmap(tempRoadmap);
                                        }
                                    } else {
                                        // Converts the x/y position to a Canvas position and apply some margin for the BlockPickerMenu
                                        // to display on the right bottom of the cursor
                                        const [x, y] = translateXYToCanvasPosition(event.clientX, event.clientY, { top: 3, left: -330 });

                                        // Opens the block picker menu below the clicked element
                                        setBlockPickerMenu({
                                            isDisplayed: true,
                                            // Depending on the position of the canvas, you might need to deduce from x/y some delta
                                            left: x,
                                            top: y,
                                            displayedFrom: selectedNode
                                        });
                                    }
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