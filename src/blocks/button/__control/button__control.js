import {funcCommand} from '../../../js/common/common.js';
import {funcProcessGetGrfShipSets} from '../../table/__schedule/table__schedule.js';

/* график отгрузки */
let today = new Date();
let year = today.getFullYear();
localStorage.setItem("curr_year", year);

let btn_previous_year = document.querySelector(".button__control_previous-year");
btn_previous_year.addEventListener("click", () => {
    let year = localStorage.getItem("curr_year");
    let currYear = +year - 1;
    localStorage.setItem("curr_year", currYear);

    document.getElementById("grf_year").value = "";
    document.getElementById("grf_year").value = currYear;

    let body  =  {"user":"demo", "meth":"view", "obj":"grfShipSets", "count":"100", "filt":`[{"fld":"year","val":["${currYear}"]}]`};
    funcCommand(body, funcProcessGetGrfShipSets);
})

let btn_next_year = document.querySelector(".button__control_next-year");
btn_next_year.addEventListener("click", () => {
    let year = localStorage.getItem("curr_year");
    let currYear = +year + 1;
    localStorage.setItem("curr_year", currYear);

    document.getElementById("grf_year").value = "";
    document.getElementById("grf_year").value = currYear;

    let body  =  {"user":"demo", "meth":"view", "obj":"grfShipSets", "count":"100", "filt":`[{"fld":"year","val":["${currYear}"]}]`};
    funcCommand(body, funcProcessGetGrfShipSets);
})