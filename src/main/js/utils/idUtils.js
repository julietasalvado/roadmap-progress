export const getIdFromHref = (href) => {
    return href.substr(href.lastIndexOf('/') + 1, href.length)
}

export const getAvailableId = (nodes) => {
    const min = Math.ceil(1);
    const max = Math.floor(100000);
    while (true) {
        const id = Math.floor(Math.random() * (max - min + 1)) + min;
        if (nodes.filter(node => node.id === id).length === 0)
            // react-flow only accepts ids in string format
            return (id).toString();
    }
}