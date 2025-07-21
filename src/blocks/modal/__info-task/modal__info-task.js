import {funcCommand, removeOptions, insertDataInSelect, responseProcessor, formatDate, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetTasks, funcGetTasksTree} from '../../table/__control-task-control/table__control-task-control.js';

let tasks_modal    = document.getElementById("tasks_modal");
let tasks_close    = document.getElementById("tasks_close");
let tasks_title    = document.getElementById("tasks_name_title");
let tasks_name     = document.getElementById("tasks_name");
let tasks_status   = document.getElementById("tasks_status");
let tasks_datebeg  = document.getElementById("tasks_datebegin");
let tasks_dateacc  = document.getElementById("tasks_dateaccept");
let tasks_dateend  = document.getElementById("tasks_dateend");
let tasks_dtpredel = document.getElementById("tasks_dateendpredel");
let tasks_mission  = document.getElementById("tasks_mission");
let tasks_prim     = document.getElementById("tasks_prim");
let tasks_dl_d     = document.getElementById("tasks_dl_d");
let tasks_dl_h     = document.getElementById("tasks_dl_h");
let tasks_dl_m     = document.getElementById("tasks_dl_m");
let tasks_user     = document.getElementById("tasks_user");
let tasks_areaprof = document.getElementById("tasks_areaprof");
let tasks_content  = document.getElementById("tasks_content");
let tasks_autor    = document.getElementById("tasks_autoready");
let tasks_problem  = document.getElementById("tasks_fproblem");
let tasks_dtstart  = document.getElementById("tasks_datestart");
let tasks_count    = document.getElementById("tasks_amount");
let tasks_start    = document.getElementById("tasks_start");
let tasks_save     = document.getElementById("tasks_save");

let tasks_usermove = document.getElementById("tasks_usermove");
let tasks_datemove = document.getElementById("tasks_datemove");

tasks_close.onclick = function(){
    tasks_modal.style.display = "none";
}

tasks_close.ontouchend = (e) => {
    e.preventDefault();
    tasks_modal.style.display = "none";
}

dragElement(tasks_modal);

export const funcGetTasksSteps = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":"dirTask", "uin":`${uin}`, "uinTask":`${localStorage.getItem('uinTask')}`};
    funcCommand(body, funcProcessGetTasksSteps);

    tasks_modal.style.display  = "block";
}

export const funcGetTasksArchiveSteps = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":"dirTaskArch", "uin":`${uin}`, "uinTaskArch":`${localStorage.getItem('uinTaskArchive')}`};
    funcCommand(body, funcProcessGetTasksSteps);

    tasks_modal.style.display  = "block";
}

const funcProcessGetTasksSteps = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Инфо шага:", respobj);

    removeOptions(tasks_status);
    removeOptions(tasks_user);
    removeOptions(tasks_areaprof);
    removeOptions(tasks_content);
    removeOptions(tasks_start);

    if(respobj.answ.uin === '0'){
        tasks_mission.disabled  = true;
        tasks_count.disabled    = false;
        tasks_dtpredel.disabled = false;
        tasks_dtstart.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_dateacc.parentElement.classList.add("modal__input-wrapper_display-none");
    } else {
        tasks_mission.disabled  = false;
        tasks_count.disabled    = true;
        tasks_dtpredel.disabled = true;
        tasks_dtstart.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_dateacc.parentElement.classList.remove("modal__input-wrapper_display-none");
    }

    if(document.URL.includes('#tasks/tasks_archive')){
        tasks_usermove.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_datemove.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_save.classList.add("modal__input-wrapper_display-none");
        tasks_name.disabled     = true;
        tasks_status.disabled   = true;
        tasks_user.disabled     = true;
        tasks_count.disabled    = true;
        tasks_dtpredel.disabled = true;
        tasks_dtstart.disabled  = true;
        tasks_start.disabled    = true;
        tasks_dl_d.disabled     = true;
        tasks_dl_h.disabled     = true;
        tasks_dl_m.disabled     = true;
    } else {
        tasks_usermove.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_datemove.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_save.classList.remove("modal__input-wrapper_display-none");
        tasks_name.disabled     = false;
        tasks_status.disabled   = false;
        tasks_user.disabled     = false;
        tasks_count.disabled    = false;
        tasks_dtpredel.disabled = false;
        tasks_dtstart.disabled  = false;
        tasks_start.disabled    = false;
        tasks_dl_d.disabled     = false;
        tasks_dl_h.disabled     = false;
        tasks_dl_m.disabled     = false;
    }

    let obj          = respobj.answ;
    let name         = obj.name;
    let mission      = obj.mission      != undefined ? obj.mission : '---';
    let prim         = obj.prim         != undefined ? obj.prim : '---';
    let numb_i       = obj.numb_inlevel != undefined ? obj.numb_inlevel : '0';
    let dl           = obj.dl;
    let nameStatus   = obj.status.name;
    let uinStatus    = obj.status.uin;
    let dtstart      = obj.datestart;
    let dateaccept   = obj.dateaccept;
    let datebegin    = obj.datebegin;
    let dateend      = obj.dateend;
    let dtpredel     = obj.dateendpredel;
    let nameUser     = obj.user.name;
    let uinUser      = obj.user.uin;
    let nameAreaprof = obj.areaprof != undefined ? obj.areaprof.name : '---';
    let uinAreaprof  = obj.areaprof != undefined ? obj.areaprof.uin : '';
    let nameStart    = obj.start    != undefined ? obj.start.name : '---';
    let uinStart     = obj.start    != undefined ? obj.start.uin : '';
    let nameContent  = obj.content  != undefined ? obj.content.name : '---';
    let uinContent   = obj.content  != undefined ? obj.content.uin : '';
    let autoready    = obj.autoready;
    let fproblem     = obj.fproblem;
    let count        = obj.count    != undefined ? obj.count : '---';
    let uin          = obj.uin;
    let del          = obj.del;

    let nameUsermove = obj.usermove != undefined ? obj.usermove.name : '---';
    let datemove     = obj.datemove;

    addTasksInfo(name, mission, prim, numb_i, dl, nameStatus, uinStatus, dtstart, dateaccept, datebegin, dateend, dtpredel, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, autoready, fproblem, count, uin, del, nameUsermove, datemove);
}

const addTasksInfo =
(name, mission, prim, numb_i, dl, nameStatus, uinStatus, dtstart, dateaccept, datebegin, dateend, dtpredel, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, autoready, fproblem, count, uin, del, nameUsermove, datemove) => {
    tasks_title.innerHTML = `Задача: ${name}. Номер: ${numb_i}`;
    tasks_name.value      = name;
    tasks_dtstart.value   = dtstart    != undefined ? dtstart.split("T")[0] : '';
    tasks_dateacc.value   = dateaccept != '' ? formatDate(dateaccept) : '---';
    tasks_datebeg.value   = datebegin  != '' ? formatDate(datebegin) : '---';
    tasks_dateend.value   = dateend    != '' ? formatDate(dateend) : '---';
    tasks_dtpredel.value  = dtpredel   != undefined ? dtpredel.split("T")[0] : '';
    tasks_mission.value   = mission;
    tasks_prim.value      = prim;
    tasks_dl_d.value      = dl.dl_d;
    tasks_dl_h.value      = dl.dl_h;
    tasks_dl_m.value      = dl.dl_m;
    insertDataInSelect(tasks_status, nameStatus, uinStatus, "statustask_list");
    insertDataInSelect(tasks_user, nameUser, uinUser, "users_list");
    uin === "0" ? tasks_user.previousElementSibling.textContent = "Администратор:" : tasks_user.previousElementSibling.textContent = "Исполнитель:";
    insertDataInSelect(tasks_areaprof, nameAreaprof, uinAreaprof, "prof_list");
    insertDataInSelect(tasks_content, nameContent, uinContent, "contents_list");
    insertDataInSelect(tasks_start, nameStart, uinStart, "startstep_list");
    uinStart === 2 ? tasks_dtstart.disabled = false : tasks_dtstart.disabled = true;
    tasks_autor.checked   = autoready === 1 ? true : false;
    tasks_problem.checked = fproblem === 1 ? true : false;
    tasks_count.value = count;
    tasks_save.value = "";
    tasks_save.value = uin;

    tasks_usermove.value != undefined ? nameUsermove : '---';
    tasks_datemove.value  = datemove != '' ? formatDate(datemove) : '---';
}

/* кнопка сохранения */
tasks_save.onclick = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirTask", "uinTask":`${localStorage.getItem('uinTask')}`, "uin":`${tasks_save.value}`, "name":"", "mission":"", "uinstatus":"", "uinuser":"", "uinareaprof":"", "prim":"", "dl_d":"", "dl_h":"", "dl_m":"", "fproblem":"", "uinstart":"", "count":"", "dateendpredel":"", "datestart":""};

    let tasks_name     = document.getElementById("tasks_name").value;
    let tasks_status   = document.getElementById("tasks_status").value;
    let tasks_user     = document.getElementById("tasks_user").value;
    let tasks_areaprof = document.getElementById("tasks_areaprof").value;
    let tasks_prim     = document.getElementById("tasks_prim").value;
    let tasks_mission  = document.getElementById("tasks_mission").value;
    let tasks_dl_d     = document.getElementById("tasks_dl_d").value;
    let tasks_dl_h     = document.getElementById("tasks_dl_h").value;
    let tasks_dl_m     = document.getElementById("tasks_dl_m").value;
    let tasks_start    = document.getElementById("tasks_start").value;
    let tasks_count    = document.getElementById("tasks_amount").value;
    let tasks_dtpredel = document.getElementById("tasks_dateendpredel").value;
    let tasks_dtstart  = document.getElementById("tasks_datestart").value;

    body.name          = tasks_name;
    body.uinstatus     = tasks_status;
    body.uinuser       = tasks_user;
    body.uinareaprof   = tasks_areaprof;
    body.prim          = tasks_prim;
    body.mission       = tasks_mission;
    body.dl_d          = tasks_dl_d;
    body.dl_h          = tasks_dl_h;
    body.dl_m          = tasks_dl_m;
    body.uinstart      = tasks_start;
    body.count         = tasks_count;
    body.dateendpredel = tasks_dtpredel
    body.datestart     = tasks_dtstart;
    body.fproblem      = tasks_problem.checked === true ? "1" : "0";

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