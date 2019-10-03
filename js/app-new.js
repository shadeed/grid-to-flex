class gridToFlex {
    constructor() {
        this.init();
    }

    init() {
        this.initValues();
        this.cacheDOM();
        this.assignDefaults();
        this.bindEvents();
    }

    cacheDOM() {
        this.minCol = document.querySelector('#itemWidth');
        this.gridColGap = document.querySelector('#gridColGap');
        this.gridRowGap = document.querySelector('#gridRowGap');
        this.unifyGap = document.querySelector('#unifyGap');
        this.gridWrapper = document.querySelector('.js-grid');
        this.breakPointsList = document.querySelector('.flex-breakpoints-list');
        this.addBreakpointBtn = document.querySelector('#addBreakpoint');
        this.generateCSS = document.querySelector('#generateCSS');
    }

    initValues() {
        this.minColWidth = 200;
        this.gridColGapValue = 16;
        this.gridRowGapValue = 16;
        this.isUnify = false;
        this.flexBreakpoints = [];
        this.flexBreakpointsInfo = [];
    }

    assignDefaults() {
        this.minCol.value = this.minColWidth;
        this.gridColGap.value = this.gridColGapValue;
        this.gridRowGap.value = this.gridRowGapValue;
    }

    bindEvents() {
        this.minCol.addEventListener('input', this.colChange.bind(this));
        this.gridColGap.addEventListener('input', this.colGapChange.bind(this));
        this.gridRowGap.addEventListener('input', this.rowGapChange.bind(this));
    }

    colChange() {
        if(this.minCol.value < 0) {
            return;
        }
        this.minColWidth = this.minCol.value;
        this.generateGridItems();
    }

    colGapChange() {
        this.gridColGapValue = this.gridColGap.value;
        this.generateGridItems();
    }

    rowGapChange() {
        this.gridRowGapValue = this.gridRowGap.value;
        this.generateGridItems();
    }

    generateGridItems() {
        if(this.unifyGap.checked) {
            this.isUnify = true;
        } else {
            this.isUnify = false;
        }
    
        if(this.isUnify) {
            let currentActiveElem = document.activeElement;
    
            if(currentActiveElem.getAttribute('id') == 'gridColGap') {
                this.gridRowGapValue = this.gridColGapValue;
            }
    
            if(currentActiveElem.getAttribute('id') == 'gridRowGap') {
                this.gridColGapValue = this.gridRowGapValue;
            }
    
            this.gridColGap.value = this.gridColGapValue;
            this.gridRowGap.value = this.gridRowGapValue;
        }
    
        let prevCode = "display: grid; \n" + "grid-template-columns: "+
        `repeat(auto-fit, minmax(<span>${this.minColWidth}px</span>, 1fr));` + "\n" + `grid-gap: <span>${this.gridRowGapValue}px ${this.gridColGapValue}px</span>;`;
    
        document.querySelector('#gridCodePreview').innerHTML = prevCode;
    
        this.gridWrapper.style.gridTemplateColumns = `repeat(auto-fit, minmax(${this.minColWidth}px, 1fr))`;
        this.gridWrapper.style.gridColumnGap = `${this.gridColGapValue}px`;
        this.gridWrapper.style.gridRowGap = `${this.gridRowGapValue}px`;
    }

    addBreakpoint(defaultLength = 0) {
        let listLength = (defaultLength > 0) ? defaultLength : breakPointsList.children.length;
    
        let mainDiv = document.createElement('div');
        mainDiv.classList.add('flex-breakpoints-item');
    
        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = "remove";
        deleteBtn.setAttribute('aria-label', 'Remove Breakpoint');
        deleteBtn.addEventListener('click', function(e){
            e.preventDefault();
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    
            // Update the number, IDs of the breakpoints
            //updateBreakpoints();
    
            let parentElm = e.target.parentNode;
            let parentLabel = parentElm.querySelector('.c-label');
            let labelFor = parentLabel.getAttribute('for');
            let index = parseInt(labelFor.replace(/[^0-9]/g, ''), 10);
            
            //flexBreakpointsInfo.splice(index-1, 1);
    
            // Rename the array IDs to match the inputs
            //renameFlexbreakpointsInfo(flexBreakpointsInfo.length);
    
            //console.log(flexBreakpointsInfo);
        });
    
        function renameFlexbreakpointsInfo(arrayLength) {
            flexBreakpointsInfo = [];
    
            console.log(arrayLength);
    
            for (let i = 0; i < arrayLength; i++) {
                flexBreakpointsInfo.push({
                    firstInput: `fromWidth-${i+1}`,
                    secondInput: `itemsToShow-${i+1}`
                });
            }
        }
    
        let bpTitle = document.createElement('h3');
        bpTitle.innerHTML = `Breakpoint ${listLength+1}`;
    
        let gridDiv = document.createElement('div');
        gridDiv.classList.add('o-grid--2');
    
        let firstInputDiv = document.createElement('div');
    
        let firstInputLabel = document.createElement('label');
        firstInputLabel.classList.add('c-label');
        firstInputLabel.setAttribute('for', `fromWidth-${listLength+1}`);
        firstInputLabel.innerHTML = "Min Width";
    
        let firstInput = document.createElement('input');
        firstInput.classList.add('c-input');
        firstInput.setAttribute('type', 'number');
        firstInput.setAttribute('id', `fromWidth-${listLength+1}`);
        firstInput.setAttribute('placeholder', 'e.g: 500px');
        firstInput.setAttribute('required', '');
    
        let secondInputDiv = document.createElement('div');
    
        let secondInputLabel = document.createElement('label');
        secondInputLabel.classList.add('c-label');
        secondInputLabel.setAttribute('for', `itemsToShow-${listLength+1}`);
        secondInputLabel.innerHTML = "Items";
    
        let secondInput = document.createElement('input');
        secondInput.classList.add('c-input');
        secondInput.setAttribute('type', 'number');
        secondInput.setAttribute('id', `itemsToShow-${listLength+1}`);
        secondInput.setAttribute('placeholder', 'e.g: 3');
        secondInput.setAttribute('required', '');
    
        firstInputDiv.appendChild(firstInputLabel);
        firstInputDiv.appendChild(firstInput);
    
        secondInputDiv.appendChild(secondInputLabel);
        secondInputDiv.appendChild(secondInput);
    
        gridDiv.appendChild(firstInputDiv);
        gridDiv.appendChild(secondInputDiv);
    
        mainDiv.appendChild(deleteBtn);
        mainDiv.appendChild(bpTitle);
        mainDiv.appendChild(gridDiv);
    
        flexBreakpointsInfo.push({
            firstInput: firstInput.getAttribute('id'),
            secondInput: secondInput.getAttribute('id')
        });
    
        if(flexBreakpointsInfo.length > 0) {
            generateCSS.removeAttribute('disabled');
        }
    
        return mainDiv;
    }
}

let test = new gridToFlex();