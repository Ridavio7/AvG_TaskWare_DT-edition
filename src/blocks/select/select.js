/* select фильтра анимация */
export const psevdoSelect = (id) => {
    let checkList = document.getElementById(id);
    let select__items = document.getElementsByClassName("select-props-value");
    checkList.addEventListener('click', function(event) {
        for (let i = 0; i < select__items.length; i++) {
            select__items[i].className = select__items[i].className.replace(" select__filter_visible", "");
        }

        checkList.className.includes('select__filter_visible') ? checkList.classList.remove('select__filter_visible') : checkList.classList.add('select__filter_visible');
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
            let input = makeCheckboxForPsevdo(psevdoSelect, "checkbox", "checkbox", arr[key].uin, `checkbox_${select_id}_${arr[key].uin}`, `checkbox_${select_id}_${arr[key].uin}`, arr[key].name);

            input.addEventListener("change", () => {
                let filter = input.parentElement.parentElement.previousElementSibling;
                if(!filter.textContent.includes(arr[key].name)){
                    if(filter.textContent.includes('Комплекты') || filter.textContent.includes('Изделия') ||
                        filter.textContent.includes('Контрагенты') || filter.textContent.includes('Статусы')){ //filter.textContent.includes(`<img class="select__img" src="assets/images/filter.svg" alt=""></img>`)
                        filter.textContent = ""; filter.textContent = `${arr[key].name}, `;
                    } else {
                        filter.textContent += `${arr[key].name}, `;
                    }
                } else if(filter.textContent.includes('')) {
                    filter.textContent = 'Фильтр';
                } else {
                    filter.textContent = filter.textContent.replace(`${arr[key].name},`, '');
                }
            })
        }
    }
}

export const addToDropdownPsevdoFoundPlus = (select_id, arr) => {
    let psevdoSelect = document.getElementById(select_id);
    for (let key in arr) {
        let input = makeCheckboxForPsevdo(psevdoSelect, "checkbox", "checkbox", '', `checkbox_${select_id}_${arr[key]}`, `checkbox_${select_id}_${arr[key]}`, arr[key]);

        input.addEventListener("change", () => {
            let filter = input.parentElement.parentElement.previousElementSibling;
            if(!filter.textContent.includes(arr[key])){
                if(filter.textContent.includes(`Значения`)){
                    filter.innerHTML = ""; filter.innerHTML = `${arr[key]}, `;
                } else {
                    filter.innerHTML += `${arr[key]}, `;
                }
            } else {
                filter.innerHTML = filter.textContent.replace(`${arr[key]},`, '');
            }
        })
    }
}

/* select фильтра вне справ */
export const addToDropdownPsevdoAnotherList = (selec, arr, other) => {
    let psevdoSelect = document.getElementById(selec);
    for (let key in arr) {
        makeCheckboxForPsevdo(psevdoSelect, "checkbox", "checkbox", arr[key], `${other}${arr[key]}`, `${other}${arr[key]}`, arr[key]);
    }
}

const makeCheckboxForPsevdo = (select, input_type, input_class, input_val, input_id, label_for, label_text) => {
    let input = document.createElement("input");
    input.type = input_type;
    input.className = input_class;
    input.value = input_val;
    input.id = input_id;

    let label = document.createElement('label');
    label.htmlFor = label_for;
    label.textContent = label_text;

    let li = document.createElement("li");
    li.append(input);
    li.append(label);
    select.append(li);

    return input;
}