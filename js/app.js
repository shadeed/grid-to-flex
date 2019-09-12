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
    // console.log("Min col width: " + minColWidth);
    // console.log("Grid col gap: " + gridColGapValue);
    // console.log("Grid row gap: " + gridRowGapValue);
    // console.log("--------")

    // for(var i = 0; i < flexBreakpoints.length; i++) {
    //     console.log("Breakpoint " + (i+1));
    //     console.log("Breakpoint from: " + flexBreakpoints[i].breakpointFrom + "px");
    //     console.log("Num of items: " + flexBreakpoints[i].numOfItems);
    //     console.log("--------")
    // }

    getBreakpoints();

    console.log("Flex Breakpoints" + flexBreakpoints);

    console.log("Flex Breakpoints IDs" + flexBreakpointsInfo);

    var breakPointsList = [];

    var result1 = `
@mixin grid() {
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
    @include mq($from: ${flexBreakpoints[i].breakpointFrom}px) {
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

    console.log(result1 + "\n" + breakPointsList + "\n" + grid);
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
    gridWrapper.style.gridTemplateColumns = `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`;
    gridWrapper.style.gridColumnGap = `${gridColGapValue}px`;
    gridWrapper.style.gridRowGap = `${gridRowGapValue}px`;
}

function addBreakpoint() {
    var listLength = breakPointsList.children.length;

    var mainDiv = document.createElement('div');
    mainDiv.classList.add('flex-breakpoints-item');

    var deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "remove";
    deleteBtn.addEventListener('click', function(e){
        e.preventDefault();
        console.log(`clicked #${listLength+1}`);
        console.log(e.target.parentNode.parentNode.removeChild(e.target.parentNode));
    });

    var bpTitle = document.createElement('h3');
    bpTitle.innerHTML = `Breakpoint ${listLength+1}`;

    var gridDiv = document.createElement('div');
    gridDiv.classList.add('o-grid--2');

    var firstInputDiv = document.createElement('div');

    var firstInputLabel = document.createElement('label');
    firstInputLabel.classList.add('c-label');
    firstInputLabel.setAttribute('for', `fromWidth-${listLength+1}`);
    firstInputLabel.innerHTML = "From Width";

    var firstInput = document.createElement('input');
    firstInput.classList.add('c-input');
    firstInput.setAttribute('type', 'number');
    firstInput.setAttribute('id', `fromWidth-${listLength+1}`);
    firstInput.setAttribute('placeholder', 'e.g: 500px');

    var secondInputDiv = document.createElement('div');

    var secondInputLabel = document.createElement('label');
    secondInputLabel.classList.add('c-label');
    secondInputLabel.setAttribute('for', `itemsToShow-${listLength+1}`);
    secondInputLabel.innerHTML = "Number of items";

    var secondInput = document.createElement('input');
    secondInput.classList.add('c-input');
    secondInput.setAttribute('type', 'number');
    secondInput.setAttribute('id', `itemsToShow-${listLength+1}`);
    secondInput.setAttribute('placeholder', 'e.g: 3');

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

    return mainDiv;
}

function getBreakpoints() {
    for(var i = 0; i < flexBreakpointsInfo.length; i++) {
        var fromWidthID = flexBreakpointsInfo[i].firstInput;
        var numOfItemsID = flexBreakpointsInfo[i].secondInput;

        console.log(fromWidthID);
        console.log(numOfItemsID);

        var fromWidthValue = document.querySelector("#"+fromWidthID).value;
        var numOfItemsValue = document.querySelector("#"+numOfItemsID).value;

        flexBreakpoints.push({
            breakpointFrom: fromWidthValue,
            numOfItems: numOfItemsValue
        });
    }
}