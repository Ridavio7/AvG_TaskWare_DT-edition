import {funcCommand, setStatus, responseProcessor, formatDate, funcProcessOnlyConsole, funcProcessOnlyInfo} from '../../../js/common/common.js';
import {TreeTaskBuilder} from '../../_tree/treeTask.js';
import {funcGetTasksSteps} from '../../modal/__info-task/modal__info-task.js';

export const funcGetTasks = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"tasks", "count":"100", "asort":"datebegin"};
    funcCommand(body, funcProcessGetTasks);
}

const funcProcessGetTasks = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Задачи:", respobj);

    const container = document.getElementById('tb_tasks');
    container.innerHTML = '';
    buildStructure(respobj.answ, container)

    /* открытие модального окна */
    let button_modal = document.querySelectorAll(".button__control_modal-tasks-catTask");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            let btn = tb_tasks.querySelector('.button__control_active');
            if(btn != null){
                btn.classList.remove('button__control_active');
                btn.parentElement.parentElement.classList.remove('tr_mark');
            }

            localStorage.setItem('button-active__tasks-catTask', elem.value);

            funcGetTasksTree(elem.value);
            elem.classList.add('button__control_active');
            elem.parentElement.parentElement.classList.add('tr_mark');
        })
    })

    let button_control_del = document.querySelectorAll(".button__control_modal-tasks-del");
    button_control_del.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm(`Отозвать задачу "${elem.name}"?`);
            if(result === true){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"stoptask", "obj":"tasks", "uintask":`${elem.value}`};
                funcCommand(body, funcProcessOnlyInfo);
                setTimeout(function(){ funcGetTasks() }, 100);
                setTimeout(function(){ funcGetTasksTree(`${localStorage.getItem('uinTask')}`) }, 200);
            }
        })
    })
    
    let button_control_archive = document.querySelectorAll(".button__control_modal-tasks-archive");
    button_control_archive.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm(`Убрать в архив задачу "${elem.name}"?`);
            if(result === true){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"archive", "obj":"tasks", "uinTask":`${elem.value}`};
                funcCommand(body, funcProcessOnlyInfo);
                setTimeout(function(){ funcGetTasks() }, 100);
            }
        })
    })
}

function buildStructure(data, container) {
    for (const item of data) {
        const title = document.createElement('h3');
        title.textContent = item.nameshablon;
        title.classList.add('table__title');
        container.appendChild(title);

        const table = document.createElement('table');
        table.classList = 'table table_no-rotation';
        /*const thead = document.createElement('thead');
        thead.classList.add('thead');
        const trHead = document.createElement('tr');
        trHead.classList.add('tr');

        ['', 'Название', 'Начало', ''].forEach(text => {
            const td = document.createElement('td');
            td.className = 'td td_active';
            td.textContent = text;
            trHead.appendChild(td);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);*/

        const tbody = document.createElement('tbody');
        for (const task of item.tasks) {
            const tr = document.createElement('tr');
            tr.classList.add('tr');

            const tdStatus = document.createElement('td');
            tdStatus.classList.add('td');
            tdStatus.innerHTML = `<button class="button__control button__control_action button__control_action_status button__control_modal-tasks-catTask" value="${task.uin}">${setStatus(task.status.uin, 0)}</button>`

            const tdName = document.createElement('td');
            tdName.classList.add('td');
            tdName.innerHTML = `<button class="button__control button__control_action button__control_action_text button__control_modal-tasks-catTask" value="${task.uin}">${task.name}</button>`;

            const tdDateBegin = document.createElement('td');
            tdDateBegin.classList.add('td');
            tdDateBegin.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-catTask" value="${task.uin}">${formatDate(task.datebegin)}</button>`;

            const tdDateEnd = document.createElement('td');
            tdDateEnd.classList.add('td');
            tdDateEnd.innerHTML = `<button class="button__control button__control_action button__control_action_date button__control_modal-tasks-catTask" value="${task.uin}">${formatDate(task.dateend)}</button>`;

            const tdBtn = document.createElement('td');
            tdBtn.classList = 'td td_nowrap-content';
            tdBtn.innerHTML = `<button class="button__control button__control_modal-tasks-del" value="${task.uin}" name="${task.name}">Отозвать</button><button class="button__control button__control_modal-tasks-archive" value="${task.uin}" name="${task.name}">В архив</button>`;

            if(task.fproblem != 0){
                tr.style.backgroundColor = '#ffdbdb';
                tdName.firstChild.style.color = '#ff3131';
                tdDateBegin.firstChild.style.color = '#ff3131';
                tdDateEnd.firstChild.style.color = '#ff3131';
            }

            tr.appendChild(tdStatus);
            tr.appendChild(tdName);
            tr.appendChild(tdDateBegin);
            tr.appendChild(tdDateEnd);
            tr.appendChild(tdBtn);

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        container.appendChild(table);
    }
}

export const funcGetTasksTree = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"catTask", "uinTask":`${uin}`};
    funcCommand(body, funcProcessGetTasksTree);
}

const funcProcessGetTasksTree = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Дерево задачи:", respobj);

    localStorage.setItem("uinTask", respobj.answ.uinTask)

    const tree = new TreeTaskBuilder('tree_tasks', 'dirTask', 'catTask', funcGetTasksTree, funcGetTasksSteps, '', funcGetTasks, []);
    tree.build(respobj.answ);
}
