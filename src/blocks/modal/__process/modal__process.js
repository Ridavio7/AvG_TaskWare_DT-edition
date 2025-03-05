import {funcCommand, funcProcessOnlyInfo, clearTable, removeOptionsSetValue, addToDropdown} from '../../../js/common/common.js';
import {dragElement} from '../modal.js';

let modal_process = document.getElementById("modal_process");
let span_process  = document.getElementById("close_process");

span_process.addEventListener("click", () => {
    modal_process.style.display = "none";
})

dragElement(modal_process);

export const funcInfoProcessOpenModal = (uin) => {
    modal_process.style.display = "block";

    //funcGetInfoProcess(uin);
}