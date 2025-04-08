let input_add_img = document.querySelectorAll(".input__type-file_img");
input_add_img.forEach((elem) => {
    elem.addEventListener("change", () => {
        let fileName = elem.files[0] ? elem.files[0].name : 'Файл не выбран';
        elem.nextElementSibling.textContent = fileName;
    })
})