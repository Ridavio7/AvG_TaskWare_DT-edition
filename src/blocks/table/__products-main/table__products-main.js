import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js';
import {funcInfoTcardprodsOpenModal} from '../../modal/__tcardprods/modal__tcardprods.js';

export const funcGetProducts = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"products", "count":"100"};
    funcCommand(body, funcProcessGetProducts);
}

const funcProcessGetProducts = (result, respobj) => {
    console.log("Изделия:", respobj);

    let tb_id = "tb_products_main";
    clearTable(tb_id);

    let products_list = respobj.answ;
    localStorage.setItem("products_list", JSON.stringify(products_list));
    for (let key in respobj.answ) {
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addProductsRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_product = document.querySelectorAll(".button__control_mdel-product");
    button_control_mdel_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"products", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_product = document.querySelectorAll(".button__control_update-product");
    button_control_update_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"products", "name":"", "uincolor":"", "uin":`${elem.value}`};

            let target_table = tb_products_main;
            body.name = findForUpdateInput(`product_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetProducts()}, 100);
        })
    })

    let button_modal = document.querySelectorAll(".button__control_modal-process");
    button_modal.forEach((elem) => {
        elem.addEventListener("click", () => {
            funcInfoTcardprodsOpenModal(elem.value);
        })
    })
}

const addProductsRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo = newRow.insertCell(0); cellInfo.classList = "td td__text_align_center";
    let cellName = newRow.insertCell(1); cellName.classList = "td td__text_align_center";
    let cellBtn  = newRow.insertCell(2); cellBtn.classList  = "td";

    cellInfo.innerHTML = `<button class="button__control button__control_modal-process" value="${uin}"><img class="button__control__img" src="assets/images/info.svg" alt="" title="Инфо"></button>`;
    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="product_name_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-product" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt="" title="Обновить"></button><button class="button__control button__control_mdel button__control_mdel-product${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg" title="Пометить на удаление"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-product");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"products", "uincolor":"", "name":""};

    let name_value = document.getElementById("input_add_products").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
        body.uincolor = "1";

        document.getElementById("input_add_products").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetProducts()}, 100);
    }
})

listenSortSelect("sort_products", "tb_products_main", "products", funcProcessGetProducts);