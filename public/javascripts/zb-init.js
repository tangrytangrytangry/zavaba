// After DOM ready
jQuery(function () {

    // Form select-list of languages and it's events
    zbFormSelectLang();

    // Init main logo bar
    zbLogoBar();

    // Init main navigation panel
    zbInitNav();

    // Load all periods from server to screen
    zbPeriodList();

    // Load last events from server to screen
    zbLastEventList();

    // Init login controller
    var lc = new zbLoginController();

    // Init signup controller
    var sc = zbSignupController();

    // Init form validator
    var rv = new zbResetValidator();

    // Login retrieval form via email //
    var ev = new zbEmailValidator();

    $('#get-credentials-form').ajaxForm({
        url: '/lost-password',
        beforeSubmit: function (formData, jqForm, options) {
            if (ev.validateEmail($('#email-tf').val())) {
                ev.hideEmailAlert();
                return true;
            } else {
                ev.showEmailAlert("<b>Error!</b> Please enter a valid email address");
                return false;
            }
        },
        success: function (responseText, status, xhr, $form) {
            $('#cancel').html('OK');
            $('#retrieve-password-submit').hide();
            ev.showEmailSuccess("Check your email on how to reset your password.");
        },
        error: function (e) {
            if (e.responseText == 'email-not-found') {
                ev.showEmailAlert("Email not found. Are you sure you entered it correctly?");
            } else {
                $('#cancel').html('OK');
                $('#retrieve-password-submit').hide();
                ev.showEmailAlert("Sorry. There was a problem, please try again later.");
            }
        }
    });

    return;

});