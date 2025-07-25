import {funcCommand, funcProcessOnlyInfo, removeOptions, insertDataInSelect, responseProcessor} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetShablons, funcGetShablonsTree} from '../../table/__template-task-shablons/table__template-task-shablons.js';

let shablons_modal    = document.getElementById("shablons_modal");
let shablons_close    = document.getElementById("shablons_close");
let shablons_title    = document.getElementById("shablons_name_title");
let shablons_name     = document.getElementById("shablons_name");
let shablons_mission  = document.getElementById("shablons_mission");
let shablons_dl_d     = document.getElementById("shablons_dl_d");
let shablons_dl_h     = document.getElementById("shablons_dl_h");
let shablons_dl_m     = document.getElementById("shablons_dl_m");
let shablons_user     = document.getElementById("shablons_user");
let shablons_areaprof = document.getElementById("shablons_areaprof");
let shablons_content  = document.getElementById("shablons_content");
let shablons_autor    = document.getElementById("shablons_autoready")
let shablons_start    = document.getElementById("shablons_start");
let shablons_save     = document.getElementById("shablons_save");

shablons_close.onclick = function(){
    shablons_modal.style.display = "none";
}

shablons_close.ontouchend = (e) => {
    e.preventDefault();
    shablons_modal.style.display = "none";
}

dragElement(shablons_modal);

export const funcGetShablonsSteps = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":"dirSh", "uin":`${uin}`, "uinShablon":`${localStorage.getItem('uinShablon')}`};
    funcCommand(body, funcProcessGetShablonsSteps);

    shablons_modal.style.display  = "block";
}

const funcProcessGetShablonsSteps = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Инфо шага:", respobj);

    shablons_name.value    = '';
    shablons_mission.value = '';
    shablons_dl_d.value    = '';
    shablons_dl_h.value    = '';
    shablons_dl_m.value    = '';
    removeOptions(shablons_user);
    removeOptions(shablons_areaprof);
    removeOptions(shablons_content);
    removeOptions(shablons_start);

    if(respobj.answ.uin === '0'){
        shablons_areaprof.disabled = true;
        shablons_content.disabled  = true;
    } else {
        shablons_areaprof.disabled = false;
        shablons_content.disabled  = false;
    }

    let obj          = respobj.answ;
    let name         = obj.name;
    let mission      = obj.mission != undefined ? obj.mission : '---';
    let numb_i       = obj.numb_inlevel != undefined ? obj.numb_inlevel : '0';
    let dl           = obj.dl;
    let nameShablon  = obj.shablon.name;
    let uinShablon   = obj.shablon.uin;
    let nameUser     = obj.user.name;
    let uinUser      = obj.user.uin;
    let nameAreaprof = obj.areaprof != undefined ? obj.areaprof.name : '---';
    let uinAreaprof  = obj.areaprof != undefined ? obj.areaprof.uin : '';
    let nameStart    = obj.start    != undefined ? obj.start.name : '---';
    let uinStart     = obj.start    != undefined ? obj.start.uin : '';
    let nameContent  = obj.content  != undefined ? obj.content.name : '---';
    let uinContent   = obj.content  != undefined ? obj.content.uin : '';
    let autoready    = obj.autoready;
    let uin          = obj.uin;
    let del          = obj.del;
    addShablonsInfo(name, mission, numb_i, dl, nameShablon, uinShablon, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, autoready, uin, del);
}

const addShablonsInfo =
(name, mission, numb_i, dl, nameShablon, uinShablon, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, autoready, uin, del) => {
    shablons_title.innerHTML = `Шаблон: ${nameShablon}. Номер: ${numb_i}. Название: ${name}`;
    shablons_name.value      = name;
    shablons_mission.value   = mission;
    shablons_dl_d.value      = dl.dl_d;
    shablons_dl_h.value      = dl.dl_h;
    shablons_dl_m.value      = dl.dl_m;
    insertDataInSelect(shablons_user, nameUser, uinUser, "users_list");
    uin === "0" ? shablons_user.previousElementSibling.textContent = "Администратор:" : shablons_user.previousElementSibling.textContent = "Исполнитель:";
    insertDataInSelect(shablons_areaprof, nameAreaprof, uinAreaprof, "prof_list");
    insertDataInSelect(shablons_content, nameContent, uinContent, "contents_list");
    insertDataInSelect(shablons_start, nameStart, uinStart, "startstep_list");
    shablons_autor.checked = autoready === 1 ? true : false;
    shablons_save.value = uin;
    shablons_save.name = uinShablon;
}

shablons_save.onclick = (elem) => {
    let body;
    elem.target.value === 0 ? 
    body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirSh", "uin":`${elem.target.value}`, "name":"", "uinuser":"", "autoready":"", "uinShablon":`${localStorage.getItem('uinShablon')}`} :
    body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirSh", "uin":`${elem.target.value}`, "name":"", "uinuser":"", "uinareaprof":"", "uincontent":"", "uinstart":"", "numb_inlevel":"", "mission":"", "prim":"", "dl_d":"", "dl_h":"", "dl_m":"", "autoready":"", "uinShablon":`${localStorage.getItem('uinShablon')}`};

    body.name         = shablons_name.value;
    body.uinuser      = shablons_user.value;
    body.uinareaprof  = shablons_areaprof.value;
    body.uincontent   = shablons_content.value;
    body.uinstart     = shablons_start.value;
    body.mission      = shablons_mission.value;
    body.dl_d         = shablons_dl_d.value;
    body.dl_h         = shablons_dl_h.value;
    body.dl_m         = shablons_dl_m.value;
    body.autoready    = shablons_autor.checked === true ? "1" : "0";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetShablonsTree(elem.target.name)}, 100);
    setTimeout(function(){funcGetShablons()}, 150); 
}