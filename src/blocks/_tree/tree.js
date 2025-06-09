import {funcCommand, funcProcessOnlyInfo, treeSpanFactory} from "../../js/common/common.js";

export class Tree {
    constructor(dataItem) {
        this.id         = dataItem.id;
        this.text       = dataItem.text;
        this.deleted    = dataItem.del === 1;
        this.children   = dataItem.children || [];
        this.contentNum = dataItem.contentNum;
        this.del        = dataItem.del;
        this.parentId   = null;
    }

    hasChildren() {
        return this.children.length > 0;
    }

    isValid() {
        return !this.deleted;
    }
}

export class TreeBuilder {
    constructor(containerId, obj, objPar, funcTree, funcItem, funcTrans, options) {
        this.container      = document.getElementById(containerId);
        this.contextMenuDiv = document.getElementById('contextMenu');
        this.selectedItem   = null;
        this.activeSummary  = null;
        this.obj            = obj;
        this.objPar         = objPar;
        this.funcTree       = funcTree;
        this.funcItem       = funcItem;
        this.funcTrans      = funcTrans;
        this.options        = options;
    }

    build(data) {
        this.container.innerHTML = '';

        const root_item = new Tree(data);
        const root_branch = this.createBranch(root_item);
        this.container.append(root_branch);

        this.initStorage()

        if(this.options.includes("contextmenu")){this.contextMenu()} else {this.contextMenuDiv = null};
    }

    buildTree(items, parentElement, parentId) {
        items.forEach(dataItem => {
            const item = new Tree(dataItem);
            item.parentId = parentId;
            
            const details = this.createBranch(item);
            parentElement.append(details);
        });
    }

    createBranch(item) {
        const itemContainer     = document.createElement('div');
        itemContainer.className = 'tree-catalog__item';

        const itemHeader     = document.createElement('div');
        itemHeader.className = 'tree-catalog__header';
        itemHeader.id        = `summary_${item.id}`;
        itemHeader.setAttribute('data-id', item.id);

        itemHeader.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.selectItem(itemHeader);
            this.showContextMenu(e, item);
        })

        itemHeader.addEventListener('click', () => {
            this.selectItem(itemHeader);
        })
        
        const arrow     = document.createElement('span');
        arrow.className = 'tree-catalog__arrow collapsed';
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleItemChildren(itemContainer);
        })
        itemHeader.appendChild(arrow);

        const textSpan       = document.createElement('span');
        textSpan.className   = 'tree-catalog__text';
        textSpan.textContent = `${item.text} (${item.contentNum})`;
        itemHeader.appendChild(textSpan);

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'tree-catalog__children-container';
        
        itemContainer.appendChild(itemHeader);
        itemContainer.appendChild(childrenContainer);
        
        if (item.hasChildren()) {
            this.buildTree(item.children, childrenContainer, item.id);
        } else {
            itemHeader.classList.add('tree-catalog__header_no-children');
        }

        if (!item.isValid()) itemHeader.classList.add('tree-catalog__header_deleted');
        
        return itemContainer;
    }

    toggleItemChildren(itemContainer) {
        const arrow             = itemContainer.querySelector('.tree-catalog__arrow');
        const childrenContainer = itemContainer.querySelector('.tree-catalog__children-container');
        const header            = arrow.parentElement
        
        arrow.classList.toggle('collapsed');
        childrenContainer.classList.toggle('collapsed');
        header.classList.toggle('tree-catalog__header_open');
        
        this.saveState();
    }

    selectItem(summaryElement) {
        if (this.activeSummary) this.activeSummary.classList.remove('tree-catalog__header_active');
        
        this.activeSummary = summaryElement;
        this.activeSummary.classList.add('tree-catalog__header_active');

        this.saveState();
        this.funcItem(this.activeSummary.getAttribute('data-id'));
    }

    saveState() {
        const activeItemId = this.activeSummary ? 
            this.activeSummary.getAttribute('data-id') : null;
        localStorage.setItem('treeState', JSON.stringify(activeItemId));
    }

    initStorage() {
        const savedState = localStorage.getItem('treeState');
        if (savedState) {
            const activeItemId = JSON.parse(savedState);
            if (activeItemId) {
                const activeElement = this.container.querySelector(`[data-id="${activeItemId}"]`);
                if (activeElement) this.selectItem(activeElement);
            }
        }
        window.addEventListener('beforeunload', () => this.saveState());
    }

    contextMenu() {
        document.getElementById('addBtn').addEventListener('click', () => {
            this.add(this.selectedItem);
            this.hideContextMenu();
        })
        
        document.getElementById('renameBtn').addEventListener('click', (e) => {
            this.rename(this.selectedItem);
            this.hideContextMenu();
        })
        
        document.getElementById('deleteBtn').addEventListener('click', () => {
            this.delete(this.selectedItem);
            this.hideContextMenu();
        })

        document.getElementById('deleteForeverBtn').addEventListener('click', () => {
            this.deleteForever(this.selectedItem);
            this.hideContextMenu();
        })
        
        document.getElementById('moveBtn').addEventListener('click', () => {
            this.move(this.selectedItem);
            this.hideContextMenu();
        })

        document.addEventListener('click', (e) => {
            if (e.target.closest('.context-menu') === null) {
                this.hideContextMenu();
            }
        })
    }

    showContextMenu(e, item) {
        e.preventDefault();
        this.selectedItem = item;

        const deleteBtn = document.getElementById('deleteBtn');
        this.selectedItem.deleted ? deleteBtn.textContent = 'Снять пометку' : deleteBtn.textContent = 'Пометить на удаление';
        
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
            let newName = prompt('Введите название:', '');
            if(newName != null){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"add", "obj":`${this.obj}`, "uinparent":`${dataItem.id}`, "name":`${newName}`};
                funcCommand(body, funcProcessOnlyInfo, this.funcTree);
            }
        }
    }

    rename(dataItem) {
        if(dataItem != null){
            let newName = prompt('Введите новое название:', '');
            if(newName != null){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"update", "obj":`${this.obj}`, "uin":`${dataItem.id}`, "uinparent":`${dataItem.parentId}`, "name":`${newName}`};
                funcCommand(body, funcProcessOnlyInfo, this.funcTree);
            }
        }
    }

    delete(dataItem) {
        if(dataItem != null){
            let result = dataItem.del === 0 ? confirm('Подтвердите пометку на удаление') : confirm('Подтвердите снятие пометки на удаление');
            if(result){
                let body  =  {"user":`${localStorage.getItem('srtf')}`, "meth":"mdel", "obj":`${this.objPar}`, "uin":`${dataItem.id}`};
                funcCommand(body, funcProcessOnlyInfo, this.funcTree);
            }
        }
    }

    deleteForever(dataItem) {
        if(dataItem != null){
            let result = confirm('Вы уверены, что ходите удалить навсегда?');
            if(result){
                
            }
        }
    }

    move(dataItem){
        if(dataItem != null){
            this.funcTrans(dataItem.id, dataItem.text);
        }
    }

    get() {
        return this.activeSummary;
    }
}