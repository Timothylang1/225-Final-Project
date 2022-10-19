/*
    Sources:

    Parameters from url
    https://www.sitepoint.com/get-url-parameters-with-javascript/

    Import statements
    https://www.scaler.com/topics/javascript/import-js-file-in-js/
    https://stackoverflow.com/questions/58211880/uncaught-syntaxerror-cannot-use-import-statement-outside-a-module-when-import

*/
import * as utils from './sort_filter_search.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// console.log(utils.filters_dict);

filter = urlParams.get('filter');
console.log(filter);
if (filter == "Shoes") {
    console.log("Shoes was the set filter");
}
search = urlParams.get('search');
console.log(search);