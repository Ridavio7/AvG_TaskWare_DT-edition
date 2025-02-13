/* select фильтра анимация */
export const psevdoSelect = (id) => {
    let checkList = document.getElementById(id);
    let select__items = document.getElementsByClassName("select-props-value");
    checkList.addEventListener('click', function(event) {
        for (let i = 0; i < select__items.length; i++) {
            select__items[i].className = select__items[i].className.replace(" select__filter_visible", "");
        }

        checkList.classList.add('select__filter_visible');
        event.stopPropagation();
    });
    window.addEventListener('click', function() {
        checkList.classList.remove('select__filter_visible');
    });
}

/* select фильтра заполенение */
export const addToDropdownPsevdo = (select_id, arr) => {
    let psevdoSelect = document.getElementById(select_id);
    for (let key in arr) {
        if(arr[key].del === 0){
            let li = document.createElement("li");
            let input = document.createElement("input");
            input.type = "checkbox";
            input.className = "checkbox";
            input.value = arr[key].uin;
            input.id = `checkbox_${select_id}_${arr[key].uin}`;
            let label = document.createElement("label");
            label.htmlFor = `checkbox_${select_id}_${arr[key].uin}`;
            label.textContent = arr[key].name;
            li.append(input);
            li.append(label);
            psevdoSelect.append(li);
        }
    }
}

/* select фильтра вне справ */
export const addToDropdownPsevdoAnotherList = (selec, arr, other) => {
    let psevdoSelect = document.getElementById(selec);
    for (let key in arr) {
        let li = document.createElement("li");
        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "checkbox";
        input.value = arr[key];
        input.id = `${other}${arr[key]}`;
        let label = document.createElement('label');
        label.htmlFor = `${other}${arr[key]}`;
        label.textContent = arr[key];
        li.append(input);
        li.append(label);
        psevdoSelect.append(li);
    }
}