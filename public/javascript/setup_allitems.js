const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
filter = urlParams.get('filter');
console.log(filter);
if (filter == "Shoes") {
    console.log("Shoes was the set filter");
}
search = urlParams.get('search');
console.log(search);