/* общие */
import '../blocks/#common/common.styles.scss';
/* шапка */
import '../blocks/header/header.scss';
import '../blocks/header/header.js';
/* боковая панель */
import '../blocks/sidebar/sidebar.scss';
import '../blocks/sidebar/__task/sidebar__task.scss';
/* кнопки */
import '../blocks/button/__control/button__control.scss';
import '../blocks/button/__control/_modal/button__control_modal.scss';
import '../blocks/button/__tab/button__tab.scss';
import '../blocks/button/__tab/button__tab.js';
import '../blocks/button/__select/button__select.scss'
/* input */
import '../blocks/input/__type-text/input__type-text.scss';
import '../blocks/input/__type-text/_modal/input__type-text_modal.scss';
import '../blocks/input/__type-checkbox/input__type-checkbox.scss';
import '../blocks/input/__type-date/input__type-date.scss';
import '../blocks/input/__type-time/input__type-time.scss';
import '../blocks/input/__type-radio/input__type-radio.scss';
/* select */
import '../blocks/select/select.scss';
import '../blocks/select/select.js';
import '../blocks/select/_modal/select_modal.scss';
/* модальные окна */
import '../blocks/modal/modal.scss';
/* таблицы */
import '../blocks/table/table.scss';
import '../blocks/table/__task/table__task.scss';

import {funcCommand, makeSelect, findForUpdateSelect, findForUpdateInput, addToDropdown } from '../js/common/common.js.js';

window.onload = function(){
    funcGetResTable();
}

/* отправка запроса для выбранных сетов/изделий */
function funcGetResTable(){
    let zapros_sets = localStorage.getItem("zapros_set_value");
    let zapros_products = localStorage.getItem("zapros_product_value");
    let contragent = localStorage.getItem("contragent_uin");

    let body  =  {"user":"demo", "meth":"ship", "contr":`${contragent}`, "zaprS":`${zapros_sets}`, "zaprP":`${zapros_products}`};
    funcCommand( body, funcProcessGetResTable );
}

/* обработка запроса для выбранных сетов/изделий */
function funcProcessGetResTable(result, respobj){
    //localStorage.removeItem("zapros_set_value"); 
    //localStorage.removeItem("zapros_product_value");
    if( result === 0 ) return;
    console.log(respobj);

    if(respobj.succ === 1){
        alert("Все успешно, прошла отгрузка");
        funcProcessGetResTableSets(result, respobj);
        funcProcessGetResTableProducts(result, respobj);
    } else if(respobj.succ === 0){
        let answ = [];
        for(let key in respobj.answF){
            let name = respobj.answF[key].name;
            answ.push(name);
        }
        alert(`Не хватает наклеек у изделия(-й) ${answ}`);
    } else if(respobj.succ === 2){
        let answ = (respobj.user).toString();
        alert(`Базу занял ${answ}`);
    } else if(respobj.succ === 3){
        alert("Сервер не смог заблокировать базу для текущей отгрузки, ждем пока освободиться");
    } else if(respobj.succ === 4){
        alert("Вы ничего не отгружаете! Вернитесь и выберете изделия для отгрузки!");
    }
}

/* отправка запроса для выбранных сетов/изделий */
function funcProcessGetResTableSets(result, respobj){
    if( result === 0 ) return;
    console.log(respobj.answS);
    
    let div_tb_id = "wrapper_tb_shipment_sets";
    let div = document.getElementById(div_tb_id);
    
    for (let key in respobj.answS) {
        let table_head = document.createElement("table");
        table_head.className = "table";

        let row_head   = table_head.insertRow(-1);
        row_head.className = "table";
        row_head.innerHTML = '<td class="td table__content_head"><img src="assets/images/arrow_sidebar_2.svg"></td></td><td class="td">SN отгрузки</td><td class="td">№ в партии</td><td class="td">Комплект</td><td class="td">Статус</td><td class="td">Получатель</td><td class="td">Дата</td><td class="td">Примечание</td><td></td>';
    
        div.append(table_head);

        let val       = respobj.answS[key];
        let NPset     = val.NPset;
        let SNset     = val.SNset;
        let name      = val.set;
        let status    = val.status.name;
        let statusUin = val.status.uin;
        let kontr     = val.kontr;
        let date      = val.date;
        let prim      = val.prim;
        let uin       = val.uin;
        let comp      = val.comp;
        addSetsRow(NPset, SNset, name, status, statusUin, kontr, date, prim, uin, table_head, div_tb_id);

        let table_content = document.createElement("table");
        table_content.className = "table table__content_set";
        table_content.id = `table_content_set_${uin}`;

        let row_content = table_content.insertRow(-1);
        row_content.className = "table";
        row_content.innerHTML = '<td class="td"></td><td class="td">SN изделия</td><td class="td">Изделие</td><td class="td">Цвет</td>';
    
        table_head.after(table_content);

        for(let key in comp){
            let val      = comp[key];
            let prod     = val.prod;
            let SNprod   = val.snprod;
            let color    = val.color.name;
            let colorUin = val.color.uin;
            let uinPr    = val.uinpr;

            addSetsRowChild(prod, SNprod, color, colorUin, uinPr, table_content);
        }
    }

    //div.getElementsByClassName("table_head")[0].firstChild.firstChild.style.visibility = "visible";
    div.querySelectorAll(".table__content_head").forEach(el=>{
        el.addEventListener("click",e=>{
            let action = e.currentTarget.parentNode.parentNode.parentNode.nextElementSibling.classList.toggle("active");
            action === true ?e.srcElement.style.transform = "rotate(-180deg)" : e.srcElement.style.transform = "none";
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-ship-sets");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let arrpr_val  = JSON.stringify(findForUpdateSelectProdInSet(elem.value));
            let body  =  {"user":"demo", "meth":"update", "obj":"shipSets", "uinstatus":"", "date":"", "prim":"", "arrpr":`${arrpr_val}`, "uin":`${elem.value}`};
        
            let target_table = wrapper_tb_shipment_sets;
        
            body.uinstatus = findForUpdateSelect(target_table, "ship_sets_status_select_", elem.value);
            body.date      = findForUpdateInput(`ship_sets_date_${elem.value}`, target_table);
            body.prim      = findForUpdateInput(`ship_sets_prim_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })
}

function findForUpdateSelectProdInSet(uin){
    let table_products = document.getElementById(`table_content_set_${uin}`);
    let selects_products = table_products.getElementsByTagName("select");
    let arrpr = [];
    for(let key in selects_products){
        let color_date = {};
        let val = selects_products[key];
        color_date.uincolor = val.value;
        color_date.uinpr    = val.id;
        arrpr.push(color_date)
    }

    let filt_arrpr = arrpr.splice(0, arrpr.length - 3);
    return filt_arrpr;
}

function addSetsRow(NPset, SNset, name, status, statusUin, kontr, date, prim, uin, table_head, div_tb_id){
    let newRow     = table_head.insertRow(-1);
    newRow.classList = "tr";

    let cellSlide  = newRow.insertCell(0); cellSlide.classList = "td";
    let cellNPset  = newRow.insertCell(1); cellNPset.classList = "td";
    let cellSNset  = newRow.insertCell(2); cellSNset.classList = "td";
    let cellName   = newRow.insertCell(3); cellName.classList = "td";
    let cellStatus = newRow.insertCell(4); cellStatus.classList = "td";
    let cellKontr  = newRow.insertCell(5); cellKontr.classList = "td";
    let cellDate   = newRow.insertCell(6); cellDate.classList = "td";
    let cellPrim   = newRow.insertCell(7); cellPrim.classList = "td";
    let cellButton = newRow.insertCell(8); cellButton.classList = "td";

    makeSelect("ship_sets_status_select_", uin, status, statusUin, "statuses_list", "select", cellStatus);
    cellDate.innerHTML   = `<input class="input__type-text" type="date" value="${date}" name="ship_sets_date_${uin}">`;
    cellPrim.innerHTML   = `<input class="input__type-text" type="text" value="${prim}" name="ship_sets_prim_${uin}">`;
    cellNPset.innerHTML = NPset;
    cellSNset.innerHTML = SNset;
    cellName.innerHTML  = name;
    cellKontr.innerHTML = kontr;
    cellButton.innerHTML = `<button class="button__control button__control_update-ship-sets" style="background-color:inherit" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button>`;

    let display_tb = document.getElementById(div_tb_id);
    display_tb.style.display = "block";
}

function addSetsRowChild(prod, SNprod, color, colorUin, uinPr, table_content){
    let newRow     = table_content.insertRow(-1);


    let cellButton = newRow.insertCell(0);
    let cellSNprod = newRow.insertCell(1);
    let cellProd   = newRow.insertCell(2);
    let cellColor  = newRow.insertCell(3);

    let cellProdText = document.createTextNode(prod); cellProd.append(cellProdText);
    let cellSNprodText = document.createTextNode(SNprod); cellSNprod.append(cellSNprodText);

    let select = document.createElement("select");
    select.id = uinPr;
    let option = document.createElement("option");
    option.text = color;
    option.value = colorUin;
    select.appendChild(option);
    cellColor.appendChild(select);

    let list = localStorage.getItem("colors_list");
    addToDropdown(select, JSON.parse(list));
}

function funcProcessGetResTableProducts(result, respobj){
    if( result === 0 ) return;
    console.log(respobj.answP);
    let div_tb_id = "wrapper_tb_shipment_products";
    let div = document.getElementById(div_tb_id);

    for (let key in respobj.answP) {
        let table_head = document.createElement("table");
        let row_head   = table_head.insertRow(-1);

        row_head.className = "td_ship";
        row_head.innerHTML = '<td class="table_head"><img src="../images/arrow_down_sidebar.svg"></td><td>Диапазон SN изделий</td><td>Кол-во в партии</td><td>Изделие</td><td>Получатель</td>';
    
        div.append(table_head);
        
        let val = respobj.answP[key];
        let SNbeg = val.SNbeg;
        let SNend = val.SNend;
        let NP = val.NP;
        let prod = val.prod;
        let kontr = val.kontr;
        let more = val.more;
        addProductsRow(SNbeg, SNend, NP, prod, kontr, table_head, div_tb_id);

        let table_content = document.createElement("table");
        table_content.className = "table_content_prod";
        let row_content = table_content.insertRow(-1);
        row_content.className = "td_ship";
        row_content.innerHTML = '<td></td><td>SN изделия</td><td>Доп. № изделия</td><td>№ в партии</td><td>Изделие</td><td>Цвет</td><td>Версия АПП</td><td>Версия ПО</td><td>МАС-адрес</td><td>Статус</td><td>Получатель</td><td>Дата</td><td>Примечание</td><td></td>';
    
        table_head.after(table_content);

        for (let key in more) {
            let val = more[key];
            let SNprod    = val.SNprod;
            let nprod     = val.nprod;
            let NPset     = val.NPset;
            let name      = val.prod;
            let color     = val.color.name;
            let colorUin  = val.color.uin;
            let vapp      = val.vapp.name;
            let vappUin   = val.vapp.uin;
            let vpp       = val.vapp.name;
            let vppUin    = val.vapp.uin;
            let mac       = val.mac;
            let status    = val.status.name;
            let statusUin = val.status.uin;
            let kontr     = val.kontr;
            let date      = val.date;
            let prim      = val.prim;
            let uin       = val.uin;
            addProductsRowChild(SNprod, nprod, NPset, name, color, colorUin, vapp, vappUin, vpp, vppUin, mac, status, statusUin, kontr, date, prim, uin, table_content);
        }
    }

    //div.getElementsByClassName("table_head")[0].firstChild.firstChild.style.visibility = "visible";
    div.querySelectorAll(".table_head").forEach(el=>{
        el.addEventListener("click",e=>{
            let action = e.currentTarget.parentNode.parentNode.parentNode.nextElementSibling.classList.toggle("active");
            action === true ?e.srcElement.style.transform = "rotate(-180deg)" : e.srcElement.style.transform = "none";
        });
    });
}

function addProductsRow(SNbeg, SNend, NP, prod, kontr, table_head, div_tb_id){
    let newRow    = table_head.insertRow(-1);
    let cellSlide = newRow.insertCell(0);
    let cellSN    = newRow.insertCell(1);
    let cellNP    = newRow.insertCell(2);
    let cellprod  = newRow.insertCell(3);
    let cellkontr = newRow.insertCell(4);

    let cellSNtext    = document.createTextNode(`${SNbeg} - ${SNend}`); cellSN.append(cellSNtext);
    let cellNPtext    = document.createTextNode(NP); cellNP.append(cellNPtext);
    let cellprodtext  = document.createTextNode(prod); cellprod.append(cellprodtext);
    let cellkontrtext = document.createTextNode(kontr); cellkontr.append(cellkontrtext);

    let display_tb = document.getElementById(div_tb_id);
    display_tb.style.display = "block";
    //tooltipTableHover(cellname, uin);
}

function addProductsRowChild(SNprod, nprod, NPset, name, color, colorUin, vapp, vappUin, vpp, vppUin, mac, status, statusUin, kontr, date, prim, uin, table_content){
    let newRow     = table_content.insertRow(-1);
    let cellbutton = newRow.insertCell(0);
    let cellSNprod = newRow.insertCell(1);
    let cellNprod  = newRow.insertCell(2);
    let cellNPset  = newRow.insertCell(3);
    let cellName   = newRow.insertCell(4);
    let cellColor  = newRow.insertCell(5);
    let cellVapp   = newRow.insertCell(6);
    let cellVpp    = newRow.insertCell(7);
    let cellMac    = newRow.insertCell(8);
    let cellStatus = newRow.insertCell(9);
    let cellKontr  = newRow.insertCell(10);
    let cellDate   = newRow.insertCell(11);
    let cellPrim   = newRow.insertCell(12);
    let cellButton = newRow.insertCell(13);

    makeSelect("ship_product_color_select_", uin, color, colorUin, "colors_list", "select", cellColor);
    makeSelect("ship_product_vapp_select_", uin, vapp, vappUin, "verapp_list", "select", cellVapp);
    makeSelect("ship_product_vpp_select_", uin, vpp, vppUin, "verpp_list", "select", cellVpp);
    makeSelect("ship_product_status_select_", uin, status, statusUin, "statuses_list", "select", cellStatus);

    cellMac.innerHTML   = `<input class="input__type-text" type="text" value="${mac}" name="ship_product_mac_${uin}">`;
    cellDate.innerHTML  = `<input class="input__type-text" type="date" value="${date}" name="ship_product_date_${uin}">`;
    cellPrim.innerHTML  = `<input class="input__type-text" type="text" value="${prim}" name="ship_product_prim_${uin}">`;
    cellNprod.innerHTML = `<input class="input__type-text" type="text" value="${nprod}" name="ship_product_nprod_${uin}">`;

    let cellSNprodText = document.createTextNode(SNprod); cellSNprod.append(cellSNprodText);
    let cellNPsetText  = document.createTextNode(NPset); cellNPset.append(cellNPsetText);
    let cellNameText   = document.createTextNode(name); cellName.append(cellNameText);
    let cellKontrText  = document.createTextNode(kontr); cellKontr.append(cellKontrText);
    cellButton.innerHTML = `<button class="button_control" style="background-color:inherit" onclick="funcUpdateProductsRowChild(${uin},${colorUin},${vappUin},${vppUin},${statusUin},this)"><img src="../images/button/chb/checkbox.svg"></button>`;
}

function funcUpdateProductsRowChild(uin, colorUin, vappUin, vppUin, statusUin, elem){
    let body  =  {"user":"demo", "meth":"update", "obj":"shipProducts", "uincolor":"", "uinvapp":"", "uinvpp":"", "mac":"",
                    "nprod":"","uinstatus":"", "date":"","prim":"", "uin":`${uin}`};

    let target_table = wrapper_tb_shipment_products;
    body.uincolor  = findForUpdateSelectFormula(uin, colorUin, target_table, "ship_product_color_select_");
    body.uinvapp   = findForUpdateSelectFormula(uin, vappUin, target_table, "ship_product_vapp_select_");
    body.uinvpp    = findForUpdateSelectFormula(uin, vppUin, target_table, "ship_product_vpp_select_");
    body.uinstatus = findForUpdateSelectFormula(uin, statusUin, target_table, "ship_product_status_select_");
    body.mac       = findForUpdateInput(`ship_product_mac_${uin}`, target_table);
    body.nprod     = findForUpdateInput(`ship_product_nprod_${uin}`, target_table);
    body.date      = findForUpdateInput(`ship_product_date_${uin}`, target_table);
    body.prim      = findForUpdateInput(`ship_product_prim_${uin}`, target_table);

    funcCommand(body, funcProcessOnlyInfo);
}