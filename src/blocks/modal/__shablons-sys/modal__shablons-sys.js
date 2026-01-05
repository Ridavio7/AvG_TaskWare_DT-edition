import {funcCommand, clearTable, formatDate, clearTableAll, removeOptions, addToDropdownOneOption} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow, openModal, closeModal} from '../modal.js';

let shablons_sys_modal       = document.getElementById("shablons_sys_modal");
let shablons_sys_close       = document.getElementById("shablons_sys_close");
let modal_resize             = document.getElementById("shablons_sys_resize");
let shablons_sys_save        = document.getElementById("shablons_sys_save");
let shablons_sys_tasks       = document.getElementById("shablons_sys_tasks");
let shablons_sys_prim        = document.getElementById("shablons_sys_prim");
let shablons_sys_datebegin   = document.getElementById("shablons_sys_datebegin");
let shablons_sys_datebegin_t = document.getElementById("shablons_sys_datebegin_time");
let shablons_sys_dateend     = document.getElementById("shablons_sys_dateend");
let shablons_sys_dateend_t   = document.getElementById("shablons_sys_dateend_time");

closeModal(shablons_sys_modal, shablons_sys_close);

dragElement(shablons_sys_modal);
resizeModalWindow(modal_resize, "whModalShablonsSys", "Размеры окна детализации количества");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalShablonsSys", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcInfoShablonsSysOpenModal = () => {
    funcGetResize();
    openModal(shablons_sys_modal);

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shablons", "reg":"sys", "count":"100"};
    funcCommand(body, funcProcessGetInfoShablonsSys);
}

const funcProcessGetInfoShablonsSys = (result, respobj) => {
    console.log("Шаблоны Сист:", respobj);

    removeOptions(shablons_sys_tasks);

    for (let key in respobj.answ){
        let obj   = respobj.answ[key];
        let name  = obj.name;
        let uin   = obj.uin;
        
        addToDropdownOneOption(shablons_sys_tasks, name, uin);
    }
}