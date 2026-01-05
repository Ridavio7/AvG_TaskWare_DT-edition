import {funcCommand, funcProcessOnlyInfo, removeOptions, clearTable, clearTableAll} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow, openModal, closeModal} from '../modal.js';
import {funcProcessGetDocpost} from '../../table/__provider/table__provider.js';

let docpost_substdoc_modal          = document.getElementById("docpost_substdoc_modal");
let docpost_substdoc_close          = document.getElementById("docpost_substdoc_close");
let docpost_substdoc_name_1c        = document.getElementById("docpost_substdoc_name_1c");
let docpost_substdoc_name_1c_show   = document.getElementById("docpost_substdoc_name_1c_select");
let docpost_substdoc_component      = document.getElementById("docpost_substdoc_component");
let docpost_substdoc_component_show = document.getElementById("docpost_substdoc_component_select");
let docpost_substdoc_status_ready   = document.getElementById("docpost_substdoc_status_ready");
let docpost_substdoc_status_process = document.getElementById("docpost_substdoc_status_process");
let docpost_substdoc_button_perfom  = document.getElementById("docpost_substdoc_button_perfom");
let tb_docpost_substdoc_1c          = document.getElementById("tb_docpost_substdoc_1c");
let tb_docpost_substdoc_comp        = document.getElementById("tb_docpost_substdoc_comp");
let modal_resize                    = document.getElementById("docpost_substdoc_modal_resize");

let uincompont;

closeModal(docpost_substdoc_modal, docpost_substdoc_close);

dragElement(docpost_substdoc_modal);
resizeModalWindow(modal_resize, "whModalDocpostSubstDoc", "Размеры окна автоподстановки");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalDocpostSubstDoc", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcInfoDocpostSubstdocOpenModal = () => {
    funcGetResize();
    openModal(docpost_substdoc_modal);
}

docpost_substdoc_name_1c.addEventListener('input', (elem) => {
    let body =  {"user":`${localStorage.getItem('srtf')}`, "obj":"docpost", "meth":"found1conly", "status":"[1, 2]", "name":`${elem.target.value}`, "count":"100"};

    funcCommand(body, funcProcessShowName1c);
})

const funcProcessShowName1c = (result, respobj) => {
    removeOptions(docpost_substdoc_name_1c_show);

    let arr = respobj.answ;
    for (let key in arr) {
        let newOption = new Option(arr[key].name1c, arr[key].name1c);
        docpost_substdoc_name_1c_show.append(newOption);
    }
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
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"subst1c", "obj":"docpost", "regime":"found", "methfound":"full", "status":"", "name1c":"", "uincompont":""};

    let textContent_1c = docpost_substdoc_name_1c_show.value;
    uincompont = docpost_substdoc_component_show.value;
    if (docpost_substdoc_name_1c_show.value = '' || uincompont === undefined) {
        alert("Вы не заполнили все поля!")
    } else {
        let status_arr = [];
        if(docpost_substdoc_status_ready.checked === true){ status_arr.push(1) };
        if(docpost_substdoc_status_process.checked === true){ status_arr.push(2) };
        body.status = `[${status_arr}]`;

        body.name1c = textContent_1c;
        body.uincompont = `${uincompont}`;

        funcCommand(body, funcProcessDocpostSubstdoc);

        docpost_substdoc_name_1c_show.value = textContent_1c;
    }
}

const funcProcessDocpostSubstdoc = (result, respobj) => { 
    if(respobj.size === 0){
        alert('По вашему запросу ничего не найдено!')
    } else {
        let textContent_1c = docpost_substdoc_name_1c_show.value;
        uincompont = docpost_substdoc_component_show.value;
        let res = confirm(`По вашему запросу найдено документов - ${respobj.size}, Продолжить подстановку?`);
        if(res){
            let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"subst1c", "obj":"docpost", "regime":"subst", "methfound":"full", "status":"", "name1c":"", "uincompont":""};

            let status_arr = [];
            if(docpost_substdoc_status_ready.checked === true){ status_arr.push(1) };
            if(docpost_substdoc_status_process.checked === true){ status_arr.push(2) };
            body.status = `[${status_arr}]`;

            body.name1c = textContent_1c;
            body.uincompont = `${uincompont}`;

            funcCommand(body, funcProcessOnlyInfo);

            docpost_substdoc_modal.style.display = "none";
            docpost_substdoc_name_1c.value = '';
            docpost_substdoc_name_1c_show.innerHTML = '';
            docpost_substdoc_component.value = '';
            docpost_substdoc_component_show.innerHTML = '';
            document.getElementById("docpost_substdoc_status_ready").checked = true;
            document.getElementById("docpost_substdoc_status_process").checked = false;

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