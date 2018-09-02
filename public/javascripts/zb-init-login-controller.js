function zbLoginController() {

	// bind event listeners to button clicks //
	$('#retrieve-password-submit').click(function () {
		$('#get-credentials-form').submit();
	});
	
	$('#login #forgot-password').click(function () {
		$('#cancel').html('Cancel');
		$('#retrieve-password-submit').show();
		$('#get-credentials').modal('show');
	});

	$('#login .button-rememember-me').click(function (e) {
		var span = $(this).find('span');
		if (span.hasClass('fa-square-o')) {
			span.addClass('fa-check-square-o');
			span.removeClass('fa-square-o');
		} else {
			span.removeClass('fa-check-square-o');
			span.addClass('fa-square-o');
		}
	});

	// automatically toggle focus between the email modal window and the login form //
	$('#get-credentials').on('shown.bs.modal', function () { $('#email-tf').focus(); });
	$('#get-credentials').on('hidden.bs.modal', function () { $('#user-tf').focus(); });

	return;

}