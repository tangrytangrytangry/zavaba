
// Init main navigation panel
function zbInitNav() {

    var navMenuItems = jQuery(".navbar-nav .nav-link").removeClass("nav-link_active");

    navMenuItems
        .filter(function (index, element) {
            let isCurrPage = (element.pathname === document.location.pathname ||
                (element.pathname === '/home' && document.location.pathname === '/')
            );
            //console.log("element.pathname = " + element.pathname,
            //    "isCurrPage = " + isCurrPage)
            return isCurrPage;
        })
        .addClass("nav-link_active");

    return;

}
