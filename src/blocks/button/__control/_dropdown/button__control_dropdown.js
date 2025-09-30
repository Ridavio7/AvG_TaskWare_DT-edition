export class DropdownButton {
    constructor(containerElem, triggerText, buttonsConfig, iconSrc) {
        this.containerId = containerElem;
        this.triggerText = triggerText;
        this.buttonsConfig = buttonsConfig;
        this.iconSrc = iconSrc;
        this.init();
    }

    init() {
        const container = this.containerId;
        if (!container) {
            console.error(`Контейнер с id "${this.containerId}" не найден.`);
            return;
        }

        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'button__control';
        triggerBtn.type = 'button';

        if (this.iconSrc) {
            const img = document.createElement('img');
            img.src = this.iconSrc;
            img.className = "button__control__img button__control_dropdown-img";
            img.alt = 'icon';
            img.loading = 'lazy';
            triggerBtn.appendChild(img);
        }

        const span = document.createElement('span');
        span.textContent = this.triggerText;
        triggerBtn.appendChild(span);

        const menu = document.createElement('div');
        menu.className = 'button__control_dropdown-menu';

        this.buttonsConfig.forEach(btn => {
            const btnEl = document.createElement('button');
            btnEl.textContent = btn.text;
            btnEl.className = "button__control_dropdown-button";
            btnEl.addEventListener('click', (e) => {
                e.stopPropagation();
                btn.action();
                this.hideMenu(menu);
            })
            menu.appendChild(btnEl);
        })

        container.appendChild(triggerBtn);
        container.appendChild(menu);

        let timeoutId;

        const showMenu = () => {
            clearTimeout(timeoutId);
            menu.classList.add('show');
        }

        const hideMenuDelayed = () => {
            timeoutId = setTimeout(() => {
                menu.classList.remove('show');
            }, 300)
        }

        triggerBtn.addEventListener('click', showMenu);
        menu.addEventListener('click', showMenu);

        //triggerBtn.addEventListener('mouseleave', hideMenuDelayed);
        //menu.addEventListener('mouseleave', hideMenuDelayed);

        document.addEventListener('click', (e) => {
            if (e.target.closest('.button__control_dropdown-container') === null) {
                this.hideMenu(menu);
            }
        });
    }

    hideMenu(menu){ menu.classList.remove('show') };
}

/* Пример использования:

new DropdownButton('dropdown1', 'Действия', [
  { text: 'Редактировать', action: () => alert('Редактировать!') },
  { text: 'Удалить', action: () => alert('Удалить!') },
  { text: 'Скопировать', action: () => alert('Скопировано!') }
], "https://via.placeholder.com/20/007BFF/FFFFFF?text=⚙");

*/