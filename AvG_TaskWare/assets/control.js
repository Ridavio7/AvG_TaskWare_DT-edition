const url = "https://apitw.avantguard.pro:32100/json";

window.onload = function(){
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
let arrow_user = document.getElementsByClassName("arrow_user");
arrow_user[0].addEventListener("click", (e)=>{
  let arrowParent = e.target.parentElement.parentElement;
  arrowParent.classList.toggle("showMenu");
});

/* установка значений вкладок */
function returnTabs(){
  let tab_second = document.getElementsByClassName(/*localStorage.getItem("control_tab_second_active")*/"tablinks_users");
  tab_second[0].click();
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

//////////
/* пользователи */
function funcGetUsers(){
  let body  =  {"user":"demo", "meth":"view", "obj":"users", "count":"100"};
  funcCommand(body, funcProcessGetUsers);
}

function funcProcessGetUsers(result, respobj){
  if( result === 0 ) return;
  console.log("Пользователи:", respobj);

  let tb_id = "tb_users";
  clearTable(tb_id);

  let users_list = respobj.answ;
  localStorage.setItem("users_list", JSON.stringify(users_list));

  for (let key in respobj.answ){
    let obj   = respobj.answ[key];
    let num   = +key + 1;
    let name  = obj.name;
    let job   = obj.job.name;
    let email = obj.email;
    let phone = obj.phone;
    let del   = obj.del;
    let uin   = obj.uin;
    addUsersRow(num, name, job, email, phone, del, uin, tb_id);
  }
}

function addUsersRow(num, name, job, email, phone, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellInfo  = newRow.insertCell(0);
  let cellNum   = newRow.insertCell(1);
  let cellName  = newRow.insertCell(2);
  let cellJob   = newRow.insertCell(3);
  let cellEmail = newRow.insertCell(4);
  let cellPhone = newRow.insertCell(5);
  let cellBtn   = newRow.insertCell(6);

  cellInfo.innerHTML  = `<button class="button_control" value="${uin}" onclick="funcInfoUserOpenModal(this)"><img src="../images/info.svg"></button>`;
  cellNum.innerHTML   = num;
  cellName.innerHTML  = name;
  cellJob.innerHTML   = job;
  cellEmail.innerHTML = email;
  cellPhone.innerHTML = phone;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowUsers(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* модальное окно */
let modal_info_user  = document.getElementById("modal_info_user");
let span_info_user   = document.getElementById("close_info_user");
let input_user_name  = document.getElementById("user_name");
let select_user_job  = document.getElementById("user_job");
let input_user_email = document.getElementById("user_email");
let input_user_phone = document.getElementById("user_phone");
let button_user_save = document.getElementById("user_save");
let button_user_add  = document.getElementById("user_add");

span_info_user.onclick = function(){
  modal_info_user.style.display = "none";
}

/* открытие инфо мод. окна пользователя */
function funcInfoUserOpenModal(elem){
  modal_info_user.style.display  = "block";
  button_user_save.style.display = "flex";
  button_user_add.style.display  = "none";

  funcGetRightsUsersInfo();
  setTimeout(function(){funcGetUserInfo(elem.value)}, 100);
}

/* права для мод. окна пользователя */
function funcGetRightsUsersInfo(){
  let body = {"user":"demo", "meth":"view", "obj":"rights", "count":"100"};
  funcCommand(body, funcProcessGetRightsUsersInfo);
}

function funcProcessGetRightsUsersInfo(result, respobj){
  if( result === 0 ) return;
  console.log("Права:", respobj);

  let tb_id = "tb_user_rights";
  clearTableAll(tb_id);

  for (let key in respobj.answ){
    let obj   = respobj.answ[key];
    let name  = obj.name;
    let uin   = obj.uin;
    addRightsUsersInfo(name, uin, tb_id);
  }
}

function addRightsUsersInfo(name, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellCheckbox  = newRow.insertCell(0);
  let cellRightname = newRow.insertCell(1);

  cellCheckbox.innerHTML  = `<input type="checkbox" class="custom-checkbox" id="right_${uin}" value="${uin}"><label for="right_${uin}"></label>`;
  cellRightname.innerHTML = name;
}

/* инфо пользователя в мод. окне */
function funcGetUserInfo(uin){
  let body = {"user":"demo", "meth":"view", "obj":"users", "count":"1", "filt":`[{"fld":"uin","val":["${uin}"]}]`};
  funcCommand(body, funcProcessGetUserInfo);
}

function funcProcessGetUserInfo(result, respobj){
  if( result === 0 ) return;
  console.log("Пользователь:", respobj);

  input_user_name.value  = "";
  input_user_email.value = "";
  input_user_phone.value = "";
  removeOptions(select_user_job);

  let obj     = respobj.answ[0];
  let name    = obj.name;
  let jobName = obj.job.name;
  let jobUin  = obj.job.uin;
  let email   = obj.email;
  let phone   = obj.phone;
  let rights  = obj.rights;
  let uin     = obj.uin;

  addUserInfo(name, jobName, jobUin, email, phone, rights, uin);
}

function addUserInfo(name, jobName, jobUin, email, phone, rights, uin){
  input_user_name.value  = name;
  input_user_email.value = email;
  input_user_phone.value = phone;
  button_user_save.value = uin;
  addToDropdownOneOption(select_user_job, jobName, jobUin);
  addToDropdown(select_user_job, "jobs_list");

  for(key in rights){
    let obj  = rights[key];
    let uin  =  obj.uin;

    let checkbox = document.getElementById(`right_${uin}`);
    checkbox.checked = true;
  }
}

/* открытие добавления мод. окна пользователя */
function funcInfoUserOpenModalAdd(){
  modal_info_user.style.display  = "block";
  button_user_add.style.display  = "flex";
  button_user_save.style.display = "none";

  funcProcessInfoUserOpenModalAdd();
  setTimeout(function(){funcGetRightsUsersInfo()}, 100);
}

function funcProcessInfoUserOpenModalAdd(){
  input_user_name.value  = "";
  input_user_email.value = "";
  input_user_phone.value = "";
  removeOptions(select_user_job)
  addToDropdownOneOption(select_user_job, "---", "");
  addToDropdown(select_user_job, "jobs_list");
}

/* функция удаления пользователи */
function funcMdelRowUsers(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"users", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления пользователи */
function funcUpdateRowUsers(elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"users", "uin":`${elem.value}`, "name":"", "rights":"", "uinjob":"4", "email":"", "phone":""};

  body.name   = input_user_name.value;
  body.uinjob = select_user_job.value;
  body.email  = input_user_email.value;
  body.phone  = input_user_phone.value;

  let modal = document.getElementById("modal_info_user");
  let checkboxs = modal.getElementsByClassName("custom-checkbox");
  let arr_rights = [];

  for(let chb in checkboxs){
    if(checkboxs[chb].checked === true){
      arr_rights.push(+checkboxs[chb].value);
    }
  }
  body.rights = `[${arr_rights}]`;

  funcCommand(body, funcProcessOnlyInfo);
  highlightButtonSaveModal(elem);
  setTimeout(function(){funcGetUsers()}, 100);
}

/* функция добавления пользователи */
function funcAddRowUsers(){
  let body  =  {"user":"demo", "meth":"add", "obj":"users", "name":"", "rights":"", "uinjob":"", "email":"", "phone":""};

  if(input_user_name.value === "" && select_user_job.value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name   = input_user_name.value;
    body.uinjob = select_user_job.value;
    body.email  = input_user_email.value;
    body.phone  = input_user_phone.value;

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetUsers()}, 100);
    setTimeout(function(){modal_info_user.style.display  = "none"}, 150);
  }
}

listenSortSelect("sort_users", "tb_users", "users", funcProcessGetUsers);

//////////
/* должности */
function funcGetJobs(){
  let body  =  {"user":"demo", "meth":"view", "obj":"jobs", "count":"100"};
  funcCommand(body, funcProcessGetJobs);
}

function funcProcessGetJobs(result, respobj){
  if( result === 0 ) return;
  console.log("Должности:", respobj);
  let tb_id = "tb_jobs";
  clearTable(tb_id);

  let jobs_list = respobj.answ;
  localStorage.setItem("jobs_list", JSON.stringify(jobs_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addJobsRow(name, del, uin, tb_id);
  }
}

function addJobsRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowJobs(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowJobs(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления должности */
function funcMdelRowJobs(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"jobs", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления должности */
function funcUpdateRowJobs(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"jobs", "name":"", "uin":`${uin}`};

  let target_table = tb_jobs;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlight(elem);
  setTimeout(function(){funcGetJobs()}, 100);
}

/* функция добавления должности */
function funcAddRowJobs(){
  let body  =  {"user":"demo", "meth":"add", "obj":"jobs", "name":""};

  let name_value = document.getElementById("input_add_jobs").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_jobs").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetJobs()}, 100);
  }
}

listenSortSelect("sort_jobs", "tb_jobs", "jobs", funcProcessGetJobs);

//////////
/* права */
function funcGetRights(){
  let body  =  {"user":"demo", "meth":"view", "obj":"rights", "count":"100"};
  funcCommand(body, funcProcessGetRights);
}

function funcProcessGetRights(result, respobj){
  if( result === 0 ) return;
  console.log("Права:", respobj);
  let tb_id = "tb_rights";
  clearTable(tb_id);

  let rights_list = respobj.answ;
  localStorage.setItem("rights_list", JSON.stringify(rights_list));
  for (let key in respobj.answ){
    let set = respobj.answ[key];
    let name = set.name;
    let del = set.del;
    let uin = set.uin;
    addRightsRow(name, del, uin, tb_id);
  }
}

function addRightsRow(name, del, uin, tb_id){
  let tableRef = document.getElementById(tb_id);
  let newRow = tableRef.insertRow(-1);

  let cellName = newRow.insertCell(0);
  let cellBtn = newRow.insertCell(1);

  cellName.innerHTML = `<input type="text" value="${name}" name="${name}">`;

  let bx_color;
  del === 0 ? bx_color = "inherit" : bx_color = "red"; cellBtn.classList = "cell_button";
  cellBtn.innerHTML = `<button class="button_control" onclick="funcUpdateRowRights(${uin},'${name}',this)"><img src="../images/button/chb/checkbox.svg"></button>&nbsp;&nbsp;&nbsp;<button class="button_control" style="background:${bx_color}" onclick="funcMdelRowRights(${uin},this)"><img src="../images/button/cross_w.svg"></button>`;
}

/* функция удаления цвета */
function funcMdelRowRights(uin, elem){
  let body  =  {"user":"demo", "meth":"mdel", "obj":"rights", "uin":`${uin}`};

  if(elem.style.background === "red"){
    elem.style.background = "inherit";
  } else {
    elem.style.background = "red"
  }

  funcCommand(body, funcProcessOnlyInfo);
}

/* функция обновления цвета */
function funcUpdateRowRights(uin, name, elem){
  let body  =  {"user":"demo", "meth":"update", "obj":"rights", "name":"", "uin":`${uin}`};

  let target_table = tb_rights;
  body.name = findForUpdateInput(name, target_table);

  funcCommand(body, funcProcessOnlyInfo);
  highlight(elem);
  setTimeout(function(){funcGetRights()}, 100);
}

/* функция добавления цвета */
function funcAddRowRights(){
  let body  =  {"user":"demo", "meth":"add", "obj":"rights", "name":""};

  let name_value = document.getElementById("input_add_rights").value

  if(name_value === ""){
    alert("Вы не заполнили все поля!");
  } else {
    body.name = name_value;

    document.getElementById("input_add_rights").value = "";

    funcCommand(body, funcProcessOnlyInfo);
    setTimeout(function(){funcGetRights()}, 100);
  }
}

listenSortSelect("sort_rights", "tb_rights", "rights", funcProcessGetRights);

////////// ОБЩИЕ ФУНКЦИИ //////////
function funcProcessOnlyInfo(result, respobj){
  if( result === 0 ) return;
  console.log(respobj);
  if(respobj.succ === 0){alert("Произошла ошибка! Попробуйте снова!")};
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

/* изменение цвета кнопки обновления */
function highlight(obj){
  obj.style.background = "green";
  setTimeout(function(){
    obj.style.background = "inherit";
  }, 3000);
}

function highlightButtonSaveModal(obj){
  obj.style.background = "green";
  setTimeout(function(){
    obj.style.background = "var(--expand-button-active)";
  }, 2000);
}

/* добавление одну option в select */
function addToDropdownOneOption(select, text, uin){
  let option = document.createElement("option");
  option.text = text;
  option.value = uin;
  select.appendChild(option);
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

/* очистка select */
function removeOptions(selec){
  selec.value = "";
  let len = selec.length;
  for (let i = 0; i < len; i++) {
    selec.remove(0);
  }
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

/* sidebar */
const expand_btn = document.querySelector(".expand-btn");
let activeIndex;
expand_btn.addEventListener("click", () => {
  document.body.classList.toggle("collapsed");
});

/* sidebar tabs */
function openTabSidebar(evt, tabName) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("sidebar_tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("sidebar_tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "flex";
  document.getElementById(tabName).style.flexDirection = "column";
  evt.currentTarget.className += " active";
}
document.getElementById("defaultOpenSidebar").click();

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

  localStorage.setItem("control_tab_second_active", second_class);
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

function handleLeaveSite(){
  let result = confirm("Вы уверены, что хотите выйти?");
  if(result === true){
    window.location = 'https://dev.proektit.ru';
  }
}