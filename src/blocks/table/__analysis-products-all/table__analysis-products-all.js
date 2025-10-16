import {funcCommand, listenCustomSelect, sendFiltAnalisys, clearCustomSelect, sortAnalisys, makeSelect, responseProcessor, listenDate, clearTableAll} from '../../../js/common/common.js';
import {customSelect, customSortSelect} from '../../select/select.js';

export const funcGetShipProductsAll = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shipProdsAll", "count":"500", "filt":"", "asort": "uin", "filt":`${JSON.stringify(filt_analysis_products_all)}`};
    funcCommand(body, funcProcessGetShipProductsAll);
}

const funcProcessGetShipProductsAll = (result, respobj) => {
    if(respobj.answ === "" && respobj.succ === 0){alert("Не найдено! Повторите запрос!"); document.getElementById("button_analysis_products_all_reset").click()};
    console.log("Анализ всех изделий:", respobj);

    let tb_id = "tb_analysis_products_all";
    clearTableAll("tb_analysis_products_all");

    for (let key in respobj.answ) {
        let val       = respobj.answ[key];
        let SNset     = val.SNset;
        let SNprod    = val.snprod;
        let NPset     = val.NPset;
        let set       = val.set;
        let product   = val.product;
        let color     = val.color;
        let verapp    = val.vapp;
        let verpp     = val.vpp;
        let mac       = val.mac;
        let status    = val.status.name;
        let uinstatus = val.status.uin;
        let kontr     = val.kontr;
        let date      = val.date;
        let prim      = val.prim;
        let comp      = val.comp;
        let uin       = val.uin;
        addRowColumsShipProductsAll(SNset, SNprod, NPset, set, product, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id);
    }
}

const addRowColumsShipProductsAll =
(SNset, SNprod, NPset, set, product, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSNset   = newRow.insertCell(0);  cellSNset.classList   = "td td__text_align_center";
    let cellSNprod  = newRow.insertCell(1);  cellSNprod.classList  = "td td__text_align_center";
    let cellNPset   = newRow.insertCell(2);  cellNPset.classList   = "td td__text_align_center";
    let cellset     = newRow.insertCell(3);  cellset.classList     = "td";
    let cellproduct = newRow.insertCell(4);  cellproduct.classList = "td";
    let cellColor   = newRow.insertCell(5);  cellColor.classList   = "td";
    let cellverapp  = newRow.insertCell(6);  cellverapp.classList  = "td";
    let cellverpp   = newRow.insertCell(7);  cellverpp.classList   = "td";
    let cellmac     = newRow.insertCell(8);  cellmac.classList     = "td";
    let cellstatus  = newRow.insertCell(9);  cellstatus.classList  = "td";
    let cellkontr   = newRow.insertCell(10); cellkontr.classList   = "td";
    let celldate    = newRow.insertCell(11); celldate.classList    = "td td__text_align_center";
    let cellprim    = newRow.insertCell(12); cellprim.classList    = "td";

    makeSelect("shipproducts_all_select_", uin, status, uinstatus, "statuses_list", "select", cellstatus);
    cellSNset.innerHTML   = SNset;
    cellSNprod.innerHTML  = SNprod;
    cellNPset.innerHTML   = NPset;
    cellset.innerHTML     = set;
    cellproduct.innerHTML = product;
    cellColor.innerHTML   = color;
    cellverapp.innerHTML  = verapp;
    cellverpp.innerHTML   = verpp;
    cellmac.innerHTML     = mac
    cellkontr.innerHTML   = kontr;
    celldate.innerHTML    = `<div class="input__type-date_wrapper"><input class="input__type-text input__type-date" type="date" value="${date}" name="shipproducts_all_date_${uin}"><label for="" class="input__type-date_icon"><img src="assets/images/calendar.svg" alt=""></label></div>`;
    cellprim.innerHTML    = `<input class="input__type-text" type="text" value="${prim}" name="shipproducts_all_prim_${uin}">`;
}

customSelect('analysis_products_all_set_customDropdown', JSON.parse(localStorage.getItem("sets_list")), 'комплект');
customSelect('analysis_products_all_prod_customDropdown', JSON.parse(localStorage.getItem("products_list")), 'изделие');
customSelect('analysis_products_all_contr_customDropdown', JSON.parse(localStorage.getItem("contragents_list")), 'контрагента');
customSelect('analysis_products_all_status_customDropdown', JSON.parse(localStorage.getItem("statuses_list")), 'статус');

let filt_analysis_products_all = [];
let filt_1 = {fld: "uin", on: "sets"};
let filt_2 = {fld: "uin", on: "products"};
let filt_3 = {fld: "uin", on: "contragents"};
let filt_4 = {fld: "uin", on: "statuses"};
let filt_5 = {fld: "date", vald: []};
filt_analysis_products_all.push(filt_5);

listenCustomSelect("analysis_products_all_set_customDropdown", filt_1, [], filt_analysis_products_all);
listenCustomSelect("analysis_products_all_prod_customDropdown", filt_2, [], filt_analysis_products_all);
listenCustomSelect("analysis_products_all_contr_customDropdown", filt_3, [], filt_analysis_products_all);
listenCustomSelect("analysis_products_all_status_customDropdown", filt_4, [], filt_analysis_products_all);
listenDate(document.getElementById('filt_analysis_products_all_date_first'), document.getElementById('filt_analysis_products_all_date_second'), filt_5, [], filt_analysis_products_all);

document.getElementById("button_analysis_products_all_choose").addEventListener("click", () => {
    sendFiltAnalisys(filt_analysis_products_all, 'tb_analysis_products_all', 'shipProdsAll', funcProcessGetShipProductsAll);
})

document.getElementById("button_analysis_products_all_reset").addEventListener("click", () => {
    filt_analysis_products_all.length = 0;
    clearCustomSelect('analysis_products_all_set_customDropdown', 'комплект');
    clearCustomSelect('analysis_products_all_prod_customDropdown', 'изделие');
    clearCustomSelect('analysis_products_all_contr_customDropdown', 'контрагента');
    clearCustomSelect('analysis_products_all_status_customDropdown', 'статус');
    document.getElementById('filt_analysis_products_all_date_first').value = '';
    document.getElementById('filt_analysis_products_all_date_second').value = '';
    funcGetShipProductsAll();
    filt_analysis_products_all.push(filt_5);
})

customSortSelect("sort_analysis_products_all");
sortAnalisys("sort_analysis_products_all", filt_analysis_products_all, "shipProdsAll", funcProcessGetShipProductsAll);