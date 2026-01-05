import {funcCommand, responseProcessor} from '../../../js/common/common.js';
import {funcGetUserTasksThreeColl} from '../../table/__user-tasks/table__user-tasks.js';

export const funcTaskContentMount = (uin) => {
    return `
    <div class="modal__wrapper modal__wrapper-task-mount">
        <div>
            <div class="modal__button-wrapper">
                <div class="modal__input-wrapper">
                    <label class="input__type-text__label-active" for="mount_count"
                        >Количество:</label
                    >
                    <input
                        class="input__type-text input__type-text_modal"
                        type="number"
                        id="mount_count_${uin}"
                        min="1"
                        style="border-bottom: 0.063rem solid var(--border)"
                    />
                </div>
                <div class="modal__button-wrapper">
                    <button class="button__control" id="mount_count_minus_${uin}">
                        <img
                            class="button__control__img"
                            src="assets/images/minus.svg"
                            alt=""
                            title="Убрать"
                        />
                    </button>
                    <button class="button__control" id="mount_count_plus_${uin}">
                        <img
                            class="button__control__img"
                            src="assets/images/plus.svg"
                            alt=""
                            title="Добавить"
                        />
                    </button>
                </div>
            </div>
            <div class="modal__input-wrapper modal__input-wrapper_display-none">
                <label class="input__type-text__label-active" for="user_job"
                    >Пользователь:</label
                >
                <div class="custom-select">
                    <select class="select select_modal" id="mount_usersaccprof_${uin}">
                        <option value="">Выберите пользователя</option>
                    </select>
                    <span class="select-text"></span>
                </div>
            </div>
        </div>
        <button
            class="button__control button__control_modal"
            id="mount_button_${uin}"
        >
            Выпустить
        </button>
    </div>
    `
}

export const funcTaskContentMountHelpers = (uin, faccprof) => {
    document.getElementById(`mount_count_minus_${uin}`).addEventListener("click", () => {
        document.getElementById(`mount_count_${uin}`).stepDown();
    })

    document.getElementById(`mount_count_plus_${uin}`).addEventListener("click", () => {
        document.getElementById(`mount_count_${uin}`).stepUp();
    })

    document.getElementById(`mount_button_${uin}`).addEventListener("click", () => {
        funcSaveMount(uin, faccprof);
    })
}

const funcSaveMount = (uin, faccprof) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fixprocpp", "uinuser":"", "uinproduct":"", "uintechproc":"", "count":"", "datetm":"", "prim":"", "uinstep":`${uin}`};

    let uinproduct   = document.getElementById(`task_prod_${uin}`).textContent;
    let uintechproc  = document.getElementById(`task_techproc_${uin}`).textContent;
    let count        = document.getElementById(`mount_count_${uin}`).value;
    let usersaccprof = document.getElementById(`mount_usersaccprof_${uin}`).value

    body.uinproduct  = uinproduct;
    body.uintechproc = uintechproc;
    body.datetm      = new Date().toISOString();

    if(count === ''){
        alert('Вы не заполнили все необходимые поля!');
    } else {
        body.count = count;

        if(faccprof === 1){
            if(usersaccprof === ''){
                alert('Вы не заполнили все необходимые поля!');
            } else {
                body.uinuser = usersaccprof;
                funcCommand(body, funcProcessSaveMount);
            }
        } else {
            body.uinuser = localStorage.getItem('user_uin');
            funcCommand(body, funcProcessSaveMount);
        }
    }
}

const funcProcessSaveMount = (result, respobj) => {
    console.log(respobj);
    responseProcessor(result, respobj.succ);

    if(respobj.succ != -10){ funcGetUserTasksThreeColl() };
    if(window.innerWidth <= 1024){ document.querySelector('.button__control_tabcontent-close').click() }
}