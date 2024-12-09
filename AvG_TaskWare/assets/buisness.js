const url = "https://apitw.avantguard.pro:32100/json";
let filt_sets = [], filt_formula_sets = [], filt_products = [],
filt_formula_products = [], filt_snprod = [], filt_analysis_sets = [],
filt_analysis_products = [], filt_analysis_products_all = [], filt_analysis_components_all = [];

window.onload = function(){
  funcGetGrfShipSets();
  funcGetShipProductsAll();
  funcGetDocpost();
  funcGetContragents();
  funcGetStorages();
  funcGetUsers();
  returnTabs();
}

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

/* выпадающий список по стрелке */
let arrowTab = document.querySelectorAll(".arrow");
for (let i = 0; i < arrowTab.length; i++) {
  arrowTab[i].addEventListener("click", (e)=>{
    let arrowParent = e.target.parentElement.parentElement;
    arrowParent.classList.toggle("showMenu");
    localStorage.setItem("sidebar_tablink_active", arrowParent.id);
  });
}

let arrow_user = document.getElementsByClassName("arrow_user");
arrow_user[0].addEventListener("click", (e)=>{
  let arrowParent = e.target.parentElement.parentElement;
  arrowParent.classList.toggle("showMenu");
});

/* установка значений вкладок */ 
function returnTabs(){  
  let tab_main = document.getElementById(localStorage.getItem("buisness_tab_main_active"));
  tab_main.click();
  let tab_first = document.getElementById(localStorage.getItem("buisness_tab_first_active"));
  if(tab_first != null){
    tab_first.parentElement.parentElement.previousElementSibling.click();
    tab_first.click();
    if(tab_first.name === "non_child"){localStorage.removeItem("buisness_tab_second_active"); localStorage.removeItem("buisness_tab_third_active")};

    let showMenu_val = localStorage.getItem("sidebar_tablink_active");
    document.getElementById(showMenu_val).className += " showMenu";
  }

  let tab_second = document.getElementsByClassName(localStorage.getItem("buisness_tab_second_active"));
  tab_second[0].click();
  if(tab_second[0].name === "non_child"){localStorage.removeItem("buisness_tab_third_active")};

  let tab_third = document.getElementsByClassName(localStorage.getItem("buisness_tab_third_active"));
  tab_third[0].click();

  funcFindSetHref("link_shipment_directory", "link_shipment_directory", "#directory/sets/sets_main");
  funcFindSetHref("link_shipment_analysis", "link_shipment_analysis", "#analysis/analysis_sets");
  funcFindSetHref("link_dir_product", "link_dir_product", "#dir_product/colors");
  funcFindSetHref("link_dir_components", "link_dir_components", "#dir_components/measurement");
}

function funcFindSetHref(id, link_key, def){
  let a = document.getElementById(id);
  let link = localStorage.getItem(link_key);
  link != null ? a.href = link : a.href = def;
}

/* первая установка значений вкладок */
function setLockalValues(){
  localStorage.setItem("link_shipment_directory", "#directory/sets/sets_main");
  localStorage.setItem("link_shipment_analysis", "#analysis/analysis_sets");
  localStorage.setItem("link_dir_product", "#dir_product/colors");
  localStorage.setItem("link_dir_components", "#dir_components/measurement");
  localStorage.setItem("link_main", "#schedule");
  funcGetSets();
  funcGetFormulaSets();
  funcGetProducts();
  funcGetFormulaProducts();
  funcGetDocpost();
  funcGetColors();
  funcGetVerapp();
  funcGetVerpp();
  funcGetMeas();
  funcGetTypeselem();
  funcGetProps();
  funcGetSNProd();
  funcGetStatuses();
  funcGetStatussn();
  funcGetContragents();
  funcGetStatusDoc();
  funcGetStorages();
  alert('Значения установлены!');
}

if(localStorage.getItem('first') === null){
  setLockalValues();
  localStorage.setItem('first','nope!');
}

/* отслеживание Hash */
window.addEventListener('hashchange', function() {
  let hash = location.hash;
  localStorage.setItem("link_main", hash);
  if(hash.includes("directory")){
    let link = document.getElementById("link_shipment_directory");
    link.href = hash;
    localStorage.setItem("link_shipment_directory", hash);
  } else if(hash.includes("analysis")){
    let link = document.getElementById("link_shipment_analysis");
    link.href = hash;
    localStorage.setItem("link_shipment_analysis", hash);
  } else if(hash.includes("dir_product")){
    let link = document.getElementById("link_dir_product");
    link.href = hash;
    localStorage.setItem("link_dir_product", hash);
  } else if(hash.includes("dir_components")){
    let link = document.getElementById("link_dir_components");
    link.href = hash;
    localStorage.setItem("link_dir_components", hash);
  }
});

function funcCommand( body, callbackfunc ){
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

////////// ОТГРУЗКА //////////
//////////
/* график отгрузки */
let today = new Date();
let year = today.getFullYear();
localStorage.setItem("curr_year", year);

function funcGetGrfShipSets(){
  let currYear = localStorage.getItem("curr_year");
  document.getElementById("grf_year").value = "";
  document.getElementById("grf_year").value = currYear;

  let body  =  {"user":"demo", "meth":"view", "obj":"grfShipSets", "count":"100", "filt":`[{"fld":"year","val":["${currYear}"]}]`};
  funcCommand(body, funcProcessGetGrfShipSets);
}

function funcGrfNextYear(){
  let year = localStorage.getItem("curr_year");
  let currYear = +year + 1;
  localStorage.setItem("curr_year", currYear);

  document.getElementById("grf_year").value = "";
  document.getElementById("grf_year").value = currYear;

  let body  =  {"user":"demo", "meth":"view", "obj":"grfShipSets", "count":"100", "filt":`[{"fld":"year","val":["${currYear}"]}]`};
  funcCommand(body, funcProcessGetGrfShipSets);
}

function funcGrfPreviousYear(){
  let year = localStorage.getItem("curr_year");
  let currYear = +year - 1;
  localStorage.setItem("curr_year", currYear);

  document.getElementById("grf_year").value = "";
  document.getElementById("grf_year").value = currYear;

  let body  =  {"user":"demo", "meth":"view", "obj":"grfShipSets", "count":"100", "filt":`[{"fld":"year","val":["${currYear}"]}]`};
  funcCommand(body, funcProcessGetGrfShipSets);
}

function funcProcessGetGrfShipSets(result, respobj){
  if( result === 0 ) return;
  console.log("График:", respobj);

  let select_sets = document.getElementById("select_add_grf_set");
  addToDropdown(select_sets, "sets_list");

  let tb_id = "tb_grf";
  clearTable(tb_id);

  for (let key in respobj.answ) {
    let row  = respobj.answ[key];
    let num  = key;
    let msum = row.msum;
    let rsum = row.rsum;
    let uin  = row.uin;
    let del  = row.del;
    let uinSet = row.set.uin;
    let nameSet = row.set.name;
    let m1   = row.m1;  let r1  = row.r1;
    let m2   = row.m2;  let r2  = row.r2;
    let m3   = row.m3;  let r3  = row.r3;
    let m4   = row.m4;  let r4  = row.r4;
    let m5   = row.m5;  let r5  = row.r5;
    let m6   = row.m6;  let r6  = row.r6;
    let m7   = row.m7;  let r7  = row.r7;
    let m8   = row.m8;  let r8  = row.r8;
    let m9   = row.m9;  let r9  = row.r9;
    let m10  = row.m10; let r10 = row.r10;
    let m11  = row.m11; let r11 = row.r11;
    let m12  = row.m12; let r12 = row.r12;

    if(m1 === 0) {m1  = ""}; if(r1 === 0) {r1   = ""};
    if(m2 === 0) {m2  = ""}; if(r2 === 0) {r2   = ""};
    if(m3 === 0) {m3  = ""}; if(r3 === 0) {r3   = ""};
    if(m4 === 0) {m4  = ""}; if(r4 === 0) {r4   = ""};
    if(m5 === 0) {m5  = ""}; if(r5 === 0) {r5   = ""};
    if(m6 === 0) {m6  = ""}; if(r6 === 0) {r6   = ""};
    if(m7 === 0) {m7  = ""}; if(r7 === 0) {r7   = ""};
    if(m8 === 0) {m8  = ""}; if(r8 === 0) {r8   = ""};
    if(m9 === 0) {m9  = ""}; if(r9 === 0) {r9   = ""};
    if(m10 === 0){m10 = ""}; if(r10 === 0){r10  = ""};
    if(m11 === 0){m11 = ""}; if(r11 === 0){r11  = ""};
    if(m12 === 0){m12 = ""}; if(r12 === 0){r12  = ""};

    if(msum === 0){msum = ""}; if(rsum === 0){rsum  = ""};

    addGrfShipSetsRow(num, msum, rsum, uinSet, nameSet, del, uin, tb_id,
                      m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12,
                      r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12);
  }
}

function addGrfShipSetsRow(num, msum, rsum, uinSet, nameSet, del, uin, tb_id,
                            m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12,
                            r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellNum  = newRow.insertCell(0);
  let cellName = newRow.insertCell(1);
  let cellM1   = newRow.insertCell(2);  cellM1.classList = "col_odd";
  let cellR1   = newRow.insertCell(3);  cellR1.classList = "col_odd";
  let cellM2   = newRow.insertCell(4);
  let cellR2   = newRow.insertCell(5);
  let cellM3   = newRow.insertCell(6);  cellM3.classList = "col_odd";
  let cellR3   = newRow.insertCell(7);  cellR3.classList = "col_odd";
  let cellM4   = newRow.insertCell(8);
  let cellR4   = newRow.insertCell(9);
  let cellM5   = newRow.insertCell(10); cellM5.classList = "col_odd";
  let cellR5   = newRow.insertCell(11); cellR5.classList = "col_odd";
  let cellM6   = newRow.insertCell(12);
  let cellR6   = newRow.insertCell(13);
  let cellM7   = newRow.insertCell(14); cellM7.classList = "col_odd";
  let cellR7   = newRow.insertCell(15); cellR7.classList = "col_odd";
  let cellM8   = newRow.insertCell(16);
  let cellR8   = newRow.insertCell(17);
  let cellM9   = newRow.insertCell(18); cellM9.classList = "col_odd";
  let cellR9   = newRow.insertCell(19); cellR9.classList = "col_odd";
  let cellM10  = newRow.insertCell(20);
  let cellR10  = newRow.insertCell(21);
  let cellM11  = newRow.insertCell(22); cellM11.classList = "col_odd";
  let cellR11  = newRow.insertCell(23); cellR11.classList = "col_odd";
  let cellM12  = newRow.insertCell(24);
  let cellR12  = newRow.insertCell(25);
  let cellMsum = newRow.insertCell(26); cellMsum.classList = "col_odd";
  let cellRsum = newRow.insertCell(27); cellRsum.classList = "col_odd";
  let cellBtn  = newRow.insertCell(28);

  let number = +num + 1;
  cellNum.innerHTML = number;
  makeSelectForСompositeTables(uin, nameSet, uinSet, "sets_list", "grf_set_select_", "grf_set_select", "grf_set_select", cellName);
  cellM1.innerHTML  = `<input type="text" value="${m1}"  id="grf_input_m1_${uin}">`;  cellR1.innerHTML  = r1;
  cellM2.innerHTML  = `<input type="text" value="${m2}"  id="grf_input_m2_${uin}">`;  cellR2.innerHTML  = r2;
  cellM3.innerHTML  = `<input type="text" value="${m3}"  id="grf_input_m3_${uin}">`;  cellR3.innerHTML  = r3;
  cellM4.innerHTML  = `<input type="text" value="${m4}"  id="grf_input_m4_${uin}">`;  cellR4.innerHTML  = r4;
  cellM5.innerHTML  = `<input type="text" value="${m5}"  id="grf_input_m5_${uin}">`;  cellR5.innerHTML  = r5;
  cellM6.innerHTML  = `<input type="text" value="${m6}"  id="grf_input_m6_${uin}">`;  cellR6.innerHTML  = r6;
  cellM7.innerHTML  = `<input type="text" value="${m7}"  id="grf_input_m7_${uin}">`;  cellR7.innerHTML  = r7;
  cellM8.innerHTML  = `<input type="text" value="${m8}"  id="grf_input_m8_${uin}">`;  cellR8.innerHTML  = r8;
  cellM9.innerHTML  = `<input type="text" value="${m9}"  id="grf_input_m9_${uin}">`;  cellR9.innerHTML  = r9;
  cellM10.innerHTML = `<input type="text" value="${m10}" id="grf_input_m10_${uin}">`; cellR10.innerHTML = r10;
  cellM11.innerHTML = `<input type="text" value="${m11}" id="grf_input_m11_${uin}">`; cellR11.innerHTML = r11;
  cellM12.innerHTML = `<input type="text" value="${m12}" id="grf_input_m12_${uin}">`; cellR12.innerHTML = r12;
  cellMsum.innerHTML = msum;
  cellRsum.innerHTML = rsum;
  
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowGrfShipSets(${uin},'${uinSet}',this)"><img src="../images/button/chb/checkbox.svg" alt=""></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowGrfShipSets('${uin}',this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления графика */
function funcMdelRowGrfShipSets(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"grfShipSets", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления графика */
function funcUpdateRowGrfShipSets(uin, uinSet, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"grfShipSets", "uin":`${uin}`, "uinset":"", "year":"" ,"m1":"", "m2":"", "m3":"", "m4":"", "m5":"", "m6":"", "m7":"", "m8":"", "m9":"", "m10":"", "m11":"", "m12":""};

  body.uinset = document.getElementById(`grf_set_select_${uinSet}_${uin}`).value;
  body.year = document.getElementById("grf_year").value;
  body.m1   = document.getElementById(`grf_input_m1_${uin}`).value;
  body.m2   = document.getElementById(`grf_input_m2_${uin}`).value;
  body.m3   = document.getElementById(`grf_input_m3_${uin}`).value;
  body.m4   = document.getElementById(`grf_input_m4_${uin}`).value;
  body.m5   = document.getElementById(`grf_input_m5_${uin}`).value;
  body.m6   = document.getElementById(`grf_input_m6_${uin}`).value;
  body.m7   = document.getElementById(`grf_input_m7_${uin}`).value;
  body.m8   = document.getElementById(`grf_input_m8_${uin}`).value;
  body.m9   = document.getElementById(`grf_input_m9_${uin}`).value;
  body.m10  = document.getElementById(`grf_input_m10_${uin}`).value;
  body.m11  = document.getElementById(`grf_input_m11_${uin}`).value;
  body.m12  = document.getElementById(`grf_input_m12_${uin}`).value;

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetGrfShipSets()}, 100); 
}

/* функция добавления графика */
function funcAddRowGrfShipSets(){
  let body  =  {"user":"demo", "meth":"add", "obj":"grfShipSets", "uinset":"", "year":"" , "m1":"", "m2":"", "m3":"", "m4":"", "m5":"", "m6":"", "m7":"", "m8":"", "m9":"", "m10":"", "m11":"", "m12":""};;

  let uinset_value = document.getElementById("select_add_grf_set").value;
  let year_value = document.getElementById("grf_year").value;

  body.m1  = document.getElementById("input_add_grf_m1").value;
  body.m2  = document.getElementById("input_add_grf_m2").value;
  body.m3  = document.getElementById("input_add_grf_m3").value;
  body.m4  = document.getElementById("input_add_grf_m4").value;
  body.m5  = document.getElementById("input_add_grf_m5").value;
  body.m6  = document.getElementById("input_add_grf_m6").value;
  body.m7  = document.getElementById("input_add_grf_m7").value;
  body.m8  = document.getElementById("input_add_grf_m8").value;
  body.m9  = document.getElementById("input_add_grf_m9").value;
  body.m10 = document.getElementById("input_add_grf_m10").value;
  body.m11 = document.getElementById("input_add_grf_m11").value;
  body.m12 = document.getElementById("input_add_grf_m12").value;

  if(uinset_value === "" || year_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.uinset = uinset_value;
    body.year = year_value;

    //removeOptionsSetValue("select_add_grf_set", "-- Выберите комплект --");
    //document.getElementById("input_add_sets_mt").value = "";
  
    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetGrfShipSets()}, 100);
  }
}

//////////
/* комплекты */
function funcGetSets(){
  let body  =  {"user":"demo", "meth":"view", "obj":"sets", "count":"100"};
  funcCommand(body, funcProcessGetSets);
}

function funcProcessGetSets(result, respobj){
  if( result === 0 ) return;
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
}

addToDropdownPsevdo("filt_sets_set_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_sets_set");

addToDropdownPsevdoAnotherList("filt_sets_train_items", JSON.parse(localStorage.getItem("model_train")), "mt_");
psevdoSelect("filt_sets_train");

let button_sets_choose = document.getElementById("button_sets_choose");
button_sets_choose.onclick = function() {
  sendFilt(filt_sets, 'tb_sets_info', 'sets', funcProcessGetSets);
};

let button_sets_reset = document.getElementById("button_sets_reset");
button_sets_reset.onclick = function() {
  clearFilt(filt_sets, 'filt_sets_set_items', 'filt_sets_train_items', 'filt_sets_train_items', 'tb_sets_info', funcGetSets());
};

listenFiltSelectSets("filt_sets_set_items", "filt_sets_train_items", filt_sets);

function listenFiltSelectSets(select_1_id, select_2_id, filt_main){
  let select_1 = document.getElementById(select_1_id);
  let select_2 = document.getElementById(select_2_id);
  let filt_1   = {fld: "uin", on: "sets"};
  let val_1    = [];
  let filt_2   = {fld: "model_train"};
  let val_2    = [];

  listenSelect(select_1, filt_1, val_1, filt_main);
  listenSelect(select_2, filt_2, val_2, filt_main);
}

function addSetsRow(name, other, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellOther = newRow.insertCell(1);
  let cellBtn = newRow.insertCell(2);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  other === "" ? other = "Отсутствует" : other = other;
  cellOther.innerHTML = `<input type="text" value="${other}" name="model_train_${uin}">`;

  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowSets(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg" alt=""></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowSets('${uin}',this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления комплекта */
function funcMdelRowSets(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"sets", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления комплекта */
function funcUpdateRowSets(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"sets", "name":"", "model_train":"", "uin":`${uin}`};

  let target_table = tb_sets_info;
  body.name = findForUpdateInput(name, target_table);
  body.model_train = findForUpdateInput(`model_train_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetSets()}, 100); 
}

/* функция добавления комплекта */
function funcAddRowSets(){
  let body  =  {"user":"demo", "meth":"add", "obj":"sets", "name":"", "model_train":""};

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
}

listenSortSelect("sort_sets", "tb_sets_info", "sets", funcProcessGetSets);

//////////
/* состав комплектов */
function funcGetFormulaSets(){
  let body  =  {"user":"demo", "meth":"view", "obj":"formula_sets", "count":"100"};
  funcCommand(body, funcProcessGetFormulaSets);
}

function funcProcessGetFormulaSets(result, respobj){
  if( result === 0 ) return;
  console.log("Состав комплектов:", respobj);
  let tb_id = "tb_sets_formula_info";
  clearTable(tb_id);

  let select_sets = document.getElementById("select_add_formula_sets_set");
  addToDropdown(select_sets, "sets_list");

  let select_products = document.getElementById("select_add_formula_sets_prod");
  addToDropdown(select_products, "products_list");

  for (let key in respobj.answ) {
    let formula = respobj.answ[key];
    let set = formula.set.name;
    let product = formula.product;
    product != undefined ? product = formula.product.name : product = "---";
    let compont = formula.compont;
    compont != undefined ? compont = formula.compont.name : compont = "---";
    let count = formula.count;
    let del = formula.del;
    let uin = formula.uin;
    let uinset = formula.set.uin;
    let uinproduct = formula.product;
    uinproduct != undefined ? uinproduct = formula.product.uin : uinproduct = "' '";
    let uincompont = formula.compont;
    uincompont != undefined ? uincompont = formula.compont.uin : uincompont = "' '";
    addFormulaSetsRow(set, product, compont, count, del, uin, uinset, uinproduct, uincompont, tb_id);
  }
}

addToDropdownPsevdo("filt_sets_formula_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_sets_formula_sets");

addToDropdownPsevdo("filt_sets_formula_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_sets_formula_products");

addToDropdownPsevdo("filt_sets_formula_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_sets_formula_components");

let button_sets_formula_choose = document.getElementById("button_sets_formula_choose");
button_sets_formula_choose.onclick = function() {
  sendFilt(filt_formula_sets, 'tb_sets_formula_info', 'formula_sets', funcProcessGetFormulaSets);
};

let button_sets_formula_reset = document.getElementById("button_sets_formula_reset");
button_sets_formula_reset.onclick = function() {
  clearFilt(filt_formula_sets, 'filt_sets_formula_sets_items', 'filt_sets_formula_products_items', 'filt_sets_formula_components_items', 'tb_sets_formula_info', funcGetFormulaSets())
};

listenFiltSelectFormulaSets("filt_sets_formula_sets_items", "filt_sets_formula_products_items", "filt_sets_formula_components_items", filt_formula_sets);

function listenFiltSelectFormulaSets(select_1_id, select_2_id, select_3_id, filt_main){
  let select_1 = document.getElementById(select_1_id);
  let select_2 = document.getElementById(select_2_id);
  let select_3 = document.getElementById(select_3_id);
  let filt_1   = {fld: "uin", on: "sets"};
  let val_1    = [];
  let filt_2   = {fld: "uin", on: "products"};
  let val_2    = [];
  let filt_3   = {fld: "uin", on: "components"};
  let val_3    = [];

  listenSelect(select_1, filt_1, val_1, filt_main);
  listenSelect(select_2, filt_2, val_2, filt_main);
  listenSelect(select_3, filt_3, val_3, filt_main);
}

function addFormulaSetsRow(set, product, compont, count, del, uin, uinset, uinproduct, uincompont, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellSet     = newRow.insertCell(0);
  let cellProduct = newRow.insertCell(1);
  let cellСompont = newRow.insertCell(2);
  let cellCount   = newRow.insertCell(3);
  let cellBtn  = newRow.insertCell(4);

  makeSelectForСompositeTables(uin, set, uinset, "sets_list", "formula_sets_set_select_", "formula_sets_set_select", "formula_sets_set_select", cellSet);
  makeSelectForСompositeTables(uin, product, uinproduct, "products_list", "formula_sets_products_select_", "formula_sets_products_select", "formula_sets_products_select", cellProduct);
  if(compont === "---"){
    cellСompont.innerHTML = `<button class="button_select" disabled>${compont}</button>`;
  } else {
    cellСompont.innerHTML = `<button class="button_select" id="set_component_${uin}" value="${uincompont}" onclick="funcComponentsSelect(this)">${compont}</button>`;
  }

  //if(product === "---"){cellProduct.disabled = true};
  //if(compont === "---"){cellСompont.disabled = true};

  cellCount.innerHTML = `<input type="text" value="${count}" name="count_${uin}">`;

  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowFormulaSets(${uin},${uinset},${uinproduct},${uincompont},'count_${uin}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowFormulaSets('${uin}',this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления состава комплекта */
function funcMdelRowFormulaSets(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"formula_sets", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red";
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления состава комплекта */
function funcUpdateRowFormulaSets(uin, uinset, uinproduct, uincompont, count, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"formula_sets", "uinset":"", "uinproduct":"", "uincompont":"", "count":"", "uin":`${uin}`};

  let target_table = tb_sets_formula_info;

  body.uinset = findForUpdateSelectFormula(uin, uinset, target_table, "formula_sets_set_select_");
  if(uinproduct != " "){
    body.uinproduct = findForUpdateSelectFormula(uin, uinproduct, target_table, "formula_sets_products_select_");
  } else {
    body.uinproduct = " ";
  }
  if(uincompont != " "){
    body.uincompont = document.getElementById(`set_component_${uin}`).value;
  } else {
    body.uincompont = " ";
  }
  body.count = findForUpdateInput(count, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetFormulaSets()}, 100);
}

/* функция добавления состава комплекта */
function funcAddRowFormulaSets(){
  let body  =  {"user":"demo", "meth":"add", "obj":"formula_sets", "uinset":"", "uinproduct":"", "count":"" };

  let uinset_value = document.getElementById("select_add_formula_sets_set").value;
  let uinproduct_value = document.getElementById("select_add_formula_sets_prod").value;
  let uincompont_value = document.getElementById("button_add_sets_formula_component");
  let count_value = document.getElementById("input_add_formula_sets_count");

  if(uinset_value === "" || count_value.value === ""){
    if(uinproduct_value === "" && uincompont_value.value === ""){
      alert("Вы не заполнили все поля!");
    }
  } else {
    body.uinset = uinset_value;
    body.uinproduct = uinproduct_value;
    body.uincompont = uincompont_value.value;
    body.count = count_value.value;

    removeOptionsSetValue("select_add_formula_sets_set", "-- Выберите комплект --");
    removeOptionsSetValue("select_add_formula_sets_prod", "-- Выберите изделие --");
    uincompont_value.innerText = "Выберите комплектующее";
    uincompont_value.value = "";
    count_value.value = "";
  
    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetFormulaSets()}, 100);
  }
}

listenSortSelect("sort_sets_formula", "tb_sets_formula_info", "formula_sets", funcProcessGetFormulaSets);

//////////
/* изделия */
function funcGetProducts(){
  let body  =  {"user":"demo", "meth":"view", "obj":"products", "count":"100"};
  funcCommand(body, funcProcessGetProducts);
}

function funcProcessGetProducts(result, respobj){
  if( result === 0 ) return;
  console.log("Изделия:", respobj);
  let tb_id = "tb_products_main";
  clearTable(tb_id);

  let select_color = document.getElementById("select_add_products_color");
  addToDropdown(select_color, "colors_list");

  let products_list = respobj.answ;
  localStorage.setItem("products_list", JSON.stringify(products_list));
  for (let key in respobj.answ) {
    let set = respobj.answ[key];
    let name = set.name;
    let other = set.color.name;
    let del = set.del;
    let uin = set.uin;
    addProductsRow(name, other, del, uin, tb_id);
  }
}

addToDropdownPsevdo("filt_products_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_products_products");

addToDropdownPsevdo("filt_products_colors_items", JSON.parse(localStorage.getItem("colors_list")));
psevdoSelect("filt_products_colors");

let button_products_choose = document.getElementById("button_products_choose");
button_products_choose.onclick = function() {
  sendFilt(filt_products, 'tb_products_main', 'products', funcProcessGetProducts);
};

let button_products_reset = document.getElementById("button_products_reset");
button_products_reset.onclick = function() {
  clearFilt(filt_products, 'filt_products_products_items', 'filt_products_colors_items', 'filt_products_colors_items', 'tb_products_main', funcGetProducts());
};

listenFiltSelectProducts("filt_products_products_items", "filt_products_colors_items", filt_products);

function listenFiltSelectProducts(select_1_id, select_2_id, filt_main){
  let select_1 = document.getElementById(select_1_id);
  let select_2 = document.getElementById(select_2_id);
  let filt_1   = {fld: "uin", on: "products"};
  let val_1    = [];
  let filt_2   = {fld: "uin", on: "colors"};
  let val_2    = [];

  listenSelect(select_1, filt_1, val_1, filt_main);
  listenSelect(select_2, filt_2, val_2, filt_main);
}

function addProductsRow(name, other, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;
  other === "" ? other = "Отсутствует" : other = other;

  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowProducts(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowProducts(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления изделия */
function funcMdelRowProducts(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"products", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления изделия */
function funcUpdateRowProducts(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"products", "name":"", "uincolor":"", "uin":`${uin}`};

  let target_table = tb_products_main;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetProducts()}, 100);
}

/* функция добавления изделия */
function funcAddRowProducts(){
  let body  =  {"user":"demo", "meth":"add", "obj":"products", "name":"", "uincolor":""};

  //let select_status_value = document.getElementById("select_add_products_status").value
  let name_value = document.getElementById("input_add_products").value
  let select_value = document.getElementById("select_add_products_color").value

  if(name_value === "" || select_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    //body.fship = select_status_value;
    body.name = name_value;
    body.uincolor = select_value;

    //removeOptionsSetValue("select_add_products_status", "-- Выберите статус --");
    document.getElementById("input_add_products").value = "";
    removeOptionsSetValue("select_add_products_color", "-- Выберите цвет --");

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetProducts()}, 100);
  }
}

listenSortSelect("sort_products", "tb_products_main", "products", funcProcessGetProducts);

//////////
/* состав изделия */
function funcGetFormulaProducts(){
  let body  =  {"user":"demo", "meth":"view", "obj":"formula_products", "count":"100"};
  funcCommand(body, funcProcessGetFormulaProducts);
}

function funcProcessGetFormulaProducts(result, respobj){
  if( result === 0 ) return;
  console.log("Состав изделия:", respobj);

  let tb_id = "tb_products_formula";
  clearTable(tb_id);

  let select_products = document.getElementById("select_add_products_formula_product");
  addToDropdown(select_products, "products_list");

  let select_innproducts = document.getElementById("select_add_products_formula_innproduct");
  addToDropdown(select_innproducts, "products_list");

  for (let key in respobj.answ) {
    let formula     = respobj.answ[key];
    let product     = formula.product.name;
    let uinproduct  = formula.product.uin;
    let compont     = formula.compont;
    compont        != undefined ? compont = formula.compont.name : compont = "---";
    let uincompont  = formula.compont;
    uincompont     != undefined ? uincompont = formula.compont.uin : uincompont = "' '";
    let innprod     = formula.innprod;
    innprod        != undefined ? innprod = formula.innprod.name : innprod = "---";
    let uininnprod = formula.innprod;
    uininnprod    != undefined ? uininnprod = formula.innprod.uin : uininnprod = "' '";
    let count       = formula.count;
    let del         = formula.del;
    let uin         = formula.uin;
    addFormulaProductsRow(product, uinproduct, compont, uincompont, innprod, uininnprod, count, del, uin, tb_id);
  }
}

addToDropdownPsevdo("filt_products_formula_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_products_formula_products");

addToDropdownPsevdo("filt_products_formula_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_products_formula_components");

let button_products_formula_choose = document.getElementById("button_products_formula_choose");
button_products_formula_choose.onclick = function() {
  sendFilt(filt_formula_products, 'tb_products_formula', 'formula_products', funcProcessGetFormulaProducts);
};

let button_products_formula_reset = document.getElementById("button_products_formula_reset");
button_products_formula_reset.onclick = function() {
  clearFilt(filt_formula_products, 'filt_products_formula_products_items', 'filt_products_formula_components_items', 'filt_products_formula_components_items', 'tb_products_formula', funcGetFormulaProducts());
};

listenFiltSelectFormulaProducts("filt_products_formula_products_items", "filt_products_formula_components_items", filt_formula_products);

function listenFiltSelectFormulaProducts(select_1_id, select_2_id, filt_main){
  let select_1 = document.getElementById(select_1_id);
  let select_2 = document.getElementById(select_2_id);
  let filt_1   = {fld: "uin", on: "products"};
  let val_1    = [];
  let filt_2   = {fld: "uin", on: "components"};
  let val_2    = [];

  listenSelect(select_1, filt_1, val_1, filt_main);
  listenSelect(select_2, filt_2, val_2, filt_main);
}

function addFormulaProductsRow(product, uinproduct, compont, uincompont, innprod, uininnprod, count, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellProduct   = newRow.insertCell(0);
  let cellInnroduct = newRow.insertCell(1);
  let cellСompont   = newRow.insertCell(2);
  let cellCount     = newRow.insertCell(3);
  let cellBtn    = newRow.insertCell(4);

  makeSelectForСompositeTables(uin, product, uinproduct, "products_list", "formula_product_products_select_", "formula_product_products_select", "formula_product_products_select", cellProduct);
  makeSelectForСompositeTables(uin, innprod, uininnprod, "products_list", "formula_product_innproducts_select_", "formula_product_innproducts_select", "formula_product_innproducts_select", cellInnroduct);
  if(compont === "---"){
    cellСompont.innerHTML = `<button class="button_select" disabled>${compont}</button>`;
  } else {
    cellСompont.innerHTML = `<button class="button_select" id="product_component_${uin}" value="${uincompont}" onclick="funcComponentsSelect(this)">${compont}</button>`;
  }

  cellCount.innerHTML = `<input type="text" value="${count}" name="count_${uin}">`;

  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowFormulaProducts(${uin},${uinproduct},${uininnprod},${uincompont},'count_${uin}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowFormulaProducts('${uin}',this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления состава изделия */
function funcMdelRowFormulaProducts(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"formula_products", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления состава изделия */
function funcUpdateRowFormulaProducts(uin, uinproduct, uininnprod, uincompont, count, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"formula_products", "uincompont":"", "innprod":"", "uinproduct":"", "count":"",  "uin":`${uin}`};

  let target_table = tb_products_formula;
  body.uinproduct = findForUpdateSelectFormula(uin, uinproduct, target_table, "formula_product_products_select_");
  if(uininnprod != " "){
    body.innprod = findForUpdateSelectFormula(uin, uininnprod, target_table, "formula_product_innproducts_select_");
  } else {
    body.innprod = " ";
  }
  if(uincompont != " "){
    body.uincompont = document.getElementById(`product_component_${uin}`).value;
  } else {
    body.uincompont = " ";
  }
  body.count = findForUpdateInput(count, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetFormulaProducts()}, 100);
}

/* функция добавления состава изделия */
function funcAddRowFormulaProducts(){
  let body  =  {"user":"demo", "meth":"add",  "obj":"formula_products", "uinproduct":"", "innprod":"", "uincompont":"", "count":""};

  let uinproduct_value = document.getElementById("select_add_products_formula_product").value;
  let innprod_value = document.getElementById("select_add_products_formula_innproduct").value;
  let uincompont_value = document.getElementById("button_add_products_formula_component");
  let count_value = document.getElementById("input_add_products_formula");

  if(uinproduct_value === "" || count_value.value === ""){
    if(innprod_value === "" && uincompont_value.value === ""){
      alert("Вы не заполнили все поля!");
    }
  } else {
    body.uinproduct = uinproduct_value;
    body.innprod = innprod_value;
    body.uincompont = uincompont_value.value;
    body.count = count_value.value;
  
    removeOptionsSetValue("select_add_products_formula_product", "-- Выберите изделие --");
    removeOptionsSetValue("select_add_products_formula_innproduct", "-- Выберите изделие --");
    uincompont_value.innerText = "Выберите комплектующее";
    uincompont_value.value = "";
    count_value.value = "";
  
    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetFormulaProducts()}, 100);
  }
}

listenSortSelect("sort_products_formula", "tb_products_formula", "formula_products", funcProcessGetFormulaProducts);


//////////
/* SN изделия */
function funcGetSNProd(){
  let body  =  {"user":"demo", "meth":"view", "obj":"snprod", "count":"100"};
  funcCommand( body, funcProcessGetSNProd );
}

function funcProcessGetSNProd(result, respobj){
  if( result === 0 ) return;
  console.log("SNProd:", respobj);
  let tb_id = "tb_products_SNProd";
  clearTable(tb_id);

  let select_product = document.getElementById("select_add_SNProd_product");
  addToDropdown(select_product, "products_list");

  let select_status = document.getElementById("select_add_SNProd_status");
  addToDropdown(select_status, "statussn_list");

  for (let key in respobj.answ) {
    let formula = respobj.answ[key];
    let led = formula.led;
    let name = formula.product.name;
    let uinproduct = formula.product.uin;
    let SN = formula.SN;
    let count = formula.count;
    let count_use = formula.count_use;
    let date = formula.date;
    let status = formula.status.name;
    let uinstatus = formula.status.uin;
    let del = formula.del;
    let uin = formula.uin;
    addSNProdRow(led, name, uinproduct, SN, count, count_use, date, status, uinstatus, del, uin, tb_id);
  }
}

addToDropdownPsevdo("filt_SNprod_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_SNprod_products");

addToDropdownPsevdo("filt_SNprod_status_items", JSON.parse(localStorage.getItem("statussn_list")));
psevdoSelect("filt_SNprod_status");

let button_SNprod_choose = document.getElementById("button_SNprod_choose");
button_SNprod_choose.onclick = function() {
  sendFilt(filt_snprod, 'tb_products_SNProd', 'snprod', funcProcessGetSNProd);
};

let button_SNprod_reset = document.getElementById("button_SNprod_reset");
button_SNprod_reset.onclick = function() {
  clearFilt(filt_snprod, 'filt_SNprod_products_items', 'filt_SNprod_status_items', 'filt_SNprod_status_items', 'tb_products_SNProd', funcGetSNProd());
};

listenFiltSelectSNprod("filt_SNprod_products_items", "filt_SNprod_status_items", filt_snprod);

function listenFiltSelectSNprod(select_1_id, select_2_id, filt_main){
  let select_1 = document.getElementById(select_1_id);
  let select_2 = document.getElementById(select_2_id);
  let filt_1   = {fld: "uin", on: "products"};
  let val_1    = [];
  let filt_2   = {fld: "uin", on: "statussn"};
  let val_2    = [];

  listenSelect(select_1, filt_1, val_1, filt_main);
  listenSelect(select_2, filt_2, val_2, filt_main);
}

function addSNProdRow(led, name, uinproduct, SN, count, count_use, date, status, uinstatus, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let ceelLed      = newRow.insertCell(0);
  let cellName     = newRow.insertCell(1);
  let cellSN       = newRow.insertCell(2);
  let cellCount    = newRow.insertCell(3);
  let cellCountUse = newRow.insertCell(4);
  let cellDate     = newRow.insertCell(5);
  let cellStatus   = newRow.insertCell(6);
  let cellBtn   = newRow.insertCell(7);

  if(led === 0){
    ceelLed.innerHTML = `<img src="../images/ellipse_green.svg">`;
  } else if(led === 1){
    ceelLed.innerHTML = `<img src="../images/ellipse_orange.svg">`;
  } else if(led === 2){
    ceelLed.innerHTML = `<img src="../images/ellipse_white.svg">`;
  } else if(led === 3){
    ceelLed.innerHTML = `<img src="../images/ellipse_red.svg">`;
  }

  let select_product = document.createElement("select");
  select_product.id = `snprod_product_select_${uinproduct}`;
  let option_product = document.createElement("option");
  option_product.text = name;
  option_product.value = "";
  select_product.appendChild(option_product);
  cellName.appendChild(select_product);

  addToDropdown(select_product, "products_list");

  cellSN.innerHTML = `<input type="text" value="${SN}" name="SN_${uin}">`;
  cellCount.innerHTML = `<input type="text" value="${count}" name="count_${uin}">`;
  cellCountUse.innerHTML = `<input type="text" value="${count_use}" name="count_use_${uin}">`;
  cellDate.innerHTML = `<input type="date" value="${date}" name="date_${uin}">`;

  let select_status = document.createElement("select");
  select_status.id = `snprod_status_select_${uinstatus}`;
  let option_status = document.createElement("option");
  option_status.text = status;
  option_status.value = "";
  select_status.appendChild(option_status);
  cellStatus.appendChild(select_status);

  addToDropdown(select_status, "statussn_list");

  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowSNProd(${uin},${uinproduct},${uinstatus},this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowSNProd('${uin}',this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления SN иделия */
function funcMdelRowSNProd(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"snprod", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления SN иделия */
function funcUpdateRowSNProd(uin, uinproduct, uinstatus, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"snprod", "uinproduct":"", "SN":"", "count":"", "count_use":"", "date":"", "uinstatus":"",  "uin":`${uin}` };

  let target_table = tb_products_SNProd;

  body.uinproduct = findForUpdateSelect(uinproduct, target_table, "snprod_product_select_");
  body.SN = findForUpdateInput(`SN_${uin}`, target_table);
  body.count = findForUpdateInput(`count_${uin}`, target_table);
  body.count_use = findForUpdateInput(`count_use_${uin}`, target_table);
  body.date = findForUpdateInput(`date_${uin}`, target_table);
  body.uinstatus = findForUpdateSelect(uinstatus, target_table, "snprod_status_select_");

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetSNProd()}, 100);
}

/* функция добавления SN иделия */
function funcAddRowSNProd(){
  let body  =  {"user":"demo", "meth":"add", "obj":"snprod", "uinproduct":"", "SN":"", "count":"", "count_use":"", "date":"", "uinstatus":"" };

  let uinproduct_value = document.getElementById("select_add_SNProd_product").value
  let SN_value = document.getElementById("input_add_SNProd_SN").value
  let count_value = document.getElementById("input_add_SNProd_count").value
  let count_use_value = document.getElementById("input_add_SNProd_count_use").value
  let date_value = document.getElementById("input_add_SNProd_date").value
  let uinstatus_value = document.getElementById("select_add_SNProd_status").value

  if(uinproduct_value === "" || SN_value === "" || count_value === "" || count_use_value === "" || date_value === "" || uinstatus_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.uinproduct = uinproduct_value;
    body.SN = SN_value;
    body.count = count_value;
    body.count_use = count_use_value;
    body.date = date_value;
    body.uinstatus = uinstatus_value;

    removeOptionsSetValue("select_add_SNProd_product", "-- Выберите изделие --");
    document.getElementById("input_add_SNProd_SN").value = "";
    document.getElementById("input_add_SNProd_count").value = "";
    document.getElementById("input_add_SNProd_count_use").value = "";
    document.getElementById("input_add_SNProd_date").value = "";
    removeOptionsSetValue("select_add_SNProd_status", "-- Выберите статус --");

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetSNProd()}, 100);
  }
}

listenSortSelect("sort_SNProd", "tb_products_SNProd", "snprod", funcProcessGetSNProd);


//////////
/* анализ комплектов */
function funcGetShipSets(){
  let body  =  {"user":"demo", "meth":"view", "obj":"shipSets", "count":"500", "filt":"", "asort": "uin"};
  funcCommand(body, funcProcessGetShipSets);
}

function funcProcessGetShipSets(result, respobj){
  if( result === 0 ) return;
  if(respobj.answ === ""){alert("Не найдено! Повторите запрос!"); funcGetShipSets()};
  console.log("Анализ комплектов:", respobj);

  document.getElementById("sets_size").innerHTML = respobj.size;

  let tb_id = "tb_analysis_sets";
  for (let key in respobj.answ) {
    let val = respobj.answ[key];
    let NPset = val.NPset;
    let SNset = val.SNset;
    let name = val.set;
    let status = val.status.name;
    let uinstatus = val.status.uin;
    let kontr = val.kontr;
    let date = val.date;
    let prim = val.prim;
    let comp = val.comp;
    let uin = val.uin;
    addRowColumsShipSets(NPset, SNset, name, status, uinstatus, kontr, date, prim, comp, uin, tb_id);
  }
}

addToDropdownPsevdo("filt_analysis_sets_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_analysis_sets_sets");

addToDropdownPsevdo("filt_analysis_sets_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_analysis_sets_products");

addToDropdownPsevdo("filt_analysis_sets_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_analysis_sets_components");

addToDropdownPsevdo("filt_analysis_sets_contragents_items", JSON.parse(localStorage.getItem("contragents_list")));
psevdoSelect("filt_analysis_sets_contragents");

addToDropdownPsevdo("filt_analysis_sets_status_items", JSON.parse(localStorage.getItem("statuses_list")));
psevdoSelect("filt_analysis_sets_status");

let button_analysis_sets_choose = document.getElementById("button_analysis_sets_choose");
button_analysis_sets_choose.onclick = function() {
  sendFiltAnalisys(filt_analysis_sets, 'tb_analysis_sets', 'shipSets', funcProcessGetShipSets);
}

let button_analysis_sets_reset = document.getElementById("button_analysis_sets_reset");
button_analysis_sets_reset.onclick = function() {
  clearFiltAnalisys('filt_analysis_sets_sets_items', 'filt_analysis_sets_products_items', 'filt_analysis_sets_components_items', 'filt_analysis_sets_contragents_items',
    'filt_analysis_sets_status_items', "filt_analysis_sets_date_first", "filt_analysis_sets_date_second", 'tb_analysis_sets', filt_analysis_sets, funcGetShipSets())
}

listenFiltSelectAnalisys("filt_analysis_sets_sets_items", "filt_analysis_sets_products_items", 'filt_analysis_sets_components_items', "filt_analysis_sets_contragents_items",
  "filt_analysis_sets_status_items", "filt_analysis_sets_date_first", "filt_analysis_sets_date_second", filt_analysis_sets)

function addRowColumsShipSets(NPset, SNset, name, status, uinstatus, kontr, date, prim, comp, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellNPset  = newRow.insertCell(0);
  let cellSNset  = newRow.insertCell(1);
  let cellname   = newRow.insertCell(2);
  let cellcomp   = newRow.insertCell(3);
  let cellstatus = newRow.insertCell(4);
  let cellkontr  = newRow.insertCell(5);
  let celldate   = newRow.insertCell(6);
  let cellprim   = newRow.insertCell(7);
  let cellBtn = newRow.insertCell(8);

  let prodTable = document.createElement('table');
  prodTable.classList.add("table_prod");
  cellcomp.append(prodTable);
  cellcomp.style.paddingLeft = "0px";

  for(let key in comp){
    let val    = comp[key];
    let prod   = val.prod;
    let SNprod = val.snprod;
    let color  = val.color;

    let prodTableRow = prodTable.insertRow(-1);
    let cellSNprod   = prodTableRow.insertCell(0);
    let cellProd     = prodTableRow.insertCell(1);
    let cellColor    = prodTableRow.insertCell(2);

    let cellProdText   = document.createTextNode(prod); cellProd.appendChild(cellProdText);
    let cellSNprodText = document.createTextNode(SNprod); cellSNprod.appendChild(cellSNprodText);
    let cellColorText  = document.createTextNode(color); cellColor.appendChild(cellColorText);
  }

  let select = document.createElement("select");
  select.id = `shipsets_select_${uin}`;
  let option = document.createElement("option");
  option.text = status;
  option.value = uinstatus;
  select.appendChild(option);
  cellstatus.appendChild(select);

  addToDropdown(select, "statuses_list");

  celldate.innerHTML = `<input type="date" value="${date}" name="shipsets_date_${uin}">`;
  cellprim.innerHTML = `<input type="text" value="${prim}" name="shipsets_prim_${uin}">`;

  let cellNPsettext = document.createTextNode(SNset); cellNPset.appendChild(cellNPsettext);
  let cellSNsettext = document.createTextNode(NPset); cellSNset.appendChild(cellSNsettext);
  let cellnametext = document.createTextNode(name); cellname.appendChild(cellnametext);
  let cellkontrtext = document.createTextNode(kontr); cellkontr.appendChild(cellkontrtext);
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowShipSets(${uin},this)"><img src="../images/button/chb/checkbox.svg"></button>`;
}

function funcUpdateRowShipSets(uin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"shipSets", "uinstatus":"", "date":"", "prim":"", "uin":`${uin}`};

  let target_table = tb_analysis_sets;
  body.uinstatus = findForUpdateSelect(uin, target_table, "shipsets_select_");
  body.date = findForUpdateInput(`shipsets_date_${uin}`, target_table);
  body.prim = findForUpdateInput(`shipsets_prim_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  //setInterval(function(){location.reload();}, 500);
}

sortAnalisys("sort_analysis_sets", "tb_analysis_sets", filt_analysis_sets, "shipSets", funcProcessGetShipSets);

//////////
/* анализ изделий */
function funcGetShipProducts(){
  let body  =  {"user":"demo", "meth":"view", "obj":"shipProducts", "count":"500", "filt":"", "asort": "uin"};
  funcCommand(body, funcProcessGetShipProducts);
}

function funcProcessGetShipProducts(result, respobj){
  if( result === 0 ) return;
  if(respobj.answ === ""){alert("Не найдено! Повторите запрос!"); funcGetShipProducts()};
  console.log("Анализ изделий:", respobj);

  document.getElementById("products_size").innerHTML = respobj.size;

  let tb_id = "tb_analysis_products";
  for (let key in respobj.answ) {
    let val = respobj.answ[key];
    let SNprod = val.snprod;
    let NPset = val.NPset;
    let name = val.product;
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
    addRowColumsShipProducts(SNprod, NPset, name, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id);
  }
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
button_analysis_products_choose.onclick = function() {
  sendFiltAnalisys(filt_analysis_products, 'tb_analysis_products', 'shipProducts', funcProcessGetShipProducts);
}

let button_analysis_products_reset = document.getElementById("button_analysis_products_reset");
button_analysis_products_reset.onclick = function() {
  clearFiltAnalisys('filt_analysis_products_sets_items', 'filt_analysis_products_products_items', 'filt_analysis_products_components_items', 'filt_analysis_products_contragents_items',
    'filt_analysis_products_status_items', "filt_analysis_products_date_first", "filt_analysis_products_date_second", 'tb_analysis_products', filt_analysis_products, funcGetShipProducts())
}

listenFiltSelectAnalisys("filt_analysis_products_sets_items", "filt_analysis_products_products_items", 'filt_analysis_products_components_items', "filt_analysis_products_contragents_items",
  "filt_analysis_products_status_items", "filt_analysis_products_date_first", "filt_analysis_products_date_second", filt_analysis_products)

function addRowColumsShipProducts(SNprod, NPset, name, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellSNprod = newRow.insertCell(0);
  let cellNPset  = newRow.insertCell(1);
  let cellname   = newRow.insertCell(2);
  let cellColor  = newRow.insertCell(3);
  let cellverapp = newRow.insertCell(4);
  let cellverpp  = newRow.insertCell(5);
  let cellmac    = newRow.insertCell(6);
  let cellstatus = newRow.insertCell(7);
  let cellkontr  = newRow.insertCell(8);
  let celldate   = newRow.insertCell(9);
  let cellprim   = newRow.insertCell(10);
  let cellBtn = newRow.insertCell(11);

  for(let key in comp){
    let val = comp[key];
    let prod = val.prod;
    let SNprod = val.snprod;

    let prodTableRow = prodTable.insertRow(-1);
    let cellSNprod = prodTableRow.insertCell(0);
    let cellprod = prodTableRow.insertCell(1);

    let cellprodtext = document.createTextNode(prod); cellprod.appendChild(cellprodtext);
    let cellSNprodtext = document.createTextNode(SNprod); cellSNprod.appendChild(cellSNprodtext);
  }

  let select = document.createElement("select");
  select.id = `shipproducts_select_${uin}`;
  let option = document.createElement("option");
  option.text = status;
  option.value = uinstatus;
  select.appendChild(option);
  cellstatus.appendChild(select);

  addToDropdown(select, "statuses_list");

  celldate.innerHTML = `<input type="date" value="${date}" name="shipproducts_date_${uin}">`;
  cellprim.innerHTML = `<input type="text" value="${prim}" name="shipproducts_prim_${uin}">`;

  let cellSNprodtext   = document.createTextNode(SNprod); cellSNprod.appendChild(cellSNprodtext);
  let cellNPsettext    = document.createTextNode(NPset); cellNPset.appendChild(cellNPsettext);
  let cellnametext     = document.createTextNode(name); cellname.appendChild(cellnametext);
  let cellColortext    = document.createTextNode(color); cellColor.appendChild(cellColortext);
  let cellverapptext   = document.createTextNode(verapp); cellverapp.appendChild(cellverapptext);
  let cellverpptext    = document.createTextNode(verpp); cellverpp.appendChild(cellverpptext);
  let cellmactext      = document.createTextNode(mac); cellmac.appendChild(cellmactext);
  let cellkontrtext    = document.createTextNode(kontr); cellkontr.appendChild(cellkontrtext);
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowShipProducts(${uin},this)"><img src="../images/button/chb/checkbox.svg"></button>`;
}

function funcUpdateRowShipProducts(uin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"shipProducts", "uinstatus":"", "date":"", "prim":"", "uin":`${uin}`};

  let target_table = tb_analysis_products;
  body.uinstatus = findForUpdateSelect(uin, target_table, "shipproducts_select_");
  body.date = findForUpdateInput(`shipproducts_date_${uin}`, target_table);
  body.prim = findForUpdateInput(`shipproducts_prim_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  //setInterval(function(){location.reload();}, 500);
}

sortAnalisys("sort_analysis_products", "tb_analysis_products", filt_analysis_products, "shipProducts", funcProcessGetShipProducts);

//////////
/* анализ всех изделий */
function funcGetShipProductsAll(){
  let body  =  {"user":"demo", "meth":"view", "obj":"shipProdsAll", "count":"500", "filt":"", "asort": "uin"};
  funcCommand(body, funcProcessGetShipProductsAll);
}

function funcProcessGetShipProductsAll(result, respobj){
  if( result === 0 ) return;
  if(respobj.answ === ""){alert("Не найдено! Повторите запрос!"); funcGetShipProductsAll()};
  console.log("Анализ всех изделий:", respobj);

  document.getElementById("products_all_size").innerHTML = respobj.size;

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
button_analysis_products_all_choose.onclick = function() {
  sendFiltAnalisys(filt_analysis_products_all, 'tb_analysis_products_all', 'shipProdsAll', funcProcessGetShipProductsAll);
}

let button_analysis_products_all_reset = document.getElementById("button_analysis_products_all_reset");
button_analysis_products_all_reset.onclick = function() {
  clearFiltAnalisys('filt_analysis_products_all_sets_items', 'filt_analysis_products_all_products_items', 'filt_analysis_products_all_components_items', 'filt_analysis_products_all_contragents_items',
    'filt_analysis_products_all_status_items', "filt_analysis_products_all_date_first", "filt_analysis_products_all_date_second", 'tb_analysis_products_all', filt_analysis_products_all, funcGetShipProductsAll());
}

listenFiltSelectAnalisys('filt_analysis_products_all_sets_items', 'filt_analysis_products_all_products_items', 'filt_analysis_products_all_components_items', 'filt_analysis_products_all_contragents_items',
    'filt_analysis_products_all_status_items', "filt_analysis_products_all_date_first", "filt_analysis_products_all_date_second", filt_analysis_products_all);

function addRowColumsShipProductsAll(SNset, SNprod, NPset, set, product, color, verapp, verpp, mac, status, uinstatus, kontr, date, prim, comp, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellSNset   = newRow.insertCell(0);
  let cellSNprod  = newRow.insertCell(1);
  let cellNPset   = newRow.insertCell(2);
  let cellset     = newRow.insertCell(3);
  let cellproduct = newRow.insertCell(4);
  let cellColor   = newRow.insertCell(5);
  let cellverapp  = newRow.insertCell(6);
  let cellverpp   = newRow.insertCell(7);
  let cellmac     = newRow.insertCell(8);
  let cellstatus  = newRow.insertCell(9);
  let cellkontr   = newRow.insertCell(10);
  let celldate    = newRow.insertCell(11);
  let cellprim    = newRow.insertCell(12);
  //let cellBtn  = newRow.insertCell(13);

  for(let key in comp){
    let val = comp[key];
    let prod = val.prod;
    let SNprod = val.snprod;

    let prodTableRow = prodTable.insertRow(-1);
    let cellSNprod = prodTableRow.insertCell(0);
    let cellprod = prodTableRow.insertCell(1);

    let cellprodtext = document.createTextNode(prod); cellprod.appendChild(cellprodtext);
    let cellSNprodtext = document.createTextNode(SNprod); cellSNprod.appendChild(cellSNprodtext);
  }

  let select = document.createElement("select");
  select.id = `shipproducts_all_select_${uin}`;
  let option = document.createElement("option");
  option.text = status;
  option.value = uinstatus;
  select.appendChild(option);
  cellstatus.appendChild(select);

  addToDropdown(select, "statuses_list");

  celldate.innerHTML = `<input type="date" value="${date}" name="shipproducts_all_date_${uin}">`;
  cellprim.innerHTML = `<input type="text" value="${prim}" name="shipproducts_all_prim_${uin}">`;

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
  //cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowShipProductsAll(${uin},this)"><img src="../images/button/chb/checkbox.svg"></button>`;
}

/*
function funcUpdateRowShipProductsAll(uin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"shipProdsAll", "uinstatus":"", "date":"", "prim":"", "uin":`${uin}`};

  let target_table = tb_analysis_products_all;
  body.uinstatus = findForUpdateSelect(uin, target_table, "shipproducts_all_select_");
  body.date = findForUpdateInput(`shipproducts_all_date_${uin}`, target_table);
  body.prim = findForUpdateInput(`shipproducts_all_prim_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  //setInterval(function(){location.reload();}, 500);
}
*/

sortAnalisys("sort_analysis_products_all", "tb_analysis_products_all", filt_analysis_products_all, "shipProdsAll", funcProcessGetShipProductsAll);

//////////
/* анализ всех комплектующих */
function funcGetShipComponentsAll(){
  let body  =  {"user":"demo", "meth":"view", "obj":"shipCompontsAll", "count":"500", "filt":"", "asort": "uin"};
  funcCommand(body, funcProcessGetShipComponentsAll);
}

function funcProcessGetShipComponentsAll(result, respobj){
  if( result === 0 ) return;
  if(respobj.answ === ""){alert("Не найдено! Повторите запрос!"); funcProcessGetShipComponentsAll()};
  console.log("Анализ всех комплектующих:", respobj);

  document.getElementById("components_size").innerHTML = respobj.size;

  let tb_id = "tb_analysis_components_all";
  for (let key in respobj.answ) {
    let val = respobj.answ[key];
    let SNset = val.SNset;
    let NPset = val.NPset;
    let set = val.set;
    let product = val.product;
    let innproduct = val.innprod;
    let count = val.count;
    let component = val.compont;
    let status = val.status.name;
    let uinstatus = val.status.uin;
    let kontr = val.kontr;
    let date = val.date;
    let prim = val.prim;
    let uin = val.uin;
    addRowColumsShipComponentsAll(SNset, NPset, set, product, innproduct, count, component, status, uinstatus, kontr, date, prim, uin, tb_id);
  }
}

addToDropdownPsevdo("filt_analysis_components_all_sets_items", JSON.parse(localStorage.getItem("sets_list")));
psevdoSelect("filt_analysis_components_all_sets");

addToDropdownPsevdo("filt_analysis_components_all_products_items", JSON.parse(localStorage.getItem("products_list")));
psevdoSelect("filt_analysis_components_all_products");

addToDropdownPsevdo("filt_analysis_components_all_components_items", JSON.parse(localStorage.getItem("components_list")));
psevdoSelect("filt_analysis_components_all_components");

addToDropdownPsevdo("filt_analysis_components_all_contragents_items", JSON.parse(localStorage.getItem("contragents_list")));
psevdoSelect("filt_analysis_components_all_contragents");

addToDropdownPsevdo("filt_analysis_components_all_status_items", JSON.parse(localStorage.getItem("statuses_list")));
psevdoSelect("filt_analysis_components_all_status");

let button_analysis_components_choose = document.getElementById("button_analysis_components_choose");
button_analysis_components_choose.onclick = function() {
  sendFiltAnalisys(filt_analysis_components_all, 'tb_analysis_components_all', 'shipCompontsAll', funcProcessGetShipComponentsAll);
}

let button_analysis_components_reset = document.getElementById("button_analysis_components_reset");
button_analysis_components_reset.onclick = function() {
  clearFiltAnalisys('filt_analysis_components_all_sets_items', 'filt_analysis_components_all_products_items', 'filt_analysis_components_all_components_items', 'filt_analysis_components_all_contragents_items',
    'filt_analysis_components_all_status_items', "filt_analysis_components_all_date_first", "filt_analysis_components_all_date_second", 'tb_analysis_components_all', filt_analysis_components_all, funcGetShipComponentsAll());
}

listenFiltSelectAnalisys('filt_analysis_components_all_sets_items', 'filt_analysis_components_all_products_items', 'filt_analysis_components_all_components_items', 'filt_analysis_components_all_contragents_items',
  'filt_analysis_components_all_status_items', "filt_analysis_components_all_date_first", "filt_analysis_components_all_date_second", filt_analysis_components_all);

function addRowColumsShipComponentsAll(SNset, NPset, set, product, innproduct, count, component, status, uinstatus, kontr, date, prim, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellSNset      = newRow.insertCell(0);
  let cellNPset      = newRow.insertCell(1);
  let cellSet        = newRow.insertCell(2);
  let cellProduct    = newRow.insertCell(3);
  let cellInnproduct = newRow.insertCell(4);
  let cellCount      = newRow.insertCell(5);
  let cellComp       = newRow.insertCell(6);
  let cellStatus     = newRow.insertCell(7);
  let cellKontr      = newRow.insertCell(8);
  let cellDate       = newRow.insertCell(9);
  let cellPrim       = newRow.insertCell(10);
  //let cellBtn  = newRow.insertCell(10);

  let select = document.createElement("select");
  select.id = `shipcomponents_all_select_${uin}`;
  let option = document.createElement("option");
  option.text = status;
  option.value = uinstatus;
  select.appendChild(option);
  cellStatus.appendChild(select);

  addToDropdown(select, "statuses_list");

  cellDate.innerHTML = `<input type="date" value="${date}" name="shipcomponents_all_date_${uin}">`;
  cellPrim.innerHTML = `<input type="text" value="${prim}" name="shipcomponents_all_prim_${uin}">`;

  let cellSNsetText      = document.createTextNode(SNset);      cellSNset.appendChild(cellSNsetText);
  let cellNPsetText      = document.createTextNode(NPset);      cellNPset.appendChild(cellNPsetText);
  let cellSetText        = document.createTextNode(set);        cellSet.appendChild(cellSetText);
  let cellProductText    = document.createTextNode(product);    cellProduct.appendChild(cellProductText);
  let cellCountText      = document.createTextNode(count);  cellCount.appendChild(cellCountText);
  let cellCompText       = document.createTextNode(component);  cellComp.appendChild(cellCompText);
  let cellInnproductText = document.createTextNode(innproduct); cellInnproduct.appendChild(cellInnproductText);
  let cellKontrText      = document.createTextNode(kontr);      cellKontr.appendChild(cellKontrText);
  //cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowShipComponentsAll(${uin},this)"><img src="../images/button/chb/checkbox.svg"></button>`;
}

/*
function funcUpdateRowShipComponentsAll(uin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"shipCompontsAll", "uinstatus":"", "date":"", "prim":"", "uin":`${uin}`};

  let target_table = tb_analysis_components_all;
  body.uinstatus = findForUpdateSelect(uin, target_table, "shipcomponents_all_select_");
  body.date = findForUpdateInput(`shipcomponents_all_date_${uin}`, target_table);
  body.prim = findForUpdateInput(`shipcomponents_all_prim_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  //setInterval(function(){location.reload();}, 500);
}
*/

sortAnalisys("sort_analysis_components", "tb_analysis_components_all", filt_analysis_components_all, "shipCompontsAll", funcProcessGetShipComponentsAll);

////////// ПОСТАВКА //////////
function funcGetDocpost(){
  let body  =  {"user":"demo", "meth":"view", "obj":"docpost", "count":"100"};
  funcCommand(body, funcProcessGetDocpost);
}

function funcProcessGetDocpost(result, respobj){
  if( result === 0 ) return;
  console.log("Док. поступления:", respobj);

  let tb_id = "tb_docpost";
  clearTable(tb_id);

  for (let key in respobj.answ){
    let obj = respobj.answ[key];
    let statdocName = obj.statdoc.name;
    let numb        = obj.numb;
    let date        = obj.date;
    let numb1c      = obj.numb1c;
    let date1c      = obj.date1c;
    let contrName   = obj.contr.name;
    let storageName = obj.storage.name;
    let userName    = obj.user.name;
    let sum         = obj.sum;
    let prim        = obj.prim;
    let del         = obj.del;
    let uin         = obj.uin;
    addDocpostRow(statdocName, numb, date, numb1c, date1c, contrName, storageName, userName, sum, prim, del, uin, tb_id);
  }
}

/* заполнение таблицы поставки */
function addDocpostRow(statdocName, numb, date, numb1c, date1c, contrName, storageName, userName, sum, prim, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellInfo        = newRow.insertCell(0);
  let cellStatdocName = newRow.insertCell(1);
  let cellNumb        = newRow.insertCell(2);
  let cellDate        = newRow.insertCell(3);
  let cellNumb1c      = newRow.insertCell(4);
  let cellDate1c      = newRow.insertCell(5);
  let cellContrName   = newRow.insertCell(6);
  let cellStorageName = newRow.insertCell(7);
  let cellUserName    = newRow.insertCell(8);
  //let cellSum         = newRow.insertCell(9);
  let cellPrim        = newRow.insertCell(9);
  let cellBtn         = newRow.insertCell(10);

  cellInfo.innerHTML        = `<button class="button_control" value="${uin}" onclick="funcInfoDocpostOpenModal(this)"><img src="../images/info.svg"></button>`;
  cellStatdocName.innerHTML = statdocName;
  cellNumb.innerHTML        = numb;
  cellDate.innerHTML        = date;
  cellNumb1c.innerHTML      = numb1c;
  cellDate1c.innerHTML      = date1c;
  cellContrName.innerHTML   = contrName;
  cellStorageName.innerHTML = storageName;
  cellUserName.innerHTML    = userName;
  cellPrim.innerHTML        = prim;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowDocpost(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления поставки */
function funcMdelRowDocpost(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"docpost", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* модальное окно поставки */
let modal_info_docpost = document.getElementById("modal_info_docpost");
let close_info_docpost = document.getElementById("close_info_docpost");

let select_docpost_statdoc = document.getElementById("docpost_statdoc");
let select_docpost_user    = document.getElementById("docpost_user");
let select_docpost_storage = document.getElementById("docpost_storage");
let input_docpost_contr   = document.getElementById("docpost_contr");
let input_docpost_numb     = document.getElementById("docpost_numb");
let input_docpost_date     = document.getElementById("docpost_date");
let input_docpost_numb1c   = document.getElementById("docpost_numb1c");
let input_docpost_date1c   = document.getElementById("docpost_date1c");
let input_docpost_prim     = document.getElementById("docpost_prim");
let button_docpost_save    = document.getElementById("docpost_save");

close_info_docpost.onclick = function() {
  modal_info_docpost.style.display = "none";
}

function funcGetInfoInputsDocpost(uin){
  let body_inputs  =  {"user":"demo", "meth":"view", "obj":"docpost", "count":"1", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
  funcCommand(body_inputs, funcProcessGetInfoInputsDocpost);
}

function funcGetInfoTableDocpost(uin){
  let body_table  =  {"user":"demo", "meth":"view", "obj":"compontpost", "count":"10", "uindoc":`${uin}`};
  funcCommand(body_table, funcProcessGetInfoTableDocpost);
}

function funcInfoDocpostOpenModal(elem){
  modal_info_docpost.style.display = "block";
  localStorage.setItem("docpost_uin", elem.value);

  setTimeout(function(){funcGetInfoInputsDocpost(elem.value)}, 100);
  setTimeout(function(){funcGetInfoTableDocpost(elem.value)}, 150);
}

function funcProcessGetInfoInputsDocpost(result, respobj){
  if( result === 0 ) return;
  console.log("Док. поступления 1:", respobj);

  removeOptions(select_docpost_statdoc);
  removeOptions(select_docpost_user);
  removeOptions(select_docpost_storage);
  input_docpost_contr.value  = "";
  input_docpost_numb.value   = "";
  input_docpost_date.value   = "";
  input_docpost_numb1c.value = "";
  input_docpost_date1c.value = "";
  input_docpost_prim.value   = "";

  for (let key in respobj.answ){
    let obj = respobj.answ[key];
    let statdocName = obj.statdoc.name;
    let statdocUin  = obj.statdoc.uin;
    let numb        = obj.numb;
    let date        = obj.date;
    let numb1c      = obj.numb1c;
    let date1c      = obj.date1c;
    let contrName   = obj.contr.name;
    let contrUin    = obj.contr.uin;
    let storageName = obj.storage.name;
    let storageUin  = obj.storage.uin;
    let userName    = obj.user.name;
    let userUin     = obj.user.uin;
    let prim        = obj.prim;
    addDocpostInfoInputs(statdocName, statdocUin, numb, date, numb1c, date1c, contrName, contrUin, storageName, storageUin, userName, userUin, prim);
  }
}

function addDocpostInfoInputs(statdocName, statdocUin, numb, date, numb1c, date1c, contrName, contrUin, storageName, storageUin, userName, userUin, prim){
  addToDropdownOneOption(select_docpost_statdoc, statdocName, statdocUin);
  addToDropdown(select_docpost_statdoc, "statusdoc_list");
  addToDropdownOneOption(select_docpost_storage, storageName, storageUin);
  addToDropdown(select_docpost_storage, "storages_list");
  addToDropdownOneOption(select_docpost_user, userName, userUin);
  addToDropdown(select_docpost_user, "users_list");
  input_docpost_contr.value  = contrName;
  input_docpost_numb.value   = numb;
  input_docpost_date.value   = date;
  input_docpost_numb1c.value = numb1c;
  input_docpost_date1c.value = date1c;
  input_docpost_prim.value   = prim;
}

/* функция обновления поставки */
function funcUpdateRowDocpost(elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"docpost","uin":"", "numb":"", "date":"", "prim":"", "uinstatus":"", "uinuser":"", "uinstorage":""};

  body.uin        = localStorage.getItem("docpost_uin");
  body.numb       = input_docpost_numb.value;
  body.date       = input_docpost_date.value;
  body.prim       = input_docpost_prim.value;
  body.uinstatus  = select_docpost_statdoc.value;
  body.uinuser    = select_docpost_user.value;
  body.uinstorage = select_docpost_storage.value;

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSaveModal(elem);
  //setTimeout(function(){funcGetColors()}, 100);
}

function funcProcessGetInfoTableDocpost(result, respobj){
  if( result === 0 ) return;
  console.log("Таблица док. поступления 1:", respobj);

  let tb_id = "tb_modal_docpost";
  clearTableAll(tb_id);

  for (let key in respobj.answ){
    let obj = respobj.answ[key];
    let name        = obj.name;
    let compontName = obj.compont.name;
    let compontUin  = obj.compont.uin;
    let measName    = obj.meas.name;
    let measUin     = obj.meas.uin;
    let storageName = obj.storage.name;
    let storageUin  = obj.storage.uin;
    let count       = obj.count;
    let del         = obj.del;
    let uin         = obj.uin;
    addDocpostInfoTable(name, compontName, compontUin, measName, measUin, storageName, storageUin, count, del, uin, tb_id);
  }
}

function addDocpostInfoTable(name, compontName, compontUin, measName, measUin, storageName, storageUin, count, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName    = newRow.insertCell(0);
  let cellCompont = newRow.insertCell(1);
  let cellMeas    = newRow.insertCell(2);
  let cellStorage = newRow.insertCell(3);
  let cellCount   = newRow.insertCell(4);
  let cellBtn     = newRow.insertCell(5);

  cellName.innerHTML = `<input type="text" value="${name}" class="input_component_1c" disabled style="width:90%">`;
  cellCompont.innerHTML = `<button class="button_select" id="docpost_component_${uin}" value="${compontUin}" onclick="funcComponentsSelect(this)">${compontName}</button>`;
  makeSelectForСompositeTables(uin, measName, measUin, "meas_list", "docpost_meas_select_", "docpost_meas_select", "docpost_meas_select", cellMeas);
  makeSelectForСompositeTables(uin, storageName, storageUin, "storages_list", "docpost_storage_select_", "docpost_storage_select", "docpost_storage_select", cellStorage);
  cellCount.innerHTML = `<input type="text" value="${count}" name="docpost_count_${uin}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowDocpostInfoTable(${uin},${measUin},${storageUin},this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowColors(${uin},this)" disabled><img src="../images/button/cross_w.svg"></button>`;
}

function funcUpdateRowDocpostInfoTable(uin, measUin, storageUin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"compontpost", "uin":`${uin}`, "uincompont":"", "uinstorage":"", "uinmeas":"", "count":""};

  let target_table = tb_modal_docpost;
  body.uincompont  = document.getElementById(`docpost_component_${uin}`).value;
  body.uinmeas     = findForUpdateSelectFormula(uin, measUin, target_table, "docpost_meas_select_");
  body.uinstorage  = findForUpdateSelectFormula(uin, storageUin, target_table, "docpost_storage_select_");
  body.count       = findForUpdateInput(`docpost_count_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetInfoTableDocpost(localStorage.getItem("docpost_uin"))}, 150);
}

////////// СПРАВОЧНИКИ //////////
//////////
/* цвета */
function funcGetColors(){
  let body  =  {"user":"demo", "meth":"view", "obj":"colors", "count":"100"};
  funcCommand(body, funcProcessGetColors);
}

function funcProcessGetColors(result, respobj){
  if( result === 0 ) return;
  console.log("Цвета:", respobj);
  let tb_id = "tb_products_colors";
  clearTable(tb_id);

  let colors_list = respobj.answ;
  localStorage.setItem("colors_list", JSON.stringify(colors_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addColorsRow(name, del, uin, tb_id);
  }
  //addToDropdownPsevdo("filt_colors_items", respobj.answ);
}

function addColorsRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowColors(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowColors(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления цвета */
function funcMdelRowColors(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"colors", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления цвета */
function funcUpdateRowColors(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"colors", "name":"", "uin":`${uin}`};

  let target_table = tb_products_colors;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetColors()}, 100);
}

/* функция добавления цвета */
function funcAddRowColors(){
  let body  =  {"user":"demo", "meth":"add", "obj":"colors", "name":""};

  let name_value = document.getElementById("input_add_colors").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_colors").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetColors()}, 100);
  }
}

listenSortSelect("sort_colors", "tb_products_colors", "colors", funcProcessGetColors);

//////////
/* версии плат */
function funcGetVerapp(){
  let body  =  {"user":"demo", "meth":"view", "obj":"verapp", "count":"100" };
  funcCommand(body, funcProcessGetVerapp);
}

function funcProcessGetVerapp(result, respobj){
  if( result === 0 ) return;
  console.log("verapp:", respobj);
  let tb_id = "tb_products_verapp";
  clearTable(tb_id);

  let verapp_list = respobj.answ;
  localStorage.setItem("verapp_list", JSON.stringify(verapp_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addVerappRow(name, del, uin, tb_id);
  }
}

function addVerappRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowVerapp(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowVerapp(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления версии плат */
function funcMdelRowVerapp(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"verapp", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления версии плат */
function funcUpdateRowVerapp(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"verapp", "name":"", "uin":`${uin}`};

  let target_table = tb_products_verapp;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetVerapp()}, 100);
}

/* функция добавления версии плат */
function funcAddRowVerapp(){
  let body  =  {"user":"demo", "meth":"add", "obj":"verapp", "name":""};

  let name_value = document.getElementById("input_add_verapp").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_verapp").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetVerapp()}, 100);
  }
}

listenSortSelect("sort_verapp", "tb_products_verapp", "verapp", funcProcessGetVerapp);

//////////
/* версии по */
function funcGetVerpp(){
  let body  =  {"user":"demo", "meth":"view", "obj":"verpp", "count":"100" };
  funcCommand(body, funcProcessGetVerpp);
}

function funcProcessGetVerpp(result, respobj){
  if( result === 0 ) return;
  console.log("verpp:", respobj);
  let tb_id = "tb_products_verpp";
  clearTable(tb_id);

  let verpp_list = respobj.answ;
  localStorage.setItem("verpp_list", JSON.stringify(verpp_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addVerppRow(name, del, uin, tb_id);
  }
}

function addVerppRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowVerpp(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowVerpp(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления версии по */
function funcMdelRowVerpp(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"verpp", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления версии по */
function funcUpdateRowVerpp(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"verpp", "name":"", "uin":`${uin}`};

  let target_table = tb_products_verpp;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetVerpp()}, 100);
}

/* функция добавления версии по */
function funcAddRowVerpp(){
  let body  =  {"user":"demo", "meth":"add", "obj":"verpp", "name":""};

  let name_value = document.getElementById("input_add_verpp").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_verpp").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetVerpp()}, 100);
  }
}

listenSortSelect("sort_verpp", "tb_products_verpp", "verpp", funcProcessGetVerpp);

/* каталог комплектующие дерево */
function funcGetComponentsTree(){
  let body  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"100"};
  funcCommand(body, funcProcessGetComponentsTree);
}

function funcProcessGetComponentsTree(result, respobj){
  if( result === 0 ) return;
  console.log("Дерево:", respobj);

  $('#jstree_div').jstree({
    core: {
      data: respobj.answ
    },
    "plugins" : [ "state", "unique", "contextmenu", "dnd" ],
  });

  $('#jstree_div').on('changed.jstree', function (e, data) {
    let objNode = data.instance.get_node(data.selected);

    let uin = objNode.id;
    localStorage.setItem("uincatC", uin);

    let tb_id = "tb_components_tree";
    clearTableAll(tb_id);

    let table = document.getElementById(tb_id);
    let row_head   = table.insertRow(-1);
    row_head.innerHTML = `<tr><td></td><td></td><td></td><td></td><td class="cell_button"><button class="button_add" onclick="funcInfoComponentsOpenModalAdd(${uin})"><img src="../images/plus.svg" alt=""></button></td></tr>`;

    funcGetComponents(uin);

    funcMarkNode(respobj.answDop);
  });

  $('#jstree_div').on('click.jstree', function (){
    funcMarkNode(respobj.answDop);
  });
}

/* пометка папки */
function funcMarkNode(arr){
  for(let i in arr){
    let id  = arr[i].id;
    let del = arr[i].del;

    if(del === 1){
      let node = document.getElementById(`${id}_anchor`);
      if(node != null){
        node.style.color = "red";
      }
    }
  }
}

/* каталог комплектующих */
function funcGetComponents(uin){
  let body  =  {"user":"demo", "meth":"view","obj":"dirC", "uin":`${uin}`, "count":"5000"};
  funcCommand(body, funcProcessGetComponents);
}

function funcProcessGetComponents(result, respobj){
  if( result === 0 ) return;
  console.log("Директория:", respobj);

  let tb_id = "tb_components_tree"
  clearTable(tb_id);

  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let fUnic = set.fUnic;
    let typelm = set.typelm.name;
    let del = set.del;
    let uin = set.uin;
    addComponents(name, fUnic, typelm, del, uin, tb_id);
  }
}

function addComponents(name, fUnic, typelm, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellInfo   = newRow.insertCell(0);
  let cellFUnic  = newRow.insertCell(1);
  let cellName   = newRow.insertCell(2);
  let cellTypelm = newRow.insertCell(3);
  let cellBtn = newRow.insertCell(4);

  cellInfo.innerHTML = `<button class="button_control" value="${uin}" onclick="funcInfoComponentsOpenModal(this)"><img src="../images/info.svg"></button>`;
  fUnic === 1 ? cellFUnic.innerHTML = `<input type="checkbox" class="custom-checkbox" id="chb_funic_${uin}" disabled checked><label for="chb_funic_${uin}"></label>` : 
                cellFUnic.innerHTML = `<input type="checkbox" class="custom-checkbox" id="chb_funic_${uin}" disabled><label for="chb_funic_${uin}"></label>`;
  let cellNameText   = document.createTextNode(name); cellName.appendChild(cellNameText);
  let cellTypelmText   = document.createTextNode(typelm); cellTypelm.appendChild(cellTypelmText);

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowComponents(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* модальное окно */
let modal_info_component = document.getElementById("modal_info_component");
let span_info_component = document.getElementById("close_info");
let component_input_name = document.getElementById("component_name");
let component_select_type = document.getElementById("component_type");
let component_checkbox_funic = document.getElementById("component_unic");
let component_select_typesprops_add_name = document.getElementById("component_info_add_props_select");
let component_select_typesprops_name = document.getElementsByClassName("component_info_props_select");

span_info_component.onclick = function(){
  let result = confirm("Вы покидаете окно редактирования комплектующего! Вы сохранили все изменения?");
  if(result === true){
    if(location.hash === "#dir_components/components"){
      modal_info_component.style.display = "none";
    } else {
      modal_info_component.style.display = "none";
      modal_select_component.style.display = "block";
    }
  }
}

function funcInfoComponentsOpenModal(elem){
  modal_info_component.style.display = "block";
  modal_select_component.style.display = "none";

  funcGetComponentInfo(elem.value);
  setTimeout(function(){funcGetComponentInfoProps(elem.value)}, 100);
}

function funcInfoComponentsOpenModalAdd(uin){
  modal_info_component.style.display = "block";
  modal_select_component.style.display = "none";

  funcProcessInfoComponentsModalAdd(uin);
}

function funcProcessInfoComponentsModalAdd(uin){
  component_input_name.value = "";
  removeOptionsSetValue("component_type", "---");
  removeOptionsSetValue("component_info_add_props_select", "---");
  component_checkbox_funic.checked = false;
  document.getElementById("main_tb_modal_info_component").style.display = "none";
  clearTable("tb_modal_info_component");
  document.getElementById("component_info_add_d1").disabled = true;
  document.getElementById("component_info_add_d2").disabled = true;

  let component_add = document.getElementById("component_add");
  component_add.value = uin;
  component_add.style.display = "flex";
  document.getElementById("component_save").style.display = "none";

  addToDropdown(component_select_type, "typelm_list");
}

component_type.addEventListener("change", function (){
  if(component_save.style.display === "flex"){
    let result = confirm("Вы меняете тип! Если вы подтверждаете, то все свойства будут удалены! Подтвердить?");
    if(result === true){
      setTimeout(function(){
        for (let i of component_select_typesprops_name){
          let body  =  {"user":"demo", "meth":"fulldel", "obj":"compontsprops", "uincompont":`${i.name}`};
          funcCommand(body, funcProcessOnlyInfo);
        }
        clearTable("tb_modal_info_component");
      }, 100);

      setTimeout(function(){
        removeOptionsSetValue("component_info_add_props_select", "---");
        funcGetComponentInfoTypesProps(component_type.value);
      }, 150);

      setTimeout(function(){
        addToDropdown(component_select_typesprops_add_name, "typesprops_list");
        document.getElementById("component_save").click();
      }, 200);
    }
  }
});

component_info_add_props_select.addEventListener("change", function (){
  let body  =  {"user":"demo", "meth":"view", "obj":"props", "count":"100", "filt":`[{"fld":"uin","val":["${component_info_add_props_select.value}"]}]`};
  funcCommand(body, funcSelectAddMeasOnTable);

  function funcSelectAddMeasOnTable(result, respobj){
    if( result === 0 ) return;
    component_info_add_props_select.parentElement.nextElementSibling.innerText = respobj.answ[0].meas.name;
  }
});

/* функция удаления комплектующего */
function funcMdelRowComponents(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"components", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления комплектующего */
function funcUpdateRowComponents(elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"components", "name":"", "uin":`${elem.value}`, "fUnic":"", "uintypes":""};

  let name_value     = document.getElementById("component_name").value;
  let uintypes_value = document.getElementById("component_type").value;
  let fUnic          = document.getElementById("component_unic");
  let fUnic_value    = null;
  fUnic.checked === true ? fUnic_value = "1" : fUnic_value = "0";

  body.name     = name_value;
  body.uintypes = uintypes_value;
  body.fUnic    = fUnic_value;

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSaveModal(elem);
  setTimeout(function(){clearTable("tb_components_tree")}, 100);
  setTimeout(function(){funcGetComponents(localStorage.getItem("uincatC"))}, 150);
}

/* функция добавления комплектующего */
function funcAddComponents(elem){
  let body  =  {"user":"demo", "meth":"add", "obj":"components", "name":"", "uincatC":`${elem.value}`, "uintypes":"", "fUnic":""};

  let name_value = document.getElementById("component_name").value;
  let type_value = document.getElementById("component_type").value;
  let fUnic      = document.getElementById("component_unic");

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name       = name_value;
    body.uintypes   = type_value;

    let fUnic_value = null;
    fUnic.checked === true ? fUnic_value = "1" : fUnic_value = "0";
    body.fUnic      = fUnic_value;

    funcCommand(body, funcProcessOnlyInfo);
    highlightButtonSaveModal(elem);
    setTimeout(function(){clearTable("tb_modal_info_component")}, 100);
    setTimeout(function(){clearTable("tb_components_tree")}, 150);
    setTimeout(function(){funcGetComponents(localStorage.getItem("uincatC"))}, 200);
    setTimeout(function(){modal_info_component.style.display = "none";}, 250);
  }
}

/* инфо о комплектующем в модальном окне */
function funcGetComponentInfo(uin){
  let body  =  {"user":"demo", "meth":"view","obj":"components", "count":"10", "sort":"uin", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
  funcCommand(body, funcProcessGetComponentInfo);
}

function funcProcessGetComponentInfo(result, respobj){
  if( result === 0 ) return;
  console.log("Комплектующее ИНФО:", respobj);

  document.getElementById("component_name").value = "";
  let select = document.getElementById("component_type");
  select.value = "";
  let len = select.length;
  for (let i = 0; i < len; i++) {
    select.remove(0);
  }

  for (let key in respobj.answ){
    let set       = respobj.answ[key];
    let name      = set.name;
    let fUnic     = set.fUnic;
    let typelm    = set.typelm.name;
    let typelmUin = set.typelm.uin;
    let uin       = set.uin;
    addComponentInfo(name, fUnic, typelm, typelmUin, uin);
  }
}

function addComponentInfo(name, fUnic, typelm, typelmUin, uin){
  let input = document.getElementById("component_name");
  input.value = name;

  funcGetComponentInfoTypesProps(typelmUin);

  let select = document.getElementById("component_type");
  let option = document.createElement("option");
  if(typelm === ''){typelm = "---"}
  option.text = typelm;
  option.value = typelmUin;
  select.appendChild(option);

  addToDropdown(select, "typelm_list");

  let select_unic = document.getElementById("component_unic");
  fUnic === 1 ? select_unic.checked = true : select_unic.checked = false;

  document.getElementById("component_info_add_button").value = "";
  document.getElementById("component_save").value = "";

  document.getElementById("component_info_add_button").value = uin;
  document.getElementById("component_save").value = uin;

  document.getElementById("component_add").style.display = "none";
  document.getElementById("component_save").style.display = "flex";
}

component_unic.addEventListener('click', function () {
  let inputs = document.getElementsByClassName("component_info_input");
  if(component_unic.checked !== true){
    for(let i of inputs){
      i.disabled = true;
    }
  } else {
    for(let i of inputs){
      i.disabled = false;
    }
  }
});

/* соответствия типов елементов-комплектующих и свойств комплект-х */
function funcGetComponentInfoTypesProps(uin){
  let body  =  {"user":"demo", "meth":"view", "obj":"typesprops", "count":"100", "uintypes":`${uin}`}
  funcCommand(body, funcProcessGetComponentInfoTypesProps);
}

function funcProcessGetComponentInfoTypesProps(result, respobj){
  if( result === 0 ) return;
  console.log("Комплектующее TypesProps:", respobj);

  let typesprops_list = respobj.answ;
  localStorage.setItem("typesprops_list", JSON.stringify(typesprops_list));
}

/* св-ва комплектующего в модальном окне */
function funcGetComponentInfoProps(uin){
  let body  =  {"user":"demo", "meth":"view", "obj":"compontsprops", "count":"100", "uincompont":`${uin}`}
  funcCommand(body, funcProcessGetComponentInfoProps);
}

function funcProcessGetComponentInfoProps(result, respobj){
  if( result === 0 ) return;
  console.log("Комплектующее св-ва:", respobj);

  let select = document.getElementById("component_info_add_props_select");
  removeOptions(select);
  let option = document.createElement("option");
  option.text = "---";
  select.appendChild(option);

  component_info_add_props_select.parentElement.nextElementSibling.innerText = "---";

  addToDropdown(select, "typesprops_list");
  
  let tb_id = "tb_modal_info_component"
  clearTable(tb_id);

  for (let key in respobj.answ){
    let set      = respobj.answ[key];
    let props    = set.props.name;
    let propsUin = set.props.uin;
    let meas     = set.meas.name;
    let value    = set.value;
    let perc     = set.perc;
    let d1       = set.d1;
    let d2       = set.d2;
    let del      = set.del;
    let uin      = set.uin;
    let uincompont = set.uincompont;
    addComponentInfoProps(props, propsUin, meas, value, perc, d1, d2, del, uin, uincompont, tb_id);
  }

  let select_unic = document.getElementById("component_unic");
  let inputs = document.getElementsByClassName("component_info_input");
  if(select_unic.checked === true){
    for(i of inputs){i.disabled = false};
  } else {
    select_unic.checked = false;
    for(i of inputs){i.disabled = true};
  }
}

function addComponentInfoProps(props, propsUin, meas, value, perc, d1, d2, del, uin, uincompont, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow     = tableRef.insertRow(-1);

  let cellProps  = newRow.insertCell(0);
  let cellMeas   = newRow.insertCell(1);
  let cellValue  = newRow.insertCell(2);
  let cellPerc   = newRow.insertCell(3);
  let cellD1     = newRow.insertCell(4);
  let cellD2     = newRow.insertCell(5);
  let cellBtn = newRow.insertCell(6);

  makeSelectForСompositeTables(uin, props, propsUin, "typesprops_list", "component_info_props_select_", "component_info_props_select", uincompont, cellProps);
  let cellMeasText    = document.createTextNode(meas); cellMeas.appendChild(cellMeasText);
  cellValue.innerHTML = `<input type="text" name="component_info_value_${uin}" value="${value}">`;
  cellPerc.innerHTML  = `<input type="text" name="component_info_perc_${uin}" value="${perc}">`;
  cellD1.innerHTML    = `<input type="text" name="component_info_d1_${uin}" class="component_info_input" value="${d1}">`;
  cellD2.innerHTML    = `<input type="text" name="component_info_d2_${uin}" class="component_info_input" value="${d2}">`;

  let select = document.getElementById(`component_info_props_select_${propsUin}_${uin}`);
  select.addEventListener("change", function (){
    let body  =  {"user":"demo", "meth":"view", "obj":"props", "count":"100", "filt":`[{"fld":"uin","val":["${select.value}"]}]`};
    funcCommand(body, funcSelectMeasOnTable);
  
    function funcSelectMeasOnTable(result, respobj){
      if( result === 0 ) return;
      select.parentElement.nextElementSibling.innerText = respobj.answ[0].meas.name;
    }
  });

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateComponentInfoProps(${uin},${uincompont},${propsUin},this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelComponentInfoProps(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления св-во комплектующего */
function funcMdelComponentInfoProps(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"compontsprops", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновлении св-во комплектующего */
function funcUpdateComponentInfoProps(uin, uincompont, propsUin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"compontsprops", "uin":`${uin}`, "uincompont":`${uincompont}`, "uinprops":"", "value":"", "d1":"", "d2":"", "perc":""};

  let target_table = main_tb_modal_info_component;
  body.uinprops = findForUpdateSelectFormula(uin, propsUin, target_table, "component_info_props_select_");
  body.value    = findForUpdateInput(`component_info_value_${uin}`, target_table);
  body.d1       = findForUpdateInput(`component_info_d1_${uin}`, target_table);
  body.d2       = findForUpdateInput(`component_info_d2_${uin}`, target_table);
  body.perc     = findForUpdateInput(`component_info_perc_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  funcGetComponentInfo(uincompont);
  setTimeout(function(){funcGetComponentInfoProps(uincompont)}, 100);
}

/* функция добавления св-ва комплектующего */
function funcAddComponentInfoProps(elem){
  let body  =  {"user":"demo", "meth":"add", "obj":"compontsprops", "uincompont":`${elem.value}`, "uinprops":"", "value":"", "d1":"", "d2":"", "perc":""};

  let uinprops_value = document.getElementById(`component_info_add_props_select`).value;
  let value_value    = document.getElementById(`component_info_add_value`).value;
  let d1_value       = document.getElementById(`component_info_add_d1`).value;
  let d2_value       = document.getElementById(`component_info_add_d2`).value;
  let perc_value     = document.getElementById(`component_info_add_perc`).value;

  if(uinprops_value === "" || value_value === "" || perc_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.uinprops = uinprops_value;
    body.value    = value_value;
    body.d1       = d1_value;
    body.d2       = d2_value;
    body.perc     = perc_value;
  
    removeOptionsSetValue(`component_info_add_props_select`, "---");
    document.getElementById(`component_info_add_value`).value = "";
    document.getElementById(`component_info_add_d1`).value = "";
    document.getElementById(`component_info_add_d2`).value = "";
    document.getElementById(`component_info_add_perc`).value = "";
  
    funcCommand(body, funcProcessOnlyInfo);
    funcGetComponentInfo(elem.value);
    setTimeout(function(){funcGetComponentInfoProps(elem.value)}, 100);
  }
}

/* каталог комплектующие дерево выбор */
/* модальное окно */
let modal_select_component = document.getElementById("modal_select_component");
let span_select_component = document.getElementById("close_component_select");

span_select_component.onclick = function() {
  if(window.location.hash.includes("_formula")){
    modal_select_component.style.display = "none";
  } else {
    modal_select_component.style.display = "none";
    modal_info_docpost.style.display = "block";
  }
}
function funcComponentsSelect(elem){
  if(window.location.hash.includes("_formula")){
    modal_select_component.style.display = "block";
  } else {
    modal_info_docpost.style.display = "none";
    modal_select_component.style.display = "block";
  }

  funcGetComponentsTreeSelect();
  localStorage.setItem("button_select_component_id", elem.id);
}

function funcGetComponentsTreeSelect(){
  let body  =  {"user":"demo", "meth":"view", "obj":"catC", "count":"100"};
  funcCommand(body, funcProcessGetComponentsTreeSelect);
}

function funcProcessGetComponentsTreeSelect(result, respobj){
  if( result === 0 ) return;

  $('#modal_select_component_tree').jstree({
    core: {
      data: respobj.answ
    },
    "plugins" : ["state"],
  });

  $('#modal_select_component_tree').on('changed.jstree', function (e, data) {
    let objNode = data.instance.get_node(data.selected);

    let uin = objNode.id;

    let body  =  {"user":"demo", "meth":"view","obj":"dirC", "uin":`${uin}`, "count":"5000" };
    funcCommand(body, funcProcessGetComponentsSelect);
  })

  $('#modal_select_component_tree').on('click.jstree', function (){
    funcMarkNode(respobj.answDop);
  });
}

function funcProcessGetComponentsSelect(result, respobj){
  if( result === 0 ) return;

  let tb_id = "tb_component_select"
  clearTableAll(tb_id);

  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addComponentsSelect(name, del, uin, tb_id);
  }
}

function addComponentsSelect(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellSelect = newRow.insertCell(0);
  let cellInfo   = newRow.insertCell(1);
  let cellName   = newRow.insertCell(2);
  let cellBtn = newRow.insertCell(3);

  if(del != 0){
    cellSelect.innerHTML = `<button class="button_add" disabled><img src="../images/plus.svg" alt=""></button>`;
  } else {
    cellSelect.innerHTML = `<button class="button_add" value="${uin}" name="${name}" onclick="funcComponentsSelectTakeUin(this)"><img src="../images/plus.svg" alt=""></button>`;
  }

  cellInfo.innerHTML = `<button class="button_control" value="${uin}" onclick="funcInfoComponentsOpenModal(this)"><img src="../images/info.svg"></button>`;
  cellName.innerHTML = name;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" style="background:${bx_color}" disabled><img src="../images/button/cross_w.svg"></button>`;
}

function funcComponentsSelectTakeUin(elem){
  result = confirm("Подтверждаете выбор комплектующего?");
  if(result === true){
    if(window.location.hash.includes("_formula")){    
      modal_select_component.style.display = "none";
    } else {
      modal_select_component.style.display = "none";
      modal_info_docpost.style.display = "block";
    }

    let button = document.getElementById(localStorage.getItem("button_select_component_id"));
    button.value = elem.value;
    button.innerText = elem.name;
  }
}

//////////
/* единицы измерения */
function funcGetMeas(){
  let body  =  {"user":"demo", "meth":"view", "obj":"meas", "count":"100"};
  funcCommand(body, funcProcessGetMeas);
}

function funcProcessGetMeas(result, respobj){
  if( result === 0 ) return;
  console.log("Ед. изм.:", respobj);
  let tb_id = "tb_componenets_measurement";
  clearTable(tb_id);

  let meas_list = respobj.answ;
  localStorage.setItem("meas_list", JSON.stringify(meas_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addMeasRow(name, del, uin, tb_id);
  }
  //addToDropdownPsevdo("filt_colors_items", respobj.answ);
}

function addMeasRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowMeas(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowMeas(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления единицы измерения */
function funcMdelRowMeas(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"meas", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления единицы измерения */
function funcUpdateRowMeas(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"meas", "name":"", "uin":`${uin}`};

  let target_table = tb_componenets_measurement;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetMeas()}, 100);
}

/* функция добавления единицы измерения */
function funcAddRowMeas(){
  let body  =  {"user":"demo", "meth":"add", "obj":"meas", "name":""};

  let name_value = document.getElementById("input_add_measurement").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_measurement").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetMeas()}, 100);
  }
}

listenSortSelect("sort_measurement", "tb_componenets_measurement", "meas", funcProcessGetMeas);

//////////
/* Типы элементов-комплектующих */
function funcGetTypeselem(){
  let body  =  {"user":"demo", "meth":"view", "obj":"typeselem", "count":"100"};
  funcCommand(body, funcProcessGetTypeselem);
}

function funcProcessGetTypeselem(result, respobj){
  if( result === 0 ) return;
  console.log("Типы элем.:", respobj);
  let tb_id = "tb_componenets_typeselem";
  clearTable(tb_id);

  let typelm_list = respobj.answ;
  localStorage.setItem("typelm_list", JSON.stringify(typelm_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addTypeselemRow(name, del, uin, tb_id);
  }
  //addToDropdownPsevdo("filt_colors_items", respobj.answ);
}

function addTypeselemRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellInfo   = newRow.insertCell(0);
  let cellName   = newRow.insertCell(1);
  let cellBtn = newRow.insertCell(2);

  cellInfo.innerHTML = `<button class="button_control" value="${uin}" name="${name}" onclick="funcInfoTypeselemOpenModal(this)"><img src="../images/info.svg"></button>`;
  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowTypeselem(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowTypeselem(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления Типы элементов-комплектующих */
function funcMdelRowTypeselem(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"typeselem", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления Типы элементов-комплектующих */
function funcUpdateRowTypeselem(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"typeselem", "name":"", "uin":`${uin}`};

  let target_table = tb_componenets_typeselem;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetTypeselem()}, 100);
}

/* функция добавления Типы элементов-комплектующих */
function funcAddRowTypeselem(){
  let body  =  {"user":"demo", "meth":"add", "obj":"typeselem", "name":""};

  let name_value = document.getElementById("input_add_typeselem").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_typeselem").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetTypeselem()}, 100);
  }
}

listenSortSelect("sort_typeselem", "tb_componenets_typeselem", "typeselem", funcProcessGetTypeselem);


/* модальное окно */
let modal_typeselem = document.getElementById("modal_typeselem");
let span_typeselem = document.getElementById("close_typeselem");

span_typeselem.onclick = function() {
  modal_typeselem.style.display = "none";
}

function funcInfoTypeselemOpenModal(elem){
  modal_typeselem.style.display = "block";

  let body  =  {"user":"demo", "meth":"view","obj":"typesprops", "count":"100", "uintypes":`${elem.value}`}
  funcCommand(body, funcProcessGetInfoTypeselem);
}

function funcProcessGetInfoTypeselem(result, respobj){
  if( result === 0 ) return;
  console.log("Св-ва типа:", respobj);

  document.getElementById("typeselem_name").value = "";

  let tb_id = "tb_modal_typeselem";
  clearTable(tb_id);

  removeOptionsSetValue("typeselem_add_props_select", "---");
  addToDropdown(typeselem_add_props_select, "props_list")

  if(respobj.answ === ''){
    let compName = respobj.answDop.name;
    let typeUin  = respobj.answDop.uintypes;
    let propName = '---';
    let propUin  = '';
    let meas     = '---';
    let del      = '';
    clearTable(tb_id);
    addInfoTypeselem(compName, typeUin, propName, propUin, meas, del, tb_id, respobj.answ);
  } else {
    let compName = respobj.answDop.name;
    let typeUin  = respobj.answDop.uintypes;
    for (let key in respobj.answ){
      let prop     = respobj.answ[key];
      let propName = prop.name;
      let propUin  = prop.uin;
      let meas     = prop.meas;
      let del      = prop.tpdel;
      addInfoTypeselem(compName, typeUin, propName, propUin, meas, del, tb_id, respobj.answ);
    }
  }
}

function addInfoTypeselem(compName, typeUin, propName, propUin, meas, del, tb_id, arr){
  let input = document.getElementById("typeselem_name");
  input.value = compName;

  let tableRef = document.getElementById(tb_id);
  let newRow   = tableRef.insertRow(-1);

  let cellProps = newRow.insertCell(0);
  let cellMeas  = newRow.insertCell(1);
  let cellBtn   = newRow.insertCell(2);

  let select = document.createElement("select");
  let option = document.createElement("option");
  option.text = propName;
  select.appendChild(option);
  cellProps.appendChild(select);

  for (let key in arr) {
    if(arr[key].del === 0){
      let newOption = new Option(arr[key].name, arr[key].uin);
      select.append(newOption);
    }
  }

  cellMeas.innerHTML = meas;

  typeselem_add_button.value = typeUin;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowInfoTypeselem(${typeUin},${propUin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления св-ва типа элементов-комплектующих */
function funcMdelRowInfoTypeselem(typeUin, propUin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"typesprops", "uintypes":`${typeUin}`, "uinprops":`${propUin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция добавления св-ва типа элементов-комплектующих */
function funcAddRowInfoTypeselem(elem){
  let body  =  {"user":"demo", "meth":"add", "obj":"typesprops", "uintypes":`${elem.value}`, "uinprops":""};

  let uinprops_value = document.getElementById("typeselem_add_props_select").value;

  if(uinprops_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.uinprops = uinprops_value;

    funcCommand(body, funcProcessOnlyInfo);
    setInterval(function(){location.reload()}, 500);
  }
}

//////////
/* Свойства */
function funcGetProps(){
  let body  =  {"user":"demo", "meth":"view", "obj":"props", "count":"100"};
  funcCommand(body, funcProcessGetProps);
}

function funcProcessGetProps(result, respobj){
  if( result === 0 ) return;
  console.log("Свойства:", respobj);
  let tb_id = "tb_componenets_props";
  clearTable(tb_id);

  let props_list = respobj.answ;
  localStorage.setItem("props_list", JSON.stringify(props_list));

  let select = document.getElementById("select_add_props");
  addToDropdown(select, "meas_list");

  for (let key in respobj.answ){
    let set     = respobj.answ[key];
    let name    = set.name;
    let del     = set.del;
    let uin     = set.uin;
    let meas    = set.meas.name;
    let uinmeas = set.meas.uin;
    addPropsRow(name, del, uin, meas, uinmeas, tb_id);
  }
  //addToDropdownPsevdo("filt_colors_items", respobj.answ);
}

function addPropsRow(name, del, uin, meas, uinmeas, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName   = newRow.insertCell(0);
  let cellMeas   = newRow.insertCell(1);
  let cellBtn = newRow.insertCell(2);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let select = document.createElement("select");
  select.id = `props_select_${uinmeas}`;
  let option = document.createElement("option");
  option.text = meas;
  option.value = "";
  select.appendChild(option);
  cellMeas.appendChild(select);

  addToDropdown(select, "meas_list");

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowProps(${uin},'${name}',${uinmeas},this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowProps(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления Свойства */
function funcMdelRowProps(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"props", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления Свойства */
function funcUpdateRowProps(uin, name, uinmeas, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"props", "name":"", "uin":`${uin}`, "uinmeas":""};

  let target_table = tb_componenets_props;
  body.name = findForUpdateInput(name, target_table);
  body.uinmeas = findForUpdateSelect(uinmeas, target_table, "props_select_");

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetProps()}, 100);
}

/* функция добавления Свойства */
function funcAddRowProps(){
  let body  =  {"user":"demo", "meth":"add", "obj":"props", "name":"", "uinmeas":""};

  let name_value = document.getElementById("input_add_props").value;
  let uinmeas_value = document.getElementById("select_add_props").value;

  if(name_value === "" && uinmeas_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;
    body.uinmeas = uinmeas_value;

    document.getElementById("input_add_props").value = "";
    removeOptionsSetValue("select_add_props", "-- Выберите ед. изм. --");

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetProps()}, 100);
  }
}

//////////
/* контрагенты */
function funcGetContragents(){
  let body  =  {"user":"demo", "meth":"view", "obj":"contragents", "count":"100"};
  funcCommand(body, funcProcessGetContragents);
}

function funcProcessGetContragents(result, respobj){
  if( result === 0 ) return;
  console.log("Контрагенты:", respobj);

  let contragents_list = respobj.answ;
  localStorage.setItem("contragents_list", JSON.stringify(contragents_list));
  
  let tb_id = "tb_contragents";
  clearTable(tb_id);

  for (let key in respobj.answ) {
    let set = respobj.answ[key];
    let name = set.name;
    let kpp = set.kpp;
    let inn = set.inn;
    let address = set.address;
    let del = set.del;
    let uin = set.uin;
    addContragentsRow(name, kpp, inn, address, del, uin, tb_id);
  }
}

function addContragentsRow(name, kpp, inn, address, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellKpp = newRow.insertCell(1);
  let cellInn = newRow.insertCell(2);
  let cellAddress = newRow.insertCell(3);
  let cellBtn = newRow.insertCell(4);

  cellName.innerHTML = `<input type="text" value="${name}" name="name_${uin}">`;
  cellKpp.innerHTML = `<input type="text" value="${kpp}" name="kpp_${uin}">`;
  cellInn.innerHTML = `<input type="text" value="${inn}" name="inn_${uin}">`;
  cellAddress.innerHTML = `<input type="text" value="${address}" name="address_${uin}">`;

  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowContragents(${uin},this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowContragents(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления контрагенты */
function funcMdelRowContragents(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"contragents", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления контрагенты */
function funcUpdateRowContragents(uin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"contragents", "name":"", "inn":"", "kpp":"", "address":"", "uin":`${uin}`};

  let target_table = tb_contragents;
  body.name = findForUpdateInput(`name_${uin}`, target_table);
  body.inn = findForUpdateInput(`inn_${uin}`, target_table);
  body.kpp = findForUpdateInput(`kpp_${uin}`, target_table);
  body.address = findForUpdateInput(`address_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetContragents()}, 100);
}

/* функция добавления контрагенты */
function funcAddRowContragents(){
  let body  =  {"user":"demo", "meth":"add", "obj":"contragents", "name":"", "inn":"", "kpp":"", "address":""};

  let name_value = document.getElementById("input_add_contragents_name").value
  let kpp_value = document.getElementById("input_add_contragents_inn").value
  let inn_value = document.getElementById("input_add_contragents_kpp").value
  let address_value = document.getElementById("input_add_contragents_address").value

  if(name_value === "" || kpp_value === "" || inn_value === "" || address_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;
    body.kpp = kpp_value;
    body.inn = inn_value;
    body.address = address_value;

    document.getElementById("input_add_contragents_name").value = "";
    document.getElementById("input_add_contragents_inn").value = "";
    document.getElementById("input_add_contragents_kpp").value = "";
    document.getElementById("input_add_contragents_address").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetContragents()}, 100);
  }
}

listenSortSelect("sort_contragents", "tb_contragents", "contragents", funcProcessGetContragents);

//////////
/* склады */
function funcGetStorages(){
  let body  =  {"user":"demo", "meth":"view", "obj":"storages", "count":"100"};
  funcCommand(body, funcProcessGetStorages);
}

function funcProcessGetStorages(result, respobj){
  if( result === 0 ) return;
  console.log("Склады:", respobj);

  let storages_list = respobj.answ;
  localStorage.setItem("storages_list", JSON.stringify(storages_list));
  
  let tb_id = "tb_storages";
  clearTable(tb_id);

  for (let key in respobj.answ) {
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addStoragesRow(name, del, uin, tb_id);
  }
}

function addStoragesRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow   = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn  = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="name_${uin}">`;

  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowStorages(${uin},this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowStorages(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления склады */
function funcMdelRowStorages(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"storages", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления склады */
function funcUpdateRowStorages(uin, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"storages", "name":"", "uin":`${uin}`};

  let target_table = tb_storages;
  body.name = findForUpdateInput(`name_${uin}`, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetStorages()}, 100);
}

/* функция добавления склады */
function funcAddRowStorages(){
  let body  =  {"user":"demo", "meth":"add", "obj":"storages", "name":""};

  let name_value = document.getElementById("input_add_storages_name").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_storages_name").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetStorages()}, 100);
  }
}

listenSortSelect("sort_storages", "tb_storages", "storages", funcProcessGetStorages);

//////////
/* статус отгрузки */
function funcGetStatuses(){
  let body  =  {"user":"demo", "meth":"view", "obj":"statuses", "count":"100"};
  funcCommand(body, funcProcessGetStatuses);
}

function funcProcessGetStatuses(result, respobj){
  if( result === 0 ) return;
  console.log("Статусы:", respobj);
  let tb_id = "tb_statuses_shipment";
  clearTable(tb_id);

  let statuses_list = respobj.answ;
  localStorage.setItem("statuses_list", JSON.stringify(statuses_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addStatusesRow(name, del, uin, tb_id);
  }
}

function addStatusesRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowStatuses(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowStatuses(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления статуса */
function funcMdelRowStatuses(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"statuses", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления статуса */
function funcUpdateRowStatuses(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"statuses", "name":"", "uin":`${uin}`};

  let target_table = tb_statuses_shipment;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setInterval(function(){location.reload();}, 500);
}

/* функция добавления статуса */
function funcAddRowStatuses(){
  let body  =  {"user":"demo", "meth":"add", "obj":"statuses", "name":""};

  let name_value = document.getElementById("input_add_statuses_shipment_name").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_statuses_shipment_name").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setInterval(function(){location.reload();}, 500);
  }
}

listenSortSelect("sort_statuses_shipment", "tb_statuses_shipment", "statuses", funcProcessGetStatuses);

//////////
/* SN статус */
function funcGetStatussn(){
  let body  =  {"user":"demo", "meth":"view", "obj":"statussn", "count":"100"};
  funcCommand(body, funcProcessGetStatussn);
}

function funcProcessGetStatussn(result, respobj){
  if( result === 0 ) return;
  console.log("SN статус:", respobj);

  let statussn_list = respobj.answ;
  localStorage.setItem("statussn_list", JSON.stringify(statussn_list));

  let tb_id = "tb_statuses_statussn";
  clearTable(tb_id);

  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addStatussnRow(name, del, uin, tb_id);
  }
}

function addStatussnRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowStatussn(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowStatussn(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления статуса */
function funcMdelRowStatussn(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"statussn", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления статуса */
function funcUpdateRowStatussn(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"statussn", "name":"", "uin":`${uin}`};

  let target_table = tb_statuses_statussn;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetStatussn()}, 100);
}

/* функция добавления статуса */
function funcAddRowStatussn(){
  let body  =  {"user":"demo", "meth":"add", "obj":"statussn", "name":""};

  let name_value = document.getElementById("input_add_statussn_name").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_statussn_name").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetStatussn()}, 100);
  }
}

listenSortSelect("sort_statuses_statussn", "tb_statuses_statussn", "statussn", funcProcessGetStatussn);

//////////
/* статус документа */
function funcGetStatusDoc(){
  let body  =  {"user":"demo", "meth":"view", "obj":"statusdoc", "count":"100"};
  funcCommand(body, funcProcessGetStatusDoc);
}

function funcProcessGetStatusDoc(result, respobj){
  if( result === 0 ) return;
  console.log("Статус док:", respobj);
  
  let tb_id = "tb_statuses_statusdoc";
  clearTable(tb_id);

  let statusdoc_list = respobj.answ;
  localStorage.setItem("statusdoc_list", JSON.stringify(statusdoc_list));

  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addStatusDocRow(name, del, uin, tb_id);
  }
}

function addStatusDocRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowStatusDoc(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowStatusDoc(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления статуса */
function funcMdelRowStatusDoc(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"statusdoc", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления статуса */
function funcUpdateRowStatusDoc(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"statusdoc", "name":"", "uin":`${uin}`};

  let target_table = tb_statuses_statusdoc;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSave(elem);
  setTimeout(function(){funcGetStatusDoc()}, 100);
}

/* функция добавления статуса */
function funcAddRowStatusDoc(){
  let body  =  {"user":"demo", "meth":"add", "obj":"statusdoc", "name":""};

  let name_value = document.getElementById("input_add_statusdoc_name").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_statusdoc_name").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetStatusDoc()}, 100);
  }
}

listenSortSelect("sort_statuses_statusdoc", "tb_statuses_statusdoc", "statusdoc", funcProcessGetStatusDoc);

//////////
/* Пользователи */
function funcGetUsers(){
  let body  =  {"user":"demo", "meth":"view", "obj":"users", "count":"100"};
  funcCommand(body, funcProcessGetUsers);
}

function funcProcessGetUsers(result, respobj){
  if( result === 0 ) return;
  console.log("пользователи:", respobj);

  let users_list = respobj.answ;
  localStorage.setItem("users_list", JSON.stringify(users_list));
}

////////// ОБЩИЕ ФУНКЦИИ //////////
function funcProcessOnlyInfo(result, respobj){
  if( result === 0 ) return;
  console.log(respobj);
  if(respobj.succ === 0){alert("Произошла ошибка! Попробуйте снова!")};
}

/* изменение цвета кнопки обновления */
function highlightButtonSave(obj){
  obj.style.background = "green";
  setTimeout(function(){
    obj.style.background = "inherit";
  }, 1000);
}

function highlightButtonSaveModal(obj){
  obj.style.background = "green";
  setTimeout(function(){
    obj.style.background = "var(--expand-button-active)";
  }, 2000);
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
    target_input = " ";
  }

  return target_input;
}

/* поиск select для обновления */
function findForUpdateSelect(uinOther, table, select){
  let selects = table.getElementsByTagName("select");
  let select_value = [];
  for (let i = 0, len = selects.length; i < len; i++) {
    if (selects[i].id === `${select}${uinOther}`) {
      select_value.push(selects[i]);
    }
  }
  let target_select = select_value[0].value;

  return target_select;
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

/* добавление option в select */
function addToDropdown(select, arr_obj){
  let arr = JSON.parse(localStorage.getItem(arr_obj));
  for (let key in arr) {
    if(arr[key].del === 0){
      let newOption = new Option(arr[key].name, arr[key].uin);
      select.append(newOption);
    }
  }
}

/* добавление одну option в select */
function addToDropdownOneOption(select, text, uin){
  let option = document.createElement("option");
  option.text = text;
  option.value = uin;
  select.appendChild(option);
}

/* создание и заполнение select для составов */
function makeSelectForСompositeTables(uinMain, other, uinOther, otherList, determinant, className, name, cell){
  let select = document.createElement("select");
  select.id = `${determinant}${uinOther}_${uinMain}`;
  select.className = className;
  select.name = name;
  let option = document.createElement("option");
  option.text = other;
  option.value = uinOther;
  select.appendChild(option);
  cell.appendChild(select);

  addToDropdown(select, otherList);
}

/* очистка и установка опции select */
function removeOptionsSetValue(selec, text){
  let mySelect = document.getElementById(selec);
  mySelect.value = "";
  let len = mySelect.length;
  for (let i = 0; i < len; i++) {
    mySelect.remove(0);
  }
  let option = document.createElement("option");
  option.text = text;
  option.value = "";
  mySelect.appendChild(option);
}

/* очистка select */
function removeOptions(selec){
  selec.value = "";
  let len = selec.length;
  for (let i = 0; i < len; i++) {
    selec.remove(0);
  }
}

/* очистка таблицы без первой строки*/
function clearTable(tb_id){
  let table = document.getElementById(tb_id);
  for(let i = 1; i < table.rows.length;){
    table.deleteRow(i);
  }
}

/* очистка таблицы */
function clearTableAll(tb_id){
  let table = document.getElementById(tb_id);
  for(let i = 0; i < table.rows.length;){
    table.deleteRow(i);
  }
}

/* select сортировка */
function listenSortSelect(select, tb, obj, func){
  document.getElementById(select).addEventListener('change', function(){
    clearTable(tb);
  
    let option = this.selectedIndex;
    switch (option){
      case 0:
        let body0  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500"};
        funcCommand(body0, func);
        break;
      case 1:
        let body1  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "sort":"name"};
        funcCommand(body1, func);
        break;
      case 2:
        let body2  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "asort":"name"};
        funcCommand(body2, func);
        break;
      case 3:
        let body3  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "sort":"uin"};
        funcCommand(body3, func);
        break;
      case 4:
        let body4  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "asort":"uin"};
        funcCommand(body4, func);
        break;
      case 5:
        let body5  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "sort":"uinset"};
        funcCommand(body5, func);
        break;
      case 6:
        let body6  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "asort":"uinset"};
        funcCommand(body6, func);
        break;
      case 7: 
        let body7  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "sort":"datechange"};
        funcCommand(body7, func);
        break;
      case 8:
        let body8  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "asort":"datechange"};
        funcCommand(body8, func);
        break;
    }
  });
}

/* select фильтра заполенение */
function addToDropdownPsevdo(select_id, arr){
  let psevdoSelect = document.getElementById(select_id);
  for (let key in arr) {
    if(arr[key].del === 0){
      let li = document.createElement("li");
      let input = document.createElement("input");
      input.type = "checkbox";
      input.className = "custom-checkbox";
      input.value = arr[key].uin;
      input.id = `chb_${select_id}_${arr[key].uin}`;
      let label = document.createElement("label");
      label.htmlFor = `chb_${select_id}_${arr[key].uin}`;
      label.textContent = arr[key].name;
      li.append(input);
      li.append(label);
      psevdoSelect.append(li);
    }
  }
}

/* select фильтра анимация */
function psevdoSelect(id){
  /*checkList.getElementsByClassName('anchor')[0].onclick = function(evt) {
    if (checkList.classList.contains('visible'))
      checkList.classList.remove('visible');
    else
      checkList.classList.add('visible');
  }*/

  let checkList = document.getElementById(id);
  checkList.addEventListener('click', function(event) {
    checkList.classList.add('visible');
    event.stopPropagation();
  });
  window.addEventListener('click', function() {
    checkList.classList.remove('visible');
  });
}

/* select фильтра вне справ */
function addToDropdownPsevdoAnotherList(selec, arr, other){
  let psevdoSelect = document.getElementById(selec);
  for (let key in arr) {
    let li = document.createElement("li");
    let input = document.createElement("input");
    input.type = "checkbox";
    input.className = "custom-checkbox";
    input.value = arr[key];
    input.id = `${other}${arr[key]}`;
    let label = document.createElement('label');
    label.htmlFor = `${other}${arr[key]}`;
    label.textContent = arr[key];
    li.append(input);
    li.append(label);
    psevdoSelect.append(li);
  }
}

/* select фильтра считывание значения */
function listenSelect(select, filt, val, filt_main){
  select.addEventListener('change', function(){
    val.length = 0;
    let checkboxes = select.getElementsByTagName("input");
    for(key in checkboxes){
      if(checkboxes[key].checked === true){
        let chbv = checkboxes[key].value;
        val.push(chbv);
      }
    }
    filt.val = val;
    filt_main.push(filt);
  });
}

/* date фильтра считывание значения */
function listenDate(date_1, date_2, filt, val, filt_main){
  date_1.addEventListener('change', function(){
    val.length = 0;
    val.push(date_1.value);
    filt.vald = val;
    filt_main.push(filt);
  })
  date_2.addEventListener('change', function(){
    val.push(date_2.value);
    filt.vald = val;
    filt_main.push(filt);
  })
}

/* фильтр для анализа слушает */
function listenFiltSelectAnalisys(select_1_id, select_2_id, select_3_id, select_4_id, select_5_id, date_1_id, date_2_id, filt_main){
  let select_1 = document.getElementById(select_1_id);
  let select_2 = document.getElementById(select_2_id);
  let select_3 = document.getElementById(select_3_id);
  let select_4 = document.getElementById(select_4_id);
  let select_5 = document.getElementById(select_5_id);
  let date_1   = document.getElementById(date_1_id);
  let date_2   = document.getElementById(date_2_id);
  let filt_1   = {fld: "uin", on: "sets"};
  let val_1    = [];
  let filt_2   = {fld: "uin", on: "products"};
  let val_2    = [];
  let filt_3   = {fld: "uin", on: "components"};
  let val_3    = [];
  let filt_4   = {fld: "uin", on: "contragents"};
  let val_4    = [];
  let filt_5   = {fld: "uin", on: "statuses"};
  let val_5    = [];
  let filt_6   = {fld: "date"};
  let val_6    = [];

  listenSelect(select_1, filt_1, val_1, filt_main);
  listenSelect(select_2, filt_2, val_2, filt_main);
  listenSelect(select_3, filt_3, val_3, filt_main);
  listenSelect(select_4, filt_4, val_4, filt_main);
  listenSelect(select_5, filt_5, val_5, filt_main);
  listenDate(date_1, date_2, filt_6, val_6, filt_main);
}

/* фильтр для анализа отправка */
function sendFiltAnalisys(filt, tb_id, obj, func){
  let filt_filter = Array.from(new Set(filt.map(filt => JSON.stringify(filt)))).map(filt => JSON.parse(filt));
  let filt_str = JSON.stringify(filt_filter);
  clearTableAll(tb_id);
  let body  =  {"user":"demo", "meth":"view", "obj":obj, "count":"5000", "filt":`${filt_str}`, "asotr": "uin"};
  funcCommand(body, func);
}

/* фильтр для анализа очистка */
function clearFiltAnalisys(select_1, select_2, select_3, select_4, select_5, date_1, date_2, tb_id, filt, func){
  filt.length = 0;
  clearCheckboxes(select_1);
  clearCheckboxes(select_2);
  clearCheckboxes(select_3);
  clearCheckboxes(select_4);
  clearCheckboxes(select_5);
  document.getElementById(date_1).value = "";
  document.getElementById(date_2).value = "";
  clearTableAll(tb_id);
  func;
}

/* сортировка анализа */
function sortAnalisys(selec, tb_id, filt, obj, func){
  document.getElementById(selec).addEventListener('change', function(){
    let table = document.getElementById(tb_id);
    for(let i = 0; i < table.rows.length;){
      table.deleteRow(i);
    }
  
    let filt_filter = Array.from(new Set(filt.map(filt => JSON.stringify(filt)))).map(filt => JSON.parse(filt));
    let filt_str = JSON.stringify(filt_filter);
    let option = this.selectedIndex;
    switch (option){
      case 0:
        let body0  =  {"user":"demo", "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000"};
        funcCommand(body0, func);
        break;
      case 1:
        let body1  =  {"user":"demo", "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "sort":"uin"};
        funcCommand(body1, func);
        break;
      case 2:
        let body2  =  {"user":"demo", "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "asort":"uin"};
        funcCommand(body2, func);
        break;
      case 3:
        let body3  =  {"user":"demo", "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "sort":"name"};
        funcCommand(body3, func);
        break;
      case 4:
        let body4  =  {"user":"demo", "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "asort":"name"};
        funcCommand(body4, func);
        break;
      case 5:
        let body5  =  {"user":"demo", "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "sort":"datechange"};
        funcCommand(body5, func);
        break;
      case 6:
        let body6  =  {"user":"demo", "meth":"view", "obj":obj, "filt":`${filt_str}`, "count":"5000", "asort":"datechange"};
        funcCommand(body6, func);
        break;
    }
  });
}

/* отправка отфильтрованного запроса */
function sendFilt(filt, tb_id, obj, func){
  let filt_str = JSON.stringify(filt);
  clearTable(tb_id);
  let body  =  {"user":"demo", "meth":"view", "obj":obj, "count":"500", "filt":`${filt_str}`};
  funcCommand(body, func);
}

/* очистка фильтра */
function clearFilt(filt, select_1, select_2, select_3, tb_id, func){
  filt.length = 0;
  clearCheckboxes(select_1);
  clearCheckboxes(select_2);
  clearCheckboxes(select_3);
  clearTable(tb_id);
  func;
}

/* очистка чекбоксов фильтра */
function clearCheckboxes(select_id){
  let selec = document.getElementById(select_id);
  let inputs = selec.querySelectorAll("input");
	for(let i = inputs.length; i--;) {
    inputs[i].checked = false;
  }
}

/* sidebar */
const expand_btn = document.querySelector(".expand-btn");
let activeIndex;
expand_btn.addEventListener("click", () => {
  document.body.classList.toggle("collapsed");
});

/* sidebar tabs */
function openTabSidebar(evt, tabName, elem) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("sidebar_tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks_main");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "flex";
  document.getElementById(tabName).style.flexDirection = "column";
  evt.currentTarget.className += " active";

  for(let key in tablinks){
    if(tablinks[key].className === "icon-link tablinks_main active"){
      localStorage.setItem("buisness_tab_main_active", elem.id);
    }
  }

  if(elem.id === "link_provider" || elem.id === "link_storage"){
    //document.getElementById(localStorage.getItem("buisness_tab_first_active")).classList.remove("active");
    localStorage.removeItem("buisness_tab_first_active");
    localStorage.removeItem("buisness_tab_second_active");
    localStorage.removeItem("buisness_tab_third_active");
  }
}

/* 1 вкладка */
function openTabFirst(evt) {
  let tablinks = document.getElementsByClassName("tablinks_first");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  evt.currentTarget.className += " active";
  evt.currentTarget.parentElement.parentElement.previousElementSibling.click();

  for(let key in tablinks){
    if(tablinks[key].className === "tablinks_first active"){
      let tab_id = tablinks[key].id;
      localStorage.setItem("buisness_tab_first_active", tab_id);
    }
  }
}

/* 2 вкладка */
function openTabSecond(evt, first_class, second_class, func) {
  setTimeout(function(){func}, 10);
  let tablinks_1 = document.getElementsByClassName(first_class);
  let tablinks_2 = document.getElementsByClassName(second_class);

  for (let i = 0; i < tablinks_1.length; i++) {
    tablinks_1[i].className = tablinks_1[i].className.replace(" active", "");
  }
  for (let i = 0; i < tablinks_2.length; i++) {
    tablinks_2[i].className += " active";
  }

  localStorage.setItem("buisness_tab_second_active", second_class);
}

/* 3 вкладка */
function openTabThird(evt, first_class, second_class, func) {
  setTimeout(function(){func}, 10);
  let tablinks_1 = document.getElementsByClassName(first_class);
  let tablinks_2 = document.getElementsByClassName(second_class);

  for (let i = 0; i < tablinks_1.length; i++) {
    tablinks_1[i].className = tablinks_1[i].className.replace(" active", "");
  }
  for (let i = 0; i < tablinks_2.length; i++) {
    tablinks_2[i].className += " active";
  }

  localStorage.setItem("buisness_tab_third_active", second_class);
}

/* переклуючение таблиц */
const tb1 = document.getElementById('analysis_products');
const tb2 = document.getElementById('analysis_products_all');

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
})

function handleLeaveSite(){
  let result = confirm("Вы уверены, что хотите выйти?");
  if(result === true){
    window.location = 'https://dev.proektit.ru';
  }
}