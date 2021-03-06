import React, {useEffect, useState} from "react"
import useDidMount from "../api/useDidMount";
import BlockPickerMenu from "./BlockPickerMenu";
import {translateXYToCanvasPosition} from "../api/TranslateXYToCanvasPosition";
import client from "./../client";
import {getAvailableId, getIdFromHref} from "../utils/idUtils";
import ReactFlow, {getOutgoers, getIncomers, removeElements, isNode, addEdge, isEdge} from 'react-flow-renderer';
import PlusNode from "./nodes/PlusNode";

const getNodes = (elements) => {
    return elements.filter(element => isNode(element))
}

const getEdges = (elements) => {
    return elements.filter(element => isEdge(element))
}

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
        // Sends new node to the backend
        if (e.key === "Enter") {
            let parentNode = getIncomers(displayedFrom, elements)[0];

            // if it is a main topic node
            let nodeType = "SECONDARY_TOPIC";
            let nodeId = getAvailableId(getNodes(elements));
            let nodeX = 125, nodeY = 125;
            if (parentNode.data.nodeType === 'START') {
                nodeType = "MAIN_TOPIC";
                nodeX = parentNode.position.x;
                nodeY = parentNode.position.y + 100;
            }

            // Creates edge & node
            const newNode = createNormalNode(nodeId, e.target.value, nodeType, nodeX, nodeY);
            const newEdge = createEdge(parentNode.id, nodeId);
            let tempElements = elements
                .concat(newNode);
            tempElements = addEdge(newEdge, tempElements);

            // Removes the plus node & edge
            const nodesToRemove = getOutgoers(parentNode, tempElements).filter(node => node.id.endsWith('+'))
            tempElements = removeElements(nodesToRemove, tempElements)

            // Takes all nodes a position below
            tempElements
                .filter(element => isNode(element, tempElements))
                .filter(node => node.position.y >= newNode.position.y)
                .map(node => {
                    node.position = {
                        ...node.position,
                        y: node.position.y + 100,
                    };
                } );

            // Takes the old children one position below
            if (parentNode.data.nodeType === 'START') {
                const siblings = getOutgoers(parentNode, tempElements).filter(node => node !== newNode && node.data.nodeType === 'MAIN_TOPIC')

                // Node reorganization for the first main_topic
                if (siblings.length === 1) {
                    let sibling = siblings[0];
                    sibling.position = {
                        ...sibling.position,
                        y: sibling.position.y + 100,
                    };

                    // Removes edges between father and siblings and keeping the father for reuse
                    const siblingEdge = getEdges(tempElements).filter(edge => edge.target === sibling.id)
                    tempElements = removeElements(siblingEdge, tempElements);

                    const newEdge = createEdge(newNode.id, sibling.id)
                    tempElements = addEdge(newEdge, tempElements)
                }
            }

            setElements(tempElements)

            // Send them to the backend
            onUpdate(tempElements)

            // Close block picker
            setBlockPickerMenu({
                isDisplayed: false,
                left: 0,
                top: 0,
                displayedFrom: {}
            });
        }
    }

    const onUpdate = (updatedElements) => {
        //separate nodes & edges
        const nodes = getNodes(updatedElements).map(node => { return {
            nodeId: node.id,
            x: node.position.x,
            y: node.position.y,
            height: 0,
            width: 0,
            title: node.data.label,
            roadmap: roadmap._links.self.href,
            type: node.data.nodeType,
        }})

        const edges = updatedElements.filter(element => !isNode(element)).map(edge => { return {
            edgeId: (edge.id).toString(),
            edgeFrom: edge.source,
            edgeTo: edge.target,
            roadmap: roadmap._links.self.href,
        }})

        const tempRoadmap = roadmap
        tempRoadmap.nodes = nodes
        tempRoadmap.edges = edges
        setRoadmap(tempRoadmap);

        client({
            method: 'PUT',
            path: roadmap._links.self.href,
            entity: tempRoadmap,
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(response => {
            console.log("Updated", response)
        });
    }

    const convertEdges = () => {
        return (props.roadmap.edges.map(edge => {
            return ({
                id: (edge.id).toString(),
                source: edge.edgeFrom,
                target: edge.edgeTo
            })
        }))
    }

    const convertNodesFromDB = () => {
        return (props.roadmap.nodes.map(node => {
            let style;
            if (node.type === 'START') {
                style = {
                    background: '#7294d2',
                    fontWeight: 'bold',
                }
            }

            return ({
                id: node.id,
                data: {
                    label: (
                        node.title
                    ),
                    nodeType: node.type
                },
                position: {
                    x: node.x,
                    y: node.y
                },
                type: 'input',
                style: style,
            })}))
    }

    const createEdge = (parentId, childrenId) => {
        console.log('creating edge', parentId, childrenId)
        return ({
            id: parentId + '-' + childrenId,
            source: parentId,
            target: childrenId
        })
    }

    const createNormalNode = (id, title, nodeType, x, y) => {
        return createNode(id, title, nodeType, x, y)
    }

    const createPlusNode = (id, x, y) => {
        return createNode(id, '+', 'PLUS', x + 160, y - 30, {
            background: '#f1e826',
            color: '#333',
            border: '3px solid ##f1e826',
            width: 50,
        })
    }

    const createMaterialPlusNode = (id, x, y) => {
        return createNode(id, 'Add Material', 'MATERIAL_PLUS', x + 160, y + 30, {
            background: '#D6D5E6',
                color: '#333',
                border: '1px solid #222138',
                width: 100,
        },)
    }

    const createNode = (id, title, type, x, y, style) => {
        return ({
            id: id,
            type: 'input',
            data: {
                label: title,
                nodeType: type
            },
            position: {
                x: x,
                y: y
            },
            style: style
        })
    }

    const loadRoadmapData = () => {
        if (props.roadmap != null) {
            setElements(convertNodesFromDB().concat(convertEdges()))

            const tempRoadmap = props.roadmap
            tempRoadmap.id = getIdFromHref(tempRoadmap._links.self.href)
            setRoadmap(tempRoadmap)
        }
    }

    const didMount = useDidMount()
    useEffect(() => {
        if (!didMount) { loadRoadmapData() }
    }, [didMount, props.roadmap])

    const nodeTypes = {
        PLUS: PlusNode,
        MATERIAL_PLUS: PlusNode,
        START: PlusNode,
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
                        const nodesToDelete = elements.filter(node => node.nodeType === "PLUS" || node.nodeType === "MATERIAL_PLUS")
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
                                .concat(createMaterialPlusNode(newMaterialId, selectedNode.position.x, selectedNode.position.y));
                                // Adds an edge from the selected node to the new plus nodes
                                //.concat(createEdge(selectedNode.id, newNodeId))
                                //.concat(createEdge(selectedNode.id, newMaterialId))

                            tempElements = addEdge(createEdge((selectedNode.id).toString(), newNodeId), tempElements);
                            tempElements = addEdge(createEdge((selectedNode.id).toString(), newMaterialId), tempElements);

                            // Save
                            setElements(tempElements)
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
                                displayedFrom: selectedNode
                            });
                        }
                }}
            >
            </ReactFlow>
        </div>
    }
}