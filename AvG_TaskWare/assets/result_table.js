const url = "https://apitw.avantguard.pro:32100/json";

window.onload = function() {
    //funcGetResTableSets();
    //funcGetResTableProducts();
    funcGetResTable();
}

function funcCommand(body, callbackfunc){
    let xhr    = new XMLHttpRequest();
    let jsbody = JSON.stringify( body );
    let resp;

    xhr.responseType = 'text';
    xhr.onload = function (){
        if (xhr.readyState === 4){
        if (xhr.status === 200){
            try{
            resp = JSON.parse(xhr.responseText);
            callbackfunc( 1, resp );
            } catch (err){
            console.log(err);
            }
        } else {
            callbackfunc( 0, null );
        }
        }
    };

    xhr.onerror = function(){
        console.log("Ошибка соединения!");
        callbackfunc( 0, null );
    }

    xhr.open("POST", url );
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(jsbody);
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
        //funcProcessGetResTableSets(result, respobj);
        funcProcessGetResTableSets_(result, respobj);
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

/*
function funcProcessGetResTableSets(result, respobj){
    if( result === 0 ) return;
    console.log(respobj.answS);
    let tb_id = "tb_shipment_sets";
    let div_tb_id = "wrapper_tb_shipment_sets";

    for (let key in respobj.answS) {
        let val = respobj.answS[key];
        let NPset = val.NPset;
        let SNset = val.SNset;
        let name = val.set;
        let status = val.status.name;
        let kontr = val.kontr;
        let date = val.date;
        let prim = val.prim;
        let comp = val.comp;
        let uin = val.uin;
        addSetsRow(NPset, SNset, name, status, kontr, date, prim, uin, tb_id, div_tb_id);
        makeTooltiptable(uin, comp, div_tb_id);
    }
}

function addSetsRow(NPset, SNset, name, status, kontr, date, prim, uin, tb_id, div_tb_id){
    let display_tb = document.getElementById(div_tb_id);
    display_tb.style.display = "table";

    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);

    let cellNPset  = newRow.insertCell(0);
    let cellSNset  = newRow.insertCell(1);
    let cellname   = newRow.insertCell(2);
    let cellstatus = newRow.insertCell(3);
    let cellkontr  = newRow.insertCell(4);
    let celldate   = newRow.insertCell(5);
    let cellprim   = newRow.insertCell(6);

    let cellNPsettext = document.createTextNode(SNset); cellNPset.append(cellNPsettext);
    let cellSNsettext = document.createTextNode(NPset); cellSNset.append(cellSNsettext);
    let cellnametext = document.createTextNode(name); cellname.append(cellnametext);
    let cellstatustext = document.createTextNode(status); cellstatus.append(cellstatustext);
    let cellkontrtext = document.createTextNode(kontr); cellkontr.append(cellkontrtext);
    let celldatetext = document.createTextNode(date); celldate.append(celldatetext);
    let cellprimtext = document.createTextNode(prim); cellprim.append(cellprimtext);

    tooltipTableHover(cellname, uin);
}
*/

/* отправка запроса для выбранных сетов/изделий */
function funcProcessGetResTableSets_(result, respobj){
    if( result === 0 ) return;
    console.log(respobj.answS);
    let div_tb_id = "wrapper_tb_shipment_sets_";
    let div = document.getElementById(div_tb_id);
    
    for (let key in respobj.answS) {
        let table_head = document.createElement("table");
        let row_head   = table_head.insertRow(-1);
        row_head.className = "td_ship";
        row_head.innerHTML = '<th class="table_head"><img src="../images/arrow_down_sidebar.svg"></th></th><th>SN отгрузки</th><th>№ в партии</th><th>Комплект</th><th>Статус</th><th>Получатель</th><th>Дата</th><th>Примечание</th><th></th>';
    
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
        addSetsRow_(NPset, SNset, name, status, statusUin, kontr, date, prim, uin, table_head, div_tb_id);

        let table_content = document.createElement("table");
        table_content.className = "table_content_set";
        table_content.id = `table_content_${uin}`;
        let row_content = table_content.insertRow(-1);
        row_content.className = "td_ship";
        row_content.innerHTML = '<th></th><th>SN изделия</th><th>Изделие</th><th>Цвет</th>';
    
        table_head.after(table_content);

        for(let key in comp){
            let val      = comp[key];
            let prod     = val.prod;
            let SNprod   = val.snprod;
            let color    = val.color.name;
            let colorUin = val.color.uin;
            let uinPr    = val.uinpr;

            addSetsRowChild_(prod, SNprod, color, colorUin, uinPr, table_content);
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

function addSetsRow_(NPset, SNset, name, status, statusUin, kontr, date, prim, uin, table_head, div_tb_id){
    let newRow     = table_head.insertRow(-1);
    let cellSlide  = newRow.insertCell(0);
    let cellNPset  = newRow.insertCell(1);
    let cellSNset  = newRow.insertCell(2);
    let cellName   = newRow.insertCell(3);
    let cellStatus = newRow.insertCell(4);
    let cellKontr  = newRow.insertCell(5);
    let cellDate   = newRow.insertCell(6);
    let cellPrim   = newRow.insertCell(7);
    let cellButton = newRow.insertCell(8);

    makeSelectForСompositeTables(uin, status, statusUin, "statuses_list", "ship_sets_status_select_", cellStatus);
    cellDate.innerHTML   = `<input type="date" value="${date}" name="ship_sets_date_${uin}">`;
    cellPrim.innerHTML   = `<input type="text" value="${prim}" name="ship_sets_prim_${uin}">`;
    let cellNPsetText    = document.createTextNode(NPset); cellNPset.append(cellNPsetText);
    let cellSNsetText    = document.createTextNode(SNset); cellSNset.append(cellSNsetText);
    let cellNameText     = document.createTextNode(name); cellName.append(cellNameText);
    let cellKontrText    = document.createTextNode(kontr); cellKontr.append(cellKontrText);
    cellButton.innerHTML = `<button class="button_control" style="background-color:inherit" onclick="funcUpdateSetsRow(${uin},${statusUin},this)"><img src="../images/button/chb/checkbox.svg"></button>`;

    let display_tb = document.getElementById(div_tb_id);
    display_tb.style.display = "block";
}

function funcUpdateSetsRow(uin, statusUin, elem){
    let arrpr_val  = JSON.stringify(findForUpdateSelectProdInSet(uin));
    let body  =  {"user":"demo", "meth":"update", "obj":"shipSets", "uinstatus":"", "date":"", "prim":"", "arrpr":`${arrpr_val}`, "uin":`${uin}`};

    let target_table = wrapper_tb_shipment_sets_;

    body.uinstatus = findForUpdateSelectFormula(uin, statusUin, target_table, "ship_sets_status_select_");
    body.date      = findForUpdateInput(`ship_sets_date_${uin}`, target_table);
    body.prim      = findForUpdateInput(`ship_sets_prim_${uin}`, target_table);

    funcCommand(body, funcProcessOnlyInfo);
    highlight(elem);
}

function findForUpdateSelectProdInSet(uin){
    let table_products = document.getElementById(`table_content_${uin}`);
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

function addSetsRowChild_(prod, SNprod, color, colorUin, uinPr, table_content){
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
        row_head.innerHTML = '<th class="table_head"><img src="../images/arrow_down_sidebar.svg"></th><th>Диапазон SN изделий</th><th>Кол-во в партии</th><th>Изделие</th><th>Получатель</th>';
    
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
        row_content.innerHTML = '<th></th><th>SN изделия</th><th>Доп. № изделия</th><th>№ в партии</th><th>Изделие</th><th>Цвет</th><th>Версия АПП</th><th>Версия ПО</th><th>МАС-адрес</th><th>Статус</th><th>Получатель</th><th>Дата</th><th>Примечание</th><th></th>';
    
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

    makeSelectForСompositeTables(uin, color, colorUin, "colors_list", "ship_product_color_select_", cellColor);
    makeSelectForСompositeTables(uin, vapp, vappUin, "verapp_list", "ship_product_vapp_select_", cellVapp);
    makeSelectForСompositeTables(uin, vpp, vppUin, "verpp_list", "ship_product_vpp_select_", cellVpp);
    makeSelectForСompositeTables(uin, status, statusUin, "statuses_list", "ship_product_status_select_", cellStatus);

    cellMac.innerHTML   = `<input type="text" value="${mac}" name="ship_product_mac_${uin}">`;
    cellDate.innerHTML  = `<input type="date" value="${date}" name="ship_product_date_${uin}">`;
    cellPrim.innerHTML  = `<input type="text" value="${prim}" name="ship_product_prim_${uin}">`;
    cellNprod.innerHTML = `<input type="text" value="${nprod}" name="ship_product_nprod_${uin}">`;

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
    highlight(elem);
}

/* поиск input для обновления */
function findForUpdateInput(name, table){
    let inputs = table.getElementsByTagName("input");
    let input_value = [];
    for (let i = 0, len = inputs.length; i < len; i++) {
        if (inputs[i].name === name) {
                input_value.push(inputs[i]);
            }
        }
        let target_input = input_value[0].value;
        if(target_input === ""){
            target_input = `" "`;
        }
    return target_input;
}

/* поиск select для обновления составов */
function findForUpdateSelectFormula(uin, uinOther, table, select){
    let selects = table.getElementsByTagName("select");
    let select_value = [];
    for (let i = 0, len = selects.length; i < len; i++) {
        if (selects[i].id === `${select}${uinOther}_${uin}`) {
            select_value.push(selects[i]);
        }
    }
    let target_select = select_value[0].value;
    return target_select;
}

function makeSelectForСompositeTables(uinMain, other, uinOther, otherList, determinant, cell){
    let select = document.createElement("select");
    select.id = `${determinant}${uinOther}_${uinMain}`;
    let option = document.createElement("option");
    option.text = other;
    option.value = uinOther;
    select.appendChild(option);
    cell.appendChild(select);

    let list = localStorage.getItem(otherList);
    addToDropdown(select, JSON.parse(list));
}

function addToDropdown(select, arr){
    for (let key in arr) {
        if(arr[key].del === 0){
            let newOption = new Option(arr[key].name, arr[key].uin);
            select.append(newOption);
        }
    }
}

function tooltipTableHover(td, uin){
    td.onmouseout = function(e) {
        document.getElementById(uin).style.display='none';
    }
    td.onmouseover = function(e) {
        document.getElementById(uin).style.display='table';
    };
}

function makeTooltiptable(uin, comp, tb_id){
    let divTableRef = document.getElementById(tb_id);
    let tooltipTable = document.createElement('table');
    tooltipTable.id = uin;
    tooltipTable.classList.add("coupontooltip");
    divTableRef.append(tooltipTable);

    for(let key in comp){
        let val = comp[key];
        let prod = val.prod;
        let SNprod = val.snprod;

        let tooltipTableRow = tooltipTable.insertRow(-1);
        let cellprod = tooltipTableRow.insertCell(0);
        let cellSNprod = tooltipTableRow.insertCell(1);
    
        let cellprodtext = document.createTextNode(prod); cellprod.append(cellprodtext);
        let cellSNprodtext = document.createTextNode(SNprod); cellSNprod.append(cellSNprodtext);
    }

    tooltipTable.onclick = function() {tooltipTable.style.display='none'};
}

function funcProcessOnlyInfo(result, respobj){
    if( result === 0 ) return;
    console.log(respobj);
}

/* изменение цвета кнопки обновления */
function highlight(obj){
    obj.style.background = "green";
    setTimeout(function(){
      obj.style.background = "inherit";
    }, 1000);
}

/* выпадающий список */
let arrow_user = document.getElementsByClassName("arrow_user");
arrow_user[0].addEventListener("click", (e)=>{
    let arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
});

/* переключение темы */
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
        document.getElementById('slider').checked = false;
    } else {
        setTheme('theme-light');
        document.getElementById('slider').checked = true;
    }
})();

/*
const tb1 = document.getElementById('wrapper_tb_shipment_sets');
const tb2 = document.getElementById('wrapper_tb_shipment_sets_');

function handleRadioClick() {
  if (document.getElementById('switch_tb_1').checked) {
    tb1.style.display = 'block';
    tb2.style.display = 'none';
  } else {
    tb1.style.display = 'none';
    tb2.style.display = 'block';
  }
}

const radioButtons = document.querySelectorAll(
  'input[name="example"]',
);

radioButtons.forEach(radio => {
  radio.addEventListener('click', handleRadioClick);
});*/

function handleLeaveSite(){
    let result = confirm("Вы уверены, что хотите выйти?");
    if(result === true){
      window.location = 'https://dev.proektit.ru';
    }
  }