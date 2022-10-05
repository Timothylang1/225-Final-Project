// Determines how far to translate the items
var x = 0;
// TOTAL VISIBLE ITEMS ON SCREEN. The animation will delay only for elements on screen for the cool effect
const visible_items = 4;

document.getElementById('left_arrow').setAttribute('onclick', 'clickLeft()'); // -1
document.getElementById('right_arrow').setAttribute('onclick', 'clickRight()'); // 1

function clickRight() {
    // Gets all the items on the recent items screen
    items = document.getElementsByClassName("item");

    // If there are no more items to the left or right, (depending on which way the user is trying to scroll) then don't scroll
    if (-x + 1 >= items.length / visible_items) {
        return;
    }
    x -= 1;

    var movement = [
        {translate: x * 100 * visible_items + '%'}
    ];
    var attributes = {
        duration: 400, // In milliseconds
        fill: 'forwards',
        easing: 'ease-in-out', // Eases in and eases out animation for more fluid movement
    };
    for (i=0; i < items.length; i++) {
        items[i].animate(movement, attributes);
    }
}

function clickLeft() {
    // Gets all the items on the recent items screen
    items = document.getElementsByClassName("item");

    // If there are no more items to the left or right, (depending on which way the user is trying to scroll) then don't scroll
    if (x == 0) {
        return;
    }
    x += 1;

    var movement = [
        {translate: x * 100 * visible_items + '%'}
    ];
    var attributes = {
        duration: 400, // In milliseconds
        fill: 'forwards',
        easing: 'ease-in-out', // Eases in and eases out animation for more fluid movement
    };
    for (i=0; i < items.length; i++) {
        items[i].animate(movement, attributes);
    }
}