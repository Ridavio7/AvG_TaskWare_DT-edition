import {funcCommand, clearTable, findForUpdateInput, highlightButtonSave, funcProcessOnlyInfo, responseProcessor, funcProcessOnlyConsole} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';
import {funcGetCompontimgs} from '../../table/__comp-compontimgs/table__comp-compontimgs.js';

let edit_imgs_modal = document.getElementById("comp_edit_imgs_modal");
let edit_imgs_close = document.getElementById("comp_edit_imgs_close");
let edit_imgs_title = document.getElementById("comp_edit_imgs_title");

edit_imgs_close.onclick = () => {
    edit_imgs_modal.style.display = "none";
}

dragElement(edit_imgs_modal);

export const funcEditImgsOpenModal = (uin, name) => {
    edit_imgs_modal.style.display = "block";

    edit_imgs_title.innerHTML = name;
    funcGetCompontimgsEdit(uin);
}

export const funcGetCompontimgsEdit = (uin) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "obj":"compontimgBS", "meth":"view", "uincompont":`${uin}`, "count":"100", "sort":"name"}
    funcCommand(body, funcProcessGetCompontimgs);
}

const funcProcessGetCompontimgs = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Картинки:", respobj);

    let tb_id = "tb_modal_img";
    clearTable(tb_id);

    for (let key in respobj.answ){
        let obj   = respobj.answ[key];
        let name  = obj.name;
        let fname = obj.fname;
        let del   = obj.del;
        let uin   = obj.uin;
        addCompontimgs(name, fname, del, uin, tb_id);
    }

    // функция удаления 
    let button_control_mdel = document.querySelectorAll(".button__control_mdel-compontimgs");
    button_control_mdel.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":"compontimgBS", "uin":`${elem.value}`};

            if(elem.classList[3] === 'button__control_mdel_active'){
                elem.classList.remove('button__control_mdel_active');
            } else {
                elem.classList.add('button__control_mdel_active');
            }
        
            funcCommand(body, funcProcessOnlyInfo);
        })
    })

    // функция обновления
    // API UPDATE ОТСТУТВТВУЕ, у кнопок disabled
    let button_control_update = document.querySelectorAll(".button__control_update-compontimgs");
    button_control_update.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"compontimgs", "uincompont":`${elem.name}`, "name":"", "img":"", "uin":`${elem.value}`};

            let target_table = tb_modal_img;
            body.name = findForUpdateInput(`component_info_img_name_${elem.value}`, target_table);
            body.img = findForUpdateInput(`component_info_img_img_${elem.value}`, target_table);

            funcCommand(body, funcProcessOnlyConsole);
            highlightButtonSave(elem);
            setTimeout(function(){funcGetCompontimgsEdit(`${elem.name}`)}, 100);
        })
    })

    // открытие окна с картинкой
    let button_control_open = document.querySelectorAll(".button__control_open-compontimgs");
    button_control_open.forEach((elem) => {
        elem.addEventListener("click", () => {
            let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewBS", "obj":"compontimgBS", "uin":`${elem.value}`};
            funcCommand(body, funcProcessOpenCompontimgs);
        })
    })
}

const addCompontimgs = (name, fname, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellInfo = newRow.insertCell(0); cellInfo.classList = "td";
    let cellName = newRow.insertCell(1); cellName.classList = "td";
    let cellImg  = newRow.insertCell(2); cellImg.classList  = "td";
    let cellBtn  = newRow.insertCell(3); cellBtn.classList  = "td";

    cellInfo.innerHTML = `<button class="button__control button__control_open-compontimgs" value="${uin}"><img class="button__control__img" src="assets/images/link.svg" alt=""></button>`;
    cellName.innerHTML = `<input class="input__type-text" type="text" value="${name}" name="component_info_img_name_${uin}">`;
    cellImg.innerHTML  = `<input type="file" class="input__type-file_img" name="component_info_img_img_${uin}" id="component_info_img_img_${uin}" accept="image/*" disabled hidden><label class="input__type-text input__type-file" for="component_info_img_img_${uin}">${fname}</label>`;

    let bx_color = del === 0 ? bx_color = "" : bx_color = " button__control_mdel_active"; cellBtn.classList = "td td_buttons-control";
    cellBtn.innerHTML = `<button class="button__control button__control_update button__control_update-compontimgs" value="${uin}" disabled><img class="button__control__img" src="assets/images/arrow_3.svg" alt=""></button><button class="button__control button__control_mdel button__control_mdel-compontimgs${bx_color}" value="${uin}"><img class="button__control__img" src="assets/images/cross.svg"></button>`;
}

const funcProcessOpenCompontimgs = (result, respobj) => {
    //responseProcessor(result, respobj.succ);
    console.log("Картинка:", respobj);

    var win = window.open();
    win.document.write(`<iframe src="data:image/jpg;base64,${respobj.answ.bs}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
}

let button_control_add = document.getElementById("component_info_add_button_img");
button_control_add.onclick = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":"compontimgBS", "name":"", "fname":"", "uincompont":"", "bs":""};

    let name_value  = document.getElementById("component_info_add_img_name").value;
    let fname_value = document.getElementById("component_info_add_img_img");
    let uin_value   = document.getElementById("component_save").value;
    let bs_value;

    let file = fname_value.files[0];
    let reader = new FileReader();
    reader.onload = () => {
        bs_value = reader.result.split(',')[1];

        if(name_value === "" || file === undefined || file.size > 3145728){
            alert("Вы не заполнили все поля и/или файл больше 3 Мб!");
        } else {
            body.name       = name_value;
            body.fname      = file.name;
            body.uincompont = uin_value;
            body.bs         = bs_value;
    
            document.getElementById("component_info_add_img_name").value = "";
            document.getElementById("component_info_add_img_img").value = "";
            document.getElementById("component_info_add_img_img").nextElementSibling.textContent = "Выберите файл";
        
            funcCommand(body, funcProcessOnlyInfo);
            setTimeout(function(){funcGetCompontimgsEdit(uin_value)}, 100);
            setTimeout(function(){funcGetCompontimgs(uin_value)}, 150);
        }
    }
    reader.readAsDataURL(file);
}