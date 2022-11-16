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

/* 
    First, get the dictionary from session storage if it exists. The reason for this is that the checkboxes don't work upon 
    initial load of page if they have been checked and then stored in cache (i.e. when a user visits an individual item, but then 
    revisits all-items page right after. Then if they checked a filter, it will remain checked, but the state will be read as unchecked in javascript).
    So instead, store the last known state of the checkboxes in session storage using the dictionary, and then the dictionary and checkboxes will match up
    To ensure this, we will also force each checkbox to match the state of the returned dictionary.
*/

if (JSON.parse(sessionStorage.getItem("filters_dict")) != null) {
    filters_dict = JSON.parse(sessionStorage.getItem("filters_dict"));
}
else {
    // Set filters:
    filters_dict = {"Shoes" : false, "Shirts" : false, "Pants" : false, "Toiletries" : false, "House Items" : false, "Seasonal" : false, "Other" : false};
}

if (JSON.parse(sessionStorage.getItem("sort_dict")) != null) {
    sort_dict = JSON.parse(sessionStorage.getItem("sort_dict"));
}
else {
    // Set sorts:
    sort_dict = {"Item_Type_Sort" : false, "Alphabetical_Sort" : false, "Date_Sort" : false};
}

// Check if any filters should be changed intially changed if url for page has filters added in. At the very end after the setup, we will call the function filter to apply the initial filters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.has('filter')) {
    const input_filter = urlParams.get('filter');
    // Check filter box to show filter has been applied
    filters_dict[input_filter] = true;
    // Update session storage to match
    sessionStorage.setItem("filters_dict", JSON.stringify(filters_dict)); // Can only store strings
}

// Force checkboxes to match filters_dict
for (key in filters_dict) {
    document.getElementById(key).checked = filters_dict[key];
}

// Force checkboxes to match sort_dict
for (key in sort_dict) {
    document.getElementById(key).checked = sort_dict[key];
}

// Check searchbar
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
        return listofelements[0].textContent; // textContent is far more consistent on what it returns then innerText since innerText changes whether display=none or not https://stackoverflow.com/questions/67286355/div-innertext-loses-new-lines-after-setting-display-to-none
    }
    // If no elements of that class found, return an empty string
    return "";
}

// Sorting methods

function sorting_method(type) {
    // First change the variables based on the input
    sort_dict[type] = !sort_dict[type];

    // Then store the most updated version of sort_dict in sessionStorage
    sessionStorage.setItem("sort_dict", JSON.stringify(sort_dict));

    // Then sort elements based on sorting algorithm
    order.sort((element1, element2) => item_type_sort(element1, element2));

    // Then swap elements based on ordered list so displayed in order
    for (i = 0; i < order.length; i++) {
        element = order[i];

        // Orders elements on screen in order of sorted list
        element.style.order = i;
    }
}

// Sorts by priority: first is type, then name, then date
function item_type_sort(element1, element2) {
    if (sort_dict["Item_Type_Sort"]) {
        dif = compare(getAttributeText(element1, "type"), getAttributeText(element2, "type"));
        if (dif == 0) {
            return alpahabet_type_sort(element1, element2);
        }
        else return dif;
    }
    else return alpahabet_type_sort(element1, element2);
}

function alpahabet_type_sort(element1, element2) {
    if (sort_dict["Alphabetical_Sort"]) {
        dif = compare(getAttributeText(element1, "name"), getAttributeText(element2, "name"));
        if (dif == 0) {
            return date_type_sort(element1, element2);
        }
        else return dif;
    }
    else return date_type_sort(element1, element2);
}

function date_type_sort(element1, element2) {
    if (sort_dict["Date_Sort"]) {
        return compareDate(getDate(element1), getDate(element2));
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

function compareDate(item1, item2) {
    // Exactly like compare, but we want to return the newest item added first, not last, so we're looking for the largest date to be first
    if (item1 > item2) return -1;
    else if (item1 == item2) return 0;
    else return 1;
}

// End of sorting method


// Filter / search methods

// Get search bar element
const searchInput = document.getElementsByClassName("search_bar")[0];

function filter(type) {
    // Change correct filter in dictionary
    if (type != "input_from_search_bar") {
        filters_dict[type] = !filters_dict[type];
        sessionStorage.setItem("filters_dict", JSON.stringify(filters_dict)); // Then store the most updated dictionary in sesison storage
    }

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
