import {funcCommand, setStatus, responseProcessor, formatDate, funcProcessOnlyConsole, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {TreeTaskBuilder} from '../../_tree/treeTask.js';
import {funcGetTasksArchiveSteps} from '../../modal/__info-task/modal__info-task.js';
import {resizeModalWindow} from '../../modal/modal.js';

let wrapper_tree_tasks_archive = document.getElementById("wrapper_tree_tasks_archive");
let tabcontent_close = document.querySelector('.button__control_tabcontent-close-archTask');

resizeModalWindow(tb_tasks_archive, "whTaskTable");
resizeModalWindow(wrapper_tree_tasks_archive, "whTaskTree"); 

/* настройка размера окна */
const funcGetResizeTb = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whTaskTable", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTb)
}

const funcProcessGetResizeTb = (result, respobj) => {
    document.getElementById("tb_tasks_archive").style.width  = `${respobj.answ.val[0]}px`;
    document.getElementById("tb_tasks_archive").style.height = `${respobj.answ.val[1]}px`;
}

/* настройка размера окна */
const funcGetResizeTree = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whTaskTree", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResizeTree)
}

const funcProcessGetResizeTree = (result, respobj) => {
    wrapper_tree_tasks_archive.style.width  = `${respobj.answ.val[0]}px`;
    wrapper_tree_tasks_archive.style.height = `${respobj.answ.val[1]}px`;
}

export const funcGetTasksArchive = () => {
    funcGetResizeTb();
    funcGetResizeTree();
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasksarch", "count":"100", "asort":"datebegin"};
    funcCommand(body, funcProcessGetTasksArchive);
}

const funcProcessGetTasksArchive = (result, respobj) => {
    console.log("Архив:", respobj);

    const container = document.getElementById('tb_tasks_archive');
    container.innerHTML = '';
    buildStructure(respobj.answ, container)

    /* открытие модального окна */
    let button_modal = document.querySelectorAll(".button__control_modal-tasks-archive-catTask");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            let btn = tb_tasks_archive.querySelector('.button__control_active');
            if(btn != null){
                btn.classList.remove('button__control_active');
                btn.parentElement.parentElement.classList.remove('tr_mark');
            }

            funcGetTasksArchiveTree(elem.value);
            elem.classList.add('button__control_active');
            elem.parentElement.parentElement.classList.add('tr_mark');

            if(window.innerWidth <= 1025){
                wrapper_tree_tasks_archive.style.display = "block";
                tabcontent_close.style.display = "flex";
            }
        })
    })
}

function buildStructure(data, container) {
    for (const item of data) {
        const title_tb = document.createElement('table');
        title_tb.classList = 'table table_no-border-radius';

        const title_tr = document.createElement('tr');
        title_tr.classList.add('tr');

        const title_td = document.createElement('td');
        title_td.classList = 'td td__text_align_center td_font-color-active';
        title_td.innerHTML = item.nameshablon;

        title_tr.append(title_td);
        title_tb.append(title_tr);

        container.appendChild(title_tb);

        const table = document.createElement('table');
        table.classList = 'table  table_no-border-radius';

        const tbody = document.createElement('tbody');
        for (const task of item.tasks) {
            const tr = document.createElement('tr');
            tr.classList = 'tr tr_hover-btn';

            const tdStatus = document.createElement('td');
            tdStatus.classList = 'td td_tree-status';
            tdStatus.innerHTML = `<button class="button__control button__control_action button__control_action_status button__control_modal-tasks-archive-catTask" value="${task.uin}">${setStatus(task.status.uin, task.fpart, 'control-task__img-status')}</button>`

            const tdName = document.createElement('td');
            tdName.classList.add('td');
            tdName.innerHTML = `<button class="button__control button__control_action button__control_action_text button__control_action_text-arch button__control_modal-tasks-archive-catTask" value="${task.uin}">${task.name}</button>`;

            /*const tdDateBegin = document.createElement('td');
            tdDateBegin.classList.add('td');
            tdDateBegin.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-archive-catTask" value="${task.uin}">${formatDate(task.datebegin)}</button>`;
            
            const tdDateEnd = document.createElement('td');
            tdDateEnd.classList.add('td');
            tdDateEnd.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-archive-catTask" value="${task.uin}">${formatDate(task.dateend)}</button>`;
            */
            const tdDateMove = document.createElement('td');
            tdDateMove.classList = 'td td_width-5';
            tdDateMove.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-archive-catTask" value="${task.uin}">${formatDate(task.datemove)}</button>`;

            if(task.fproblem != 0){
                tr.style.backgroundColor = '#ffdbdb';
                tdName.firstChild.style.color = '#ff3131';
                tdDateBegin.firstChild.style.color = '#ff3131';
                tdDateEnd.firstChild.style.color = '#ff3131';
            }

            tr.appendChild(tdStatus);
            tr.appendChild(tdName);
            //tr.appendChild(tdDateBegin);
            //tr.appendChild(tdDateEnd);
            tr.appendChild(tdDateMove);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        container.appendChild(table);
    }
}

export const funcGetTasksArchiveTree = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catTaskArch", "uinTaskArch":`${uin}`};
    funcCommand(body, funcProcessGetTasksArchiveTree);
}

const funcProcessGetTasksArchiveTree = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Дерево архива:", respobj);

    localStorage.setItem("uinTask", respobj.answ.uinTask)

    const tree = new TreeTaskBuilder('tree_tasks_archive', 'dirTaskArch', 'catTaskArch', funcGetTasksArchiveTree, funcGetTasksArchiveSteps, '', funcGetTasksArchive, []);
    tree.build(respobj.answ);
}

if(tabcontent_close != null){
    if(window.innerWidth <= 1024){
        tabcontent_close.style.opacity = "1";
        tabcontent_close.addEventListener('click', () => {
            wrapper_tree_tasks_archive.style.display = "none";
        })
    } else {
        tabcontent_close.style.opacity = "0";
    }
}