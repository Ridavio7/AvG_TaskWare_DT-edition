import {funcCommand} from '../../../js/common/common.js';

export const funcGetProducts = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"products", "count":"100" };
    funcCommand( body, funcProcessGetProducts );
}

const funcProcessGetProducts = ( result, respobj ) => {
    if( result === 0 ) return;
    let tb_id = "tb_products";

    console.log("Изделия:", respobj);
    for (let key in respobj.answ) {
        let set = respobj.answ[key];
        let del = set.del;
        if(del === 0){
            let uin = set.uin;
            let name = set.name;
            addProductsRow(uin, name, tb_id);
        }
    }
}

const addProductsRow = (uin, name, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellCheckbox = newRow.insertCell(0); cellCheckbox.classList = "td";
    let cellName     = newRow.insertCell(1); cellName.classList     = "td";
    let cellInput    = newRow.insertCell(2); cellInput.classList    = "td";

    cellCheckbox.innerHTML = `<input type="checkbox" class="checkbox" id="product_${uin}" name="${uin}" value="${name}"><label for="product_${uin}"></label>`;
    cellName.innerHTML = name;
    cellInput.innerHTML = `<input class="input__type-text input__type-text_title" type="text" id="input_product_${uin}" name="${uin}">`;
}