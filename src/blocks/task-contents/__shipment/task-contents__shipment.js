import {funcGetSets} from '../../table/__tasks-sets/table__tasks-sets.js';
import {funcGetProducts} from '../../table/__tasks-products/table__tasks-products.js';
import {funcGetUsers} from '../../table/__tasks-users/table__tasks-users.js';
import {funcGetContragents} from '../../table/__tasks-contragents/table__tasks-contragents.js';
import {getCheckbox, zapros_set, forModal_set, zapros_product, forModal_product} from '../../modal/__shipment/modal__shipment.js';

export const funcTaskContentShipment = () => {
        return `
        <div class="modal__table-wrapper_task">
          <div class="modal__input-wrapper modal__input-wrapper_task">
            <label class="input__type-text__label" for="task_contragents"
              >Контрагент:</label
            >
            <select class="select select_task" id="task_contragents">
              <option value=" ">Контрагент</option>
            </select>
          </div>
          <button
            class="button__control button__control_modal"
            id="shipment_button"
          >
            Отгрузить
          </button>
        </div>
        <div class="modal__body">
          <div class="modal__table">
            <table class="table">
              <thead class="thead">
                <tr class="tr">
                  <td class="td td_active">Комплект</td>
                  <td class="td td_active">Количество</td>
                </tr>
              </thead>
              <tbody id="tb_sets"></tbody>
            </table>
          </div>
          <div class="modal__table">
            <table class="table">
              <thead class="thead">
                <tr class="tr">
                  <td class="td td_active">Изделие</td>
                  <td class="td td_active">Количество</td>
                </tr>
              </thead>
              <tbody id="tb_products"></tbody>
            </table>
          </div>
        </div>`
}

export const funcTaskContentShipmentHelpers = () => {
    document.getElementById("shipment_button").onclick = () => {
        let task_contragents = document.getElementById("task_contragents");
        if(task_contragents.value === " "){
            alert("Вы не выбрали контрагента!");
        } else {
            localStorage.setItem("contragent_uin", task_contragents.value);
            getCheckbox(tb_sets, "input_set_", zapros_set, forModal_set, "zapros_set_value");
            getCheckbox(tb_products, "input_product_", zapros_product, forModal_product, "zapros_product_value");
            document.getElementById("shipment_modal").style.display = "block";
        }
    }
    funcGetSets();
    funcGetProducts();
    funcGetContragents();
    funcGetUsers();
}