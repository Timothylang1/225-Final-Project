// Determines how far to translate the items
var x = 0;
// TOTAL VISIBLE ITEMS ON SCREEN. The animation will delay only for elements on screen for the cool effect
const visible_items = 4;

document.getElementsByClassName('left_arrow')[0].setAttribute('onclick', 'clickLeft()'); // -1
document.getElementsByClassName('right_arrow')[0].setAttribute('onclick', 'clickRight()'); // 1

function clickRight() {
    // Gets all the items on the recent items screen
    items = document.getElementsByClassName("item");
    console.log("x: " + x);

    // First check if we should move the items at all left or right. If there are less than 4 items, then there is no scroll function
    if (items.length <= 4) {
        return;
    }
    else {
        // If there are no more items to the left or right, (depending on which way the user is trying to scroll) then don't scroll
        if (x == -(items.length - visible_items)) {
            return;
        }
    }
    x -= 1;

    var movement = [
        {translate: x * 100 + '%'}
    ];
    var attributes = {
        duration: 400, // In milliseconds
        fill: 'forwards',
        easing: 'ease-in-out', // Eases in and eases out animation for more fluid movement
    };
    for (i=0; i < items.length; i++) {
        // Only apply the animation delay for the elements that are visible + one element to the right
        if (i >= -x - 1 && i <= -x + visible_items - 1) {
            attributes['delay'] = (i + x + 1) * 50;
        }
        items[i].animate(movement, attributes);
    }
}

function clickLeft() {
    // Gets all the items on the recent items screen
    items = document.getElementsByClassName("item");

    console.log("x: " + x);

    // First check if we should move the items at all left or right. If there are less than 4 items, then there is no scroll function
    if (items.length <= 4) {
        return;
    }
    else {
        // If there are no more items to the left or right, (depending on which way the user is trying to scroll) then don't scroll
        if (x == 0) {
            return;
        }
    }
    x += 1;

    var movement = [
        {translate: x * 100 + '%'}
    ];
    var attributes = {
        duration: 400, // In milliseconds
        fill: 'forwards',
        easing: 'ease-in-out', // Eases in and eases out animation for more fluid movement
    };
    for (i=0; i < items.length; i++) {
        // Only apply the delay for the elements that are visible + one element to the left
        if (i >= -x && i <= -x + visible_items) {
            attributes['delay'] = (visible_items - i - x) * 50;
        }
        
        items[i].animate(movement, attributes);
    }
}