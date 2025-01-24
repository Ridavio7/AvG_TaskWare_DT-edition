let expand_btn = document.querySelector(".sidebar__expand-button");
expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
});

/* sidebar первые кнопки */
let sidebar_links = document.querySelectorAll(".sidebar__link");
sidebar_links.forEach((elem) => {
    elem.addEventListener("click", () => {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("sidebar__tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("sidebar__link");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" sidebar__link_active", "");
        }
        document.getElementById(elem.classList[1]).style.display = "flex";
        document.getElementById(elem.classList[1]).style.flexDirection = "column";
        elem.className += " sidebar__link_active";

        localStorage.setItem("buisness_sidebar_tab_first_active", elem.id);
    
        if(elem.id === "link_provider" || elem.id === "link_storage"){
          //document.getElementById(localStorage.getItem("buisness_tab_first_active")).classList.remove("active");
            localStorage.removeItem("buisness_tab_first_active");
            localStorage.removeItem("buisness_tab_second_active");
            localStorage.removeItem("buisness_tab_third_active");
        }
    });
});

/* sidebar вторые кнопки */
let sidebar_menu_links = document.querySelectorAll(".sidebar__menu__link");
sidebar_menu_links.forEach((elem) => {
    elem.addEventListener("click", () => {
        tablinks = document.getElementsByClassName("sidebar__menu__link");
        for (let i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" sidebar__link_active", "");
        }
    
        elem.className += " sidebar__link_active";
        elem.parentElement.parentElement.previousElementSibling.click();
    
        localStorage.setItem("buisness_sidebar_tab_second_active", elem.id);
    })
})

/* выпадающий список по стрелке */
let arrowTab = document.querySelectorAll(".sidebar__arrow");
for (let i = 0; i < arrowTab.length; i++) {
    arrowTab[i].addEventListener("click", (e)=>{
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("sidebar__wrapper_menu-visibale");
        localStorage.setItem("buisness_sidebar_arrow_active", arrowParent.id);
    });
}