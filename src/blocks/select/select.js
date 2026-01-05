export const customSelect = (select_id, arr, text) => {
    const dropdown    = document.getElementById(select_id);
    const header      = dropdown.querySelector('.selectHeader');
    const searchInput = dropdown.querySelector('.searchInput');
    const optionsList = dropdown.querySelector('.optionsList');
    const noResults   = dropdown.querySelector('.noResults');
    const button      = dropdown.querySelector('.buttonReset');

    for(let key in arr){
        if(arr[key].del === 0){
            let label = document.createElement('label');
            label.className = 'select-custom__option-item';
            label.htmlFor = `checkbox_${select_id}_${arr[key].uin}`;

            let input = document.createElement('input');
            input.type = "checkbox";
            input.className = "checkbox";
            input.value = arr[key].name;
            input.setAttribute('data-value', (arr[key].uin));
            input.id = `checkbox_${select_id}_${arr[key].uin}`;

            let label_i = document.createElement('label');
            label_i.htmlFor = `checkbox_${select_id}_${arr[key].uin}`;
            label_i.append(arr[key].name);

            label.append(input);
            label.append(label_i);

            optionsList.append(label)
        }
    }

    const optionItems = optionsList.querySelectorAll('.select-custom__option-item');
    const checkboxes = optionsList.querySelectorAll('input[type="checkbox"]');

    header.addEventListener('click', () => {
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            searchInput.focus();
            filterOptions();
        }
    })

    searchInput.addEventListener('input', filterOptions);

    function filterOptions() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        optionItems.forEach(item => {
            const text = item.textContent.trim();
            if (text.toLowerCase().includes(query)) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        })

        if (query && visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelection);
    })

    function updateSelection() {
        const checked = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (checked.length === 0) {
            header.innerHTML = `<span class="select-custom__icon select-custom__icon-filter"></span> ${text}`;
            if (button) button.style.display = 'none';
        } else {
            header.textContent = checked.length > 1 
            ? `${checked.length} выбрано` 
            : checked.join(', ');
            if (button) button.style.display = 'flex';
        }
    }

    if (button) {
        button.addEventListener('click', () => {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            updateSelection();
            searchInput.value = '';
            filterOptions();
        })
    }

    // Очистка поиска при закрытии
    dropdown.addEventListener('mouseleave', () => {
      // Можно оставить, если хочется сбрасывать поиск при уходе
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('active');
        }
    })
}

export const customSortSelect = (select_id) => {
    const dropdown      = document.getElementById(select_id);
    const selectHeader  = dropdown.querySelector('.selectHeader');
    const icon          = dropdown.querySelector('.select-custom__icon');
    const options       = dropdown.querySelectorAll('li');

    selectHeader.addEventListener('click', () => {
        dropdown.classList.toggle('active');
        
        if(window.innerWidth <= 1024){
            document.getElementById('modal-overlay').style.display = 'block';
        }
    })

    options.forEach(option => {
        option.addEventListener('click', () => {
            if(window.innerWidth <= 1024){
                selectHeader.classList.add('active');
            } else {
                selectHeader.textContent = option.textContent;
                selectHeader.insertAdjacentHTML('afterbegin', '<span class="select-custom__icon"></span>');
            }
            dropdown.classList.remove('active');
        })
    })
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.select-custom')) {
        document.querySelectorAll('.select-custom').forEach(d => d.classList.remove('active'));

        if(window.innerWidth <= 1024){
            document.getElementById('modal-overlay').style.display = 'none';
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.select-custom_filter-open').forEach(child => {
        child.addEventListener('click', () => {
            const targetId = child.dataset.target;
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) {
                targetBlock.style.display = 'flex';
            }
        })
    })

    document.querySelectorAll('.button__control_tabcontent-filter-close').forEach(child => {
        child.addEventListener('click', () => {
            const targetId = child.dataset.target;
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) {
                targetBlock.style.display = 'none';
            }
        })
    })

    if(window.innerWidth <= 1024){
        document.querySelectorAll('.button__control_tabcontent-send-filter').forEach(child => {
            child.textContent = 'Применить';
        })

        document.querySelectorAll('.button__control_tabcontent-reset-filter').forEach(child => {
            child.textContent = 'Сбросить';
        })
    }
})