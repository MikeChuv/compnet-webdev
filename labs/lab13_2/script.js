
const menuDataFile = "./data.json";
let menuData;
let menu;

class MenuItem {
    constructor(parent, title, action) {
        this.parent = parent;
        this.title = title;
        this.action = action;
        this.children = [];
    }
    addChild(childItem) {
        this.children.push(childItem);
    }


    createHtml() {
        this.html = document.createElement("div");
        let itemTitle = document.createElement("span");
        itemTitle.innerHTML = this.title;
        this.html.appendChild(itemTitle);
        this.html.classList.add('menu-item')
        this.html.addEventListener("mouseover", (event) => {
            console.log(this.title, "mouseover");
            this.html.classList.add("item-active");
        })
        this.html.addEventListener("mouseout", (event) => {
            console.log(this.title, "mouseout");
            this.html.classList.remove("item-active");
        })
        if (this.children.length != 0) {
            itemTitle.innerHTML += ' >'
            this.childrenHtml = document.createElement("div");
            this.html.appendChild(this.childrenHtml)
            // let actionLink = `<a href="./${this.action}"></a>`
            for (const child of this.children) {
                this.childrenHtml.appendChild(child.createHtml());
            }

            this.childrenHtml.classList.add('item-hidden')
            this.childrenHtml.classList.add('submenu')
            if (this.parent != null){
                this.childrenHtml.classList.add('inline-item')
            }

            this.html.addEventListener("mouseover", (event) => {
                this.childrenHtml.classList.replace("item-hidden", "item-visible");
            })
            this.html.addEventListener("mouseout", (event) => {
                this.childrenHtml.classList.replace("item-visible", "item-hidden")
            })
        } else {
            // this.html.addEventListener("mouseover", (event) => {
            //     console.log(this.title, "mouseover");
            //     this.childrenHtml.classList.replace("item-hidden", "item-visible")
            // })
            // this.html.addEventListener("mouseout", (event) => {
            //     console.log(this.title, "mouseout");
            //     this.childrenHtml.classList.replace("item-visible", "item-hidden")
            // })
        }
        return this.html;
    }
}


class Menu {
    constructor(items) {
        this.items = [];
        this.loadMenu(null, items);
    }

    loadMenuItem(parent, itemData) {
        let title    = itemData["title"];
        let action   = itemData["action"];
        let children = itemData["children"];

        let item = new MenuItem(parent, title, action);
        if (children.length != 0){
            this.loadMenu(item, children)
        }
        return item;
    }

    loadMenu(parent, children) {
        for (let i = 0; i < children.length; i++){
            if (parent == null) {
                this.items.push(
                    this.loadMenuItem(parent, children[i]) 
                );
            } else {
                parent.addChild(
                    this.loadMenuItem(parent, children[i])
                )
            }
        }
    }


    createHtml() {
        this.html = document.createElement("div");
        this.html.classList.add('main-menu')
        for (const item of this.items) {
            this.html.appendChild(item.createHtml());
        }
        return this.html;
    }

}



function showMenu(menu){
    let html = menu.createHtml()
    let wrapper = document.querySelector(".menu-wrapper")
    wrapper.appendChild(html)


}


function onLoadHandler() {

    try {
        fetch(menuDataFile)
            .then(response => response.json())
            .then((json) => {
                menuData = json
                menu = new Menu(menuData);
                showMenu(menu);
            })
    } catch (error) {
        console.error(error)    
    }

}


window.onload = onLoadHandler;

