let button_tab_first = document.querySelectorAll(".button__tab__first");
button_tab_first.forEach((elem) => {
    elem.addEventListener("click", () => {
        //setTimeout(function(){elem.name}, 10);
        let tablinks_1 = document.getElementsByClassName(elem.classList[0]);
        let tablinks_2 = document.getElementsByClassName(elem.classList[1]);
    
        for (let i = 0; i < tablinks_1.length; i++) {
            tablinks_1[i].className = tablinks_1[i].className.replace(" button__tab__first_active", "");
        }
        for (let i = 0; i < tablinks_2.length; i++) {
            tablinks_2[i].className += " button__tab__first_active";
        }
    
        localStorage.setItem("buisness_tabcontent_tab_active", elem.classList[1]);
    })
});