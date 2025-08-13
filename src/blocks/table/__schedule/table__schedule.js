import {funcCommand, addToDropdown, clearTable, makeSelect, removeOptionsSetValue, funcProcessOnlyInfo, highlightButtonSave, responseProcessor} from '../../../js/common/common.js'

export const funcGetGrfShipSets = () => {
    let currYear = localStorage.getItem("curr_year");
    document.getElementById("grf_year").value = "";
    document.getElementById("grf_year").value = currYear;

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"grfShipSets", "count":"100", "filt":`[{"fld":"year","val":["${currYear}"]}]`};
    funcCommand(body, funcProcessGetGrfShipSets);
}

export const funcProcessGetGrfShipSets = (result, respobj) => {
    responseProcessor(result, respobj.succ);
    console.log("График:", respobj);

    let select_sets = document.getElementById("select_add_grf_set");
    removeOptionsSetValue("select_add_grf_set", "Выберите");
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

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-schedule");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"grfShipSets", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-schedule");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"grfShipSets", "uin":`${elem.value}`, "uinset":"", "year":"" ,"m1":"", "m2":"", "m3":"", "m4":"", "m5":"", "m6":"", "m7":"", "m8":"", "m9":"", "m10":"", "m11":"", "m12":""};

            body.uinset = document.getElementById(`grf_set_select__${elem.value}`).value;
            body.year   = document.getElementById("grf_year").value;
            body.m1     = document.getElementById(`grf_input_m1_${elem.value}`).value;
            body.m2     = document.getElementById(`grf_input_m2_${elem.value}`).value;
            body.m3     = document.getElementById(`grf_input_m3_${elem.value}`).value;
            body.m4     = document.getElementById(`grf_input_m4_${elem.value}`).value;
            body.m5     = document.getElementById(`grf_input_m5_${elem.value}`).value;
            body.m6     = document.getElementById(`grf_input_m6_${elem.value}`).value;
            body.m7     = document.getElementById(`grf_input_m7_${elem.value}`).value;
            body.m8     = document.getElementById(`grf_input_m8_${elem.value}`).value;
            body.m9     = document.getElementById(`grf_input_m9_${elem.value}`).value;
            body.m10    = document.getElementById(`grf_input_m10_${elem.value}`).value;
            body.m11    = document.getElementById(`grf_input_m11_${elem.value}`).value;
            body.m12    = document.getElementById(`grf_input_m12_${elem.value}`).value;
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetGrfShipSets()}, 100); 
        })
    })
}

function addGrfShipSetsRow(num, msum, rsum, uinSet, nameSet, del, uin, tb_id,
                            m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12,
                            r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12){
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellNum  = newRow.insertCell(0);  cellNum.classList  = "td td_right-border";
    let cellName = newRow.insertCell(1);  cellName.classList = "td td_right-border";
    let cellM1   = newRow.insertCell(2);  cellM1.classList   = "td";
    let cellR1   = newRow.insertCell(3);  cellR1.classList   = "td td_right-border";
    let cellM2   = newRow.insertCell(4);  cellM2.classList   = "td";
    let cellR2   = newRow.insertCell(5);  cellR2.classList   = "td td_right-border";
    let cellM3   = newRow.insertCell(6);  cellM3.classList   = "td";
    let cellR3   = newRow.insertCell(7);  cellR3.classList   = "td td_right-border";
    let cellM4   = newRow.insertCell(8);  cellM4.classList   = "td";
    let cellR4   = newRow.insertCell(9);  cellR4.classList   = "td td_right-border";
    let cellM5   = newRow.insertCell(10); cellM5.classList   = "td";
    let cellR5   = newRow.insertCell(11); cellR5.classList   = "td td_right-border";
    let cellM6   = newRow.insertCell(12); cellM6.classList   = "td";
    let cellR6   = newRow.insertCell(13); cellR6.classList   = "td td_right-border";
    let cellM7   = newRow.insertCell(14); cellM7.classList   = "td";
    let cellR7   = newRow.insertCell(15); cellR7.classList   = "td td_right-border";
    let cellM8   = newRow.insertCell(16); cellM8.classList   = "td";
    let cellR8   = newRow.insertCell(17); cellR8.classList   = "td td_right-border";
    let cellM9   = newRow.insertCell(18); cellM9.classList   = "td";
    let cellR9   = newRow.insertCell(19); cellR9.classList   = "td td_right-border";
    let cellM10  = newRow.insertCell(20); cellM10.classList  = "td";
    let cellR10  = newRow.insertCell(21); cellR10.classList  = "td td_right-border"; 
    let cellM11  = newRow.insertCell(22); cellM11.classList  = "td";
    let cellR11  = newRow.insertCell(23); cellR11.classList  = "td td_right-border";
    let cellM12  = newRow.insertCell(24); cellM12.classList  = "td";
    let cellR12  = newRow.insertCell(25); cellR12.classList  = "td td_right-border";
    let cellMsum = newRow.insertCell(26); cellMsum.classList = "td";
    let cellRsum = newRow.insertCell(27); cellRsum.classList = "td td_right-border";
    let cellBtn  = newRow.insertCell(28);

    let number         = +num + 1;
    cellNum.innerHTML  = number;
    makeSelect("grf_set_select_", uin, nameSet, uinSet, "sets_list", "select", cellName);
    cellM1.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m1}"  id="grf_input_m1_${uin}">`;  cellR1.innerHTML  = r1;
    cellM2.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m2}"  id="grf_input_m2_${uin}">`;  cellR2.innerHTML  = r2;
    cellM3.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m3}"  id="grf_input_m3_${uin}">`;  cellR3.innerHTML  = r3;
    cellM4.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m4}"  id="grf_input_m4_${uin}">`;  cellR4.innerHTML  = r4;
    cellM5.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m5}"  id="grf_input_m5_${uin}">`;  cellR5.innerHTML  = r5;
    cellM6.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m6}"  id="grf_input_m6_${uin}">`;  cellR6.innerHTML  = r6;
    cellM7.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m7}"  id="grf_input_m7_${uin}">`;  cellR7.innerHTML  = r7;
    cellM8.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m8}"  id="grf_input_m8_${uin}">`;  cellR8.innerHTML  = r8;
    cellM9.innerHTML   = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m9}"  id="grf_input_m9_${uin}">`;  cellR9.innerHTML  = r9;
    cellM10.innerHTML  = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m10}" id="grf_input_m10_${uin}">`; cellR10.innerHTML = r10;
    cellM11.innerHTML  = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m11}" id="grf_input_m11_${uin}">`; cellR11.innerHTML = r11;
    cellM12.innerHTML  = `<input class="input__type-text input__type-text_table-schedule" type="text" value="${m12}" id="grf_input_m12_${uin}">`; cellR12.innerHTML = r12;
    cellMsum.innerHTML = msum;
    cellRsum.innerHTML = rsum;
    
    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-schedule" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-schedule${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

/* функция добавления графика */
let button_control_add_product = document.querySelector(".button__control_add-schedule");
button_control_add_product.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"grfShipSets", "uinset":"", "year":"" , "m1":"", "m2":"", "m3":"", "m4":"", "m5":"", "m6":"", "m7":"", "m8":"", "m9":"", "m10":"", "m11":"", "m12":""};

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
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetGrfShipSets()}, 100);
    }
})