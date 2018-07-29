// Current lang
var currentLang = "";

// Clear class
function zbCleanSelectLang(select) {
    // Clear styles
    return $(select).removeClass();
}

// Form select-list of languages and it's events
function zbFormSelectLang() {

    // Get claean lang dropdown list
    var selectLang = zbCleanSelectLang('.select-lang');

    // Add class for every language
    selectLang.addClass(function () {
        return 'select-lang__icon-flag-' + this.value;
    });

    // Add style to hide scroll bars
    selectLang.css({ height: 'auto', overflow: 'hidden', zIndex: '40000' });

    // Leaving lang selection - setup new language
    selectLang.on('click mouseleave', function () {

        let data = {};

        // Normal size
        this.size = 1;


        zbCleanSelectLang(this).addClass(function () {
            return 'select-lang__icon-flag-' + this.value;
        });

        if (currentLang !== this.value) {
            currentLang = this.value;
            // data = sendGetRequestToServer('language/' + currentLang);
            data = sendGetRequestToServer('language', '?lang=' + currentLang);
            location.reload(true);         
        }

        return;

    });

    // Определяем обработчик на событие ухода мышки с области элемента
    selectLang.on('mouseover', function () {
        // Очищаем стиль списка, чтобы он не мешал отображению
        zbCleanSelectLang(this);

        // Устанавливаем размер, равный количеству элементов
        this.size = $(this).find('option').length;
    });
}




