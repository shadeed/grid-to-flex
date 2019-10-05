class gridToFlex {
    constructor() {
        this.init();
    }

    init() {
        this.initValues();
        this.cacheDOM();
        this.assignDefaults();
        this.bindEvents();
        this.addDefaultBreakpoints();
        this.generateGridItems();
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
        this.resultModal = document.querySelector('#resultModal');
        this.modalBody = document.querySelector('#modalBody');
        this.resultCode = document.querySelector('#resultCode');
        this.copyCSS = document.querySelector('#copyCSS');
        this.closeModal = document.querySelector('#close');
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
        this.addBreakpointBtn.addEventListener('click', this.addBreakpointEvent.bind(this));
        this.generateCSS.addEventListener('click', this.generateResult.bind(this));
        this.copyCSS.addEventListener('click', this.copyResult.bind(this));
        this.closeModal.addEventListener('click', this.closeResult.bind(this));
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

    addBreakpointEvent(e) {
        e.preventDefault();
        let breakpoint = this.addBreakpoint();
        this.breakPointsList.appendChild(breakpoint);
    }

    addBreakpoint(defaultLength = 0) {
        let listLength = (defaultLength > 0) ? defaultLength : this.breakPointsList.children.length;
    
        let mainDiv = document.createElement('div');
        mainDiv.classList.add('flex-breakpoints-item');
    
        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = "remove";
        deleteBtn.setAttribute('aria-label', 'Remove Breakpoint');
        deleteBtn.addEventListener('click', this.deleteBreakpoint.bind(this));
    
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
    
        this.flexBreakpointsInfo.push({
            firstInput: firstInput.getAttribute('id'),
            secondInput: secondInput.getAttribute('id')
        });
    
        if(this.flexBreakpointsInfo.length > 0) {
            this.generateCSS.removeAttribute('disabled');
        }
    
        return mainDiv;
    }

    renameFlexbreakpointsInfo(arrayLength) {
        this.flexBreakpointsInfo = [];

        console.log(arrayLength);

        for (let i = 0; i < arrayLength; i++) {
            this.flexBreakpointsInfo.push({
                firstInput: `fromWidth-${i+1}`,
                secondInput: `itemsToShow-${i+1}`
            });
        }
    }

    updateBreakpoints() {
        let listLength = this.breakPointsList.children.length;
        let breakpointsItem = document.querySelectorAll('.flex-breakpoints-item');

        if(listLength > 0) {
            this.generateCSS.removeAttribute('disabled');
        } else {
            this.generateCSS.setAttribute('disabled', '');
        }

        for(let i = 0; i < listLength; i++) {
            let breakpointsTitle = breakpointsItem[i].querySelector('h3');
            breakpointsTitle.innerHTML = `Breakpoint ${i+1}`;

            let breakpointsFirstLabel = breakpointsItem[i].querySelector('.o-grid--2 > div:first-child label');
            let breakpointsFirstInput = breakpointsItem[i].querySelector('.o-grid--2 > div:first-child input');

            breakpointsFirstLabel.setAttribute("for", `fromWidth-${i+1}`);
            breakpointsFirstInput.setAttribute("id", `fromWidth-${i+1}`);

            let breakpointsSecondLabel = breakpointsItem[i].querySelector('.o-grid--2 > div:last-child label');
            let breakpointsSecondInput = breakpointsItem[i].querySelector('.o-grid--2 > div:last-child input');

            breakpointsSecondLabel.setAttribute("for", `itemsToShow-${i+1}`);
            breakpointsSecondInput.setAttribute("id", `itemsToShow-${i+1}`);
        }
    }

    getBreakpoints() {
        // Emptying the array to avoid making it larger in case generateCSS clicked multiple times.
        this.flexBreakpoints = [];

        for(var i = 0; i < this.flexBreakpointsInfo.length; i++) {
            var fromWidthID = this.flexBreakpointsInfo[i].firstInput;
            var numOfItemsID = this.flexBreakpointsInfo[i].secondInput;

            //console.log(fromWidthID);
            //console.log(numOfItemsID);

            var fromWidthValue = document.querySelector("#"+fromWidthID).value;
            var numOfItemsValue = document.querySelector("#"+numOfItemsID).value;

            this.flexBreakpoints.push({
                breakpointFrom: fromWidthValue,
                numOfItems: numOfItemsValue
            });
        }
    }

    deleteBreakpoint(e) {
        e.preventDefault();
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);

        // Update the number, IDs of the breakpoints
        this.updateBreakpoints();

        let parentElm = e.target.parentNode;
        let parentLabel = parentElm.querySelector('.c-label');
        let labelFor = parentLabel.getAttribute('for');
        let index = parseInt(labelFor.replace(/[^0-9]/g, ''), 10);
        
        this.flexBreakpointsInfo.splice(index-1, 1);

        // Rename the array IDs to match the inputs
        this.renameFlexbreakpointsInfo(this.flexBreakpointsInfo.length);

        console.log(this.flexBreakpointsInfo);
    }

    addDefaultBreakpoints() {
        // Add three breakpoints by default
        for(var i = 0; i < 3; i++) {
            var breakpoint = this.addBreakpoint(i);
            //console.log(breakpoint);
            var breakpointTitle = breakpoint.querySelector('h3');
            var inputs = breakpoint.querySelectorAll('input');

            this.breakPointsList.appendChild(breakpoint);

            if(i === 0) {
                breakpointTitle.innerHTML = "Small";
                inputs[0].value = "320";
                inputs[1].value = "2";
            }
            if(i === 1) {
                breakpointTitle.innerHTML = "Medium";
                inputs[0].value = "768";
                inputs[1].value = "3";
            }
            if(i === 2) {
                breakpointTitle.innerHTML = "Large";
                inputs[0].value = "1024";
                inputs[1].value = "4";
            }
        }
    }

    generateResult(e) {
        e.preventDefault();
        this.getBreakpoints();

        let breakPointsList = [];

        let result1 = `@mixin grid() {
        display: flex;
        flex-wrap: wrap;

        @supports(grid-area: auto) {
            display: grid;
            grid-gap: ${this.gridColGapValue}px ${this.gridRowGapValue}px;
        }
    }
    @mixin gridAuto() {
            margin-left: -${this.gridColGapValue}px;

            > * {
                margin-bottom: ${this.gridRowGapValue}px;
                margin-left: ${this.gridColGapValue}px;
            }
        `;


        for(var i = 0; i < this.flexBreakpoints.length; i++) {
            if(this.flexBreakpoints[i].breakpointFrom != "" && this.flexBreakpoints[i].numOfItems != "") {
                var result2 = `
                @media (min-width: ${this.flexBreakpoints[i].breakpointFrom}px) {
                    > * {
                        width: calc((99%/ #{${this.flexBreakpoints[i].numOfItems}}) - ${this.gridColGapValue}px);
                        flex: 0 0 calc((99% / #{${this.flexBreakpoints[i].numOfItems}}) - ${this.gridColGapValue}px);
                    }
                }
            `;

                breakPointsList.push(result2);
            }
        }

        var grid = `
        @supports(grid-area: auto) {
            grid-template-columns: repeat(auto-fit, minmax(${this.minColWidth}px, 1fr));
            margin-left: 0;

            > * {
                width: auto;
                margin-left: 0;
                margin-bottom: 0;
            }
        }

    }`;

        let code = result1 + "\n" + breakPointsList.join("\n") + "\n" + grid;

        this.resultCode.innerHTML = code;

        this.resultModal.classList.add('is-active');
    }

    copyResult(e) {
        e.preventDefault();
        this.resultCode.select();
        document.execCommand("copy");
    }

    closeResult(e) {
        e.preventDefault();
        this.resultModal.classList.remove('is-active');
    }
}

new gridToFlex();