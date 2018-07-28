// Clear class
function zbCleanSelectLang(select) {
    // Clear styles
    return $(select).removeClass();
}

// Form select-list of languages and it's events
function zbFormSelectLang() {

    // получаем выпадающий список с уже очищенными классами
    var selectLang = zbCleanSelectLang('.select-lang');

    // Add class for every language
    selectLang.addClass(function () {
        return 'select-lang__icon-flag-' + this.value;
    });

    // Add style to hide scroll bars
    selectLang.css({ height: 'auto', overflow: 'hidden', zIndex: '40000' });

    // Leaving lang selection - setup new language
    //selectLang.on('mouseleave', function () {
    selectLang.on('click mouseleave', function () {
        // Normal size
        this.size = 1;

        zbCleanSelectLang(this).addClass(function () {
            return 'select-lang__icon-flag-' + this.value;
        });

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




