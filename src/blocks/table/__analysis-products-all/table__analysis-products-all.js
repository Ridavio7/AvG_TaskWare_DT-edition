import {funcCommand, listenFiltSelectAnalisys, sendFiltAnalisys, clearFiltAnalisys, sortAnalisys, makeSelect} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';

let filt_analysis_products_all = [];

export const funcGetShipProductsAll = () => {
    let body  =  {"user":"demo", "meth":"view", "obj":"shipProdsAll", "count":"500", "filt":"", "asort": "uin", "filt":`${JSON.stringify(filt_analysis_products_all)}`};
    funcCommand(body, funcProcessGetShipProductsAll);
}

const funcProcessGetShipProductsAll = (result, respobj) => {
    if( result === 0 ) return;
    if(respobj.answ === ""){alert("Не найдено! Повторите запрос!"); funcGetShipProductsAll()};
    console.log("Анализ всех изделий:", respobj);

    let tb_id = "tb_analysis_products_all";
    for (let key in respobj.answ) {
        let val = respobj.answ[key];
        let SNset = val.SNset;
        let SNprod = val.snprod;
        let NPset = val.NPset;
        let set = val.set;
        let product = val.product;
        let color = val.color;
        let verapp = val.vapp;
        let verpp = val.vpp;
        let mac = val.mac;
        let status = val.status.name;
        let uinstatus = val.status.uin;
        let kontr = val.kontr;
        let date = val.date;
        let prim = val.prim;
        let comp = val.comp;
        let uin = val.uin;
        addRowColumsShipProductsAll(SNset, SNprod, NPset, set, product, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id);
    }
}

const addRowColumsShipProductsAll =
(SNset, SNprod, NPset, set, product, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSNset   = newRow.insertCell(0);  cellSNset.classList   = "td";
    let cellSNprod  = newRow.insertCell(1);  cellSNprod.classList  = "td";
    let cellNPset   = newRow.insertCell(2);  cellNPset.classList   = "td";
    let cellset     = newRow.insertCell(3);  cellset.classList     = "td";
    let cellproduct = newRow.insertCell(4);  cellproduct.classList = "td";
    let cellColor   = newRow.insertCell(5);  cellColor.classList   = "td";
    let cellverapp  = newRow.insertCell(6);  cellverapp.classList  = "td";
    let cellverpp   = newRow.insertCell(7);  cellverpp.classList   = "td";
    let cellmac     = newRow.insertCell(8);  cellmac.classList     = "td";
    let cellstatus  = newRow.insertCell(9);  cellstatus.classList  = "td";
    let cellkontr   = newRow.insertCell(10); cellkontr.classList   = "td";
    let celldate    = newRow.insertCell(11); celldate.classList    = "td";
    let cellprim    = newRow.insertCell(12); cellprim.classList    = "td";

    makeSelect("shipproducts_all_select_", uin, status, uinstatus, "statuses_list", "select", cellstatus);

    celldate.innerHTML = `<input class="input__type-text" type="date" value="${date}" name="shipproducts_all_date_${uin}">`;
    cellprim.innerHTML = `<input class="input__type-text" type="text" value="${prim}" name="shipproducts_all_prim_${uin}">`;

    let cellSNsettext    = document.createTextNode(SNset);   cellSNset.appendChild(cellSNsettext);
    let cellSNprodtext   = document.createTextNode(SNprod);  cellSNprod.appendChild(cellSNprodtext);
    let cellNPsettext    = document.createTextNode(NPset);   cellNPset.appendChild(cellNPsettext);
    let cellsettext      = document.createTextNode(set);     cellset.appendChild(cellsettext);
    let cellproducttext  = document.createTextNode(product); cellproduct.appendChild(cellproducttext);
    let cellColortext    = document.createTextNode(color);   cellColor.appendChild(cellColortext);
    let cellverapptext   = document.createTextNode(verapp);  cellverapp.appendChild(cellverapptext);
    let cellverpptext    = document.createTextNode(verpp);   cellverpp.appendChild(cellverpptext);
    let cellmactext      = document.createTextNode(mac);     cellmac.appendChild(cellmactext);
    let cellkontrtext    = document.createTextNode(kontr);   cellkontr.appendChild(cellkontrtext);
}

addToDropdownPsevdo("filt_analysis_products_all_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_analysis_products_all_sets");

addToDropdownPsevdo("filt_analysis_products_all_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_analysis_products_all_products");

addToDropdownPsevdo("filt_analysis_products_all_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_analysis_products_all_components");

addToDropdownPsevdo("filt_analysis_products_all_contragents_items", JSON.parse(localStorage.getItem("contragents_list")));
psevdoSelect("filt_analysis_products_all_contragents");

addToDropdownPsevdo("filt_analysis_products_all_status_items", JSON.parse(localStorage.getItem("statuses_list")));
psevdoSelect("filt_analysis_products_all_status");

let button_analysis_products_all_choose = document.getElementById("button_analysis_products_all_choose");
button_analysis_products_all_choose.addEventListener("click", () => {
    sendFiltAnalisys(filt_analysis_products_all, 'tb_analysis_products_all', 'shipProdsAll', funcProcessGetShipProductsAll);
});

let button_analysis_products_all_reset = document.getElementById("button_analysis_products_all_reset");
button_analysis_products_all_reset.addEventListener("click", () => {
    filt_analysis_products_all.length = 0;
    clearFiltAnalisys('filt_analysis_products_all_sets_items', 'filt_analysis_products_all_products_items', 'filt_analysis_products_all_components_items', 'filt_analysis_products_all_contragents_items',
        'filt_analysis_products_all_status_items', "filt_analysis_products_all_date_first", "filt_analysis_products_all_date_second", 'tb_analysis_products_all', filt_analysis_products_all, funcGetShipProductsAll());
});

listenFiltSelectAnalisys('filt_analysis_products_all_sets_items', 'filt_analysis_products_all_products_items', 'filt_analysis_products_all_components_items', 'filt_analysis_products_all_contragents_items',
'filt_analysis_products_all_status_items', "filt_analysis_products_all_date_first", "filt_analysis_products_all_date_second", filt_analysis_products_all);

sortAnalisys("sort_analysis_products_all", "tb_analysis_products_all", filt_analysis_products_all, "shipProdsAll", funcProcessGetShipProductsAll);