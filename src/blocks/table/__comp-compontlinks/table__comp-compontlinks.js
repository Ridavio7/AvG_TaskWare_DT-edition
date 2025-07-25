import {funcCommand, clearTable, findForUpdateInput, highlightButtonSave, funcProcessOnlyInfo, responseProcessor} from '../../../js/common/common.js';

export const funcGetCompontlinks = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "obj":"compontlinks", "meth":"view", "uincompont":`${uin}`, "count":"100", "sort":"name"}
    funcCommand(body, funcProcessGetCompontlinks);
}

const funcProcessGetCompontlinks = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Сылки:", respobj);

    let tb_id = "tb_modal_link";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj        = respobj.answ[key];
        let name       = obj.name;
        let link       = obj.link;
        let uincompont = obj.uincompont;
        let del        = obj.del;
        let uin        = obj.uin;
        addCompontlinks(name, link, uincompont, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-compontlinks");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"compontlinks", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-compontlinks");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"compontlinks", "uincompont":`${elem.name}`, "name":"", "link":"", "uin":`${elem.value}`};

            let target_table = tb_modal_link;
            body.name = findForUpdateInput(`component_info_link_name_${elem.value}`, target_table);
            body.link = findForUpdateInput(`component_info_link_link_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetCompontlinks(`${elem.name}`)}, 100);
        })
    })
}

const addCompontlinks = (name, link, uincompont, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo = newRow.insertCell(0); cellInfo.classList = "td";
    let cellName = newRow.insertCell(1); cellName.classList = "td";
    let cellLink = newRow.insertCell(2); cellLink.classList = "td";
    let cellBtn  = newRow.insertCell(3); cellBtn.classList  = "td";

    cellInfo.innerHTML = `<a href="${link}" target="_blank"><button class="button__control"><img class="button__control__img" src="assets/images/link.svg" alt=""></button></a>`;
    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="component_info_link_name_${uin}">`;
    cellLink.innerHTML = `<input class="input__type-text" type="text" value="${link}" name="component_info_link_link_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-compontlinks" value="${uin}" name="${uincompont}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-compontlinks${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.getElementById("component_info_add_button_link");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"compontlinks", "name":"", "link":"", "uincompont":""};

    let name_value = document.getElementById("component_info_add_link_name").value
    let link_value = document.getElementById("component_info_add_link_link").value
    let uin_value  = document.getElementById("component_save").value
    if(name_value === "" || link_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name       = name_value;
        body.link       = link_value;
        body.uincompont = uin_value

        document.getElementById("component_info_add_link_name").value = "";
        document.getElementById("component_info_add_link_link").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetCompontlinks(uin_value)}, 100);
    }
})