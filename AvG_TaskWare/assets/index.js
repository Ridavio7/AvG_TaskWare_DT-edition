const url = "https://apitw.avantguard.pro:32100/json";
let zapros_set = [], forModal_set = [], zapros_product = [], forModal_product = [], zapros_component = [], forModal_component = [];

window.onload = function(){
  funcGetContragents();
  funcGetSets();
  funcGetProducts();
  funcGetComponents();
  let href_schedule = document.getElementById("href_schedule");
  let date = localStorage.getItem("link_main");
  if(date === null){date = "#schedule"}
  href_schedule.href = `buisness.html${date}`;
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

/* первая установка значений вкладок */
function setLockalValues(){
  localStorage.setItem("link_shipment_directory", "#directory/sets/sets_main");
  localStorage.setItem("link_shipment_analysis", "#analysis/analysis_sets");
  localStorage.setItem("link_dir_product", "#dir_product/colors");
  localStorage.setItem("link_dir_components", "#dir_components/measurement");
  localStorage.setItem("link_main", "#schedule");
  alert('Значения установлены!');
}

if(localStorage.getItem('first') === null){
  setLockalValues();
  localStorage.setItem('first','nope!');
}

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

/* комплекты */
function funcGetSets(){
  let body  =  {"user":"demo", "meth":"view", "obj":"sets", "count":"100" };
  funcCommand( body, funcProcessGetSets );
}

function funcProcessGetSets( result, respobj ){
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

function addSetsRow(uin, name, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellCheckbox = newRow.insertCell(0);
  let cellName = newRow.insertCell(1);
  let cellInput = newRow.insertCell(2);

  cellCheckbox.innerHTML = `<input type="checkbox" class="custom-checkbox" id="set_${uin}" name="${uin}" value="${name}"><label for="set_${uin}"></label>`;
  let cellNametext = document.createTextNode(name);
  cellName.appendChild(cellNametext);
  cellInput.innerHTML = `<input type="text" id="input_set_${uin}" name="${uin}">`;
}

/* изделия */
function funcGetProducts(){
  let body  =  {"user":"demo", "meth":"view", "obj":"products", "count":"100" };
  funcCommand( body, funcProcessGetProducts );
}

function funcProcessGetProducts( result, respobj ){
  if( result === 0 ) return;
  let tb_id = "tb_products";

  console.log("Изделия:", respobj);
  for (let key in respobj.answ) {
    let set = respobj.answ[key];
    let del = set.del;
    if(del === 0){
      let uin = set.uin;
      let name = set.name;
      addProductsRow(uin, name, tb_id);
    }
  }
}

function addProductsRow(uin, name, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellCheckbox = newRow.insertCell(0);
  let cellName = newRow.insertCell(1);
  let cellInput = newRow.insertCell(2);

  cellCheckbox.innerHTML = `<input type="checkbox" class="custom-checkbox" id="product_${uin}" name="${uin}" value="${name}"><label for="product_${uin}"></label>`;
  let cellNametext = document.createTextNode(name);
  cellName.appendChild(cellNametext);
  cellInput.innerHTML = `<input type="text" id="input_product_${uin}" name="${uin}">`;
}

/* комплектующие */
function funcGetComponents(){
  let body  =  {"user":"demo", "meth":"view", "obj":"components", "count":"100" };
  funcCommand( body, funcProcessGetComponents );
}

function funcProcessGetComponents( result, respobj ){
  if( result === 0 ) return;
  let tb_id = "tb_components";

  console.log("Комплектующие:", respobj);
  /*for (let key in respobj.answ) {
    let set = respobj.answ[key];
    let del = set.del;
    if(del === 0){
      let uin = set.uin;
      let name = set.name;
      addComponentsRow(uin, name, tb_id);
    }
  }*/
}

function addComponentsRow(uin, name, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellCheckbox = newRow.insertCell(0);
  let cellName = newRow.insertCell(1);
  let cellInput = newRow.insertCell(2);

  cellCheckbox.innerHTML = `<input type="checkbox" class="custom-checkbox" id="component_${uin}" name="${uin}" value="${name}"><label for="component_${uin}"></label>`;
  let cellNametext = document.createTextNode(name);
  cellName.appendChild(cellNametext);
  cellInput.innerHTML = `<input type="text" id="input_component_${uin}" name="${uin}">`;
}

/* контрагенты */
function funcGetContragents(){
  let body  =  {"user":"demo", "meth":"view", "obj":"contragents", "count":"100"};
  funcCommand(body, funcProcessGetContragents);
}

function funcProcessGetContragents(result, respobj){
  if( result === 0 ) return;
  console.log("Контрагенты:", respobj);
  let select_id = "task_contragents";

  for (let key in respobj.answ) {
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addToDropdownContragents(name, del, uin, select_id);
  }
}

function addToDropdownContragents(name, del, uin, select_id){
  let select = document.getElementById(select_id);
  if(del === 0){
    let newOption = new Option(name, uin);
    select.append(newOption);
  }
}

/* модальное окно */
let modal = document.getElementById("modal_shipment");
let btn = document.getElementById("button_shipment");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  let select = document.getElementById("task_contragents");
  if(select.value === " "){
    alert("Вы не выбрали контрагента!");
  } else {
    localStorage.setItem("contragent_uin", select.value);
    getCheckbox(tb_sets, "input_set_", zapros_set, forModal_set, "zapros_set_value");
    getCheckbox(tb_products, "input_product_", zapros_product, forModal_product, "zapros_product_value");
    getCheckbox(tb_components, "input_component_", zapros_component, forModal_component, "zapros_component_value");
    modal.style.display = "block";
  }
}

span.onclick = function() {
  clearModalTable();
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    clearModalTable();
    modal.style.display = "none";
  }
}

function clearModalTable(){
  localStorage.clear();
  zapros_set.length = 0;
  forModal_set.length = 0;
  zapros_product.length = 0;
  forModal_product.length = 0;
  zapros_component.length = 0;
  forModal_component.length = 0;

  let table = document.getElementById('main_tb_sets_model');
  let newTbody = document.createElement('tbody');
  newTbody.id = "tb_sets_model";
  table.replaceChild(newTbody, table.getElementsByTagName('tbody')[0]);
}

function getCheckbox(tb_id, input_id, zapros, forModal, storage_arr){
  let checkbox_set = tb_id.getElementsByClassName("custom-checkbox");
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

function pushSetsInModal(arr){
  let tb_id = "tb_sets_model";
  for (let key in arr) {
    let set = arr[key];
    let name = set.name;
    let count = set.count;
    addRowInModal(name, count, tb_id);
  }
}

function addRowInModal(name, count, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellCount = newRow.insertCell(1);

  let cellNametext = document.createTextNode(name);
  cellName.appendChild(cellNametext);
  let cellCounttext = document.createTextNode(count);
  cellCount.appendChild(cellCounttext);
}

/* вкладки */
function openTabMain(evt, tabName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent_task");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "flex";
  document.getElementById(tabName).style.flexDirection = "column";
  evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();

function handleLeaveSite(){
  let result = confirm("Вы уверены, что хотите выйти?");
  if(result === true){
    window.location = 'https://dev.proektit.ru';
  }
}