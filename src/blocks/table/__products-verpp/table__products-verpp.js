import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';

export const funcGetVerpp = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"verpp", "count":"100"};
    funcCommand(body, funcProcessGetVerpp);
}

const funcProcessGetVerpp = (result, respobj) => {
    if( result === 0 ) return;
    console.log("verpp:", respobj);
    let tb_id = "tb_products_verpp";
    clearTable(tb_id);

    let verpp_list = respobj.answ;
    localStorage.setItem("verpp_list", JSON.stringify(verpp_list));
    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addVerppRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_product = document.querySelectorAll(".button__control_mdel-verpp");
    button_control_mdel_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"verpp", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_product = document.querySelectorAll(".button__control_update-verpp");
    button_control_update_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"verpp", "name":"", "uin":`${elem.value}`};

            let target_table = tb_products_verpp;
            body.name = findForUpdateInput(`verpp_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetVerpp()}, 100);
        })
    })
}

const addVerppRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td td__text_align_center";
    let cellBtn = newRow.insertCell(1);  cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="verpp_name_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-verpp" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-verpp${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-verpp");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"verpp", "name":""};

    let name_value = document.getElementById("input_add_verpp").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_verpp").value = "";

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetVerpp()}, 100);
    }
})

listenSortSelect("sort_verpp", "tb_products_verpp", "verpp", funcProcessGetVerpp);