import {funcCommand, clearTableAll, addToDropdown, removeOptionsSetValue} from '../../../js/common/common.js.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';
import {dragElement} from '../modal.js';
import {funcFoundPlusComponents} from '../../table/__comp-found/table__comp-found.js';

let found_plus_modal  = document.getElementById("found_plus_modal");
let found_plus_close  = document.getElementById("found_plus_close");
let found_plus_select = document.getElementById("found_plus_select");
let found_plus_input  = document.getElementById("found_plus_input");
let found_plus_button = document.getElementById("found_plus_button");

let found_tree;
let found_table;
let found_table_comp;
let found_input_id;

found_plus_close.addEventListener("click", () => {
    found_plus_modal.style.display = "none";

    removeOptionsSetValue("found_plus_select", "-- Выберите тип --");
    clearTableAll("found_plus_tb");
    found_plus_input.value = "";
})

dragElement(found_plus_modal);

export const funcFoundPlusOpenModal = (tb_id, tb_id_comp, tree_id, input_id) => {
    found_plus_modal.style.display = "block";

    removeOptionsSetValue("found_plus_select", "-- Выберите тип --");
    addToDropdown(found_plus_select, 'typelm_list');

    found_table      = tb_id;
    found_table_comp = tb_id_comp;
    found_tree       = tree_id;
    found_input_id   = input_id;
}

found_plus_button.onclick = function(){
    let props = [];
    let types_props_names_inputs  = document.querySelectorAll(".input__type-text_types-props-name");

    for(let key in types_props_names_inputs){
        let arr   = {};
        let obj   = types_props_names_inputs[key];
        let uin   = obj.name;
        let value = obj.parentElement;

        if(value != undefined){
            value = value.nextElementSibling.children[0];
            if(value.nodeName === "INPUT"){
                if(value != ""){
                    arr.uin = uin;
                    arr.val = value.value;
                    if(value.value.length != 0){props.push(arr);}
                }
            } else {
                let val = [];
                let checkboxes = value.getElementsByTagName("input");
                for(let key in checkboxes){
                    if(checkboxes[key].checked === true){
                        let chbv = checkboxes[key].nextElementSibling.textContent;
                        val.push(chbv);
                    }
                }
                arr.uin = uin;
                arr.val = val;
                if(val.length != 0){props.push(arr);}
            }
        }
    }

    let props_str = JSON.stringify(props);

    setTimeout(() => {
        funcFoundPlusComponents("found_plus_input", "found_plus_select", props_str, found_table, found_table_comp, found_tree, found_input_id);
    }, 500)
}

found_plus_select.addEventListener("change", (elem) => {
    let body  =  {"user":"demo", "meth":"view", "obj":"typesprops", "count":"100", "uintypes":`${elem.target.value}`};
    funcCommand(body, funcProcessGetTypesProps);
})

const funcProcessGetTypesProps = (result, respobj) => {
    if( result === 0 ) return;
    console.log("TypesProps поиска:", respobj);

    let tb_id = "found_plus_tb";
    clearTableAll(tb_id);

    for (let key in respobj.answ){
        let obj      = respobj.answ[key];
        let name     = obj.name;
        let uin      = obj.uin;
        addFoundTypesProps(name, uin, tb_id);
    }
}

const addFoundTypesProps = (name, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName  = newRow.insertCell(0); cellName.classList  = "td";
    let cellValue = newRow.insertCell(1); cellValue.classList = "td";
    let cellBtn   = newRow.insertCell(2); cellBtn.classList   = "td";

    cellName.innerHTML  = `<input class="input__type-text input__type-text_types-props-name" type="text" value="${name}" name=${uin} disabled>`;

    let body  =  {"user":"demo", "meth":"view", "obj":"enums", "uinprops":`${uin}`, "count":"100", "sort":"uin", "all":"0"}
    funcCommand(body, funcProcessGetInfoEnums);

    function funcProcessGetInfoEnums(result, respobj){
        if( result === 0 ) return;
        console.log("Значения в поиске:", respobj);

        if(respobj.answ === ''){
            cellValue.innerHTML = `<input class="input__type-text input__type-text_title input__type-text_types-props-value" type="text" value="">`;
        } else {
            cellValue.innerHTML = `<div class="select select__filter select-props-value" id="list_enums_prop_${uin}" tabindex="100">
                        <span class="select__anchor">-- Выберите значения --</span>
                        <ul class="select__items" id="list_enums_prop_${uin}_items"></ul>
                    </div>`

            addToDropdownPsevdo(`list_enums_prop_${uin}_items`, respobj.answ);
            psevdoSelect(`list_enums_prop_${uin}`);
        }
    }
}