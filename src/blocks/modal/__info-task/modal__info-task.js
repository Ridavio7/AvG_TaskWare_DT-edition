import {funcCommand, removeOptions, insertDataInSelect, responseProcessor, formatDate, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetTasks, funcGetTasksTree} from '../../table/__control-task-control/table__control-task-control.js';

let tasks_modal    = document.getElementById("tasks_modal");
let tasks_close    = document.getElementById("tasks_close");
let tasks_title    = document.getElementById("tasks_name_title");
let tasks_name     = document.getElementById("tasks_name");
let tasks_status   = document.getElementById("tasks_status");
let tasks_datebeg  = document.getElementById("tasks_datebegin");
let tasks_mission  = document.getElementById("tasks_mission");
let tasks_prim     = document.getElementById("tasks_prim");
let tasks_dl_d     = document.getElementById("tasks_dl_d");
let tasks_dl_h     = document.getElementById("tasks_dl_h");
let tasks_dl_m     = document.getElementById("tasks_dl_m");
let tasks_user     = document.getElementById("tasks_user");
let tasks_areaprof = document.getElementById("tasks_areaprof");
let tasks_content  = document.getElementById("tasks_content");
let tasks_autor    = document.getElementById("tasks_autoready");
let tasks_start    = document.getElementById("tasks_start");
let tasks_save     = document.getElementById("tasks_save");

tasks_close.onclick = function(){
    tasks_modal.style.display = "none";
}

dragElement(tasks_modal);

export const funcGetTasksSteps = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":"dirTask", "uin":`${uin}`, "uinTask":`${localStorage.getItem('uinTask')}`};
    funcCommand(body, funcProcessGetTasksSteps);

    tasks_modal.style.display  = "block";
}

const funcProcessGetTasksSteps = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Инфо шага:", respobj);

    tasks_name.value    = '';
    tasks_mission.value = '';
    tasks_dl_d.value    = '';
    tasks_dl_h.value    = '';
    tasks_dl_m.value    = '';
    removeOptions(tasks_status);
    removeOptions(tasks_user);
    removeOptions(tasks_areaprof);
    removeOptions(tasks_content);
    removeOptions(tasks_start);

    if(respobj.answ.uin === '0'){
        tasks_mission.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_areaprof.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_content.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_start.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_dl_d.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_prim.parentElement.classList.add("modal__input-wrapper_display-none");
    } else {
        tasks_mission.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_areaprof.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_content.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_start.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_dl_d.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_prim.parentElement.classList.remove("modal__input-wrapper_display-none");
    }

    let obj          = respobj.answ;
    let name         = obj.name;
    let mission      = obj.mission;
    let prim         = obj.prim;
    let numb_i       = obj.numb_inlevel != undefined ? obj.numb_inlevel : '0';
    let dl           = obj.dl;
    let nameStatus   = obj.status.name;
    let uinStatus    = obj.status.uin;
    let datebegin    = obj.datebegin;
    let nameUser     = obj.user.name;
    let uinUser      = obj.user.uin;
    let nameAreaprof = obj.areaprof != undefined ? obj.areaprof.name : '';
    let uinAreaprof  = obj.areaprof != undefined ? obj.areaprof.uin : '';
    let nameStart    = obj.start    != undefined ? obj.start.name : '';
    let uinStart     = obj.start    != undefined ? obj.start.uin : '';
    let nameContent  = obj.content  != undefined ? obj.content.name : '';
    let uinContent   = obj.content  != undefined ? obj.content.uin : '';
    let autoready    = obj.autoready;
    let uin          = obj.uin;
    let del          = obj.del;
    addTasksInfo(name, mission, prim, numb_i, dl, nameStatus, uinStatus, datebegin, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, autoready, uin, del);
}

const addTasksInfo =
(name, mission, prim, numb_i, dl, nameStatus, uinStatus, datebegin, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, autoready, uin, del) => {
    tasks_title.innerHTML = `Задача: ${name}. Номер: ${numb_i}`;
    tasks_name.value      = name;
    tasks_datebeg.value   = datebegin != '' ? formatDate(datebegin) : '---';
    tasks_mission.value   = mission;
    tasks_prim.value      = prim;
    tasks_dl_d.value      = dl.dl_d;
    tasks_dl_h.value      = dl.dl_h;
    tasks_dl_m.value      = dl.dl_m;
    insertDataInSelect(tasks_status, nameStatus, uinStatus, "statustask_list");
    insertDataInSelect(tasks_user, nameUser, uinUser, "users_list");
    insertDataInSelect(tasks_areaprof, nameAreaprof, uinAreaprof, "prof_list");
    insertDataInSelect(tasks_content, nameContent, uinContent, "contents_list");
    insertDataInSelect(tasks_start, nameStart, uinStart, "startstep_list");
    tasks_autor.checked = autoready === 1 ? true : false;
    tasks_save.value = "";
    tasks_save.value = uin;
}

/* кнопка сохранения */
tasks_save.onclick = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirTask", "uinTask":`${localStorage.getItem('uinTask')}`, "uin":`${tasks_save.value}`, "name":"", "mission":"", "uinstatus":"", "uinuser":"", "uinareaprof":"", "prim":"", "dl_d":"", "dl_h":"", "dl_m":""};

    let tasks_name     = document.getElementById("tasks_name").value;
    let tasks_status   = document.getElementById("tasks_status").value;
    let tasks_user     = document.getElementById("tasks_user").value;
    let tasks_areaprof = document.getElementById("tasks_areaprof").value;
    let tasks_prim     = document.getElementById("tasks_prim").value;
    let tasks_mission  = document.getElementById("tasks_mission").value;
    let tasks_dl_d     = document.getElementById("tasks_dl_d").value;
    let tasks_dl_h     = document.getElementById("tasks_dl_h").value;
    let tasks_dl_m     = document.getElementById("tasks_dl_m").value;

    body.name        = tasks_name;
    body.uinstatus   = tasks_status;
    body.uinuser     = tasks_user;
    body.uinareaprof = tasks_areaprof;
    body.prim        = tasks_prim;
    body.mission     = tasks_mission;
    body.dl_d        = tasks_dl_d;
    body.dl_h        = tasks_dl_h;
    body.dl_m        = tasks_dl_m;

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){ funcGetTasks() }, 100);
    setTimeout(function(){ funcGetTasksTree(`${localStorage.getItem('uinTask')}`) }, 150);
    setTimeout(function(){ funcGetTasksSteps(`${tasks_save.value}`) }, 200);
    setTimeout(() => {
        let buttons = document.querySelectorAll(".button__control_action_status.button__control_modal-tasks-catTask");
        let uin     = localStorage.getItem('button-active__tasks-catTask');
        buttons.forEach(button => {
            if (button.value === uin) {
                button.click();
            }
        })
    }, 250)
}