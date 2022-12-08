import { render, html } from 'uhtml';

const createElement = (tag, props, ...children) => {
    if (tag === 'fragment') return children;
    if (typeof tag === 'function') return tag(props, ...children);
    const element = document.createElement(tag);

    Object.entries(props || {}).forEach(([name, value]) => {
        if (name.startsWith('nrk')) {
            try {
                element.addEventListener(name.toLowerCase().slice(3), value);
            } catch {
                console.log('Error: Event listener does not exist');
            }
        } else element.setAttribute(name, value.toString());
    });
    children.forEach((child) => {
        appendChild(element, child);
    });
    return element;
};

const appendChild = (parent, child) => {
    if (Array.isArray(child))
        child.forEach((nestedChild) => appendChild(parent, nestedChild));
    else
        parent.appendChild(
            child.nodeType ? child : document.createTextNode(child)
        );
};

function Routes(obj) {
    let urlPath = window.location.pathname.split('/').slice(1);
    let result;
    while (urlPath.length > 0 && obj) {
        if (urlPath[0] == '') urlPath[0] = '/';
        if (!result) {
            try {
                result = obj[urlPath[0]].elem; // if result is not defined, assign the element to result
                obj = obj[urlPath[0]].route; // assign the new route to obj
            } catch {
                try {
                    result = obj['*'].elem;
                } catch {
                    return;
                }
            }
        } else {
            try {
                result.append(obj[urlPath[0]].elem); // if the next path is not empty, append the element to result
                obj = obj[urlPath[0]].route; // assign the new route to obj
            } catch {
                try {
                    result = obj['*'].elem;
                } catch {
                    return result;
                }
            }
        }
        urlPath.shift(); // remove the first element of urlPath
    }
    return result;
}

const Navigate = ({ elem, link, state, id = 'root', component }) => {
    elem.onclick = () => {
        history.pushState(state, link, link);
        render(window.document.getElementById(id), html`${component()}`);
    };
    elem.style.cursor = 'pointer';
    return elem;
};

const react = (id, commponent) => {
    render(window.document.getElementById(id), html`${commponent()}`);
};

module.exports = { createElement, Routes, Navigate, react };
