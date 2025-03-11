import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, highlightButtonSave, makeSelect, clearTableAll} from '../../../js/common/common.js';

export const funcGetLentapp = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"lentapp", "count":"100", "asort":"datetm"};
    funcCommand(body, funcProcessGetLentapp);
}

const funcProcessGetLentapp = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Лента:", respobj);
    
    let tb_id = "tb_events";
    clearTableAll(tb_id);

    let lentapp_list = respobj.answ;
    localStorage.setItem("lentapp_list", JSON.stringify(lentapp_list));
    for (let key in respobj.answ) {
        let obj          = respobj.answ[key];
        let nameproduct  = obj.name;
        let uinproduct   = obj.uinproduct;
        let nametechproc = obj.techprocname;
        let uintechproc  = obj.uintechproc;
        let nameuser     = obj.username;
        let uinuser      = obj.uinuser;
        let count        = obj.count;
        let datetm       = obj.datetm;
        let prim         = obj.prim;
        let del          = obj.del;
        let uin          = obj.uin;
        addLentappRow(nameproduct, uinproduct, nametechproc, uintechproc, nameuser, uinuser, count, datetm, prim, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel_lentapp = document.querySelectorAll(".button__control_mdel-lentapp");
    button_control_mdel_lentapp.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"mdel", "obj":"lentapp", "uin":`${elem.value}`};

            if(elem.style.background === "red"){
                elem.style.background = "inherit";
            } else {
                elem.style.background = "red"
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_lentapp = document.querySelectorAll(".button__control_update-lentapp");
    button_control_update_lentapp.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":"demo", "meth":"update", "obj":"lentapp", "uinuser":"", "uinproduct":"", "uintechproc":"", "count":"", "datetm":"", "prim":"", "uin":`${elem.value}`};

            let target_table = tb_events;
            body.uinuser     = findForUpdateSelect(target_table, "lentapp_user_select_", elem.value);
            body.uinproduct  = findForUpdateSelect(target_table, "lentapp_prod_select_", elem.value);
            body.uintechproc = findForUpdateSelect(target_table, "lentapp_techproc_select_", elem.value);
            body.count       = findForUpdateInput(`lentapp_count_${elem.value}`, target_table);
            body.prim        = findForUpdateInput(`lentapp_prim_${elem.value}`, target_table);
            let date_value   = document.getElementsByName(`lentapp_date_${elem.value}`)[0].value.split('-').join("");
            let time_value   = document.getElementsByName(`lentapp_time_${elem.value}`)[0].value;
            body.datetm      = `${date_value} ${time_value}`;
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetLentapp()}, 100);
        })
    })
}

const addLentappRow = (nameproduct, uinproduct, nametechproc, uintechproc, nameuser, uinuser, count, datetm, prim, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellUser  = newRow.insertCell(0); cellUser.classList  = "td";
    let cellProd  = newRow.insertCell(1); cellProd.classList  = "td";
    let cellProc  = newRow.insertCell(2); cellProc.classList  = "td";
    let cellCount = newRow.insertCell(3); cellCount.classList = "td";
    let cellDate  = newRow.insertCell(4); cellDate.classList  = "td";
    let cellPrim  = newRow.insertCell(5); cellPrim.classList  = "td";
    let cellBtn   = newRow.insertCell(6); cellBtn.classList   = "td";

    makeSelect("lentapp_user_select_", uin, nameuser, uinuser, "users_list", "select", cellUser);
    makeSelect("lentapp_prod_select_", uin, nameproduct, uinproduct, "products_list", "select", cellProd);
    makeSelect("lentapp_techproc_select_", uin, nametechproc, uintechproc, "techproc_list", "select", cellProc);
    cellCount.innerHTML = `<input class="input__type-text" type="text" value="${count}" name="lentapp_count_${uin}">`;
    let date = datetm.split(" ")[0];
    let time = datetm.split(" ")[1];
    cellDate.innerHTML  = `<input class="input__type-text" type="date" value="${date}" name="lentapp_date_${uin}"><input class="input__type-text" type="time" value="${time}" name="lentapp_time_${uin}">`;
    cellPrim.innerHTML  = `<input class="input__type-text" type="text" value="${prim}" name="lentapp_prim_${uin}">`;

    let bx_color; del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update-lentapp" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel-lentapp" style="background:${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

document.getElementById("sort_events").addEventListener('change', function(){
    clearTableAll("tb_events");

    let option = this.selectedIndex;
    switch (option){
        case 0:
        let body0  =  {"user":"demo", "meth":"view", "obj":"lentapp", "count":"5000", "asort":"datetm"};
        funcCommand(body0, funcProcessGetLentapp);
        break;
        case 1:
        let body1  =  {"user":"demo", "meth":"view", "obj":"lentapp", "count":"5000", "sort":"datetm"};
        funcCommand(body1, funcProcessGetLentapp);
        break;
        case 2:
        let body2  =  {"user":"demo", "meth":"view", "obj":"lentapp", "count":"5000", "asort":"datetm"};
        funcCommand(body2, funcProcessGetLentapp);
        break;
    }
});