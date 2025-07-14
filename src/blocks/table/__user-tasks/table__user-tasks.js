import {funcCommand, setStatus, responseProcessor, formatDate, funcProcessOnlyInfo} from '../../../js/common/common.js.js';
import {showNotification} from '../../modal/__notification/modal__notification.js';

import {funcTaskContentShipment, funcTaskContentShipmentHelpers} from '../../task-contents/__shipment/task-contents__shipment.js';
import {funcTaskContentMount, funcTaskContentMountHelpers} from '../../task-contents/__mount/task-contents__mount.js';

export const funcGetUserTasks = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "count":"100", "sort":"datebegin"};
    funcCommand(body, funcProcessGetUserTasks);
}

const funcProcessGetUserTasks = (result, respobj) => {
    if(respobj.succ == 0) showNotification('info', 'Уведомление!', 'Нет актуальных задач');
    console.log("Задачи:", respobj);

    const container = document.getElementById('user_tasks');
    container.innerHTML = '';
    buildStructure(respobj.answ, container)
}

function buildStructure(data, container) {
    for (const item of data) {
        const title = document.createElement('h3');
        title.textContent = item.nameshablon;
        title.classList.add('table__title');
        container.append(title);

        for (const steps of item.steps) {
            const li = document.createElement('li');
            li.classList.add('sidebar__wrapper');
            
            const a = document.createElement('a');
            const div_block = document.createElement('div');

            const div_title = document.createElement('div');
            div_title.classList.add('sidebar__title');

            const div_img = document.createElement('div');
            div_img.classList.add('sidebar__img_container');

            const div_time = document.createElement('div');
            div_time.classList.add('sidebar__block-task-time');

            const span_time = document.createElement('span');
            span_time.classList.add('sidebar__name_time');

            const span_date = document.createElement('span');
            span_date.classList.add('sidebar__name_time');

            const span_name = document.createElement('span');
            span_name.classList.add('sidebar__name');

            a.href = `#user_task_link_${steps.uin}`;
            div_block.className = `sidebar__link user_task_link_${steps.uin} sidebar__link_task sidebar__link_no-child`;
            div_img.innerHTML = setStatus(steps.status.uin);
            div_img.firstChild.classList.add('sidebar__img');
            if(steps.fproblem === 1) div_img.classList.add('sidebar__img_container-warning');

            span_time.innerHTML = steps.datebegin != '' ? formatDate(steps.datebegin) : "---";
            span_name.innerHTML = steps.name;

            div_time.append(span_time);
            //div_time.append(span_date);

            div_title.append(div_img);
            div_title.append(div_time);
            div_title.append(span_name);

            div_block.append(div_title);
            a.append(div_block);

            document.querySelector('.container').insertAdjacentHTML('beforeend', userTasksContent(steps.task.name, steps.primtask, steps.count, `user_task_link_${steps.uin}`, steps.name, steps.admin.name, steps.datebegin, steps.dateend, steps.mission, steps.prim, steps.uin, steps.fproblem));

            li.append(a);
            container.append(li);

            switch (steps.content.uin) {
                case 2:
                    document.getElementById(`user_task_link_${steps.uin}`).insertAdjacentHTML('beforeend', funcTaskContentShipment());
                    funcTaskContentShipmentHelpers();
                    break
                case 3:
                    document.getElementById(`user_task_link_${steps.uin}`).insertAdjacentHTML('beforeend', funcTaskContentMount());
                    funcTaskContentMountHelpers();
                default:
                    break
            }
        }
    }

    /* функция готовности */
    let button_ready = document.querySelectorAll(".button__control_usersteps_ready");
    button_ready.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"ready", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`};
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){location.reload()}, 100);
        })
    })

    /* функция обновления */
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
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"accept", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`};
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){location.reload()}, 100);
        })
    })

    /* функция проблемы */
    let button_problem = document.querySelectorAll(".button__control_usersteps_problem");
    button_problem.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"problem", "obj":"usersteps", "uinuser":`${localStorage.getItem('user_uin')}`, "uinstep":`${elem.value}`};
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){location.reload()}, 100);
        })
    })
}

const userTasksContent = (task_name, primtask, count, tabcontent_id, name, admin, datebegin, dateend, mission, prim, uin, fproblem) => {
    return `
    <div class="sidebar__tabcontent" id="${tabcontent_id}">
        <div class="modal__header modal__header_task">
          <div class="modal__header">
            <div class="modal__table-wrapper_task">
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_task_name"
                  >Название задачи:</label
                >
                <input
                  class="input__type-text input__type-text_task"
                  type="text"
                  id="task_task_name_${uin}"
                  value="${task_name}"
                  disabled
                />
              </div>
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_admin"
                  >Администратор:</label
                >
                <input
                  class="input__type-text input__type-text_task"
                  type="text"
                  id="task_admin_${uin}"
                  value="${admin}"
                  disabled
                />
              </div>
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_count"
                  >Количество:</label
                >
                <input
                  class="input__type-text input__type-text_task"
                  type="text"
                  id="task_count_${uin}"
                  value="${count}"
                  disabled
                />
              </div>
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_primtask"
                  >Описание задачи:</label
                >
                <input
                  class="input__type-text input__type-text_task input__type-text_modal_long"
                  type="text"
                  id="task_primtask_${uin}"
                  value="${primtask}"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal__header modal__header_task">
          <div class="modal__header">
            <div class="modal__table-wrapper_task">
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_name"
                  >Название подзадачи:</label
                >
                <input
                  class="input__type-text input__type-text_task"
                  type="text"
                  id="task_name_${uin}"
                  value="${name}"
                  disabled
                />
              </div>
            </div>
            <div class="modal__table-wrapper_task">
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_date_first"
                  >Срок:</label
                >
                <input
                  class="input__type-text input__type-date input__type-text_task"
                  type="date"
                  id="task_date_first_${uin}"
                  value="${datebegin.split("T")[0]}"
                  disabled
                />
              </div>
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <input
                  class="input__type-text input__type-time input__type-text_task"
                  type="time"
                  id="task_time_first_${uin}"
                  value="${datebegin.split("T")[1]}"
                  disabled
                />
              </div>
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <input
                  class="input__type-text input__type-date input__type-text_task"
                  type="date"
                  id="task_date_second_${uin}"
                  value="${dateend.split("T")[0]}"
                  disabled
                />
              </div>
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <input
                  class="input__type-text input__type-time input__type-text_task"
                  type="time"
                  id="task_time_second_${uin}"
                  value="${dateend.split("T")[1]}"
                  disabled
                />
              </div>
            </div>
            <div class="modal__table-wrapper_task">
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_mission"
                  >Описание:</label
                >
                <input
                  class="input__type-text input__type-text_task input__type-text_modal_long"
                  type="text"
                  id="task_mission_${uin}"
                  value="${mission}"
                  disabled
                />
              </div>
              <div class="modal__input-wrapper modal__input-wrapper_task">
                <label class="input__type-text__label" for="task_comment"
                  >Комментарий:</label
                >
                <input
                  class="input__type-text input__type-text_task input__type-text_modal_long"
                  type="text"
                  id="task_comment_${uin}"
                  value="${prim}"
                />
              </div>
            </div>
          </div>
          <div class="modal__header">
            <button
              class="button__control button__control_ready button__control_usersteps_accept"
              value="${uin}"
            >
              Принял
            </button>
            <button
              class="button__control button__control_ready button__control_usersteps_update"
              value="${uin}"
            >
              Обновить
            </button>
            <button
              class="button__control button__control_ready button__control_usersteps_problem"
              value="${uin}"
            >
              ${fproblem === 0 ? "Проблема" : "Снять проблему"}
            </button>
            <button
              class="button__control button__control_ready button__control_usersteps_ready"
              value="${uin}"
            >
              Готов
            </button>
          </div>
        </div>
      </div>`
}