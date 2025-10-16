import {funcCommand, responseProcessor} from '../../../js/common/common.js.js';
import {createCarousel} from '../../carousel/carousel.js';

let productImages = [];
let uinCompont = null;

export const funcGetCompontimgs = (uin) => {
    productImages = [];
    createCarousel([]);
    uinCompont = uin;

    let body  =  {"user":`${localStorage.getItem('srtf')}`, "obj":"compontimgBS", "meth":"view", "uincompont":`${uin}`, "count":"100", "sort":"name"}
    funcCommand(body, funcProcessGetCompontimgs);
}

const funcProcessGetCompontimgs = (result, respobj) => {
    if(respobj.answ === ''){
        document.getElementById('mainImage').src = "https://imgholder.ru/700x400/fff/212121&text=Фото+отсутствует";
        document.getElementById('thumbnailContainer').innerHTML = '';
    }

    console.log(respobj)

    for (let key in respobj.answ){
        let obj = respobj.answ[key];
        let uin = obj.uin;
        let del = obj.del;

        let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"viewBS", "obj":"compontimgBS", "uin":`${uin}`, "uincompont":`${uinCompont}`};
        funcCommand(body, funcProcessGetCompontimgBS);
    }
}

const funcProcessGetCompontimgBS = (result, respobj) => {
    let data_bs = `data:image/jpg;base64,${respobj.answ.bs}`;
    productImages.push(data_bs);

    createCarousel(productImages);
}