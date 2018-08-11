// After DOM ready
jQuery(function () {

    // Form select-list of languages and it's events
    zbFormSelectLang();

    // Init main navigation panel
    zbInitNav();

    // Init login controller
	var lc = new zbLoginController();

    return;

});