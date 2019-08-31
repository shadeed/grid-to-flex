//var cols = document.querySelector('#columns');
var minCol = document.querySelector('#itemWidth');
var gridWrapper = document.querySelector('.js-grid');
//var numOfCols = cols.value;
var minColWidth = minCol.value;

minCol.addEventListener('input', function () {
    minColWidth = this.value;
    generateGridItems();
});

// cols.addEventListener('input', function () {
//     numOfCols = this.value;
//     generateGridItems();
// });

function generateGridItems() {
    gridWrapper.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minColWidth}px, 1fr))`;
    console.log('Hello');
}

//console.log(numOfCols);