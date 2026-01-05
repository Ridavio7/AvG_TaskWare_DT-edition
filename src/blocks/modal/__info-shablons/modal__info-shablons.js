import {funcCommand, funcProcessOnlyInfo, removeOptions, insertDataInSelect, responseProcessor} from '../../../js/common/common.js';
import {dragElement, resizeModalWindow, openModal, closeModal} from '../modal.js';
import {funcGetShablons, funcGetShablonsTree} from '../../table/__template-task-shablons/table__template-task-shablons.js';
import {funcGetProductsTreeSelectUnic} from '../__select-prod-unic/modal__select-prod-unic.js';
import {funcGetShblcontrol} from '../../modal/__shblcontrol/modal__shblcontrol.js';

let shablons_modal    = document.getElementById("shablons_modal");
let shablons_close    = document.getElementById("shablons_close");
let shablons_shablon  = document.getElementById("shablons_name_shablon");
let shablons_title    = document.getElementById("shablons_name_title");
let shablons_name     = document.getElementById("shablons_name");
let shablons_mission  = document.getElementById("shablons_mission");
let shablons_dl_d     = document.getElementById("shablons_dl_d");
let shablons_dl_h     = document.getElementById("shablons_dl_h");
let shablons_dl_m     = document.getElementById("shablons_dl_m");
let shablons_user     = document.getElementById("shablons_user");
let shablons_areaprof = document.getElementById("shablons_areaprof");
let shablons_content  = document.getElementById("shablons_content");
let shablons_c_prod   = document.getElementById("shablons_content_product");
let shablons_c_proc   = document.getElementById("shablons_content_techproc");
let shablons_count    = document.getElementById("shablons_count");
let shablons_autor    = document.getElementById("shablons_autoready");
let shablons_start    = document.getElementById("shablons_start");
let shablons_save     = document.getElementById("shablons_save");
let switch_1          = document.getElementById("switch_shablons_inputs_1");
let switch_2          = document.getElementById("switch_shablons_inputs_2");
let modal_resize      = document.getElementById("shablons_modal_resize");

const tabButtons = document.querySelectorAll('.modal__tab-button_shablons');
const tabContents = document.querySelectorAll('.modal__tab-content_shablons');

let shablonsCountLastValue;
let shablonsContentLastValue;

closeModal(shablons_modal, shablons_close);

dragElement(shablons_modal);
resizeModalWindow(modal_resize, "whModalShablon", "Размеры окна шаблона");

/* настройка размера окна */
const funcGetResize = () => {
    let body = {"user":`${localStorage.getItem('srtf')}`, "meth":"get", "obj":"webopt", "name":"whModalShablon", "uinuser":`${localStorage.getItem('user_uin')}`};
    funcCommand(body, funcProcessGetResize)
}

const funcProcessGetResize = (result, respobj) => {
    modal_resize.style.width  = `${respobj.answ.val[0]}px`;
    modal_resize.style.height = `${respobj.answ.val[1]}px`;
}

export const funcGetShablonsSteps = (uin) => {
    funcGetResize();
    openModal(shablons_modal);

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewInside", "obj":"dirSh", "uin":`${uin}`, "uinShablon":`${localStorage.getItem('uinShablon')}`};
    funcCommand(body, funcProcessGetShablonsSteps);

    funcGetShblcontrol(localStorage.getItem('uinShablon'));
}

const funcProcessGetShablonsSteps = (result, respobj) => {
    console.log("Инфо шага:", respobj);

    shablons_name.value    = '';
    shablons_mission.value = '';
    shablons_dl_d.value    = '';
    shablons_dl_h.value    = '';
    shablons_dl_m.value    = '';
    removeOptions(shablons_user);
    removeOptions(shablons_areaprof);
    removeOptions(shablons_content);
    removeOptions(shablons_start);
    removeOptions(shablons_c_proc);

    if(respobj.answ.uin === '0'){
        shablons_areaprof.disabled = true;
        shablons_dl_d.disabled     = true;
        shablons_dl_h.disabled     = true;
        shablons_dl_m.disabled     = true;
        shablons_start.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        switch_1.parentElement.parentElement.parentElement.style.opacity = "0";
        if(window.innerWidth < 1024){ switch_1.parentElement.parentElement.parentElement.style.display = "none" };
        tabButtons[1].disabled = false;
    } else {
        shablons_areaprof.disabled = false;
        shablons_dl_d.disabled     = false;
        shablons_dl_h.disabled     = false;
        shablons_dl_m.disabled     = false;
        shablons_start.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
        switch_1.parentElement.parentElement.parentElement.style.opacity = "1";
        if(window.innerWidth < 1024){ switch_1.parentElement.parentElement.parentElement.style.display = "block" };
        tabButtons[1].disabled = true;
    }

    let obj          = respobj.answ;
    let name         = obj.name;
    let mission      = obj.mission != undefined ? obj.mission : '---';
    let numb_i       = obj.numb_inlevel != undefined ? obj.numb_inlevel : '0';
    let dl           = obj.dl;
    let nameShablon  = obj.shablon.name;
    let uinShablon   = obj.shablon.uin;
    let nameUser     = obj.user.name;
    let uinUser      = obj.user.uin;
    let nameAreaprof = obj.areaprof != undefined ? obj.areaprof.name : '---';
    let uinAreaprof  = obj.areaprof != undefined ? obj.areaprof.uin : '';
    let nameStart    = obj.start    != undefined ? obj.start.name : '---';
    let uinStart     = obj.start    != undefined ? obj.start.uin : '';
    let nameContent  = obj.content  != undefined ? obj.content.name : '---';
    let uinContent   = obj.content  != undefined ? obj.content.uin : '';
    let nameProd     = obj.product  != undefined ? obj.product.name : '---';
    let uinProd      = obj.product  != undefined ? obj.product.uin : '';
    let nameProc     = obj.techproc != undefined ? obj.techproc.name : '---';
    let uinProc      = obj.techproc != undefined ? obj.techproc.uin : '';
    let autoready    = obj.autoready;
    let fareaprof    = obj.fareaprof;
    let count        = obj.count;
    let uin          = obj.uin;
    let del          = obj.del;
    addShablonsInfo(name, mission, numb_i, dl, nameShablon, uinShablon, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, nameProd, uinProd, nameProc, uinProc, autoready, fareaprof, count, uin, del);
}

shablons_c_prod.onclick = () => {
    funcGetProductsTreeSelectUnic();
    localStorage.setItem("button_select_product_unic_id", "shablons_content_product");
}

const addShablonsInfo =
(name, mission, numb_i, dl, nameShablon, uinShablon, nameUser, uinUser, nameAreaprof, uinAreaprof, nameStart, uinStart, nameContent, uinContent, nameProd, uinProd, nameProc, uinProc, autoready, fareaprof, count, uin, del) => {
    shablons_shablon.innerHTML = `Шаблон: ${nameShablon}`;
    shablons_title.innerHTML   = `№ ${numb_i} ${name}`;
    shablons_name.value        = name;
    shablons_mission.value     = mission;
    shablons_dl_d.value        = dl.dl_d;
    shablons_dl_h.value        = dl.dl_h;
    shablons_dl_m.value        = dl.dl_m;
    shablons_count.value       = count;
    shablonsCountLastValue     = shablons_count.value;
    insertDataInSelect(shablons_user, nameUser, uinUser, "users_list");
    uin === "0" ? shablons_user.parentElement.previousElementSibling.textContent = "Админ:" : shablons_user.parentElement.previousElementSibling.textContent = "Исполнитель:";
    insertDataInSelect(shablons_areaprof, nameAreaprof, uinAreaprof, "prof_list");
    insertDataInSelect(shablons_content, nameContent, uinContent, "contents_list");
    shablonsContentLastValue = uinContent;
    if(uin === "0" && uinContent === 5){
        shablons_c_prod.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_c_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(uin === "0" && uinContent === 3) {
        shablons_c_prod.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_c_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(uin != "0" && uinContent === 5){
        shablons_c_prod.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_c_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(uin != "0" && uinContent === 3){
        shablons_c_prod.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_c_proc.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
    } else {
        shablons_c_prod.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_c_proc.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    }
    insertDataInSelect(shablons_c_proc, nameProc, uinProc, "techproc_list");
    if(uinProd === ''){
        shablons_c_prod.textContent = 'Выберите изделие';
        shablons_c_prod.value = '';
        shablons_c_prod.name  = '';
    } else if(uinProd === 0){
        shablons_c_prod.textContent = 'Выберите изделие';
        shablons_c_prod.value = '';
        shablons_c_prod.name  = '';
    } else {
        shablons_c_prod.textContent = nameProd;
        shablons_c_prod.value = uinProd;
        shablons_c_prod.name  = nameProd;
    }
    insertDataInSelect(shablons_start, nameStart, uinStart, "startstep_list");
    shablons_autor.checked = autoready === 1 ? true : false;
    if(fareaprof === 0){ 
        switch_1.checked = true;
        shablons_user.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_areaprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    } else if(fareaprof === 1) {
        switch_2.checked = true;
        shablons_user.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
        shablons_areaprof.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
    } else {
        shablons_user.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        shablons_areaprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
    }
    shablons_save.value = uin;
    shablons_save.name = uinShablon;
}

/* отслеживание count/content */
let shablonsCountChangeValue = false;
let shablonsContentChangeValue = false;

shablons_count.addEventListener('input', () => {
    const currentValue = shablons_count.value;

    if (currentValue !== shablonsCountLastValue) {
        shablonsCountLastValue = currentValue;
        shablonsCountChangeValue = true;
    }
})

shablons_content.addEventListener('change', () => {
    const currentValue = shablons_content.value;

    if (currentValue !== shablonsContentLastValue) {
        shablonsContentLastValue = currentValue;
        shablonsContentChangeValue = true;
    }
})

/* кнопка сохранения */
shablons_save.onclick = (elem) => {
    let body;
    elem.target.value === 0 ? 
    body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirSh", "uin":`${elem.target.value}`,
        "name":"", "uinuser":"", "autoready":"", "uincontent":"", "count":"",  "uinproduct":"", "uinShablon":`${localStorage.getItem('uinShablon')}`} :
    body = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"dirSh", "uin":`${elem.target.value}`,
        "name":"", "uinuser":"", "uinareaprof":"", "uincontent":"", "uinstart":"", "numb_inlevel":"", "mission":"",
        "prim":"", "dl_d":"", "dl_h":"", "dl_m":"", "count":"", "autoready":"", "fareaprof":"", "uinproduct":"",
        "uintechproc":"", "uinShablon":`${localStorage.getItem('uinShablon')}`};

    body.name         = shablons_name.value;
    body.uinuser      = shablons_user.value;
    body.uinareaprof  = shablons_areaprof.value;
    body.uincontent   = shablons_content.value;
    body.uinstart     = shablons_start.value;
    body.mission      = shablons_mission.value;
    body.dl_d         = shablons_dl_d.value;
    body.dl_h         = shablons_dl_h.value;
    body.dl_m         = shablons_dl_m.value;
    body.count        = shablons_count.value;
    body.autoready    = shablons_autor.checked === true ? "1" : "0";
    body.fareaprof    = switch_1.checked === true ? "0" : "1";
    body.uinproduct   = shablons_c_prod.value;
    body.uintechproc  = shablons_c_proc.value;

    funcCommand(body, funcProcessOnlyInfo);

    if(elem.target.value == 0){
        if(shablonsCountChangeValue === true || shablonsContentChangeValue === true){
            let result = confirm('Поменять количество/тип контента во всех шагах шаблона?');
            if(result){
                let body_2 = {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":"catSh", "uinShablon":`${localStorage.getItem('uinShablon')}`, "count":`${shablons_count.value}`, "uincontent":`${shablons_content.value}`};
                funcCommand(body_2, funcProcessOnlyInfo);

                shablonsCountChangeValue = false;
                shablonsContentChangeValue = false;
            }
        }
    }

    setTimeout(function(){funcGetShablonsTree(elem.target.name)}, 100);
    setTimeout(function(){funcGetShablons()}, 150);
    setTimeout(function(){funcGetShablonsSteps(elem.target.value)}, 200);
}

/* переклуючение */
const radioButtons = document.querySelectorAll(
    'input[name="switch-shablons-inputs"]',
)

radioButtons.forEach(radio => {
    radio.addEventListener('click', () => {
        if (switch_1.checked) {
            shablons_user.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
            shablons_areaprof.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
        } else if(switch_2.checked) {
            shablons_user.parentElement.parentElement.classList.add("modal__input-wrapper_display-none");
            shablons_areaprof.parentElement.parentElement.classList.remove("modal__input-wrapper_display-none");
        }
    })
})

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    })
})