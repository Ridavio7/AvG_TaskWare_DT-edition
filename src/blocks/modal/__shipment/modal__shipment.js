import {dragElement} from '../modal.js';

let shipment_modal      = document.getElementById("shipment_modal");
let shipment_close      = document.getElementById("shipment_close");
let shipment_button_sub = document.getElementById("shipment_button_sub");

export let zapros_set = [], forModal_set = [], zapros_product = [], forModal_product = [];

shipment_close.onclick = () => {
    shipment_modal.style.display = "none";
    clearModalTable();
}

shipment_close.ontouchend = (e) => {
    e.preventDefault();
    shipment_modal.style.display = "none";
    clearModalTable();
}

dragElement(shipment_modal);

window.onclick = function(event) {
    if (event.target == shipment_modal) {
        clearModalTable();
        shipment_modal.style.display = "none";
    }
}

const clearModalTable  = () => {
    localStorage.clear();
    zapros_set.length = 0;
    forModal_set.length = 0;
    zapros_product.length = 0;
    forModal_product.length = 0;

    let table = document.getElementById('shipment_main_tb_modal');
    let newTbody = document.createElement('tbody');
    newTbody.id = "shipment_tb_modal";
    table.replaceChild(newTbody, table.getElementsByTagName('tbody')[0]);
}

shipment_button_sub.onclick = () => {
    if(zapros_set.length === 0 && zapros_product.length === 0){
        alert("Вы ничего не выбрали!");
    } else {
        window.location='result_table.html';
    }
}

export const getCheckbox = (tb_id, input_id, zapros, forModal, storage_arr) => {
    let checkbox_set = tb_id.getElementsByClassName("checkbox");
    for (let key of checkbox_set) {
        if(key.checked === true){
            let input_set = document.getElementById(`${input_id}${key.name}`);
            let arr_zapros = {};
            let arr_forModal = {};
            arr_zapros.uin = key.name;
            arr_zapros.count = input_set.value;
            arr_forModal.name = key.value;
            arr_forModal.count = input_set.value;
            zapros.push(arr_zapros);
            forModal.push(arr_forModal);
        }
    }
    console.log(zapros);

    localStorage.setItem(storage_arr, JSON.stringify(zapros));
    pushSetsInModal(forModal);
}

const pushSetsInModal = (arr) => {
    let tb_id = "shipment_tb_modal";
    for (let key in arr) {
        let set = arr[key];
        let name = set.name;
        let count = set.count;
        addRowInModal(name, count, tb_id);
    }
}

const addRowInModal = (name, count, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName  = newRow.insertCell(0); cellName.classList  = "td";
    let cellCount = newRow.insertCell(1); cellCount.classList = "td";

    cellName.innerHTML  = name;
    cellCount.innerHTML = count;
}