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

}

var test = new gridToFlex();