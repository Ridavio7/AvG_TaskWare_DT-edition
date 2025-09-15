import {funcCommand, funcProcessOnlyInfo} from '../../../js/common/common.js';

export const funcTaskContentMount = (uin) => {
    return `
        <div class="modal__body">
          <div>
            <div class="modal__input-wrapper">
              <label class="input__type-text__label" for="mount_count"
                >Количество:</label
              >
              <input
                class="input__type-text input__type-text_modal"
                type="number"
                id="mount_count_${uin}"
                min="0"
              />
            </div>
          </div>
          <div class="modal__button-wrapper">
            <button class="button__control" id="mount_count_minus_${uin}">
              <img
                class="button__control__img"
                src="assets/images/minus.svg"
                alt=""
              />
            </button>
            <button class="button__control" id="mount_count_plus_${uin}">
              <img
                class="button__control__img"
                src="assets/images/plus.svg"
                alt=""
              />
            </button>
          </div>
        </div>
        <button class="button__control button__control_modal" id="mount_button_${uin}">
          Выпустить
        </button>`
}

export const funcTaskContentMountHelpers = (uin) => {
    document.getElementById(`mount_count_minus_${uin}`).addEventListener("click", () => {
        document.getElementById(`mount_count_${uin}`).stepDown();
    })

    document.getElementById(`mount_count_plus_${uin}`).addEventListener("click", () => {
        document.getElementById(`mount_count_${uin}`).stepUp();
    })

    document.getElementById(`mount_button_${uin}`).addEventListener("click", () => {
        funcSaveMount(uin);
    })
}

const funcSaveMount = (uin) => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"fixprocpp", "uinuser":`${localStorage.getItem('user_uin')}`, "uinproduct":"", "uintechproc":"", "count":"", "datetm":"", "prim":"", "uinstep":`${uin}`};

    let uinproduct  = document.getElementById(`task_prod_${uin}`).name;
    let uintechproc = document.getElementById(`task_techproc_${uin}`).name;
    let count       = document.getElementById(`mount_count_${uin}`).value;

    if(count === ''){
        alert('Вы не заполнили все необходимые поля!');
    } else {
        body.uinproduct  = uinproduct;
        body.uintechproc = uintechproc;
        body.count       = count;
        body.datetm      = new Date().toISOString();

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){ location.reload() }, 100);
    }
}