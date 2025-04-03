import { funcCommand, funcProcessOnlyInfo} from "../../js/common/common.js";
import {funcGetComponentsTree, funcGetComponents} from '../table/__comp-main/table__comp-main.js';
import {funcInfoCatcTransferOpenModal} from '../modal/__transfer-comp/modal__transfer-comp.js';

export class Tree {
    constructor(dataItem) {
        this.id       = dataItem.id;
        this.text     = dataItem.text;
        this.deleted  = dataItem.del === 1;
        this.children = dataItem.children || [];
        this.parentId = null;
    }

    hasChildren() {
        return this.children.length > 0;
    }

    isValid() {
        return !this.deleted;
    }
}

export class TreeBuilder {
    constructor(containerId, options) {
        this.container       = document.getElementById(containerId);
        this.contextMenuDiv  = document.getElementById('contextMenu');
        this.selectedItem    = null;
        this.activeSummary   = null;
        this.options = options;
    }

    build(data) {
        this.container.innerHTML = '';

        const root_item = new Tree(data);
        const root_branch = this.createBranch(root_item);
        this.container.append(root_branch);

        this.buildTree(root_item.children, root_branch, root_item.id);

        if(this.options.includes("contextmenu")){this.contextMenu()} else {this.contextMenuDiv = null};
        if(this.options.includes("openall")){this.openFullTree()};
        this.initStorage();
    }

    buildTree(items, parentElement, parentId) {
        const container = document.createElement('div');
        container.classList.add('details__container');
        
        items.forEach(dataItem => {
            const item = new Tree(dataItem);
            item.parentId = parentId;
            
            const details = this.createBranch(item);
            container.append(details);
            
            if (item.hasChildren()) {
                this.buildTree(item.children, details, item.id);
            }
        });
        
        parentElement.append(container);
    }

    createBranch(item) {
        const details = Object.assign(document.createElement('details'), {
            id: `details_${item.id}`,
            classList: 'details'
        });
        details.setAttribute('data-id', item.id);

        const summary = Object.assign(document.createElement('summary'), {
            textContent: item.text,
            id: `summary_${item.id}`,
            classList: 'summary'
        });

        if (!item.isValid()) summary.classList.add('summary_deleted');
        
        if (!item.hasChildren()) summary.classList.add('summary_no-arrow');

        details.addEventListener('toggle', () => this.saveState());

        summary.addEventListener('contextmenu', (e) => {
            this.showContextMenu(e, item);
            this.selectItem(e.target);
        });

        summary.addEventListener('click', e => this.selectItem(e.target))

        details.append(summary);
        return details;
    }

    selectItem(summaryElement) {
        if (this.activeSummary) this.activeSummary.classList.remove('summary_active');
        
        this.activeSummary = summaryElement;
        this.activeSummary.classList.add('summary_active');

        this.saveState();
        funcGetComponents(this.activeSummary.closest('details').getAttribute('data-id'))
    }

    saveState() {
        const openDetails = Array.from(this.container.querySelectorAll('details[open]'));
        const openItems = openDetails.map(detail => detail.getAttribute('data-id'));
        const activeItemId = this.activeSummary ? 
            this.activeSummary.closest('details').getAttribute('data-id') : null;

        localStorage.setItem('treeState', JSON.stringify({
            openItems,
            activeItemId
        }));
    }

    initStorage() {
        const savedState = localStorage.getItem('treeState');
        if (savedState) {
            const openItems = JSON.parse(savedState).openItems;
            const activeItemId = JSON.parse(savedState).activeItemId;

            if (openItems) {
                openItems.forEach(id => {
                    const element = this.container.querySelector(`[data-id="${id}"]`);
                    if (element) element.setAttribute('open', '');
                });
            }

            if (activeItemId) {
                const activeElement = this.container.querySelector(`[data-id="${activeItemId}"] summary`);
                if (activeElement) this.selectItem(activeElement);
            }
        }
        
        window.addEventListener('beforeunload', () => this.saveState());
    }

    openFullTree() {
        const items = this.container.querySelectorAll('.details');
        if (items) {
            items.forEach(element => {
                if (element) element.setAttribute('open', '');
            });
        }
    }

    contextMenu() {
        document.getElementById('addBtn').addEventListener('click', () => {
            this.add(this.selectedItem);
            this.hideContextMenu();
        });
        
        document.getElementById('renameBtn').addEventListener('click', (e) => {
            this.rename(this.selectedItem);
            this.hideContextMenu();
        });
        
        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.delete(this.selectedItem);
            this.hideContextMenu();
        });
        
        document.getElementById('moveBtn').addEventListener('click', () => {
            this.move(this.selectedItem);
            this.hideContextMenu();
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('.context-menu') === null) {
                this.hideContextMenu();
            }
        });
    }

    showContextMenu(e, item) {
        e.preventDefault();
        this.selectedItem = item;

        const deleteBtn = document.getElementById('deleteBtn');
        this.selectedItem.deleted ? deleteBtn.textContent = 'Восстановить' : deleteBtn.textContent = 'Удалить';
        
        this.contextMenuDiv.style.display = 'block';
        this.contextMenuDiv.style.left = `${e.pageX}px`;
        this.contextMenuDiv.style.top = `${e.pageY}px`;
    }

    hideContextMenu() {
        this.contextMenuDiv.style.display = 'none';
        this.selectedItem = null;
    }

    add(dataItem) {
        if(dataItem != null){
            let newName = prompt('Введите название папки:', '');
            if(newName != null){
                let body  =  {"user":"demo", "meth":"add", "obj":"dirC", "uinparent":`${dataItem.id}`, "name":`${newName}`};
                console.log(body)
                funcCommand(body, funcProcessOnlyInfo, funcGetComponentsTree);
            }
        }
    }

    rename(dataItem) {
        if(dataItem != null){
            let newName = prompt('Введите новое название папки:', '');
            if(newName != null){
                let body  =  {"user":"demo", "meth":"update", "obj":"dirC", "uin":`${dataItem.id}`, "uinparent":`${dataItem.parentId}`, "name":`${newName}`};
                funcCommand(body, funcProcessOnlyInfo, funcGetComponentsTree);
            }
        }
    }

    delete(dataItem) {
        if(dataItem != null){
            let result = confirm('Подтвердите удаление');
            if(result){
                let body = {"user":"demo", "meth":"mdel", "obj":"catC", "uin":`${dataItem.id}`};
                funcCommand(body, funcProcessOnlyInfo, funcGetComponentsTree);
            }
        }
    }

    move(dataItem){
        if(dataItem != null){
            funcInfoCatcTransferOpenModal(dataItem.id, dataItem.text);
        }
    }

    get() {
        return this.activeSummary.closest('details');
    }
}