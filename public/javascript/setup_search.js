/*
    Sources:

    https://www.techiedelight.com/detect-enter-key-press-javascript/

*/

// Sets up the seach bar for all navigation bars except the one for all items page
if (!location.pathname.includes("/all-items")) {
    searchInput = document.getElementsByClassName('search_bar')[0];

    // Add an event listener for key presses
    searchInput.addEventListener("keyup", (event) => {
        if (event.code === 'Enter') {
            text = searchInput.value;
            // Store searchbar text in session storage
            sessionStorage.setItem("search", searchInput.value);
            document.location = '/all-items';
        }
    });
}
