import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';

export const funcGetVerapp = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"verapp", "count":"100"};
    funcCommand(body, funcProcessGetVerapp);
}

const funcProcessGetVerapp = (result, respobj) => {
    if( result === 0 ) return;
    console.log("verapp:", respobj);
    let tb_id = "tb_products_verapp";
    clearTable(tb_id);

    let verapp_list = respobj.answ;
    localStorage.setItem("verapp_list", JSON.stringify(verapp_list));
    for (let key in respobj.answ){
        let set = respobj.answ[key];
        let name = set.name;
        let del = set.del;
        let uin = set.uin;
        addVerappRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_product = document.querySelectorAll(".button__control_mdel-verapp");
    button_control_mdel_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"verapp", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_product = document.querySelectorAll(".button__control_update-verapp");
    button_control_update_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"verapp", "name":"", "uin":`${elem.value}`};

            let target_table = tb_products_verapp;
            body.name = findForUpdateInput(`verapp_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetVerapp()}, 100);
        })
    })
}

const addVerappRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td";
    let cellBtn = newRow.insertCell(1);  cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="verapp_name_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-verapp" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-verapp" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add_product = document.querySelector(".button__control_add-verapp");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":"demo", "meth":"add", "obj":"verapp", "name":""};

    let name_value = document.getElementById("input_add_verapp").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_verapp").value = "";

        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetVerapp()}, 100);
    }
})

listenSortSelect("sort_verapp", "tb_products_verapp", "verapp", funcProcessGetVerapp);