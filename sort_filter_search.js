/* Sources:
    https://stackoverflow.com/questions/37349331/javascript-sort-items-list-by-months
    https://stackoverflow.com/questions/558614/how-can-i-reorder-elements-with-javascript
    https://stackoverflow.com/questions/3871547/iterating-over-result-of-getelementsbyclassname-using-array-foreach
    https://stackoverflow.com/questions/11633951/get-paragraph-text-inside-an-element
    https://www.w3schools.com/js/tryit.asp?filename=tryjs_array_sort2
    https://www.w3schools.com/js/js_dates.asp

*/

// Set filters:
filters = {"Shirts" : false, "Shorts" : false, "Shoes" : false, "Books" : false, "House Items" : false, "Other" : false};

// Initial order of elements
order = document.getElementsByClassName("single_item");
order = Array.from(order);

// Everything below is for sorting method

// Variables used to determine how the items are sorted
Item_Type_Sort = false;
Alphabetical_Sort = false;
Date_Sort = false;

function sorting_method(type) {
    // First change the variables based on the input
    if (type == "Item_Type_Sort") Item_Type_Sort = !Item_Type_Sort;
    else if (type == "Alphabetical_Sort") Alphabetical_Sort = !Alphabetical_Sort;
    else Date_Sort = !Date_Sort;

    // Then sort elements based on sorting algorithm
    order.sort((element1, element2) => item_type_sort(element1, element2));

    // Then swap elements based on ordered list
    for (i = 0; i < order.length; i++) {
        element = order[i];

        // Orders elements on screen in order of sorted list
        element.style.order = i;
    }
}

// Sorts by priority: first is type, then name, then date
function item_type_sort(element1, element2) {
    if (Item_Type_Sort) {
        dif = compare(getAttributeText(element1, "type"), getAttributeText(element2, "type"));
        if (dif == 0) {
            return alpahabet_type_sort(element1, element2);
        }
        else return dif;
    }
    else return alpahabet_type_sort(element1, element2);
}

function alpahabet_type_sort(element1, element2) {
    if (Alphabetical_Sort) {
        dif = compare(getAttributeText(element1, "name"), getAttributeText(element2, "name"));
        if (dif == 0) {
            return date_type_sort(element1, element2);
        }
        else return dif;
    }
    else return date_type_sort(element1, element2);
}

function date_type_sort(element1, element2) {
    if (Date_Sort) {
        return compare(getDate(element1), getDate(element2));
    }
    else return 0;
}

function getDate(element) {
    dates = element.getElementsByClassName("date")[0];
    month_day_year = dates.getElementsByClassName("main_date")[0].innerText;
    time = dates.getElementsByClassName("time_stamp")[0].innerText;
    return new Date(month_day_year + " " + time);
}

// Gets attribute from innnerhtml
function getAttributeText(element, attribute) {
    return element.getElementsByClassName(attribute)[0].getElementsByTagName("p")[0].innerText;

}

function compare(item1, item2) {
    if (item1 < item2) return -1;
    else if (item1 == item2) return 0;
    else return 1;
}

// End of sorting method

// Everything below is filter method
function filter() {
    order.forEach(element => {
        
    });
}
