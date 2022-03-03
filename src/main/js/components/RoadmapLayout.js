import React, {useEffect, useState} from "react"
import useDidMount from "../api/useDidMount";
import BlockPickerMenu from "./BlockPickerMenu";
import {translateXYToCanvasPosition} from "../api/TranslateXYToCanvasPosition";
import client from "./../client";
import {getIdFromHref} from "../utils/idUtils";
import ReactFlow, {removeElements} from 'react-flow-renderer';
import PlusNode from "./nodes/PlusNode";

export default function RoadmapLayout (props) {
    const [roadmap, setRoadmap] = useState([])
    const [elements, setElements] = useState([])
    const [blockPickerMenu, setBlockPickerMenu] = useState({
        isDisplayed: false,
        left: 0,
        top: 0,
        displayedFrom: null
    })

    const onCreationConfirmation = (e, displayedFrom) => {
        // Send new node to the backend
        if (e.key === "Enter") {
            // Close block picker
            /*setBlockPickerMenu({
                isDisplayed: false,
                left: 0,
                top: 0,
                displayedFrom: {}
            });

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
            tempRoadmap.nodes = convertNodesFromDB(tempNodes)
            tempRoadmap.edges = convertEdges(tempEdges)
            setRoadmap(tempRoadmap);

            // Send them to the backend
            onUpdate()*/
        }
    }

/*    const onUpdate = () => {
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
    }*/

    const convertEdges = () => {
        return (props.roadmap.edges.map(edge => {
            return ({
                id: edge.id,
                source: edge.edgeFrom,
                target: edge.edgeTo
            })
        }))
    }

    const convertNodesFromUI = (node) => {
        return {
            id: node.id,
            nodeType: node.type,
            data: node.data,
            position: node.position,
            // TODO roadmap: props.roadmap._links.self.href,
            type: node.type,
        }
    }

    const convertNodesFromDB = () => {
        return (props.roadmap.nodes.map(node => {
            return ({
                id: node.id,
                nodeType: node.nodeType,
                data: {
                    label: (
                        node.title
                    ),
                },
                position: {
                    x: node.x,
                    y: node.y
                },
                // TODO roadmap: props.roadmap._links.self.href,
                type: 'input',
            })}))
    }

/*    const findEdgesToNode = (nodeId) => {
        return edges != null && edges.filter(edge => edge.to === nodeId)
    }*/

    const createEdge = (parentId, childrenId) => {
        console.log('creating edge', parentId, childrenId)
        return ({
            id: parentId + '-' + childrenId,
            source: parentId,
            target: childrenId
        })
    }

/*    const createNormalNode = (id, title) => {
        return createNode(id + '', title, 'MAIN_TOPIC', 125, 250)
    }*/

    const createPlusNode = (id, x, y) => {
        return createNode(id, '', 'PLUS', x + 160, y - 30, {
            background: '#f1e826',
            color: '#333',
            border: '3px solid ##f1e826',
            width: 50,
        })
    }

    const createMaterialPlusNode = (id, x, y) => {
        return createNode(id, 'Add Material', 'MATERIAL-PLUS', x + 160, y + 30, {
            background: '#D6D5E6',
                color: '#333',
                border: '1px solid #222138',
                width: 100,
        },)
    }

    const createNode = (id, title, type, x, y, style) => {
        return ({
            id: id,
            type: type,
            data: {
                label: title
            },
            position: {
                x: x,
                y: y
            },
            style: style
        })
    }

/*    const {selections, onClick} = useSelection({
        nodes,
        edges,
        selections,
        onSelection: (s) => {
            console.log('Selecting Node', s);
        }
    });*/

    const loadRoadmapData = () => {
        if (props.roadmap != null) {
            setElements(convertNodesFromDB().concat(convertEdges()))

            const tempRoadmap = props.roadmap
            tempRoadmap.id = getIdFromHref(tempRoadmap._links.self.href)
            tempRoadmap.elements = elements;
            setRoadmap(tempRoadmap)
        }
    }

    const didMount = useDidMount()
    useEffect(() => {
        if (!didMount) { loadRoadmapData() }
    }, [didMount, props.roadmap])

    const nodeTypes = {
        PLUS: PlusNode,
    };

    console.log(elements)
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
            <ReactFlow
                nodeTypes={nodeTypes}
                elements={elements}
                onElementClick={(event, selectedNode) => {
                    console.log('element ', selectedNode)

                    if (!selectedNode.id.endsWith('+')) {
                        // Finds a temporary node (the plus node) to delete it
                        const nodesToDelete = elements.filter(node => node.nodeType === "PLUS" || node.nodeType === "MATERIAL-PLUS")
                        const newNodeId = selectedNode.id + '+'
                        const newMaterialId = selectedNode.id + 'M+'

                        // If not selecting the node twice
                        if (nodesToDelete.length === 0 || nodesToDelete[0].id !== newNodeId || nodesToDelete[0].id !== newMaterialId) {
                            let tempElements = elements

                            if (nodesToDelete.length > 0) {
                                // Deletes the plus node & edge from plus node
                                tempElements = removeElements(nodesToDelete, elements)
                            }

                            tempElements = tempElements
                                // Adds two nodes with plus symbols -add material and add node- as a temporary nodes
                                .concat(createPlusNode(newNodeId, selectedNode.position.x, selectedNode.position.y))
                                .concat(createMaterialPlusNode(newMaterialId, selectedNode.position.x, selectedNode.position.y))
                                // Adds an edge from the selected node to the new plus nodes
                                .concat(createEdge(selectedNode.id, newNodeId))
                                .concat(createEdge(selectedNode.id, newMaterialId))

                            // Save
                            setElements(tempElements)

                            const tempRoadmap = roadmap
                            tempRoadmap.elements = elements;
                            setRoadmap(tempRoadmap);
                        }} else {
                            // Converts the x/y position to a Canvas position and apply some margin for the BlockPickerMenu
                            // to display on the right bottom of the cursor
                            const [x, y] = translateXYToCanvasPosition(event.clientX, event.clientY, { top: 3, left: -330 });

                            // Opens the block picker menu below the clicked element
                            setBlockPickerMenu({
                                isDisplayed: true,
                                // Depending on the position of the canvas, you might need to deduce from x/y some delta
                                left: x,
                                top: y,
                                displayedFrom: convertNodesFromUI(selectedNode)
                            });
                        }
                }}
            >
            </ReactFlow>
        </div>
    }
}