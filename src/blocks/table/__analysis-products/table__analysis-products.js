import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, findForUpdateSelect, listenFiltSelectAnalisys, sendFiltAnalisys, clearFiltAnalisys, sortAnalisys, makeSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js';
import {addToDropdownPsevdo, psevdoSelect} from '../../select/select.js';

let filt_analysis_products = [];

export const funcGetShipProducts = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"shipProducts", "count":"500", "filt":"", "asort": "uin", "filt":`${JSON.stringify(filt_analysis_products)}`};
    funcCommand(body, funcProcessGetShipProducts);
}

const funcProcessGetShipProducts = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    if(respobj.answ === "" && respobj.succ === 0){alert("Не найдено! Повторите запрос!"); document.getElementById("button_analysis_products_reset").click()};
    console.log("Анализ изделий:", respobj);

    let tb_id = "tb_analysis_products";

    for (let key in respobj.answ) {
        let val       = respobj.answ[key];
        let SNprod    = val.snprod;
        let NPset     = val.NPset;
        let name      = val.product;
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
        addRowColumsShipProducts(SNprod, NPset, name, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id);
    }

    /* функция обновления */
    let button_control_update_ananlysis_product = document.querySelectorAll(".button__control_update-ananlysis-product");
    button_control_update_ananlysis_product.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"shipProducts", "uinstatus":"", "date":"", "prim":"", "uin":`${elem.value}`};

            let target_table = tb_analysis_products;

            body.uinstatus = findForUpdateSelect(target_table, "shipproducts_select_", elem.value);
            body.date      = findForUpdateInput(`shipproducts_date_${elem.value}`, target_table);
            body.prim      = findForUpdateInput(`shipproducts_prim_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            //setTimeout(function(){funcGetShipProducts()}, 100);
        })
    })
}

function addRowColumsShipProducts(SNprod, NPset, name, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellSNprod = newRow.insertCell(0);  cellSNprod.classList = "td td__text_align_center";
    let cellNPset  = newRow.insertCell(1);  cellNPset.classList  = "td td__text_align_center";
    let cellname   = newRow.insertCell(2);  cellname.classList   = "td";
    let cellColor  = newRow.insertCell(3);  cellColor.classList  = "td";
    let cellverapp = newRow.insertCell(4);  cellverapp.classList = "td";
    let cellverpp  = newRow.insertCell(5);  cellverpp.classList  = "td";
    let cellmac    = newRow.insertCell(6);  cellmac.classList    = "td";
    let cellstatus = newRow.insertCell(7);  cellstatus.classList = "td td__text_align_center";
    let cellkontr  = newRow.insertCell(8);  cellkontr.classList  = "td";
    let celldate   = newRow.insertCell(9);  celldate.classList   = "td td__text_align_center";
    let cellprim   = newRow.insertCell(10); cellprim.classList   = "td td__text_align_center";
    let cellBtn    = newRow.insertCell(11); cellBtn.classList    = "td";

    makeSelect("shipproducts_select_", uin, status, uinstatus, "statuses_list", "select", cellstatus);
    cellSNprod.innerHTML = SNprod;
    cellNPset.innerHTML  = NPset;
    cellname.innerHTML   = name;
    cellColor.innerHTML  = color;
    cellverapp.innerHTML = verapp;
    cellverpp.innerHTML  = verpp;
    cellmac.innerHTML    = mac;
    cellkontr.innerHTML  = kontr;
    celldate.innerHTML   = `<input class="input__type-text input__type-date" type="date" value="${date}" name="shipproducts_date_${uin}">`;
    cellprim.innerHTML   = `<input class="input__type-text" type="text" value="${prim}" name="shipproducts_prim_${uin}">`;
    cellBtn.innerHTML    = `<button class="button__control button__control_update button__control_update-ananlysis-product" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button>`;
}

addToDropdownPsevdo("filt_analysis_products_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_analysis_products_sets");

addToDropdownPsevdo("filt_analysis_products_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_analysis_products_products");

addToDropdownPsevdo("filt_analysis_products_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_analysis_products_components");

addToDropdownPsevdo("filt_analysis_products_contragents_items", JSON.parse(localStorage.getItem("contragents_list")));
psevdoSelect("filt_analysis_products_contragents");

addToDropdownPsevdo("filt_analysis_products_status_items", JSON.parse(localStorage.getItem("statuses_list")));
psevdoSelect("filt_analysis_products_status");

let button_analysis_products_choose = document.getElementById("button_analysis_products_choose");
button_analysis_products_choose.addEventListener("click", () => {
    sendFiltAnalisys(filt_analysis_products, 'tb_analysis_products', 'shipProducts', funcProcessGetShipProducts);
});

let button_analysis_products_reset = document.getElementById("button_analysis_products_reset");
button_analysis_products_reset.addEventListener("click", () => {
    filt_analysis_products.length = 0;
    clearFiltAnalisys('filt_analysis_products_sets_items', 'filt_analysis_products_products_items', 'filt_analysis_products_components_items', 'filt_analysis_products_contragents_items',
    'filt_analysis_products_status_items', "filt_analysis_products_date_first", "filt_analysis_products_date_second", 'tb_analysis_products', filt_analysis_products, funcGetShipProducts())
});

listenFiltSelectAnalisys("filt_analysis_products_sets_items", "filt_analysis_products_products_items", 'filt_analysis_products_components_items', "filt_analysis_products_contragents_items",
"filt_analysis_products_status_items", "filt_analysis_products_date_first", "filt_analysis_products_date_second", filt_analysis_products)

sortAnalisys("sort_analysis_products", "tb_analysis_products", filt_analysis_products, "shipProducts", funcProcessGetShipProducts);

/* переклуючение таблиц */
const tb1 = document.querySelector('.analysis-products');
const tb2 = document.querySelector('.analysis-products-all');

const radioButtons = document.querySelectorAll(
    'input[name="switch-table__radio"]',
);

radioButtons.forEach(radio => {
    radio.addEventListener('click', () => {
        if (document.getElementById('switch_tb_1').checked) {
            tb1.style.display = 'block';
            tb2.style.display = 'none';
        } else {
            tb1.style.display = 'none';
            tb2.style.display = 'block';
        }
    });
})