/* Sources:
    https://stackoverflow.com/questions/37349331/javascript-sort-items-list-by-months
    https://stackoverflow.com/questions/558614/how-can-i-reorder-elements-with-javascript
    https://stackoverflow.com/questions/3871547/iterating-over-result-of-getelementsbyclassname-using-array-foreach
    https://stackoverflow.com/questions/11633951/get-paragraph-text-inside-an-element
    https://www.w3schools.com/js/tryit.asp?filename=tryjs_array_sort2
    https://www.w3schools.com/js/js_dates.asp

    Search bar:
    https://javascript.plainenglish.io/how-to-build-a-search-bar-7d8a8a3d9d00
    https://www.freecodecamp.org/news/targeting-click-of-clear-button-x-on-input-field/
    
*/

// Set filters:
filters_dict = {"Shoes" : false, "Shirts" : false, "Pants" : false, "Toiletries" : false, "House Items" : false, "Seasonal" : false, "Other" : false};

// Check if any filters should be changed intially changed if url for page has filters added in. At the very end after the setup, we will call the function filter to apply the initial filters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.has('filter')) {
    const input_filter = urlParams.get('filter');
    filters_dict[input_filter] = true;
    // Then check filter box to show filter has been applied
    document.getElementById(input_filter).checked = true;
}
if (urlParams.has('search')) {
    const input_search = urlParams.get('search');
    document.getElementsByClassName('search_bar')[0].value = input_search;
}


// Initial order of elements
order = document.getElementsByClassName("single_item");
order = Array.from(order);


// Gets attribute from innnerhtml, or return empty string if it can't find inner html
function getAttributeText(element, attribute) {
    listofelements = element.getElementsByClassName(attribute);
    if (listofelements.length == 1) {
        return listofelements[0].innerText;
    }
    // If no elements of that class found, return an empty string
    return "";
}

// Sorting methods

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
    month_day_year = getAttributeText(element, "main_date");
    return new Date(month_day_year);
}

function compare(item1, item2) {
    if (item1 < item2) return -1;
    else if (item1 == item2) return 0;
    else return 1;
}

// End of sorting method


// Filter / search methods

// Get search bar element
const searchInput = document.getElementsByClassName("search_bar")[0];

function filter(type) {
    // Change correct filter in dictionary
    if (type != "input_from_search_bar") filters_dict[type] = !filters_dict[type];

    searchtext = searchInput.value.toLowerCase(); // Gets text from searchbar, lowercase everything so searchbar is less case sensitive

    order.forEach(element => {
        let name = getAttributeText(element, "name");
        let description = getAttributeText(element, "description");
        let type = getAttributeText(element, "type");
        let date = getDate(element).toDateString().substring(4); // Only include month, day and year
    
        if ((name.toLowerCase().includes(searchtext) || 
        description.toLowerCase().includes(searchtext) || 
        type.toLowerCase().includes(searchtext) || 
        date.toLowerCase().includes(searchtext)) && 
        (any_filters_set() ? true : filters_dict[type])) // We still want to obey the rules of the filter + Special case where no filter's are set, then we reveal all items
        element.style.display = "flex";
        else element.style.display = "none";
    });
}

function any_filters_set() {
    all_filters_false = true;
    for (key in filters_dict) {
        if (filters_dict[key]) {
            all_filters_false = false;
            break;
        }
    }
    return all_filters_false;
}

// Event listeners


// Add in event listener for when the little x button is pressed on search
searchInput.addEventListener("search", function() {
    filter("input_from_search_bar");
});

// Add an event listener for key presses
searchInput.addEventListener("keyup", (event) => {
    filter("input_from_search_bar");
});

// Then apply the filter once in case any parameters were changed at the beginning
filter("input_from_search_bar");
