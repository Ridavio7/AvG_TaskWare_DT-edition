import {funcCommand, funcProcessOnlyInfo, removeOptions, addToDropdown, addToDropdownOneOption, clearTableAll, makeSelect, togglePassword, validateForm, insertDataInSelect} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {showNotification} from '../__notification/modal__notification.js';
import {funcGetShablons, funcGetShablonsTree} from '../../table/__template-task-shablons/table__template-task-shablons.js';

let shablons_modal    = document.getElementById("shablons_modal");
let shablons_close    = document.getElementById("shablons_close");
let shablons_title    = document.getElementById("shablons_name_title");
let shablons_name     = document.getElementById("shablons_name");
let shablons_numb_i   = document.getElementById("shablons_numb_inlevel");
let shablons_mission  = document.getElementById("shablons_mission");
let shablons_prim     = document.getElementById("shablons_prim");
let shablons_dl_d     = document.getElementById("shablons_dl_d");
let shablons_dl_h     = document.getElementById("shablons_dl_h");
let shablons_dl_m     = document.getElementById("shablons_dl_m");
let shablons_user     = document.getElementById("shablons_user");
let shablons_areaprof = document.getElementById("shablons_areaprof");
let shablons_content  = document.getElementById("shablons_content");
let shablons_start    = document.getElementById("shablons_start");
let shablons_save     = document.getElementById("shablons_save");

shablons_close.onclick = function(){
    shablons_modal.style.display = "none";
}

dragElement(shablons_modal);

export const funcGetShablonsSteps = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":"dirSh", "uin":`${uin}`, "uinShablon":`${localStorage.getItem('uinShablon')}`};
    funcCommand(body, funcProcessGetShablonsSteps);

    shablons_modal.style.display  = "block";
}

const funcProcessGetShablonsSteps = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Инфо шага:", respobj);

    shablons_name.value      = '';
    shablons_numb_i.value    = '';
    shablons_mission.value   = '';
    shablons_prim.value      = '';
    shablons_dl_d.value      = '';
    shablons_dl_h.value      = '';
    shablons_dl_m.value      = '';
    removeOptions(shablons_user);
    removeOptions(shablons_areaprof);
    removeOptions(shablons_content);
    removeOptions(shablons_start);

    if(respobj.answ.uin === '0'){
        shablons_numb_i.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_mission.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_prim.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_areaprof.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_content.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_start.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_dl_d.parentElement.classList.add("modal__input-wrapper_display-none");
    } else {
        shablons_numb_i.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_mission.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_prim.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_areaprof.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_content.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_start.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_dl_d.parentElement.classList.remove("modal__input-wrapper_display-none");
    }

    let obj          = respobj.answ;
    let name         = obj.name;
    let mission      = obj.mission;
    let numb_i       = obj.numb_inlevel;
    let prim         = obj.prim;
    let dl           = obj.dl;
    let nameShablon  = obj.shablon.name;
    let uinShablon   = obj.shablon.uin;
    let nameUser     = obj.user.name;
    let uinUser      = obj.user.uin;
    let nameAreaprof = obj.areaprof != undefined ? obj.areaprof.name : '';
    let uinAreaprof  = obj.areaprof != undefined ? obj.areaprof.uin : '';
    let nameStart    = obj.start    != undefined ? obj.start.name : '';
    let uinStart     = obj.start    != undefined ? obj.start.uin : '';
    let nameContent  = obj.content  != undefined ? obj.content.name : '';
    let uinContent   = obj.content  != undefined ? obj.content.uin : '';
    let uin          = obj.uin;
    let del          = obj.del;
    addShablonsInfo(name, mission, numb_i, prim, dl, nameShablon, uinShablon, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, uin, del);
}

const addShablonsInfo =
(name, mission, numb_i, prim, dl, nameShablon, uinShablon, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, uin, del) => {
    shablons_title.innerHTML = `Шаблон: ${nameShablon}. Шаг: ${name}`;
    shablons_name.value      = name;
    shablons_numb_i.value    = numb_i;
    shablons_mission.value   = mission;
    shablons_prim.value      = prim;
    shablons_dl_d.value      = dl.dl_d;
    shablons_dl_h.value      = dl.dl_h;
    shablons_dl_m.value      = dl.dl_m;
    insertDataInSelect(shablons_user, nameUser, uinUser, "users_list");
    insertDataInSelect(shablons_areaprof, nameAreaprof, uinAreaprof, "prof_list");
    insertDataInSelect(shablons_content, nameContent, uinContent, "contents_list");
    insertDataInSelect(shablons_start, nameStart, uinStart, "startstep_list");
    shablons_save.value = uin;
    shablons_save.name = uinShablon;
}

shablons_save.onclick = (elem) => {
    let body;
    elem.target.value === 0 ? 
    body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirSh", "uin":`${elem.target.value}`, "name":"", "uinuser":"", "uinShablon":`${localStorage.getItem('uinShablon')}`} :
    body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirSh", "uin":`${elem.target.value}`, "name":"", "uinuser":"", "uinareaprof":"", "uincontent":"", "uinstart":"", "numb_inlevel":"", "mission":"", "prim":"", "dl_d":"", "dl_h":"", "dl_m":"", "uinShablon":`${localStorage.getItem('uinShablon')}`};

    body.name         = shablons_name.value;
    body.uinuser      = shablons_user.value;
    body.uinareaprof  = shablons_areaprof.value;
    body.uincontent   = shablons_content.value;
    body.uinstart     = shablons_start.value;
    body.numb_inlevel = shablons_numb_i.value;
    body.mission      = shablons_mission.value;
    body.prim         = shablons_prim.value;
    body.dl_d         = shablons_dl_d.value;
    body.dl_h         = shablons_dl_h.value;
    body.dl_m         = shablons_dl_m.value;

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetShablonsTree(elem.target.name)}, 100);
    setTimeout(function(){funcGetShablons()}, 150); 
}