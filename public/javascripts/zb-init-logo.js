
// Init main logo bar
function zbLogoBar() {

    var userName = jQuery("#main-user-name").get(0);
    var hasUserName = !(!userName.innerText);
    var mainUserDiv = jQuery("#main-user-div").get(0);
    var mainNoUserDiv = jQuery("#main-nouser-div").get(0);

    if (hasUserName) {
        mainUserDiv.classList.add("main-user-div_display");
        mainUserDiv.classList.remove("main-user-div_hide");
        mainNoUserDiv.classList.remove("main-user-div_display");
        mainNoUserDiv.classList.add("main-user-div_hide");
    } else {
        mainUserDiv.classList.remove("main-user-div_display");
        mainUserDiv.classList.add("main-user-div_hide");
        mainNoUserDiv.classList.add("main-user-div_display");
        mainNoUserDiv.classList.remove("main-user-div_hide");
    }
    return;
}
