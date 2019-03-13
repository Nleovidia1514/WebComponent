const getStyle = ()=>{
    return `   
    #container{
        width: 700px;
        height: 400px;
        border-radius: 50px;
        background-color: white;
        border-style: outset;
        border-color: orange;
        border-width: 10px;
        text-align: center;
        background-color: black;
        box-shadow: 10px 10px 10px black;
        min-width: 200px;
        min-height: 300px;
        resize: both;
        overflow: hidden;
    }
    .title{
        border-top-left-radius: 710px;
        border-top-right-radius: 710px;
        font-size: 35px;
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        width: 99%;
        height: 10%;
        border-style: dotted;
        border-color: black;
        text-align: center;
        background-color: aquamarine;
        margin-top: 0%;
        margin-bottom: 0%;
        cursor: move;
    }
    table{
        position: sticky;
        width: 100%;
        height: 77%;
    }
    th{
        height: 20%;
        resize: horizontal;
        overflow: auto;
        text-align: center;
        background-color: olivedrab;
        border: outset;
    }
    tr{
        background-color: rosybrown;
    }
    td{
        background-color: inherit;
    }
    textarea{
        width: 100%;
        height: 100%;
        background-color: inherit;
        text-align: center;
        vertical-align: center;
        resize: none;
        overflow: auto;
        border: none;
    }
    #controlPanel{
        border-bottom-right-radius: 700px;
        border-bottom-left-radius: 700px;
        width: 100%;
        height: 11%;
        background-color: grey;
    }
    .control{
        width: 5%;
        height: 80%;
        border: 1px solid grey;
        margin-right: 10px;
        margin-top: 4px;
        cursor: pointer; 
    }

    #pgSelect{
        position: relative;
        display: inline-block;
        width: 15%;
        height: 50%;
        top: -17%;
        float: none;
        left: -5%;      
    }

    #pgNumeric{
        position: absolute;
        width: 50%;
        height: 100%;
        top: 50%;
        left: 50%;
    }

    p{
        position: relative:
        top: 0px;
        left: -10px;
        width: 50%;
    }

    @keyframes highlight{
        from{ border: 1px solid grey}
        to { border: 1px solid cyan}
    }
    .control:hover{
        animation: highlight 1.5s; 
        animation-fill-mode: forwards;    
    }
    #closeBtn{
        outline: none;
        position: absolute;
        border-top-right-radius: 400px;
        height: 10.5%;
        width: 20%;
        max-width: 20%;
        min-width: 5%;
        top: 2.5%;
        right: 10px;
        color: black;
        font-size: 30px;
        text-align: start;
        overflow: hidden;
        
    }
    #closeBtn:hover{
        color: white;
        background-color: tomato;
        transition-duration: 0.1s;
    }`;
}

class Controls extends HTMLElement{
    connectedCallback(){
        this.sR = this.attachShadow({mode: "open"});
        this.render();
        this.addStyle();
    }
    render(){
        const div = document.createElement("div");
        div.id = "controlPanel";
        this.addButtons(div);
        this.sR.appendChild(div);
    }

    addButtons(div){
        var buttons = [];
        const firstBtn = new Image();
        firstBtn.src = "IMAGES/firstBtn.png";
        firstBtn.id = "firstBtn";
        const lastBtn = new Image();
        lastBtn.src = "IMAGES/lastBtn.png";
        const rwdBtn = new Image();
        rwdBtn.src = "IMAGES/rwdBtn.png";
        const fwdBtn = new Image();
        fwdBtn.src = "IMAGES/fwdBtn.png";
        const priorBtn = new Image();
        priorBtn.src = "IMAGES/priorBtn.png";
        const nextBtn = new Image();
        nextBtn.src = "IMAGES/nextBtn.png";
        const addBtn = new Image();
        addBtn.src = "IMAGES/addBtn.png";
        const removeBtn = new Image();
        removeBtn.src = "IMAGES/minusBtn.png";
        const p = document.createElement("p");
        p.innerHTML = "PAGE#";
        const pg = document.createElement("div");
        pg.id = "pgSelect";
        const pageSelector = document.createElement("input");
        pageSelector.id = "pgNumeric";
        pageSelector.type = "number";
        pageSelector.value = 1;
        pageSelector.min = 1;
        pageSelector.max = ((this.table.itemPage.length/this.table.pageSize) % 1 > 0.5) ? parseInt(this.table.itemPage.length/this.table.pageSize) : ((this.table.itemPage.length/this.table.pageSize) % 1 == 0) ? this.table.itemPage.length/this.table.pageSize : parseInt(this.table.itemPage.length/this.table.pageSize)+1;
        pg.appendChild(p);
        pg.appendChild(pageSelector);
        div.appendChild(pg);
        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "X";
        closeBtn.id = "closeBtn";
        this.table.sR.getElementById("container").appendChild(closeBtn);
        buttons.push(firstBtn);
        buttons.push(rwdBtn);
        buttons.push(priorBtn);
        buttons.push(nextBtn);
        buttons.push(fwdBtn);
        buttons.push(lastBtn);
        buttons.push(addBtn);
        buttons.push(removeBtn);
        buttons.forEach(button => {
            button.classList.add("control");
            div.appendChild(button);
        }); 
        this.addEvents(buttons, pageSelector, closeBtn);    
    }

    addEvents(buttons, pageSelector, closeBtn){
        closeBtn.addEventListener("click",(e)=>{
            this.table.remove();
        })
        pageSelector.addEventListener("keyup",(e)=>{
            if(e.key == "Enter"){
                this.movePage(pageSelector.value-1);
            }
        })
        buttons.forEach(control => {
            control.onmousedown = 
            control.addEventListener("mousedown",(e)=>{
                e.preventDefault();
                document.body.addEventListener("click",()=>{
                    control.style.transform = "translateY(0px)";
                })
                control.style.transform = "translateY(2px)"
            });      
        });
        buttons[0].addEventListener("click",(e)=>{
            this.movePage(0);
            let row = this.table.sR.getElementById("r0");
            this.selectRow(row);
        })
        buttons[1].addEventListener("click",(e)=>{
            if(this.table.currentPage != 0){
                this.movePage(--this.table.currentPage);
                let row = this.table.sR.getElementById(`r${this.table.itemPage[this.table.currentPage*this.table.pageSize].registryPos}`);
                this.selectRow(row);
            }        
        })
        buttons[2].addEventListener("click",(e)=>{
            if (this.table.currentPage != 0 
                && this.table.selectedRow == this.table.currentPage * this.table.pageSize) {
                this.movePage(--this.table.currentPage);
                let row = this.table.sR.getElementById(`r${this.table.itemPage[this.table.currentPage*this.table.pageSize+this.table.pageSize-1].registryPos}`);
                this.selectRow(row);
            } else if(this.table.selectedRow != 0){
                let row = this.table.sR.getElementById(`r${this.table.selectedRow - 1}`);
                this.selectRow(row);
            }   
        })
        buttons[3].addEventListener("click",(e)=>{
            let lastPage = ((this.table.itemPage.length/this.table.pageSize) % 1 > 0.5) ? parseInt(this.table.itemPage.length/this.table.pageSize) : ((this.table.itemPage.length/this.table.pageSize) % 1 == 0) ? this.table.itemPage.length/this.table.pageSize : parseInt(this.table.itemPage.length/this.table.pageSize)+1;
            if (this.table.currentPage != lastPage - 1
                && this.table.selectedRow == this.table.currentPage*this.table.pageSize + this.table.pageSize - 1) {
                this.movePage(++this.table.currentPage);
                let row = this.table.sR.getElementById(`r${this.table.itemPage[this.table.currentPage*this.table.pageSize].registryPos}`);
                this.selectRow(row);
            } else if(this.table.selectedRow != this.table.numberOfRegistrys - 1){
                let row = this.table.sR.getElementById(`r${this.table.selectedRow +1}`);
                this.selectRow(row);
            }   
        })
        buttons[4].addEventListener("click",(e)=>{
            let lastPage = ((this.table.itemPage.length/this.table.pageSize) % 1 > 0.5) ? parseInt(this.table.itemPage.length/this.table.pageSize) : ((this.table.itemPage.length/this.table.pageSize) % 1 == 0) ? this.table.itemPage.length/this.table.pageSize : parseInt(this.table.itemPage.length/this.table.pageSize)+1;
            if(this.table.currentPage != lastPage-1){
                this.movePage(++this.table.currentPage);
                let row = this.table.sR.getElementById(`r${this.table.itemPage[this.table.currentPage*this.table.pageSize].registryPos}`);
                this.selectRow(row);
            }  
        })
        buttons[5].addEventListener("click",(e)=>{
            let lastPage = ((this.table.itemPage.length/this.table.pageSize) % 1 > 0.5) ? parseInt(this.table.itemPage.length/this.table.pageSize) : ((this.table.itemPage.length/this.table.pageSize) % 1 == 0) ? this.table.itemPage.length/this.table.pageSize : parseInt(this.table.itemPage.length/this.table.pageSize)+1;
            this.movePage(lastPage-1);
            let row = this.table.sR.getElementById(`r${this.table.numberOfRegistrys-1}`);
            console.log(this.table.numberOfRegistrys)
            this.selectRow(row);
            
        })
        buttons[6].addEventListener("click",(e) => {
            const newObj = {
                ci: "",
                name: "",
                lastName: "",
                Address: "",
                registryPos: this.table.numberOfRegistrys++
            };
            this.sR.getElementById("pgNumeric").max = ((this.table.itemPage.length/this.table.pageSize) % 1 > 0.5) ? parseInt(this.table.itemPage.length/this.table.pageSize) : ((this.table.itemPage.length/this.table.pageSize) % 1 == 0) ? this.table.itemPage.length/this.table.pageSize : parseInt(this.table.itemPage.length/this.table.pageSize)+1;
            this.table.itemPage.push(newObj);
            this.table.registrys.push(newObj);
            this.movePage(this.sR.getElementById("pgNumeric").max-1);
            let row = this.table.sR.getElementById(`r${this.table.numberOfRegistrys-1}`);
            this.selectRow(row);
        })
        buttons[7].addEventListener("click",(e) => {
            this.table.itemPage.splice(this.table.selectedRow, 1);
            this.table.numberOfRegistrys--;
            console.log(this.table.itemPage)
            for (let i = 0; i < this.table.itemPage.length; i++) {
                const register = this.table.itemPage[i];
                register.registryPos = i;
            }  
            for (let i = this.table.pageSize; i > 0; i--) {
                this.table.sR.getElementById("tableBody").childNodes[i].remove();
            }
            this.table.createTable(this.table.sR.getElementById("tableBody"));
            this.movePage(this.table.currentPage);
            this.sR.getElementById("pgNumeric").max = ((this.table.itemPage.length/this.table.pageSize) % 1 > 0.5) ? parseInt(this.table.itemPage.length/this.table.pageSize) : ((this.table.itemPage.length/this.table.pageSize) % 1 == 0) ? this.table.itemPage.length/this.table.pageSize : parseInt(this.table.itemPage.length/this.table.pageSize)+1;
        })
        for (const key in this.table.registrys) {     
            let register = this.table.registrys[key];
            if(register.registryPos % this.table.pageSize == 0 && register.registryPos != 0){
                break;
            }
            let row = this.table.sR.getElementById(`r${register.registryPos}`);     
            row.addEventListener("click",(e)=>{
                this.selectRow(row);
            });   
        }  
        
        this.selectRow(this.table.sR.getElementById(`r0`));
    }  

    selectRow(row){
        let i = this.table.currentPage * this.table.pageSize;
        const slice = this.table.itemPage.slice(this.table.currentPage*this.table.pageSize,this.table.currentPage*this.table.pageSize + this.table.pageSize);
        for (let j = i ; j < i  + slice.length; j++) {
            this.table.sR.getElementById(`r${j}`).style.backgroundColor = "rosybrown";           
        }
        row.style.backgroundColor = "aqua";
        this.table.selectedRow = parseInt(row.id.replace("r",""));
    }

    movePage(pageNmbr){
        const c = this.table.sR.getElementById("tableBody").childNodes;
        for (let i = c.length-1; i > 0; i--) {
            const child = c[i];
            child.remove();
        }
        this.table.currentPage = pageNmbr;
        this.sR.getElementById("pgNumeric").value = this.table.currentPage + 1;   
        var slice = this.table.itemPage.slice(pageNmbr*this.table.pageSize,pageNmbr*this.table.pageSize + this.table.pageSize);
        console.log(slice)
        slice.forEach(register => {
            const tr = document.createElement("tr");
            tr.id = "r"+register.registryPos;
            for (const data in register) {    
                if (data != "registryPos") {
                    const td = document.createElement("td");
                    const ta = document.createElement("textarea");
                    ta.innerHTML = register[data];
                    ta.classList.add(`${data}cell`)
                    ta.addEventListener("change",(e) => {
                        const registryNumbr = ta.parentElement.parentElement.id.substring(1);
                        var obj = search(this.table.registrys, registryNumbr);
                        if(ta.className == "cicell"){
                            obj.ci = ta.value;                         
                        }
                        else if(ta.className == "namecell"){
                            obj.name = ta.value;
                        }
                        else if (ta.className == "lastNamecell") {
                            obj.lastName = ta.value;
                        }
                        else if (ta.className == "Addresscell") {
                            obj.Address = ta.value;
                        }
                    })
                    td.appendChild(ta);
                    tr.appendChild(td);    
                }
            }
            this.table.sR.getElementById("tableBody").appendChild(tr);
        });    
        for (const key in slice) {               
            let register = slice[key];
            //console.log(register.registryPos-this.table.pageSize*this.table.currentPage);
            if(register.registryPos % this.table.pageSize == 0 && register.registryPos-this.table.pageSize*this.table.currentPage!= 0){
                break;
            }
            let row = this.table.sR.getElementById(`r${register.registryPos}`);
            row.onclick = (e)=>{
                this.selectRow(row);  
            } 
        }
    }

    addStyle(){
        const styleTag = document.createElement("style");
        styleTag.textContent = getStyle();
        this.sR.appendChild(styleTag);
    }
}

class Grid extends HTMLElement {
    connectedCallback(){
        this.sR = this.attachShadow({mode: "open"});
        this.title = this.getAttribute("title");
        this.headers = headers;
        this.registrys = registrys.register;
        this.currentPage = 0;
        this.itemPage = [];
        this.pageSize = pageSize;
        this.selectedRow = 0;
        this.numberOfRegistrys = 0;
        this.table = document.createElement("table");
        this.render();
        this.addStyle();
    }
    render(){
        const div = document.createElement("div");
        div.id = "container";
        this.sR.appendChild(div);
        this.addTitle(div);
        const tbody = document.createElement("tbody");
        tbody.id = "tableBody";
        var tr = document.createElement("tr");
        for (const column in this.headers) {
            let th = document.createElement("th");
            th.id = column;
            th.innerHTML = this.headers[column];
            tr.appendChild(th);          
        }
        var position = 0;
        for(const key in this.registrys) {      
            let register = this.registrys[key];  
            register.registryPos = position;
            this.itemPage.push(register);
            //console.log(pageNmbr,position);      
            position++;  
        };
        tbody.appendChild(tr);
        this.createTable(tbody);
        this.numberOfRegistrys = position;
        div.appendChild(this.table);
        this.addControls(div);
    }

    addTitle(div){
        var oldX, oldY;
        const title = document.createElement("h1");
        title.classList.add("title");
        title.textContent = this.title;
        const moveDiv = (e)=>{
            e = e || window.event;
            e.preventDefault();
            var newY = oldY - e.clientY;
            var newX = oldX - e.clientX;
            oldY = e.clientY;
            oldX = e.clientX;
            this.style.top = (this.offsetTop - newY) + "px";
            this.style.left = (this.offsetLeft - newX) + "px";
        }

        const dragOff = ()=>{
            title.removeEventListener("mousemove", moveDiv);
            title.removeEventListener("mouseup", dragOff);
            document.body.removeEventListener("mousemove", moveDiv);
        }
        const dragOn = (e)=>{
            e = e || window.event;
            e.preventDefault();
            oldY = e.clientY;
            oldX = e.clientX;
            title.addEventListener("mousemove", moveDiv);
            document.body.addEventListener("mousemove", moveDiv);
            title.addEventListener("mouseup", dragOff);
            document.body.addEventListener("mouseup", dragOff);
        };
        title.addEventListener("mousedown", dragOn);
        div.appendChild(title);
    }

    createTable(tbody){
        var pageNmbr = 0;      
        this.itemPage.slice(0, this.pageSize).forEach(register => {
            let tr = document.createElement("tr");
            tr.id = "r" + register.registryPos;
            for (const data in register) {    
                if (data != "registryPos") {
                    let td = document.createElement("td");
                    let ta = document.createElement("textarea");
                    ta.innerHTML = register[data];
                    ta.classList.add(`${data}cell`)
                    ta.addEventListener("change",(e) => {
                        const registryNumbr = ta.parentElement.parentElement.id.substring(1);
                        var obj = search(this.registrys, registryNumbr);
                        if(ta.className == "cicell"){
                            obj.ci = ta.value;                         
                        }
                        else if(ta.className == "namecell"){
                            obj.name = ta.value;
                        }
                        else if (ta.className == "lastNamecell") {
                            obj.lastName = ta.value;
                        }
                        else if (ta.className == "Addresscell") {
                            obj.Address = ta.value;
                        }
                    })
                    td.appendChild(ta);     
                    tr.appendChild(td);
                }
            }
            tbody.appendChild(tr);
        });    
        this.table.appendChild(tbody);
        this.table.id = "table";
    }

    addStyle(){
        const styleTag = document.createElement("style");
        styleTag.textContent = getStyle();
        this.sR.appendChild(styleTag);
    }
    
    addControls(div){
        const controlsTag = document.createElement("grid-controls");
        controlsTag.table = this;
        var srchField = document.createElement("input");
        this.sR.appendChild(srchField);
        srchField.style.position = "absolute";
        srchField.style.width = "20%";
        srchField.style.top = "7.5%";
        srchField.style.left = "20px";      
        for (const column in this.headers) {
            let th = this.sR.getElementById(column);
            th.addEventListener("mousedown",(e)=>{
                th.style.border = "inset";
                document.body.addEventListener("click",(e)=>{
                    th.style.border = "outset";
                })
            })
            th.addEventListener("click",(e)=>{
                th.style.border = "outset";
            })
        }
        this.sR.getElementById("column1").addEventListener("click",(e)=>{
            this.itemPage.sort((a, b) => (a.ci > b.ci) ? 1 : -1);
            for (let i = this.pageSize; i > 0; i--) {
                this.sR.getElementById("tableBody").childNodes[i].remove();
            }
            for (let i = 0; i < this.itemPage.length; i++) {
                const register = this.itemPage[i];
                register.registryPos = i;
            }  
            this.createTable(this.sR.getElementById("tableBody"));
            controlsTag.selectRow(this.sR.getElementById(`r0`));       
        });
        this.sR.getElementById("column2").addEventListener("click",(e)=>{
            this.itemPage.sort((a, b) => (a.name > b.name) ? 1 : -1);
            for (let i = this.pageSize; i > 0; i--) {
                this.sR.getElementById("tableBody").childNodes[i].remove();
            }
            for (let i = 0; i < this.itemPage.length; i++) {
                const register = this.itemPage[i];
                register.registryPos = i;
            }  
            this.createTable(this.sR.getElementById("tableBody"));
            controlsTag.selectRow(this.sR.getElementById(`r0`));       
        });
        this.sR.getElementById("column3").addEventListener("click",(e)=>{
            this.itemPage.sort((a, b) => (a.lastName > b.lastName) ? 1 : -1);
            for (let i = this.pageSize; i > 0; i--) {
                this.sR.getElementById("tableBody").childNodes[i].remove();
            }
            for (let i = 0; i < this.itemPage.length; i++) {
                const register = this.itemPage[i];
                register.registryPos = i;
            }  
            this.createTable(this.sR.getElementById("tableBody"));
            controlsTag.selectRow(this.sR.getElementById(`r0`));       
        });
        this.sR.getElementById("column4").addEventListener("click",(e)=>{
            this.itemPage.sort((a, b) => (a.Address > b.Address) ? 1 : -1);
            for (let i = this.pageSize; i > 0; i--) {
                this.sR.getElementById("tableBody").childNodes[i].remove();
            }
            for (let i = 0; i < this.itemPage.length; i++) {
                const register = this.itemPage[i];
                register.registryPos = i;
            }  
            this.createTable(this.sR.getElementById("tableBody"));
            controlsTag.selectRow(this.sR.getElementById(`r0`));       
        });
        
        div.appendChild(controlsTag);
    }
}

function search(array, pos){
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.registryPos == pos) {
            return element;
        }
    }
    return null;
}

try {
        customElements.define("grid-table", Grid)
        customElements.define("grid-controls", Controls);
  } catch (err) {
        console.log(err);
        const h3 = document.createElement('h3')
        h3.innerHTML = "This site uses webcomponents which don't work in all browsers! Try this site in a browser that supports them!"
        document.body.appendChild(h3)
  }