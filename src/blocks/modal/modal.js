import {funcCommand, funcProcessOnlyInfo} from '../../js/common/common.js';

export const dragElement = (elmnt) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const mover = document.getElementById(elmnt.id + "_moving");

    mover.onmousedown = dragMouseDown;
    mover.ontouchstart = dragTouchStart;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup   = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function dragTouchStart(e) {
        e = e || window.event;
        e.preventDefault();
        const touch = e.touches[0];
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        const isTouch = !!e.touches;
        const clientX = isTouch ? e.touches[0].clientX : e.clientX;
        const clientY = isTouch ? e.touches[0].clientY : e.clientY;

        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        elmnt.style.top  = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup   = null;
        document.onmousemove = null;
        document.ontouchend  = null;
        document.ontouchmove = null;
    }
}

let modals = document.querySelectorAll(".modal__moving");
let count = 0;
modals.forEach((elem) => {
    elem.addEventListener("click", (elem) => {
        count += 2;
        if(elem.target.offsetParent != null) 
        elem.target.offsetParent.offsetParent.style.zIndex = count;
    })
})

export const resizeModalWindow = (modalId, modalRespName) => {
    let isResizing = false;
    let initialWidth, initialHeight;
    
    modalId.addEventListener('mousedown', function(e) {
        const rect = modalId.getBoundingClientRect();
        initialWidth = rect.width;
        initialHeight = rect.height;
        isResizing = true;
    
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    })
    
    function handleMouseUp() {
        if (!isResizing) return;
    
        const rect = modalId.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = rect.height;
    
        if (newWidth !== initialWidth || newHeight !== initialHeight) {saveSizeToServer(newWidth, newHeight)}
    
        isResizing = false;
    }

    async function saveSizeToServer(width, height) {
        let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"webopt", "name":`${modalRespName}`, "descr":"", "show":"", "fmode":"", "val":`[${width},${height}]`};
        funcCommand(body, funcProcessOnlyInfo);
    }
}