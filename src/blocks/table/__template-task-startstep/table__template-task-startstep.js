import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave} from '../../../js/common/common.js';

export const funcGetStartstep = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"startstep", "count":"100"};
    funcCommand(body, funcProcessGetStartstep);
}

const funcProcessGetStartstep = (result, respobj) => {
    if( result === 0 ) return;
    console.log("Контенты:", respobj);

    let tb_id = "tb_startstep";
    clearTable(tb_id);

    let startstep_list = respobj.answ;
    localStorage.setItem("startstep_list", JSON.stringify(startstep_list));

    for (let key in respobj.answ){
        let obj  = respobj.answ[key];
        let name = obj.name;
        let del  = obj.del;
        let uin  = obj.uin;
        addStartstepRow(name, del, uin, tb_id);
    }

    /* функция удаления */
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-startstep");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"startstep", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update = document.querySelectorAll(".button__control_update-startstep");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"startstep", "name":"", "uin":`${elem.value}`};

            let target_table = tb_startstep;
            body.name = findForUpdateInput(`startstep_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetStartstep()}, 100);
        })
    })
}

const addStartstepRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td td__text_align_center";
    let cellBtn  = newRow.insertCell(1); cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="startstep_name_${uin}">`;

    let bx_startstep = del === 0 ? bx_startstep = "" : bx_startstep = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-startstep" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-startstep${bx_startstep}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add = document.querySelector(".button__control_add-startstep");
button_control_add.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"startstep", "name":""};

    let name_value = document.getElementById("input_add_startstep").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_startstep").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetStartstep()}, 100);
    }
})

listenSortSelect("sort_startstep", "tb_startstep", "startstep", funcProcessGetStartstep);