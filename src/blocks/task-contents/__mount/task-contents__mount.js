import {funcCommand, removeOptionsSetValue, funcProcessOnlyInfo, addToDropdownTaskSelect} from '../../../js/common/common.js';
import {funcGetProductpp} from '../../table/__task-productpp/table__task-productpp.js';
import {funcGetUsers} from '../../table/__tasks-users/table__tasks-users.js';

export const funcTaskContentMount = () => {
    return `
        <div class="modal__body">
          <div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_users"
                >Пользователи:</label
              >
              <select class="select select_modal" id="mount_users">
                <option value="">Пользователи</option>
              </select>
            </div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_date"
                >Дата:</label
              >
              <input
                class="input__type-text input__type-text_title input__type-text_modal"
                type="date"
                id="mount_date"
              />
            </div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_time"
                >Время:</label
              >
              <input
                class="input__type-text input__type-text_title input__type-text_modal"
                type="time"
                id="mount_time"
                step="1"
              />
            </div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_prod"
                >Изделия:</label
              >
              <select class="select select_modal" id="mount_prod">
                <option value="">Изделия</option>
              </select>
            </div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_procc"
                >Тех. операция:</label
              >
              <select class="select select_modal" id="mount_procc">
                <option value="">Тех. операция</option>
              </select>
            </div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_count"
                >Количество:</label
              >
              <input
                class="input__type-text input__type-text_modal"
                type="number"
                id="mount_count"
                min="0"
              />
            </div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_prim"
                >Примечание:</label
              >
              <input
                class="input__type-text input__type-text_modal"
                type="text"
                id="mount_prim"
              />
            </div>
          </div>
          <div class="modal__button-wrapper">
            <button class="button__control" id="mount_count_minus">
              <img
                class="button__control__img"
                src="assets/images/minus.svg"
                alt=""
              />
            </button>
            <button class="button__control" id="mount_count_plus">
              <img
                class="button__control__img"
                src="assets/images/plus.svg"
                alt=""
              />
            </button>
          </div>
        </div>
        <button class="button__control button__control_modal" id="mount_button">
          Сохранить
        </button>`
}

export const funcTaskContentMountHelpers = () => {
    funcGetProductpp();
    funcGetUsers();

    document.getElementById("mount_date").value = new Date().toISOString().split('T')[0];
    document.getElementById("mount_time").value = new Date().toLocaleTimeString();
    
    document.getElementById("mount_prod").addEventListener("change", (event) => {
        let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"getprocpp", "uinproduct":`${event.target.value}`};
        funcCommand(body, funcProcessGetProc);
    })

    document.getElementById("mount_count_minus").addEventListener("click", () => {
        document.getElementById("mount_count").stepDown();
    })

    document.getElementById("mount_count_plus").addEventListener("click", () => {
        document.getElementById("mount_count").stepUp();
    })

    document.getElementById("mount_button").addEventListener("click", () => {
        funcSaveMount();
    })
}

const funcProcessGetProc = (result, respobj) => {
    console.log("Тех.проц.:", respobj);

    let select_id = "mount_procc";
    removeOptionsSetValue(select_id, "Тех. процесс")
    for (let key in respobj.answ) {
        let obj  = respobj.answ[key];
        let name = obj.name;
        let buy  = 1;
        let del  = 0;
        let uin  = obj.uintechproc;
        addToDropdownTaskSelect(name, buy, del, uin, select_id);
    }
}

const funcSaveMount = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"fixprocpp", "uinuser":"", "uinproduct":"", "uintechproc":"", "count":"", "datetm":"", "prim":""};

    let uinuser     = document.getElementById("mount_users").value;
    let uinproduct  = document.getElementById("mount_prod").value;
    let uintechproc = document.getElementById("mount_procc").value;
    let count       = document.getElementById("mount_count").value;
    let prim        = document.getElementById("mount_prim").value;
    let date        = document.getElementById("mount_date").value.split('-').join("");
    let time        = document.getElementById("mount_time").value;

    if(uinuser === '' || uinproduct === '' || uintechproc === '' || count === ''){
        alert('Вы не заполнили все необходимые поля!');
    } else {
        body.uinuser     = uinuser;
        body.uinproduct  = uinproduct;
        body.uintechproc = uintechproc;
        body.count       = count;
        body.prim        = prim;
        body.datetm      = `${date} ${time}`;

        funcCommand(body, funcProcessOnlyInfo);

        removeOptionsSetValue("mount_users", "Пользователи");
        funcGetUsers();
        removeOptionsSetValue("mount_prod", "Изделия");
        funcGetProductpp();
        removeOptionsSetValue("mount_procc", "Тех. процесс");
        document.getElementById("mount_count").value = "";
        document.getElementById("mount_prim").value  = "";
        document.getElementById("mount_date").value  = new Date().toISOString().split('T')[0];
        document.getElementById("mount_time").value  = new Date().toLocaleTimeString();
    }
}