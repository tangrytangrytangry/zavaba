// Clear class
function zbCleanSelectLang(select) {
    // Clear styles
    return jQuery(select).removeClass();

}
// Retrieve specific language class name
function rtvLangClassName(lang) {
    return 'select-lang__icon-flag-' + lang;
}

// Form select-list of languages and it's events
function zbFormSelectLang() {
    // Current lang
    var currentLang;

    var selectLang;
    var selectLangOpt;

    // Get current language
    selectLang = zbCleanSelectLang('#main-select-lang');
    selectLang.addClass('select-lang');

    currentLang = selectLang.attr('lang');
    if (!currentLang) {
        currentLang = selectLang[0].value;
        selectLang.attr('lang', currentLang);
    } else {
        if (selectLang[0].value !== currentLang) {
            selectLang[0].value = currentLang;
        }
    }
    selectLang.addClass(rtvLangClassName(currentLang));

    // Get clean lang dropdown list
    selectLangOpt = zbCleanSelectLang('.select-lang > option');

    // Add class for every language option
    selectLangOpt.addClass(function () {
        return rtvLangClassName(this.value);
    });
    // Add style to hide scroll bars
    selectLang.css({ height: 'auto', overflow: 'hidden', zIndex: '40000' });


    // Add style to hide scroll bars
    //selectLang.css({ height: 'auto', overflow: 'hidden', z-index: '40000' });

    // Click on lang selection - setup new language
    selectLang.on('click', function () {

        let data = {};

        // Normal size
        this.size = 1;

        zbCleanSelectLang(this).addClass(function () {
            return rtvLangClassName(this.value);
        });

        if (currentLang !== this.value) {
            currentLang = this.value;

            selectLang = zbCleanSelectLang('#main-select-lang');
            selectLang.addClass('select-lang');
            selectLang.addClass(rtvLangClassName(currentLang));
            selectLang[0].value = currentLang;

            // data = sendGetRequestToServerSync('language/' + currentLang);
            data = sendGetRequestToServerSync('language', '?lang=' + currentLang);
            location.reload(true);
        }

        return;

    });

    // Leaving lang selection - setup new language
    selectLang.on('mouseleave', function () {

        // Normal size
        this.size = 1;

        selectLang = zbCleanSelectLang(this);
        selectLang.addClass('select-lang');
        selectLang.addClass(rtvLangClassName(this.value));

        return;

    });

    // Определяем обработчик на событие ухода мышки с области элемента
    selectLang.on('mouseover', function () {
        // Clear list formatting
        zbCleanSelectLang(this);

        // Set size as number of elements
        this.size = jQuery(this).find('option').length;
    });
}

