var minCol = document.querySelector('#itemWidth');
var gridColGap = document.querySelector('#gridColGap');
var gridRowGap = document.querySelector('#gridRowGap');
var unifyGap = document.querySelector('#unifyGap');
var gridWrapper = document.querySelector('.js-grid');

var minColWidth = 200;
var gridColGapValue = 16;
var gridRowGapValue = 16;

var isUnify = false;

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
   }
});

generateGridItems();

function generateGridItems() {
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