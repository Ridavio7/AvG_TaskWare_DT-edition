import {funcCommand} from '../../../js/common/common.js';

export const funcGetSets = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"sets", "count":"100" };
    funcCommand( body, funcProcessGetSets );
}

const funcProcessGetSets = ( result, respobj ) => {
    if( result === 0 ) return;
    let tb_id = "tb_sets";

    console.log("Комплекты:", respobj);
    for (let key in respobj.answ) {
        let set = respobj.answ[key];
        let del = set.del;
        if(del === 0){
            let uin = set.uin;
            let name = set.name;
            addSetsRow(uin, name, tb_id);
        }
    }
}

const addSetsRow = (uin, name, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellCheckbox = newRow.insertCell(0); cellCheckbox.classList = "td";
    let cellName     = newRow.insertCell(1); cellName.classList     = "td";
    let cellInput    = newRow.insertCell(2); cellInput.classList    = "td";

    cellCheckbox.innerHTML = `<input type="checkbox" class="checkbox" id="set_${uin}" name="${uin}" value="${name}"><label for="set_${uin}"></label>`;
    cellName.innerHTML = name;
    cellInput.innerHTML = `<input class="input__type-text input__type-text_title" type="text" id="input_set_${uin}" name="${uin}">`;
}