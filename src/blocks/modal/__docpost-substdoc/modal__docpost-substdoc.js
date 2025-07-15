import {funcCommand, funcProcessOnlyInfo, removeOptions, clearTable, clearTableAll} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcProcessGetDocpost} from '../../table/__provider/table__provider.js';

let docpost_substdoc_modal          = document.getElementById("docpost_substdoc_modal");
let docpost_substdoc_close          = document.getElementById("docpost_substdoc_close");
let docpost_substdoc_name_1c        = document.getElementById("docpost_substdoc_name_1c");
let docpost_substdoc_name_1c_show   = document.getElementById("docpost_substdoc_name_1c_select");
let docpost_substdoc_component      = document.getElementById("docpost_substdoc_component");
let docpost_substdoc_component_show = document.getElementById("docpost_substdoc_component_select");
let docpost_substdoc_status_ready   = document.getElementById("docpost_substdoc_status_ready");
let docpost_substdoc_status_process = document.getElementById("docpost_substdoc_status_process");
let docpost_substdoc_full_find      = document.getElementById("docpost_substdoc_full_find");
let docpost_substdoc_nofull_find    = document.getElementById("docpost_substdoc_nofull_find");
let docpost_substdoc_button_perfom  = document.getElementById("docpost_substdoc_button_perfom");
let tb_docpost_substdoc_1c          = document.getElementById("tb_docpost_substdoc_1c");
let tb_docpost_substdoc_comp        = document.getElementById("tb_docpost_substdoc_comp");

let uincompont;

docpost_substdoc_close.onclick = () => {
    docpost_substdoc_modal.style.display = "none";
}

dragElement(docpost_substdoc_modal);

export const funcInfoDocpostSubstdocOpenModal = () => {
    docpost_substdoc_modal.style.display = "block";
}

docpost_substdoc_name_1c.addEventListener('input', (elem) => {
    let body =  {"user":`${localStorage.getItem('srtf')}`, "obj":"docpost", "meth":"found1conly", "status":"[1, 2]", "name":`${elem.target.value}`, "count":"100"};

    funcCommand(body, funcProcessShowName1c);
})

const funcProcessShowName1c = (result, respobj) => {
    removeOptions(docpost_substdoc_name_1c_show);

    let arr = respobj.answ;
    for (let key in arr) {
        let newOption = new Option(arr[key].name1c, arr[key].uin);
        docpost_substdoc_name_1c_show.append(newOption);
    }

    let tb_id = "tb_docpost_substdoc_1c";
    clearTableAll("tb_docpost_substdoc_1c");
    for (let key in respobj.answ) {
        let val    = respobj.answ[key];
        let name1c = val.name1c;
        addRowShowName1c(name1c, tb_id);
    }
}

const addRowShowName1c = (name1c, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td td_small";
    cellName.innerHTML = name1c;
}

docpost_substdoc_component.addEventListener('input', (elem) => {
    let body =  {"user":`${localStorage.getItem('srtf')}`, "obj":"components", "meth":"found", "name":`${elem.target.value}`, "count":"100"};

    funcCommand(body, funcProcessShowNameComp);
})

const funcProcessShowNameComp = (result, respobj) => {
    removeOptions(docpost_substdoc_component_show);

    let arr = respobj.answ;
    for (let key in arr) {
        let newOption = new Option(arr[key].name, arr[key].uin);
        docpost_substdoc_component_show.append(newOption);
    }
}

docpost_substdoc_button_perfom.onclick = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"subst1c", "obj":"docpost", "regime":"found", "methfound":"", "status":"", "name1c":"", "uincompont":""};

    let docpost_substdoc_name_1c_val = docpost_substdoc_name_1c.value;
    uincompont = docpost_substdoc_component_show.value;
    if (docpost_substdoc_name_1c.value = '' || uincompont === undefined) {
        alert("Вы не заполнили все поля!")
    } else {
        if(docpost_substdoc_full_find.checked == true){
            body.methfound = 'full';
            body.name1c = docpost_substdoc_name_1c_show.textContent;
        } else if(docpost_substdoc_nofull_find.checked == true){
            body.methfound = 'nofull';
            body.name1c = docpost_substdoc_name_1c_val;
        }

        let status_arr = [];
        if(docpost_substdoc_status_ready.checked === true){ status_arr.push(1) };
        if(docpost_substdoc_status_process.checked === true){ status_arr.push(2) };
        body.status = `[${status_arr}]`;

        body.uincompont = `${uincompont}`;

        funcCommand(body, funcProcessDocpostSubstdoc);

        docpost_substdoc_name_1c.value = docpost_substdoc_name_1c_val;
    }
}

const funcProcessDocpostSubstdoc = (result, respobj) => { 
    if(respobj.size === 0){
        alert('По вашему запросу ничего не найдено!')
    } else {
        let docpost_substdoc_name_1c_val = docpost_substdoc_name_1c.value;
        uincompont = docpost_substdoc_component_show.value;
        let res = confirm(`По вашему запросу найдено документов - ${respobj.size}, Продолжить подстановку?`);
        if(res){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"subst1c", "obj":"docpost", "regime":"subst", "methfound":"", "status":"", "name1c":"", "uincompont":""};

            console.log(docpost_substdoc_name_1c.value)
            if(docpost_substdoc_full_find.checked === true){
                body.methfound = 'full';
                body.name1c = docpost_substdoc_name_1c_show.textContent;
            } else if (docpost_substdoc_nofull_find.checked === true) {
                body.methfound = 'nofull';
                body.name1c = docpost_substdoc_name_1c_val;
            }

            let status_arr = [];
            if(docpost_substdoc_status_ready.checked === true){ status_arr.push(1) };
            if(docpost_substdoc_status_process.checked === true){ status_arr.push(2) };
            body.status = `[${status_arr}]`;

            body.uincompont = `${uincompont}`;

            funcCommand(body, funcProcessOnlyInfo);

            docpost_substdoc_modal.style.display = "none";
            docpost_substdoc_name_1c.value = '';
            docpost_substdoc_name_1c_show.innerHTML = '';
            docpost_substdoc_component.value = '';
            docpost_substdoc_component_show.innerHTML = '';
            document.getElementById("docpost_substdoc_status_ready").checked = true;
            document.getElementById("docpost_substdoc_status_process").checked = false;
            document.getElementById("docpost_substdoc_full_find").checked = true;

            setTimeout(() => {
                let body_f = { "user": `${localStorage.getItem('srtf')}`, "meth": "founddoc", "obj": "docpost", "count": "10000", "name": `${body.name1c}` };
                funcCommand(body_f, funcProcessGetDocpost);
            }, 200);
        }
    }
}

const radioButtons = document.querySelectorAll(
    'input[name="docpost_substdoc_switch-table__radio"]',
);

radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        if (document.getElementById('docpost_substdoc_nofull_find').checked) {
            document.getElementById('docpost_substdoc_name_1c').classList.add('input__type-text_modal_active');
            document.getElementById('docpost_substdoc_name_1c_select').classList.remove('select_modal_active');
        } else {
            document.getElementById('docpost_substdoc_name_1c_select').classList.add('select_modal_active');
            document.getElementById('docpost_substdoc_name_1c').classList.remove('input__type-text_modal_active');
        }
    });
})