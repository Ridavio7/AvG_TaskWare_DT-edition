import {showNotification} from '../../blocks/modal/__notification/modal__notification.js';

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
    console.log(respobj);
    responseProcessor(result, respobj.succ);
}

export const responseProcessor = (res, respobj) => {
    if( res === 0 ) return;
    let result;
    switch (respobj) {
        case 1:
            showNotification('success', 'Успех!', 'Операция выполнена успешно');
            result = true;
            break
        case 2:
            showNotification('success', 'Успех!', 'Операция выполнена успешно');
            result = true;
            break
        case -113:
            showNotification('info', 'Предупреждение!', 'Пройдите авторизацию на сайте');
            result = true;
            window.location = 'index.html';
            break
        case 0:
            showNotification('error', 'Ошибка!', 'Произошла ошибка при выполнении');
            result = false;
            break
        case -123:
            showNotification('warning', 'Предупреждение!', 'Недостаточно прав доступа');
            result = false;
            break
        default:
            showNotification('success', 'Успех!', 'Операция выполнена успешно');
            result = true;
            break
    }

    return result;
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

export const insertDataInSelect = (select, text, uin, arr_obj) => {
    addToDropdownOneOption(select, text, uin);
    addToDropdown(select, arr_obj);
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
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj": `${obj}`, "count":"10000", "filt":`${filt_str}`};
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

/* события на кнопки */
export const addEventButtonTab = (button_tab, func) => {
    button_tab.forEach((elem) => {
        elem.addEventListener("click", () => {
            func();
        })
    })
}

/* показать/скрыть пароль */
export const togglePassword = (elem, input_id) => {
    const passwordInput = document.getElementById(input_id);

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        elem.target.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.8108 18.2497L25.287 25.7277C25.3733 25.814 25.4758 25.8825 25.5886 25.9292C25.7014 25.976 25.8223 26 25.9444 26C26.0664 26 26.1873 25.976 26.3001 25.9292C26.4129 25.8825 26.5154 25.814 26.6017 25.7277C26.6881 25.6414 26.7565 25.5389 26.8033 25.4261C26.85 25.3133 26.874 25.1924 26.874 25.0703C26.874 24.9483 26.85 24.8274 26.8033 24.7146C26.7565 24.6018 26.6881 24.4993 26.6017 24.413L2.46105 0.272291C2.37473 0.185964 2.27224 0.117486 2.15945 0.0707662C2.04666 0.0240463 1.92577 9.09603e-10 1.80368 0C1.6816 -9.09602e-10 1.56071 0.0240463 1.44792 0.0707662C1.33513 0.117486 1.23264 0.185964 1.14631 0.272291C1.05999 0.358618 0.991509 0.461103 0.94479 0.573895C0.89807 0.686687 0.874023 0.807576 0.874023 0.929661C0.874023 1.05175 0.89807 1.17263 0.94479 1.28543C0.991509 1.39822 1.05999 1.5007 1.14631 1.58703L7.14434 7.58506C6.32817 8.16359 5.59364 8.84941 4.96054 9.62402C4.06436 10.7236 3.36284 11.9684 2.8863 13.3045C2.8473 13.4178 2.79902 13.5738 2.79902 13.5738L2.7656 13.6889C2.7656 13.6889 2.62447 14.6119 3.42482 14.8236C3.66269 14.8864 3.9158 14.8523 4.12853 14.7287C4.34127 14.6051 4.49625 14.4021 4.55944 14.1643L4.56129 14.1588L4.57615 14.1123L4.64114 13.9099C5.04588 12.7819 5.63927 11.7307 6.39598 10.8013C6.99213 10.0714 7.69595 9.43646 8.48322 8.91837L11.4135 11.8487C10.8222 12.2193 10.322 12.7185 9.95025 13.3091C9.57845 13.8997 9.34459 14.5665 9.26606 15.2599C9.18753 15.9534 9.26636 16.6556 9.49666 17.3144C9.72697 17.9732 10.1028 18.5716 10.5963 19.065C11.0898 19.5585 11.6882 19.9344 12.347 20.1647C13.0057 20.395 13.708 20.4738 14.4014 20.3953C15.0949 20.3168 15.7617 20.0829 16.3523 19.7111C16.9429 19.3393 17.442 18.8391 17.8127 18.2478M16.4385 16.8737C16.2605 17.2934 15.9821 17.6631 15.6279 17.9502C15.2736 18.2373 14.8543 18.433 14.4068 18.5202C13.9592 18.6074 13.4971 18.5834 13.061 18.4502C12.6249 18.3171 12.2281 18.079 11.9055 17.7567C11.5829 17.4345 11.3444 17.038 11.2108 16.602C11.0773 16.166 11.0528 15.7039 11.1395 15.2563C11.2263 14.8086 11.4216 14.3891 11.7083 14.0346C11.995 13.68 12.3644 13.4013 12.784 13.2228L16.4385 16.8737ZM10.7543 5.94349L12.3402 7.52935C12.823 7.4625 13.3343 7.42907 13.874 7.42907C17.6697 7.42907 19.976 9.12264 21.3539 10.8032C22.1106 11.7326 22.704 12.7837 23.1088 13.9118C23.1397 14.0021 23.1614 14.0696 23.1738 14.1142L23.1886 14.1606V14.1662L23.1905 14.168C23.2592 14.3998 23.4155 14.5956 23.6264 14.7139C23.8372 14.8321 24.0858 14.8635 24.3194 14.8014C24.553 14.7392 24.7531 14.5885 24.8773 14.3811C25.0014 14.1737 25.0398 13.926 24.9843 13.6908V13.6852L24.9825 13.6778L24.975 13.6537C24.9436 13.5362 24.9064 13.4203 24.8636 13.3064C24.3871 11.9703 23.6855 10.7255 22.7894 9.62588C21.1255 7.59435 18.3233 5.5721 13.8777 5.5721C12.7301 5.5721 11.6921 5.7058 10.7562 5.94164" fill="black"/></svg>')`;
    } else {
        passwordInput.type = 'password';
        elem.target.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.86549 8.67188V8.6775C1.83318 8.79659 1.77715 8.90829 1.70063 9.0062C1.6241 9.10412 1.52857 9.18634 1.41951 9.24816C1.31044 9.30998 1.18997 9.35018 1.06499 9.36648C0.940007 9.38277 0.812964 9.37484 0.691124 9.34312C-0.135923 9.12937 0.00991326 8.1975 0.00991326 8.1975L0.0444538 8.08125C0.0444538 8.08125 0.0943451 7.92375 0.134642 7.80937C0.627073 6.46029 1.35199 5.20342 2.27806 4.09313C3.99931 2.04188 6.89494 0 11.4907 0C16.0865 0 18.9821 2.04188 20.7053 4.09313C21.6314 5.20342 22.3563 6.46029 22.8487 7.80937C22.89 7.92531 22.9284 8.04222 22.9638 8.16L22.9696 8.18437V8.19188L22.9715 8.19563C23.0324 8.43425 22.9949 8.68669 22.867 8.89853C22.7392 9.11036 22.5313 9.26464 22.2881 9.3281C22.045 9.39155 21.786 9.35911 21.5671 9.23776C21.3482 9.11641 21.1869 8.91587 21.1179 8.67937L21.1159 8.67188L21.1006 8.625L21.0334 8.42063C20.6152 7.28161 20.002 6.22027 19.2201 5.28187C17.7962 3.585 15.4149 1.875 11.4907 1.875C7.56656 1.875 5.18712 3.585 3.76137 5.28187C2.97942 6.22027 2.36625 7.28161 1.94801 8.42063L1.88084 8.625L1.86549 8.67188ZM11.4907 5.625C10.2184 5.625 8.9982 6.11886 8.09854 6.99794C7.19888 7.87701 6.69346 9.0693 6.69346 10.3125C6.69346 11.5557 7.19888 12.748 8.09854 13.6271C8.9982 14.5061 10.2184 15 11.4907 15C12.763 15 13.9832 14.5061 14.8829 13.6271C15.7826 12.748 16.288 11.5557 16.288 10.3125C16.288 9.0693 15.7826 7.87701 14.8829 6.99794C13.9832 6.11886 12.763 5.625 11.4907 5.625ZM8.61236 10.3125C8.61236 9.56658 8.91561 8.85121 9.45541 8.32376C9.99521 7.79632 10.7273 7.5 11.4907 7.5C12.2541 7.5 12.9862 7.79632 13.526 8.32376C14.0658 8.85121 14.3691 9.56658 14.3691 10.3125C14.3691 11.0584 14.0658 11.7738 13.526 12.3012C12.9862 12.8287 12.2541 13.125 11.4907 13.125C10.7273 13.125 9.99521 12.8287 9.45541 12.3012C8.91561 11.7738 8.61236 11.0584 8.61236 10.3125Z" fill="black"/></svg>')`;
    }
}

const validationBase = (input_id, pattern) => {
    let msg;
    let input = document.getElementById(input_id);

    if(input.value.trim().length === 0 || input.value.match(pattern) === null){
        input.classList.add('input__type-text_error');
        msg = false;
    } else {
        input.classList.remove('input__type-text_error');
        msg = true;
    }
    return msg;
}

export const nameValidation = (input_id) => {
    const name_pattern = /^[А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+ [А-ЯЁ][а-яё]+$/;
    return validationBase(input_id, name_pattern);
}

export const emailValidation = (input_id) => {
    const email_pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return validationBase(input_id, email_pattern);
}

export const phoneValidation = (input_id) => {
    const phone_pattern = /^(?:\+7|8|7)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return validationBase(input_id, phone_pattern);
}

export async function validateForm(name, email, phone){
    const validationPromises = [
        nameValidation(name),
        emailValidation(email),
        phoneValidation(phone)
    ];

    try {
        const results = await Promise.all(validationPromises);
        return results.every(valid => valid);
    } catch (error) {
        return false;
    }
}

/* пометка вкладко */
export const returnTabs = () => {
    /* помечаем кнопки боковой панели */
    document.getElementById(localStorage.getItem("sidebar_tab_active")).click();
    /* помечаем кнопки вкладок контента */
    document.getElementsByClassName(localStorage.getItem("tabcontent_tab_active"))[0].click();
}

export const updateDirectory = () => {
    const user = localStorage.getItem('srtf');
    const requests = [
        { obj: "sets", callback: processResponse("sets") },
        { obj: "products", callback: processResponse("products") },
        { obj: "colors", callback: processResponse("colors") },
        { obj: "verapp", callback: processResponse("verapp") },
        { obj: "verpp", callback: processResponse("verpp") },
        { obj: "meas", callback: processResponse("meas") },
        { obj: "coeffs", callback: processResponse("coeffs"), sort: "uin" },
        { obj: "props", callback: processResponse("props") },
        { obj: "typeselem", callback: processResponse("typelm") },
        { obj: "contragents", callback: processResponse("contragents") },
        { obj: "storages", callback: processResponse("storages") },
        { obj: "statuses", callback: processResponse("statuses") },
        { obj: "statussn", callback: processResponse("statussn") },
        { obj: "statusdoc", callback: processResponse("statusdoc") },
        { obj: "users", callback: processResponse("users") },
        { obj: "prof", callback: processResponse("prof") },
        { obj: "contents", callback: processResponse("contents") },
        { obj: "startstep", callback: processResponse("startstep") },
        { obj: "statustask", callback: processResponse("statustask") }
    ];

    requests.forEach(({ obj, callback, sort }) => {
        const body = { 
            user, 
            meth: "view", 
            obj, 
            count: "5000",
            ...(sort && { sort })
        };
        funcCommand(body, callback);
    });

    function processResponse(storageKey) {
        return function(result, respobj) {
            if (result === 0) return;
            localStorage.setItem(`${storageKey}_list`, JSON.stringify(respobj.answ));
        };
    }
}

export const treeSpanFactory = (container, data, text, style) => {
    const textSpan = document.createElement('span');
    textSpan.className = style;
    textSpan.textContent = data != '' ? `${text}${data}` : '---';
    container.appendChild(textSpan);
}

export const treeSpanFactoryStatusTree = (container, data, style) => {
    const textSpan = document.createElement('span');
    textSpan.className = style;
    textSpan.innerHTML = data;
    container.appendChild(textSpan);
}

export const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day   = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year  = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const mins  = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${mins}`;
}

export const setStatus = (status) => {
    let img;
    switch (status) {
        case 1:
            img = '<img class="" src="assets/images/no_start.svg">';
            break
        case 2:
            img = '<img class="" src="assets/images/active.svg">';
            break
        case 3:
            img = '<img class="" src="assets/images/time_fail.svg">';
            break
        case 4:
            img = '<img class="" src="assets/images/complete.svg">';
            break
        case 5:
            img = '<img class="" src="assets/images/complete_error.svg">';
            break
        case 6:
            img = '<img class="" src="assets/images/cancel.svg">';
            break
        default:
            img = '???';
            break
    }

    return img;
}