var minCol = document.querySelector('#itemWidth');
var gridColGap = document.querySelector('#gridColGap');
var gridRowGap = document.querySelector('#gridRowGap');
var unifyGap = document.querySelector('#unifyGap');
var gridWrapper = document.querySelector('.js-grid');

var breakPointsList = document.querySelector('.flex-breakpoints-list');
var addBreanpoint = document.querySelector('#addBreakpoint');

var minColWidth = 200;
var gridColGapValue = 16;
var gridRowGapValue = 16;

var isUnify = false;

// Flexbox breakpoints
var flexBreakpoints = [
    {
        breakpointFrom: 700,
        numOfItems: 3
    },
    {
        breakpointFrom: 1000,
        numOfItems: 2
    }
];

console.log(flexBreakpoints);

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

addBreanpoint.addEventListener('click', function (e) {
    e.preventDefault();
    var breakpoint = addBreakpoint();
    breakPointsList.appendChild(breakpoint);
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

    return mainDiv;
}