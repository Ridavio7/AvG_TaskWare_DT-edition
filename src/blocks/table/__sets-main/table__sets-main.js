/*import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, sendFilt, clearFilt, listenSelect, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js';
import {addToDropdownPsevdo, addToDropdownPsevdoAnotherList, psevdoSelect} from '../../select/select.js';

export const funcGetSets = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"sets", "count":"100", "filt":`${JSON.stringify(filt_sets)}`};
    funcCommand(body, funcProcessGetSets);
}

const funcProcessGetSets = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("Комплекты:", respobj);

    let tb_id = "tb_sets_info";
    clearTable(tb_id);

    let sets_list = respobj.answ;
    localStorage.setItem("sets_list", JSON.stringify(sets_list));

    let model_tain_nf = [];
    for(let key in respobj.answ){
        let set = respobj.answ[key];
        if(set.del === 0){
            let model = set.model_train;
            model_tain_nf.push(model);
        }
    }
    let model_train = Array.from(new Set(model_tain_nf.map(model_tain_nf => JSON.stringify(model_tain_nf)))).map(model_tain_nf => JSON.parse(model_tain_nf));
    localStorage.setItem("model_train", JSON.stringify(model_train));

    for (let key in respobj.answ) {
        let set = respobj.answ[key];
        let name = set.name;
        let other = set.model_train;
        let del = set.del;
        let uin = set.uin;
        addSetsRow(name, other, del, uin, tb_id);
    }

    let button_control_mdel_set = document.querySelectorAll(".button__control_mdel-set");
    button_control_mdel_set.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"sets", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    let button_control_update_set = document.querySelectorAll(".button__control_update-set");
    button_control_update_set.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"sets", "name":"", "model_train":"", "uin":`${elem.value}`};

            let target_table = tb_sets_info;
            body.name = findForUpdateInput(`set_name_${elem.value}`, target_table);
            body.model_train = findForUpdateInput(`model_train_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetSets()}, 100); 
        })
    })
}

const addSetsRow = (name, other, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName  = newRow.insertCell(0); cellName.classList  = "td td__text_align_center";
    let cellOther = newRow.insertCell(1); cellOther.classList = "td td__text_align_center";
    let cellBtn   = newRow.insertCell(2); cellBtn.classList   = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="set_name_${uin}">`;

    other === "" ? other = "Отсутствует" : other = other;
    cellOther.innerHTML = `<input class="input__type-text" type="text" value="${other}" name="model_train_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-set" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-set${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

psevdoSelect("filt_sets_set");
addToDropdownPsevdo("filt_sets_set_items", JSON.parse(localStorage.getItem("sets_list")));

psevdoSelect("filt_sets_train");
addToDropdownPsevdoAnotherList("filt_sets_train_items", JSON.parse(localStorage.getItem("model_train")), "mt_");

let button_sets_choose = document.getElementById("button_sets_choose");
button_sets_choose.addEventListener("click", () => {
    sendFilt(filt_sets, 'tb_sets_info', 'sets', funcProcessGetSets);
});

let button_sets_reset = document.getElementById("button_sets_reset");
button_sets_reset.addEventListener("click", () => {
    filt_sets.length = 0;
    clearFilt(filt_sets, 'filt_sets_set_items', 'filt_sets_train_items', 'filt_sets_train_items', 'tb_sets_info', funcGetSets());
});

let select_1 = document.getElementById("filt_sets_set_items");
let select_2 = document.getElementById("filt_sets_train_items");
let filt_sets = []; let val_1 = [], val_2 = [],
filt_1   = {fld: "uin", on: "sets"},
filt_2   = {fld: "model_train"};

listenSelect(select_1, filt_1, val_1, filt_sets);
listenSelect(select_2, filt_2, val_2, filt_sets);

let button_control_add_set = document.querySelector(".button__control_add-set");
button_control_add_set.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"sets", "name":"", "model_train":""};

    let name_value = document.getElementById("input_add_sets").value
    let model_train_value = document.getElementById("input_add_sets_mt").value

    if(name_value === "" || model_train_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;
        body.model_train = model_train_value;

        document.getElementById("input_add_sets").value = "";
        document.getElementById("input_add_sets_mt").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetSets()}, 100);
    }
})

listenSortSelect("sort_sets", "tb_sets_info", "sets", funcProcessGetSets, filt_sets);*/