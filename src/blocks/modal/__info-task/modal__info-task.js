import {funcCommand, removeOptions, insertDataInSelect, setStatus, formatDate, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetTasks, funcGetTasksTree} from '../../table/__control-task-control/table__control-task-control.js';
import {funcGetHistorystep} from '../../table/__control-task-historystep/table__control-task-historystep.js';
import {funcGetProductsTreeSelectUnic} from '../__select-prod-unic/modal__select-prod-unic.js';
import {funcInfoDetailppOpenModal} from '../../modal/__detailpp/modal__detailpp.js';

let tasks_modal    = document.getElementById("tasks_modal");
let tasks_close    = document.getElementById("tasks_close");
let tasks_title_s  = document.getElementById("tasks_status_title");
let tasks_title    = document.getElementById("tasks_name_title");
let tasks_title_n  = document.getElementById("tasks_name_title_numb");
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
let tasks_con_prod = document.getElementById("tasks_content_product");
let tasks_con_proc = document.getElementById("tasks_content_techproc");
let tasks_autor    = document.getElementById("tasks_autoready");
let tasks_problem  = document.getElementById("tasks_fproblem");
let tasks_part     = document.getElementById("tasks_fpart");
let tasks_dtstart  = document.getElementById("tasks_datestart");
let tasks_count    = document.getElementById("tasks_amount");
let tasks_count_r  = document.getElementById("tasks_countreal");
let task_detailpp  = document.getElementById('task_detailpp');
let tasks_start    = document.getElementById("tasks_start");
let tasks_save     = document.getElementById("tasks_save");
let switch_1       = document.getElementById("switch_tasks_inputs_1");
let switch_2       = document.getElementById("switch_tasks_inputs_2");

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

    funcGetHistorystep(uin);
    console.log(localStorage.getItem('uinTask'))
    tasks_save.value = "";
    tasks_save.value = uin;

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
    removeOptions(tasks_con_proc);
    removeOptions(tasks_start);

    if(respobj.answ.uin === '0'){
        tasks_dl_d.disabled    = true;
        tasks_dl_h.disabled    = true;
        tasks_dl_m.disabled    = true;
        tasks_status.disabled  = true;
        tasks_mission.disabled = false;
        tasks_problem.disabled = true;
        tasks_prim.disabled    = true;
        tasks_count_r.classList.add("modal__input-wrapper_display-none");
        task_detailpp.classList.add("modal__input-wrapper_display-none");
        tasks_dtpredel.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_dtstart.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_start.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_dateacc.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_part.parentElement.classList.add("modal__input-wrapper_display-none");
        switch_1.parentElement.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else {
        tasks_dl_d.disabled    = false;
        tasks_dl_h.disabled    = false;
        tasks_dl_m.disabled    = false;
        tasks_status.disabled  = false;
        tasks_mission.disabled = true;
        tasks_problem.disabled = false;
        tasks_prim.disabled    = false;
        tasks_count_r.classList.remove("modal__input-wrapper_display-none");
        task_detailpp.classList.remove("modal__input-wrapper_display-none");
        tasks_dtpredel.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_dtstart.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_start.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_dateacc.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_part.parentElement.classList.remove("modal__input-wrapper_display-none");
        switch_1.parentElement.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
    }

    if(document.URL.includes('#tasks/tasks_archive')){
        tasks_usermove.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_datemove.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_save.classList.add("modal__input-wrapper_display-none");
        /*tasks_name.disabled     = true;
        tasks_status.disabled   = true;
        tasks_user.disabled     = true;
        tasks_areaprof.disabled = true;
        tasks_count.disabled    = true;
        tasks_dtpredel.disabled = true;
        tasks_dtstart.disabled  = true;
        tasks_start.disabled    = true;
        tasks_dl_d.disabled     = true;
        tasks_dl_h.disabled     = true;
        tasks_dl_m.disabled     = true;*/
    } else {
        tasks_usermove.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_datemove.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_save.classList.remove("modal__input-wrapper_display-none");
        /*tasks_name.disabled     = false;
        tasks_status.disabled   = false;
        tasks_user.disabled     = false;
        tasks_areaprof.disabled = false;
        tasks_count.disabled    = false;
        tasks_dtpredel.disabled = false;
        tasks_dtstart.disabled  = false;
        tasks_start.disabled    = false;
        tasks_dl_d.disabled     = false;
        tasks_dl_h.disabled     = false;
        tasks_dl_m.disabled     = false;*/
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
    let nameProd     = obj.product  != undefined ? obj.product.name : '---';
    let uinProd      = obj.product  != undefined ? obj.product.uin : '';
    let nameProc     = obj.techproc != undefined ? obj.techproc.name : '---';
    let uinProc      = obj.techproc != undefined ? obj.techproc.uin : '';
    let autoready    = obj.autoready;
    let fproblem     = obj.fproblem;
    let fareaprof    = obj.fareaprof;
    let fpart        = obj.fpart;
    let count        = obj.count    != undefined ? obj.count : '---';
    let countreal    = obj.countreal!= undefined ? obj.countreal : '---';
    let uin          = obj.uin;
    let del          = obj.del;

    let nameUsermove = obj.usermove != undefined ? obj.usermove.name : '---';
    let datemove     = obj.datemove;

    addTasksInfo(name, mission, prim, numb_i, dl, nameStatus, uinStatus, dtstart, dateaccept, datebegin, dateend, dtpredel, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, nameProd, uinProd, nameProc, uinProc, autoready, fproblem, fareaprof, fpart, count, countreal, uin, del, nameUsermove, datemove);
}

/* открыть детализацию */
task_detailpp.addEventListener('click', (elem) => {
    funcInfoDetailppOpenModal(elem.currentTarget.value);
})

tasks_con_prod.onclick = () => {
    funcGetProductsTreeSelectUnic();
    localStorage.setItem("button_select_product_unic_id", "tasks_content_product");
    document.getElementById("modal_select_products_unic").style.display = "block";
}

const addTasksInfo =
(name, mission, prim, numb_i, dl, nameStatus, uinStatus, dtstart, dateaccept, datebegin, dateend, dtpredel, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, nameProd, uinProd, nameProc, uinProc, autoready, fproblem, fareaprof, fpart, count, countreal, uin, del, nameUsermove, datemove) => {
    uin === "0" ? tasks_title_n.innerHTML = `${setStatus(uinStatus, fpart)} Задача: ${name}` : tasks_title_n.innerHTML = `${setStatus(uinStatus, fpart)} Задание: ${name}`;
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
    uin === "0" ? tasks_user.parentElement.previousElementSibling.textContent = "Администратор:" : tasks_user.parentElement.previousElementSibling.textContent = "Исполнитель:";
    insertDataInSelect(tasks_areaprof, nameAreaprof, uinAreaprof, "prof_list");
    insertDataInSelect(tasks_content, nameContent, uinContent, "contents_list");
    if(uin === "0" && uinContent === 5){
        tasks_con_prod.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_con_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(uin === "0" && uinContent === 3) {
        tasks_con_prod.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_con_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(uin != "0" && uinContent === 5){
        tasks_con_prod.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_con_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(uin != "0" && uinContent === 3){
        tasks_con_prod.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_con_proc.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
    } else {
        tasks_con_prod.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_con_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    }
    if(uinProd === ''){
        tasks_con_prod.textContent = 'Выберите изделие';
        tasks_con_prod.value = '';
        tasks_con_prod.name  = '';
    } else if(uinProd === 0){
        tasks_con_prod.textContent = 'Выберите изделие';
        tasks_con_prod.value = '';
        tasks_con_prod.name  = '';
    } else {
        tasks_con_prod.textContent = nameProd;
        tasks_con_prod.value = uinProd;
        tasks_con_prod.name  = nameProd;
    }
    insertDataInSelect(tasks_con_proc, nameProc, uinProc, "techproc_list");
    insertDataInSelect(tasks_start, nameStart, uinStart, "startstep_list");
    uin === "0" && uinStart === 2 ? tasks_dtstart.parentElement.classList.remove("modal__input-wrapper_display-none") : tasks_dtstart.parentElement.classList.add("modal__input-wrapper_display-none")
    tasks_autor.checked   = autoready === 1 ? true : false;
    tasks_problem.checked = fproblem === 1 ? true : false;
    tasks_part.checked    = fpart === 1 ? true : false;
    if(fareaprof === 0){
        switch_1.checked = true;
        tasks_user.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_areaprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(fareaprof === 1) {
        switch_2.checked = true;
        tasks_user.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
        tasks_areaprof.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
    } else {
        tasks_user.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        tasks_areaprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    }
    tasks_count.value = count;
    tasks_count_r.value = countreal;
    task_detailpp.value = uin;

    tasks_usermove.value != undefined ? nameUsermove : '---';
    tasks_datemove.value  = datemove != '' ? formatDate(datemove) : '---';
}

/* кнопка сохранения */
tasks_save.onclick = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirTask", "uinTask":`${localStorage.getItem('uinTask')}`,
        "uin":`${tasks_save.value}`, "name":"", "mission":"", "uinstatus":"", "uinuser":"", "uinareaprof":"", "fareaprof":"", "prim":"", "dl_d":"", "dl_h":"", "dl_m":"",
        "fproblem":"", "fpart":"", "uinstart":"", "count":"", "dateendpredel":"", "datestart":"", "autoready":"", "uincontent":"", "uinproduct":"", "uintechproc":""};

    body.name          = tasks_name.value;
    body.uinstatus     = tasks_status.value;
    body.uinuser       = tasks_user.value;
    body.uinareaprof   = tasks_areaprof.value;
    body.fareaprof     = switch_1.checked === true ? "0" : "1";
    body.prim          = tasks_prim.value;
    body.mission       = tasks_mission.value;
    body.dl_d          = tasks_dl_d.value;
    body.dl_h          = tasks_dl_h.value;
    body.dl_m          = tasks_dl_m.value;
    body.uinstart      = tasks_start.value;
    body.count         = tasks_count.value;
    body.dateendpredel = tasks_dtpredel.value;
    body.datestart     = tasks_dtstart.value;
    body.fproblem      = tasks_problem.checked === true ? "1" : "0";
    body.fpart         = tasks_part.checked === true ? "1" : "0";
    body.autoready     = tasks_autor.checked === true ? "1" : "0";
    body.uincontent    = tasks_content.value;
    body.uinproduct    = tasks_con_prod.value;
    body.uintechproc   = tasks_con_proc.value;

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

const tabButtons = document.querySelectorAll('.modal__tab-button');
const tabContents = document.querySelectorAll('.modal__tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    })
})

/* переклуючение */
const radioButtons = document.querySelectorAll(
    'input[name="switch-tasks-inputs"]',
)

radioButtons.forEach(radio => {
    radio.addEventListener('click', () => {
        if (switch_1.checked) {
            tasks_user.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
            tasks_areaprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
        } else if(switch_2.checked) {
            tasks_user.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
            tasks_areaprof.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        }
    })
})