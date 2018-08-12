
function zbEmailValidator()
{
// bind this to _local for anonymous functions //
	var _local = this;

// modal window to allow users to request credentials by email //
	_local.retrievePassword = $('#get-credentials');
	_local.retrievePasswordAlert = $('#get-credentials .alert');
	_local.retrievePassword.on('show.bs.modal', function(){ $('#get-credentials-form').resetForm(); _local.retrievePasswordAlert.hide();});
}

zbEmailValidator.prototype.validateEmail = function(e)
{
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(e);
}

zbEmailValidator.prototype.showEmailAlert = function(m)
{
	this.retrievePasswordAlert.attr('class', 'alert alert-danger');
	this.retrievePasswordAlert.html(m);
	this.retrievePasswordAlert.show();
}

zbEmailValidator.prototype.hideEmailAlert = function()
{
	this.retrievePasswordAlert.hide();
}

zbEmailValidator.prototype.showEmailSuccess = function(m)
{
	this.retrievePasswordAlert.attr('class', 'alert alert-success');
	this.retrievePasswordAlert.html(m);
	this.retrievePasswordAlert.fadeIn(500);
}