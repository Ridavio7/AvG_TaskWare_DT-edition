
export const dragElement = (elmnt) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    document.getElementById(elmnt.id + "_moving").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // получить положение курсора мыши при запуске:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // вызов функции при каждом перемещении курсора:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // вычислить новую позицию курсора:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // установите новое положение элемента:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // остановка перемещения при отпускании кнопки мыши:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

let modals = document.querySelectorAll(".modal__moving");
let count = 0;
modals.forEach((elem) => {
    elem.addEventListener("click", (elem) => {
        count += 2;
        elem.target.offsetParent.offsetParent.style.zIndex = count;
    })
})