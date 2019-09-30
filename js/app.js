var minCol = document.querySelector('#itemWidth');
var gridColGap = document.querySelector('#gridColGap');
var gridRowGap = document.querySelector('#gridRowGap');
var unifyGap = document.querySelector('#unifyGap');
var gridWrapper = document.querySelector('.js-grid');

var breakPointsList = document.querySelector('.flex-breakpoints-list');
var addBreakpointBtn = document.querySelector('#addBreakpoint');
var generateCSS = document.querySelector('#generateCSS');

var minColWidth = 200;
var gridColGapValue = 16;
var gridRowGapValue = 16;

var isUnify = false;

// Flexbox breakpoints
var flexBreakpoints = [];

var flexBreakpointsInfo = [];

// Add three breakpoints by default
for(var i = 0; i < 3; i++) {
    var breakpoint = addBreakpoint(i);
    //console.log(breakpoint);
    var breakpointTitle = breakpoint.querySelector('h3');
    var inputs = breakpoint.querySelectorAll('input');

    breakPointsList.appendChild(breakpoint);

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

// Asign default value for inputs
minCol.value = minColWidth;
gridColGap.value = gridColGapValue;
gridRowGap.value = gridRowGapValue;

minCol.addEventListener('input', function () {
    if(this.value < 0) {
        return;
    }
    minColWidth = this.value;
    generateGridItems();
});

gridColGap.addEventListener('input', function () {
    gridColGapValue = this.value;
    generateGridItems();
});

gridRowGap.addEventListener('input', function () {
    gridRowGapValue = this.value;
    generateGridItems();
});

unifyGap.addEventListener('input', function () {
   if (this.checked) {
       gridColGapValue = 16;
       gridRowGapValue = 16;

       gridColGap.value = gridColGapValue;
       gridRowGap.value = gridRowGapValue;

       isUnify = true;

       generateGridItems();
   } else {
       isUnify = false;
   }
});

addBreakpointBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var breakpoint = addBreakpoint();
    breakPointsList.appendChild(breakpoint);
});

generateCSS.addEventListener('click', function (e) {
    e.preventDefault();
    getBreakpoints();

    //console.log("Flex Breakpoints" + flexBreakpoints);

    //console.log("Flex Breakpoints IDs" + flexBreakpointsInfo);

    var breakPointsList = [];

    var result1 = `@mixin grid() {
    display: flex;
    flex-wrap: wrap;

    @supports(grid-area: auto) {
        display: grid;
        grid-gap: ${gridColGapValue}px ${gridRowGapValue}px;
    }
}
@mixin gridAuto() {
        margin-left: -${gridColGapValue}px;

        > * {
            margin-bottom: ${gridRowGapValue}px;
            padding-left: ${gridColGapValue}px;
        }
    `;

    for(var i = 0; i < flexBreakpoints.length; i++) {
        var result2 = `
    @media (min-width: ${flexBreakpoints[i].breakpointFrom}px) {
        > * {
            width: calc(99%/ #{${flexBreakpoints[i].numOfItems}});
            flex: 0 0 calc(99% / #{${flexBreakpoints[i].numOfItems}});
        }
    }
        `;

        breakPointsList.push(result2);
    }

    var grid = `
    @supports(grid-area: auto) {
        grid-template-columns: repeat(auto-fit, minmax(${minColWidth}, 1fr));
        margin-left: 0;

        > * {
            width: auto;
            padding-left: 0;
            margin-bottom: 0;
        }
    }

}`;

    var resultModal = document.querySelector('#resultModal');
    var modalBody = document.querySelector('#modalBody');
    var resultCode = document.querySelector('#resultCode');
    var copyCSS = document.querySelector('#copyCSS');
    var closeModal = document.querySelector('#close');

    var code = result1 + "\n" + breakPointsList + "\n" + grid;

    resultCode.innerHTML = code;

    resultModal.classList.add('is-active');

    copyCSS.addEventListener('click', function(e){
        e.preventDefault();
        resultCode.select();
        document.execCommand("copy");
    });

    closeModal.addEventListener('click', function(e){
        e.preventDefault();
        resultModal.classList.remove('is-active');
    });

    //console.log(result1 + "\n" + breakPointsList + "\n" + grid);
});

generateGridItems();

/********************** Functions ***********************/
function generateGridItems() {
    if(unifyGap.checked) {
        isUnify = true;
    } else {
        isUnify = false;
    }

    if(isUnify) {
        // Get the current focused element
        var currentActiveElem = document.activeElement;

        if(currentActiveElem.getAttribute('id') == 'gridColGap') {
            gridRowGapValue = gridColGapValue;
        }

        if(currentActiveElem.getAttribute('id') == 'gridRowGap') {
            gridColGapValue = gridRowGapValue;
        }

        gridColGap.value = gridColGapValue;
        gridRowGap.value = gridRowGapValue;
    }

    var prevCode = "display: grid; \n" + "grid-template-columns: "+
    `repeat(auto-fit, minmax(<span>${minColWidth}px</span>, 1fr));` + "\n" + `grid-gap: <span>${gridRowGapValue}px ${gridColGapValue}px</span>;`;

    document.querySelector('#gridCodePreview').innerHTML = prevCode;

    gridWrapper.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`;
    gridWrapper.style.gridColumnGap = `${gridColGapValue}px`;
    gridWrapper.style.gridRowGap = `${gridRowGapValue}px`;
}

function addBreakpoint(defaultLength = 0) {
    var listLength = (defaultLength > 0) ? defaultLength : breakPointsList.children.length;

    var mainDiv = document.createElement('div');
    mainDiv.classList.add('flex-breakpoints-item');

    var deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "remove";
    deleteBtn.setAttribute('aria-label', 'Remove Breakpoint');
    deleteBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);

        // Update the number, IDs of the breakpoints
        updateBreakpoints();

        var parentElm = e.target.parentNode;
        var parentLabel = parentElm.querySelector('.c-label');
        var labelFor = parentLabel.getAttribute('for');
        var index = parseInt(labelFor.replace(/[^0-9]/g, ''), 10);
        
        flexBreakpointsInfo.splice(index-1, 1);

        // Rename the array IDs to match the inputs
        renameFlexbreakpointsInfo(flexBreakpointsInfo.length);

        console.log(flexBreakpointsInfo);
    });

    function renameFlexbreakpointsInfo(arrayLength) {
        flexBreakpointsInfo = [];

        console.log(arrayLength);

        for (var i = 0; i < arrayLength; i++) {
            flexBreakpointsInfo.push({
                firstInput: `fromWidth-${i+1}`,
                secondInput: `itemsToShow-${i+1}`
            });
        }
    }

    var bpTitle = document.createElement('h3');
    bpTitle.innerHTML = `Breakpoint ${listLength+1}`;

    var gridDiv = document.createElement('div');
    gridDiv.classList.add('o-grid--2');

    var firstInputDiv = document.createElement('div');

    var firstInputLabel = document.createElement('label');
    firstInputLabel.classList.add('c-label');
    firstInputLabel.setAttribute('for', `fromWidth-${listLength+1}`);
    firstInputLabel.innerHTML = "Min Width";

    var firstInput = document.createElement('input');
    firstInput.classList.add('c-input');
    firstInput.setAttribute('type', 'number');
    firstInput.setAttribute('id', `fromWidth-${listLength+1}`);
    firstInput.setAttribute('placeholder', 'e.g: 500px');
    firstInput.setAttribute('required', '');

    var secondInputDiv = document.createElement('div');

    var secondInputLabel = document.createElement('label');
    secondInputLabel.classList.add('c-label');
    secondInputLabel.setAttribute('for', `itemsToShow-${listLength+1}`);
    secondInputLabel.innerHTML = "Items";

    var secondInput = document.createElement('input');
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

function updateBreakpoints() {
    var listLength = breakPointsList.children.length;
    var breakpointsItem = document.querySelectorAll('.flex-breakpoints-item');

    if(listLength > 0) {
        generateCSS.removeAttribute('disabled');
    } else {
        generateCSS.setAttribute('disabled', '');
    }

    for(var i = 0; i < listLength; i++) {
        var breakpointsTitle = breakpointsItem[i].querySelector('h3');
        breakpointsTitle.innerHTML = `Breakpoint ${i+1}`;

        var breakpointsFirstLabel = breakpointsItem[i].querySelector('.o-grid--2 > div:first-child label');
        var breakpointsFirstInput = breakpointsItem[i].querySelector('.o-grid--2 > div:first-child input');

        breakpointsFirstLabel.setAttribute("for", `fromWidth-${i+1}`);
        breakpointsFirstInput.setAttribute("id", `fromWidth-${i+1}`);

        var breakpointsSecondLabel = breakpointsItem[i].querySelector('.o-grid--2 > div:last-child label');
        var breakpointsSecondInput = breakpointsItem[i].querySelector('.o-grid--2 > div:last-child input');

        breakpointsSecondLabel.setAttribute("for", `itemsToShow-${i+1}`);
        breakpointsSecondInput.setAttribute("id", `itemsToShow-${i+1}`);
    }
}

function getBreakpoints() {
    console.log("TesttttT:" + flexBreakpointsInfo.length);

    flexBreakpoints = [];

    for(var i = 0; i < flexBreakpointsInfo.length; i++) {
        var fromWidthID = flexBreakpointsInfo[i].firstInput;
        var numOfItemsID = flexBreakpointsInfo[i].secondInput;

        //console.log(fromWidthID);
        //console.log(numOfItemsID);

        var fromWidthValue = document.querySelector("#"+fromWidthID).value;
        var numOfItemsValue = document.querySelector("#"+numOfItemsID).value;

        flexBreakpoints.push({
            breakpointFrom: fromWidthValue,
            numOfItems: numOfItemsValue
        });
    }
}