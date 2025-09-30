import {funcCommand, clearTableAll, responseProcessor} from '../../../js/common/common.js';

let date_first    = document.getElementById('pivtablepp_analysis_date_first');
let date_second   = document.getElementById('pivtablepp_analysis_date_second');
let button_choose = document.getElementById('button_pivtablepp_analysis_choose');
let button_reset  = document.getElementById('button_pivtablepp_analysis_reset');

date_second.value = new Date().toISOString().split('T')[0];

button_choose.addEventListener('click', () => {
    let date1 = (date_first.value).replace(/[\.\-/\\\s]/g, '');
    let date2 = (date_second.value).replace(/[\.\-/\\\s]/g, '');

    funcGetPivTablepp(date1, date2);
})

button_reset.addEventListener('click', () => {
    funcGetPivTablepp('', '');
    date_first.value  = '';
    date_second.value = '';
})

export const funcGetPivTablepp = (date1, date2) => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"pivTablepp", "count":"1000", "date1":`${date1}`, "date2":`${date2}`, "asort":"name"};
    funcCommand(body, funcProcessGetPivTablepp);
}

export const funcGetPivTableppTab = () => {
    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"pivTablepp", "count":"1000", "date1":"", "date2":`${new Date().toISOString().split('T')[0].replace(/[\.\-/\\\s]/g, '')}`, "asort":"name"};
    funcCommand(body, funcProcessGetPivTablepp);
}

const funcProcessGetPivTablepp = (result_piv, respobj_piv) => {
    console.log("СТ Печатных Плат:", respobj_piv);

    let tproc_arr = [];

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"techproc", "count":"100", "sort":"numb"};
    funcCommand(body, funcProcessGetTechproc);

    function funcProcessGetTechproc(result_tech, respobj_tech){
        if( result_tech === 0 ) return;
        console.log("Тех.процесс:", respobj_tech);

        for (let key in respobj_tech.answ){
            let obj  = respobj_tech.answ[key];
            let name = obj.name;

            tproc_arr.push(name);
        }

        let tb_id = "tb_pivtablepp";
        clearTableAll(tb_id);

        let tableRef = document.getElementById(tb_id);
        let newRow = tableRef.insertRow(-1);
        newRow.classList = "tr thead";

        let cellName  = newRow.insertCell(0); cellName.classList  = "td td_active td__text_align_center"; cellName.innerHTML = 'Изделие';
        let cellPlan  = newRow.insertCell(1); cellPlan.classList  = "td td_active td__text_align_center"; cellPlan.innerHTML = 'План';

        for (let i in tproc_arr) {
            let tproc = tproc_arr[i];
            let td = document.createElement("td");
            td.classList  = "td td_active td__text_align_center";
            td.innerHTML = tproc;
            newRow.append(td);
        }

        for (let key in respobj_piv.answ) {
            let obj   = respobj_piv.answ[key];
            let name  = obj.name;
            let plan  = obj.plan;
            let tcard = obj.tcard;
            let del   = obj.del;
            let uin   = obj.uin;
            addPivTableppRow(name, plan, tcard, del, uin, tb_id);
        }
    }
}

const addPivTableppRow = (name, plan, tcard, del, uin, tb_id) => {
    let tableRef = document.getElementById(tb_id);
    let newRow = tableRef.insertRow(-1);
    newRow.classList = "tr";

    let cellName  = newRow.insertCell(0); cellName.classList  = "td td__text_align_center"; cellName.innerHTML = name;
    let cellPlan  = newRow.insertCell(1); cellPlan.classList  = "td td__text_align_center"; cellPlan.innerHTML = plan;

    for (let j in tcard){
        let count  = tcard[j].count;
        let active = tcard[j].active;

        let td = document.createElement("td");
        td.classList = active === 0 ? "td td__text_align_center" : "td td_active-cell td__text_align_center";
        td.innerHTML = count;
        newRow.append(td);
    }
}

/*document.getElementById("sort_pivtablepp").addEventListener('change', function(){
    clearTableAll("tb_pivtablepp");

    let option = this.selectedIndex;
    switch (option){
        case 0:
        let body0  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"pivTablepp", "count":"1000", "asort":"name"};
        funcCommand(body0, funcProcessGetPivTablepp);
        break;
        case 1:
        let body1  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"pivTablepp", "count":"1000", "sort":"name"};
        funcCommand(body1, funcProcessGetPivTablepp);
        break;
        case 2:
        let body2  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"pivTablepp", "count":"1000", "asort":"uin"};
        funcCommand(body2, funcProcessGetPivTablepp);
        break;
        case 3:
        let body3  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"view", "obj":"pivTablepp", "count":"1000", "sort":"uin"};
        funcCommand(body3, funcProcessGetPivTablepp);
        break;
    }
});*/