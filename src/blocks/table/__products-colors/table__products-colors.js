import {funcCommand, funcProcessOnlyInfo, findForUpdateInput, clearTable, listenSortSelect, highlightButtonSave, responseProcessor} from '../../../js/common/common.js';
import {customSortSelect} from '../../select/select.js';

export const funcGetColors = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"colors", "count":"100"};
    funcCommand(body, funcProcessGetColors);
}

const funcProcessGetColors = (result, respobj) => {
    responseProcessor(result, respobj.succ);
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

    /* функция удаления */
    let button_control_mdel_product_color = document.querySelectorAll(".button__control_mdel-product-color");
    button_control_mdel_product_color.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"colors", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    /* функция обновления */
    let button_control_update_product_color = document.querySelectorAll(".button__control_update-product-color");
    button_control_update_product_color.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"colors", "name":"", "uin":`${elem.value}`};

            let target_table = tb_products_colors;
            body.name = findForUpdateInput(`color_name_${elem.value}`, target_table);
        
            funcCommand(body, funcProcessOnlyInfo);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetColors()}, 100);
        })
    })
}

const addColorsRow = (name, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName = newRow.insertCell(0); cellName.classList = "td td__text_align_center";
    let cellBtn = newRow.insertCell(1);  cellBtn.classList  = "td";

    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="color_name_${uin}">`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-product-color" value="${uin}"><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-product-color${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

let button_control_add_product_color = document.querySelector(".button__control_add-color");
button_control_add_product_color.addEventListener("click", () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"colors", "name":""};

    let name_value = document.getElementById("input_add_colors").value

    if(name_value === ""){
        alert("Вы не заполнили все поля!");
    } else {
        body.name = name_value;

        document.getElementById("input_add_colors").value = "";
    
        funcCommand(body, funcProcessOnlyInfo);
        setTimeout(function(){funcGetColors()}, 100);
    }
})

customSortSelect("sort_colors");
const dropdown = document.getElementById("sort_colors");
const options  = dropdown.querySelectorAll('li');
options.forEach(option => {
    option.addEventListener('click', () => {
        switch (option.getAttribute('data-value')){
            case '1':
                let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"colors", "count":"5000", "sort":"name"};
                funcCommand(body1, funcProcessGetColors);
            break;
            case '2':
                let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"colors", "count":"5000", "asort":"name"};
                funcCommand(body2, funcProcessGetColors);
            break;
            case '3':
                let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"colors", "count":"5000", "sort":"uin"};
                funcCommand(body3, funcProcessGetColors);
            break;
            case '4':
                let body4  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"colors", "count":"5000", "asort":"uin"};
                funcCommand(body4, funcProcessGetColors);
            break;
        }
    })
})