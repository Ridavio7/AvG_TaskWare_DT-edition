import {funcCommand, setStatus, responseProcessor, formatDate, funcProcessOnlyInfo, formatTime, listenCustomSelect, clearCustomSelect} from '../../../js/common/common.js.js';
import {customSelect, customSortSelect} from '../../select/select.js';
import {showNotification} from '../../modal/__notification/modal__notification.js';
import {funcInfoChatTaskOpenModal} from '../../modal/__chat-task/modal__chat-task.js';
import {funcInfoDetailppOpenModal} from '../../modal/__detailpp/modal__detailpp.js';
import {setSidebarEvents, updateCloseButtonVisibility} from '../../sidebar/sidebar.js';
import {funcInfoShablonsSysOpenModal} from '../../modal/__shablons-sys/modal__shablons-sys.js';

import {funcTaskContentShipment, funcTaskContentShipmentHelpers} from '../../task-contents/__shipment/task-contents__shipment.js';
import {funcTaskContentMount, funcTaskContentMountHelpers} from '../../task-contents/__mount/task-contents__mount.js';

export const funcGetUserTasksThreeColl = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"usersteps", "reg":"status2", "uinuser":`${localStorage.getItem('user_uin')}`, "count":"100", "sort":"prior", "uintask":""};
    funcCommand(body, funcProcessGetUserTasksThreeColl);
}

const funcProcessGetUserTasksThreeColl = (result, respobj) => {
    if(respobj.succ == 0) showNotification('info', 'Уведомление!', 'Нет актуальных задач');
    console.log("Задачи:", respobj);
    responseProcessor(result, respobj.succ);

    buildStructureThreeColl(respobj.answ);
}

const calcPercent = (count, countreal) => {
    if (count === 0) {
        return { percent: 0, className: "progress-0" };
    }

    const percent = Math.round((countreal * 100) / count);

    let className;
    if (percent <= 30) {
        className = "user-tasks-card__progress-30";
    } else if (percent <= 60) {
        className = "user-tasks-card__progress-60";
    } else if (percent <= 90) {
        className = "user-tasks-card__progress-90";
    } else {
        className = "user-tasks-card__progress-100";
    }

    return {
        percent,
        className
    }
}

function buildStructureThreeColl(data) {
    let user_task_no_start = document.getElementById('user_task_no_start');
    let user_task_review = document.getElementById('user_task_review');
    let user_task_in_progress = document.getElementById('user_task_in_progress');
    let user_tasks_content = document.getElementById('user_tasks_content');

    document.querySelectorAll('.user-tasks-col__count_no-start').forEach((elem) => { elem.innerHTML = 0 });
    document.querySelectorAll('.user-tasks-col__count_in-progress').forEach((elem) => { elem.innerHTML = 0 });
    user_task_no_start.querySelector('.user-tasks-col__tasks').innerHTML = '';
    user_task_in_progress.querySelector('.user-tasks-col__tasks').innerHTML = '';
    user_tasks_content.innerHTML = '';

    for (const item of data) {
        for (const steps of item.steps) {
            const a = document.createElement('a');
            const div_block = document.createElement('div');

            a.href = `#user_task_link_${steps.uin}`;
            div_block.className = `sidebar__link user_task_link_${steps.uin} sidebar__link_task sidebar__link_no-child`;
            steps.status.uin >= 4 ? div_block.classList.add('sidebar__link_task_work') : div_block.classList.add('sidebar__link_task_no-acc');
            div_block.id = `link_task_active_${steps.uin}`;

            let perc_res = calcPercent(steps.count, steps.countreal);

            div_block.innerHTML = `
            <div class="user-tasks-card">
                <div class="user-tasks-card__task-header">
                    <div class="user-tasks-card__task-info">
                        <div class="user-tasks-card__task-title"><span class="user-tasks-card__task-title-span">Задача:</span> ${steps.task.name}</div>
                        <div class="user-tasks-card__task-product">
                            <img class="button__control__img" src="assets/images/cube.svg" alt="Изделие" title="Изделие">${steps.product.name === '' ? '---' : steps.product.name}
                        </div>
                    </div>
                    <div class="">${setStatus(steps.status.uin, steps.fpart, 'user-tasks-card__img-status')}</div>
                </div>
                <div class="user-tasks-card__task-assignment">
                    <span class="user-tasks-card__task-assignment-span">Задание:</span> ${steps.name}
                </div>
                ${steps.content.uin === 3
                ? `<div class="user-tasks-card__progress-container"><div class="user-tasks-card__progress-bar"><div class="user-tasks-card__progress-fill ${perc_res.className}" style="width:${perc_res.percent}%;"></div></div><span>${perc_res.percent}%</span></div>`
                : ``}
                <div class="user-tasks-card__dates-status">
                    <div class="user-tasks-card__dates">
                        <div class="user-tasks-card__date-item">
                            <div class="user-tasks-card__date-label">${steps.status.uin >= 4 ? 'Принят:' : 'Старт:'}</div>
                            <div class="user-tasks-card__date-value">${steps.status.uin >= 4 ? formatDate(steps.dateaccept) : formatDate(steps.datebegin)}</div>
                        </div>
                        <div class="user-tasks-card__date-item">
                            <div class="user-tasks-card__date-label"><img src="assets/images/delta.svg" alt="Длительность" title="Длительность"></div>
                            <div class="user-tasks-card__date-value">${steps.dl.dl_d} д ${steps.dl.dl_h} ч ${steps.dl.dl_m} м</div>
                        </div>
                    </div>
                    <div class="user-tasks-card__pair-statuses">
                        ${steps.fproblem === 1 ? '<div class="user-tasks-card__status"><img src="assets/images/exclamation_mark.svg" alt="Проблема" title="Проблема"></div>' : ""}
                    </div>
                </div>
            </div>
            `
            a.append(div_block);

            user_tasks_content.insertAdjacentHTML('beforeend', userTasksContentColl(steps.task.name, steps.task.uin, steps.product.name,
            steps.product.uin, steps.techproc.name, steps.techproc.uin, steps.count, `user_task_link_${steps.uin}`, steps.name, steps.admin.name,
            steps.dateaccept.split('T')[0], steps.dateaccept.split('T')[1], steps.dateend, steps.countprev, steps.mission, steps.prim, steps.uin, steps.fproblem, steps.status.uin, steps.countstep, steps.countreal, steps.fpart, steps.missiontask, steps.dl.dl_d, steps.dl.dl_h, steps.dl.dl_m));

            if(item.blockstatus === 1){
                user_task_no_start.querySelector('.user-tasks-col__tasks').append(a);
                document.querySelectorAll('.user-tasks-col__count_no-start').forEach((elem) => { elem.innerHTML = item.countblock });
            } else {
                user_task_in_progress.querySelector('.user-tasks-col__tasks').append(a);
                document.querySelectorAll('.user-tasks-col__count_in-progress').forEach((elem) => { elem.innerHTML = item.countblock });
            }

            if(steps.status.uin >= 4){
                switch (steps.content.uin) {
                    case 2:
                        document.getElementById(`user_task_link_${steps.uin}`).insertAdjacentHTML('beforeend', funcTaskContentShipment());
                        funcTaskContentShipmentHelpers();
                        break
                    case 3:
                        document.getElementById(`user_task_link_${steps.uin}`).insertAdjacentHTML('beforeend', funcTaskContentMount(steps.uin));
                        funcTaskContentMountHelpers(steps.uin, steps.faccprof);

                        if(steps.faccprof === 1){
                            let select = document.getElementById(`mount_usersaccprof_${steps.uin}`);
                            select.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
                            for (let key in steps.usersaccprof) {
                                let obj  = steps.usersaccprof[key];
                                select.append(new Option(obj.name, obj.uin));
                            }
                        }
                        break
                    default:
                        break
                }
            }

            if(steps.content.uin == 5){
                // бегунок
                document.getElementById(`task_count_main_${steps.uin}`).classList.remove("modal__input-wrapper_display-none");
                document.getElementById(`task_techproc_${steps.uin}`).classList.add("modal__input-wrapper_display-none");
                document.getElementById(`task_counts_${steps.uin}`).classList.remove("modal__input-wrapper_display-none");
            } else if(steps.content.uin == 3){
                // монтаж ПП
                document.getElementById(`task_count_main_${steps.uin}`).classList.remove("modal__input-wrapper_display-none");
                document.getElementById(`task_techproc_${steps.uin}`).classList.remove("modal__input-wrapper_display-none");
                document.getElementById(`task_counts_${steps.uin}`).classList.remove("modal__input-wrapper_display-none");
            } else {
                document.getElementById(`task_count_main_${steps.uin}`).classList.add("modal__input-wrapper_display-none");
                document.getElementById(`task_techproc_${steps.uin}`).classList.add("modal__input-wrapper_display-none");
                document.getElementById(`task_counts_${steps.uin}`).classList.add("modal__input-wrapper_display-none");
            }
        }
    }

    user_tasks_content.insertAdjacentHTML('afterbegin', '<div class="user-tasks-content__button-block"><button class="user-tasks-content__button">Создать задачу</button></div>');

    /* чат задачи */
    let button_chat_task = document.querySelectorAll(".button__control_chat_task");
    button_chat_task.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoChatTaskOpenModal(elem.value);
        })
    })

    /* функция готовности */
    let button_ready = document.querySelectorAll(".button__control_usersteps_ready");
    button_ready.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm("Отметить это задание готовым?");
            if(result){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"ready", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`, "fpart":"0"};
                funcCommand(body, funcProcessTaskReady);

                function funcProcessTaskReady (result, respobj){
                    responseProcessor(result, respobj.succ);

                    if(respobj.succ != -11){ funcGetUserTasksThreeColl() };
                }
            }
        })
    })

    /* функция готовности частично */
    let button_ready_part = document.querySelectorAll(".button__control_usersteps_ready_part");
    button_ready_part.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm("Отметить это задание частично готовым?");
            if(result){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"ready", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`, "fpart":"1"};
                funcCommand(body, funcProcessOnlyInfo);
                setTimeout(function(){funcGetUserTasksThreeColl()}, 100);
                if(window.innerWidth <= 1024){ document.querySelector('.button__control_tabcontent-close').click() }
            }
        })
    })

    /* функция обновления шага */
    let button_update = document.querySelectorAll(".button__control_usersteps_update");
    button_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`, "prim":""};
            body.prim = document.getElementById(`task_comment_${elem.value}`).value;
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция принятия */
    let button_accept = document.querySelectorAll(".button__control_usersteps_accept");
    button_accept.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm("Принять это задание?");
            if(result){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"accept", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`};
                funcCommand(body, funcProcessOnlyInfo);
                setTimeout(function(){funcGetUserTasksThreeColl()}, 100);
                if(window.innerWidth <= 1024){ document.querySelector('.button__control_tabcontent-close').click() }
            }
        })
    })

    /* функция проблемы */
    let button_problem = document.querySelectorAll(".button__control_usersteps_problem");
    button_problem.forEach((elem) => {
        elem.addEventListener("click", () => {
            let result = confirm("Установить проблему на этом задании?");
            if(result){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"problem", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`};
                funcCommand(body, funcProcessOnlyInfo);
                setTimeout(function(){funcGetUserTasksThreeColl()}, 100);
                if(window.innerWidth <= 1024){ document.querySelector('.button__control_tabcontent-close').click() }
            }
        })
    })

    /* открыть детализацию */
    let button_detailpp = document.querySelectorAll(".button__control_detailpp");
    button_detailpp.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoDetailppOpenModal(elem.value);
        })
    })

    /*document.querySelectorAll('.user-tasks-content__button').forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoShablonsSysOpenModal();
        })
    })*/

    setTimeout(() => {
        let sidebar_links = document.querySelectorAll(".sidebar__link_task");
        sidebar_links.forEach((elem) => {
            setSidebarEvents(elem, "sidebar__tabcontent", "sidebar__link_task", "sidebar__link_active_task");
        })
    }, 800)
    
    if(!(window.innerWidth <= 1024)){
        setTimeout(() => { document.getElementById(localStorage.getItem("sidebar_task_tab_active")).click(); /*document.getElementById(localStorage.getItem("sidebar_task_tab_active")).scrollIntoView({ behavior: 'smooth' })*/ }, 1000);
    }

    let tabcontent_close = document.querySelectorAll('.button__control_tabcontent-close');
    Object.keys(tabcontent_close).forEach(elem => {
        tabcontent_close[elem].addEventListener('click', () => {
            let i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("sidebar__tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].classList.remove('sidebar__tabcontent_task-active');
            }

            document.querySelector('.user-tasks-content__container').style.display = 'none';
            document.querySelector('.container').classList.add('container_no-scroll');

            tablinks = document.getElementsByClassName("sidebar__link_task");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" sidebar__link_active_task", "");
            }
            updateCloseButtonVisibility();
        })
    })
}

const userTasksContentColl = (task_name, task_uin, product, uinProd, techproc, uinTechproc, count, tabcontent_id, name, admin, dateaccept, timeaccept,
                              dateend, countprev, mission, prim, uin, fproblem, status, countstep, countreal, fpart, missiontask, dl_d, dl_h, dl_m) => {
    return `
    <div class="sidebar__tabcontent sidebar__tabcontent_task" id="${tabcontent_id}">
        <div class="button__control_tabcontent-close__container">
            <button class="button__control button__control_tabcontent-close">
                <img class="button__control_img" src="assets/images/arrow_close.svg" alt="Чат">
            </button>
            <button class="button__control button__control_chat_task" value="${task_uin}" title="Чат">
                <img class="button__control_img__no-filter" src="assets/images/chat.svg" alt="Чат">
            </button>
        </div>
        <div class="modal__header modal__header_task">
            <div class="user-tasks-content__task-detail">
                <div class="user-tasks-content__detail-header">
                    <div>
                        <div class="user-tasks-content__detail-title">Задача: ${task_name}</div>
                        <div class="user-tasks-content__detail-subtitle">Изделие: <span id="task_prod_${uin}">${product === '' ? '---' : product}</span></div>
                    </div>
                    <div id="task_count_main_${uin}">
                        <div class="user-tasks-content__detail-title user-tasks-content__detail-title_black">${count}</div>
                        <div class="user-tasks-content__detail-subtitle">Кол-во</div>
                    </div>
                    <button class="button__control button__control_chat_task button__control_chat_task-absolute" value="${task_uin}" title="Чат">
                        <img class="button__control_img__no-filter" src="assets/images/chat.svg" alt="Чат">
                    </button>
                </div>
                <div class="user-tasks-content__detail-body">
                    <div class="user-tasks-content__detail-grid">
                        <div class="user-tasks-content__info-item">
                            <div class="user-tasks-content__info-label">Задание:</div>
                            <div class="user-tasks-content__info-value">${name}</div>
                        </div>
                        <div class="user-tasks-content__info-item">
                            <div class="user-tasks-content__info-label">Администратор:</div>
                            <div class="user-tasks-content__info-value">${admin}</div>
                        </div>
                        <div class="user-tasks-content__info-item">
                            <div class="user-tasks-content__info-label">Принят:</div>
                            <div class="user-tasks-content__info-value">
                                <div>
                                    <div class="input__type-date_wrapper">
                                        <input class="input__type-text input__type-text_modal input__type-date input__type-date_disabled" type="date" value="${dateaccept}" disabled="">
                                        <label for="" class="input__type-date_icon input__type-date_icon-no-active">
                                            <img src="assets/images/calendar.svg" alt="">
                                        </label>
                                    </div>
                                        <div class="input__type-date_wrapper">
                                        <input class="input__type-text input__type-time input__type-text_modal input__type-date_disabled" type="time" value="${timeaccept}" disabled="">
                                        <label for="" class="input__type-date_icon input__type-date_icon-no-active"><img src="assets/images/time.svg" alt=""></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="user-tasks-content__info-item">
                            <div class="user-tasks-content__info-label">Длительность:</div>
                            <div class="user-tasks-content__info-value">${formatTime(dl_d, dl_h, dl_m)}</div>
                        </div>
                        <div class="user-tasks-content__info-item">
                            <div class="user-tasks-content__info-label">Описание:</div>
                            <div class="user-tasks-content__info-value">${missiontask === '' ? '---' : missiontask}</div>
                        </div>
                        <div class="user-tasks-content__info-item" id="task_techproc_${uin}">
                            <div class="user-tasks-content__info-label">Тех. операция:</div>
                            <div class="user-tasks-content__info-value"><span id="task_techproc_${uin}">${techproc === '' ? '---' : techproc}</span></div>
                        </div>
                    </div>
                    <div class="user-tasks-content__detail-section" id="task_counts_${uin}">
                        <div class="user-tasks-content__section-title">Количество</div>
                        <div class="user-tasks-content__available">
                            <div class="user-tasks-content__operation-info">
                                <div class="user-tasks-content__operation-item">
                                    <div class="user-tasks-content__operation-value">${countstep}</div>
                                    <div class="user-tasks-content__operation-label">План</div>
                                </div>
                                <div class="user-tasks-content__operation-item">
                                    <div class="user-tasks-content__operation-value">${countprev}</div>
                                    <div class="user-tasks-content__operation-label">Доступно</div>
                                </div>
                                <div class="user-tasks-content__operation-item">
                                    <div class="user-tasks-content__operation-value">${countreal}</div>
                                    <div class="user-tasks-content__operation-label">Факт</div>
                                </div>
                            </div>
                            <button class="button__control button__control_detailpp" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" title="Детализация количества"></button>
                        </div>
                    </div>

                    <div class="user-tasks-content__comments">
                        <div class="user-tasks-content__info-label user-tasks-content__info-label-comment">Комментарий администратора:</div>
                        <div class="user-tasks-content__comment user-tasks-content__comment-admin">
                            <div class="user-tasks-content__comment-text">${mission === '' ? '---' : mission}</div>
                        </div>
                        <div class="user-tasks-content__info-label user-tasks-content__info-label-comment">Комментарий исполнителя:</div>
                        <div class="user-tasks-content__comment user-tasks-content__comment-executor">
                            <input class="input__type-text input__type-text_modal" type="text" id="task_comment_${uin}" value="${prim}" placeholder="Напишите ваш комментарий">
                            <button class="button__control button__control_usersteps_update" value="${uin}" title="Обновить"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="Обновить"></button>
                        </div>
                    </div>
                    
                    <div class="user-tasks-content__action-group">
                        <div class="user-tasks-content__action-group">
                            <button class="button__control button__control_ready button__control_usersteps_accept ${status >= 4 ? "modal__input-wrapper_display-none" : ""}"
                                    value="${uin}"
                                    ${status >= 4 ? "disabled" : ""}>
                                ${status >= 4 ? "Принято" : "Принять"}
                            </button>
                            <button class="button__control button__control_ready button__control_usersteps_ready ${status >= 4 ? "" : "modal__input-wrapper_display-none"}" value="${uin}">Готов</button>
                        </div>
                        <div class="user-tasks-content__action-group">
                            <button class="button__control button__control_ready button__control_usersteps_ready_part ${status >= 4 ? "" : "modal__input-wrapper_display-none"}"
                                    value="${uin}"
                                    ${fpart === 1 ? "disabled" : ""}>
                                Частично готов
                            </button>
                            <button class="button__control button__control_ready button__control_usersteps_problem ${status >= 4 ? "" : "modal__input-wrapper_display-none"}"
                                    value="${uin}">
                                ${fproblem === 0 ? "Проблема" : "Снять&nbsp;проблему"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
}

window.addEventListener('resize', updateCloseButtonVisibility);

const tabBtns = document.querySelectorAll('.user-tasks-tabs__btn');
const tabContents = document.querySelectorAll('.user-tasks-col__column');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        // Убираем активный класс у всех
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Добавляем активный класс текущим
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    })
})

customSelect('user_task_prod_customDropdown', JSON.parse(localStorage.getItem("products_list")), 'Изделие');
customSelect('user_task_task_customDropdown', JSON.parse(localStorage.getItem("alltasks_active_list")), 'Задача');
customSelect('user_task_techproc_customDropdown', JSON.parse(localStorage.getItem("techproc_list")), 'Тех. операция');

let filt_main = [], filt_1 = {fld:"uinproduct", on:"tasks"}, filt_2 = {fld:"uin", on:"tasks"}, filt_3 = {fld:"uintechproc", on:"cattask"};

listenCustomSelect("user_task_prod_customDropdown", filt_1, [], filt_main);
listenCustomSelect("user_task_task_customDropdown", filt_2, [], filt_main);
listenCustomSelect("user_task_techproc_customDropdown", filt_3, [], filt_main);

const btn_filter_open = document.querySelector('[data-target="select-sort"]');

document.getElementById("button_user_task_choose").addEventListener("click", () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"usersteps", "reg":"status2",
                "uinuser":`${localStorage.getItem('user_uin')}`, "count":"100", "sort":"datebegin", "filt":`${JSON.stringify(filt_main)}`};
    funcCommand(body, funcProcessGetUserTasksThreeColl);

    btn_filter_open.classList.add('active');

    if(window.innerWidth <= 1024){ document.getElementById('select-sort').style.display = 'none' };
})

document.getElementById("button_user_task_reset").addEventListener("click", () => {
    filt_main.length = 0;
    clearCustomSelect('user_task_prod_customDropdown', 'Изделие');
    clearCustomSelect('user_task_task_customDropdown', 'Задача');
    clearCustomSelect('user_task_techproc_customDropdown', 'Тех. операция');
    funcGetUserTasksThreeColl();

    btn_filter_open.classList.remove('active');
})