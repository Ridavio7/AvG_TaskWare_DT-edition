export const customSelect = (select_id, arr, text) => {
    const dropdown    = document.getElementById(select_id);
    const header      = dropdown.querySelector('.selectHeader');
    const searchInput = dropdown.querySelector('.searchInput');
    const optionsList = dropdown.querySelector('.optionsList');
    const noResults   = dropdown.querySelector('.noResults');

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

    // Все оригинальные опции (для фильтрации)
    const optionItems = optionsList.querySelectorAll('.select-custom__option-item');
    const checkboxes = optionsList.querySelectorAll('input[type="checkbox"]');

    // Переключение видимости
    header.addEventListener('click', () => {
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            searchInput.focus();
            filterOptions();
        }
    })

    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    })

    // Фильтрация опций по поиску
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

        // Показать/скрыть сообщение "Ничего не найдено"
        if (query && visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    // Обновление выбранных значений
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelection);
    })

    function updateSelection() {
        const checked = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (checked.length === 0) {
            header.textContent = `Выберите ${text}`;
        } else {
            header.textContent = checked.length > 1 
            ? `${checked.length} выбрано` 
            : checked.join(', ');
        }
        header.insertAdjacentHTML('beforeend', '<span class="select-custom__icon"></span>');
    }

    // Очистка поиска при закрытии
    dropdown.addEventListener('mouseleave', () => {
      // Можно оставить, если хочется сбрасывать поиск при уходе
    });

    // По нажатию Esc — закрыть dropdown
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('active');
        }
    })
}

export const customSortSelect = (select_id) => {
    const dropdown      = document.getElementById(select_id);
    const selectHeader  = dropdown.querySelector('.selectHeader');
    const options       = dropdown.querySelectorAll('li');

    selectHeader.addEventListener('click', () => {
        dropdown.classList.toggle('active');
    })

    options.forEach(option => {
        option.addEventListener('click', () => {
            selectHeader.textContent = option.textContent;
            dropdown.classList.remove('active');

            selectHeader.insertAdjacentHTML('beforeend', '<span class="select-custom__icon"></span>');
        })
    })

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    })
}