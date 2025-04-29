const url = "https://apitw.avantguard.pro:32100/json";

export const funcCommand = (body, callbackfunc, func) => {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Ошибка соединения!')
            }
            return response.json()
        })
        .catch((err) => {
            console.log(err)
            callbackfunc(0, null)
        })
        .then((data) => {
            callbackfunc(1, data)
        })
        .then(func)
}

export const funcProcessOnlyInfo = (result, respobj) => {
    if( result === 0 ) return;
    console.log(respobj);
    if(respobj.succ === 0){alert("Произошла ошибка! Попробуйте снова!")};
}

/* изменение цвета кнопки обновления */
export const highlightButtonSave = (elem) => {
    elem.classList.add('button__control_update_active');
    setTimeout(function(){
        elem.classList.remove('button__control_update_active');
    }, 1000);
}

export const highlightButtonSaveModal = (obj) => {
    obj.style.background = "var(--green)";
    setTimeout(function(){
        obj.style.background = "var(--expand-button-active)";
    }, 2000);
}

/* поиск input для обновления */
export const findForUpdateInput = (name, table) => {
    let inputs = table.getElementsByTagName("input");
    let input_value = [];
    for (let i = 0, len = inputs.length; i < len; i++) {
        if (inputs[i].name === name) {
            input_value.push(inputs[i]);
        }
    }
    let target_input = input_value[0].value;
    if(target_input === ""){
        target_input = " ";
    }

    return target_input;
}

/* поиск select для обновления */
export const findForUpdateSelect = (table, determinant, uin) => {
    let selects = table.getElementsByTagName("select");
    let select_value = [];
    for (let i = 0, len = selects.length; i < len; i++) {
        if (selects[i].id === `${determinant}_${uin}`) {
            select_value.push(selects[i]);
        }
    }
    let target_select = select_value[0].value;

    return target_select;
}

/* добавление option в select */
export const addToDropdown = (select, arr_obj) => {
    let arr = JSON.parse(localStorage.getItem(arr_obj));
    for (let key in arr) {
        if(arr[key].del === 0){
            let newOption = new Option(arr[key].name, arr[key].uin);
            select.append(newOption);
        }
    }
}

/* добавление одну option в select */
export const addToDropdownOneOption = (select, text, uin) => {
    let option = document.createElement("option");
    option.text = text;
    option.value = uin;
    select.appendChild(option);
}

/* создание и заполнение select для составов */
export const makeSelect = 
(determinant, uin, optionText, optionUin, list, className, cell) => {
    let select = document.createElement("select");
    select.id = `${determinant}_${uin}`;
    select.className = className;
    let option = document.createElement("option");
    option.text = optionText;
    option.value = optionUin;
    select.appendChild(option);
    cell.appendChild(select);

    addToDropdown(select, list);
}

/* очистка и установка опции select */
export const removeOptionsSetValue = (selec, text) => {
    let mySelect = document.getElementById(selec);
    while (mySelect.options.length) {mySelect.options[0] = null};
    let option = document.createElement("option");
    option.text = text;
    option.value = "";
    mySelect.appendChild(option);
}

/* очистка select */
export const removeOptions = (selec) => {
    selec.value = "";
    let len = selec.length;
    for (let i = 0; i < len; i++) {
        selec.remove(0);
    }
}

/* очистка таблицы без первой строки*/
export const clearTable = (tb_id) => {
    let table = document.getElementById(tb_id);
    for(let i = 1; i < table.rows.length;){
        table.deleteRow(i);
    }
}

/* очистка таблицы */
export const clearTableAll = (tb_id) => {
    let table = document.getElementById(tb_id);
    for(let i = 0; i < table.rows.length;){
        table.deleteRow(i);
    }
}

/* select сортировка */
export const listenSortSelect = (select, tb, obj, func, filt) => {
    document.getElementById(select).addEventListener('change', function(){
        clearTable(tb);
    
        let option = this.selectedIndex;
        switch (option){
            case 0:
            let body0  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body0, func);
            break;
            case 1:
            let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "sort":"name", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body1, func);
            break;
            case 2:
            let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "asort":"name", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body2, func);
            break;
            case 3:
            let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "sort":"uin", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body3, func);
            break;
            case 4:
            let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "asort":"uin", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body4, func);
            break;
            case 5:
            let body5  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "sort":"uinset", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body5, func);
            break;
            case 6:
            let body6  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "asort":"uinset", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body6, func);
            break;
            case 7: 
            let body7  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "sort":"datechange", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body7, func);
            break;
            case 8:
            let body8  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"500", "asort":"datechange", "filt":`${JSON.stringify(filt)}`};
            funcCommand(body8, func);
            break;
        }
    });
}

/* select фильтра считывание значения */
export const listenSelect = (select, filt, val, filt_main) => {
    select.addEventListener('change', function(){
        val.length = 0;
        let checkboxes = select.getElementsByTagName("input");
        for(let key in checkboxes){
            if(checkboxes[key].checked === true){
                let chbv = checkboxes[key].value;
                val.push(chbv);
            }
        }
        filt.val = val;
        filt_main.push(filt);
    });
}

/* date фильтра считывание значения */
export const listenDate = (date_1, date_2, filt, val, filt_main) => {
    date_1.addEventListener('change', function(){
        val.length = 0;
        val.push(date_1.value);
        filt.vald = val;
        filt_main.push(filt);
    })
    date_2.addEventListener('change', function(){
        val.push(date_2.value);
        filt.vald = val;
        filt_main.push(filt);
    })
}

/* фильтр для анализа слушает */
export const listenFiltSelectAnalisys = 
(select_1_id, select_2_id, select_3_id, select_4_id, select_5_id, date_1_id, date_2_id, filt_main) => {
    let select_1 = document.getElementById(select_1_id);
    let select_2 = document.getElementById(select_2_id);
    let select_3 = document.getElementById(select_3_id);
    let select_4 = document.getElementById(select_4_id);
    let select_5 = document.getElementById(select_5_id);
    let date_1   = document.getElementById(date_1_id);
    let date_2   = document.getElementById(date_2_id);
    let filt_1   = {fld: "uin", on: "sets"};
    let val_1    = [];
    let filt_2   = {fld: "uin", on: "products"};
    let val_2    = [];
    let filt_3   = {fld: "uin", on: "components"};
    let val_3    = [];
    let filt_4   = {fld: "uin", on: "contragents"};
    let val_4    = [];
    let filt_5   = {fld: "uin", on: "statuses"};
    let val_5    = [];
    let filt_6   = {fld: "date"};
    let val_6    = [];

    listenSelect(select_1, filt_1, val_1, filt_main);
    listenSelect(select_2, filt_2, val_2, filt_main);
    listenSelect(select_3, filt_3, val_3, filt_main);
    listenSelect(select_4, filt_4, val_4, filt_main);
    listenSelect(select_5, filt_5, val_5, filt_main);
    listenDate(date_1, date_2, filt_6, val_6, filt_main);
}

/* фильтр для анализа отправка */
export const sendFiltAnalisys = (filt, tb_id, obj, func) => {
    let filt_filter = Array.from(new Set(filt.map(filt => JSON.stringify(filt)))).map(filt => JSON.parse(filt));
    let filt_str = JSON.stringify(filt_filter);
    clearTableAll(tb_id);
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "count":"5000", "filt":`${filt_str}`, "asotr": "uin"};
    funcCommand(body, func);
}

/* фильтр для анализа очистка */
export const clearFiltAnalisys = 
(select_1, select_2, select_3, select_4, select_5, date_1, date_2, tb_id, filt, func) => {
    filt.length = 0;
    clearCheckboxes(select_1);
    clearCheckboxes(select_2);
    clearCheckboxes(select_3);
    clearCheckboxes(select_4);
    clearCheckboxes(select_5);
    document.getElementById(date_1).value = "";
    document.getElementById(date_2).value = "";
    clearTableAll(tb_id);
    func;
}

/* сортировка анализа */
export const sortAnalisys = (selec, tb_id, filt, obj, func) => {
    document.getElementById(selec).addEventListener('change', function(){
        let table = document.getElementById(tb_id);
        for(let i = 0; i < table.rows.length;){
            table.deleteRow(i);
        }
    
        let filt_filter = Array.from(new Set(filt.map(filt => JSON.stringify(filt)))).map(filt => JSON.parse(filt));
        let filt_str = JSON.stringify(filt_filter);
        let option = this.selectedIndex;
        switch (option){
            case 0:
            let body0  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000"};
            funcCommand(body0, func);
            break;
            case 1:
            let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "sort":"uin"};
            funcCommand(body1, func);
            break;
            case 2:
            let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "asort":"uin"};
            funcCommand(body2, func);
            break;
            case 3:
            let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "sort":"name"};
            funcCommand(body3, func);
            break;
            case 4:
            let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "asort":"name"};
            funcCommand(body4, func);
            break;
            case 5:
            let body5  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "sort":"datechange"};
            funcCommand(body5, func);
            break;
            case 6:
            let body6  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "asort":"datechange"};
            funcCommand(body6, func);
            break;
        }
    });
}

/* отправка отфильтрованного запроса */
export const sendFilt = (filt, tb_id, obj, func) => {
    let filt_str = JSON.stringify(filt);
    clearTable(tb_id);
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj": `${obj}`, "count":"500", "filt":`${filt_str}`};
    funcCommand(body, func);
}

/* очистка фильтра */
export const clearFilt = (filt, select_1, select_2, select_3, tb_id, func) => {
    filt.length = 0;
    clearCheckboxes(select_1);
    clearCheckboxes(select_2);
    clearCheckboxes(select_3);
    clearTable(tb_id);
    func;
}

/* очистка чекбоксов фильтра */
export const clearCheckboxes = (select_id) => {
    let selec = document.getElementById(select_id);
    let inputs = selec.querySelectorAll("input");
        for(let i = inputs.length; i--;) {
        inputs[i].checked = false;
    }
}