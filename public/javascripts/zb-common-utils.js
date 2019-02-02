
//Send GET-request to the server synchronously
function sendGetRequestToServerSync(url, inpParm) {
    var xhr = new XMLHttpRequest();
    url = encodeURIComponent(url);
    inpParm = (inpParm) ? '/' + inpParm : '';
    xhr.open('GET', url + inpParm, false);
    xhr.send();
    return xhr.responseText;
}  

//Send GET-request to the server asynchronously
function sendGetRequestToServerAsync(url, inpParm, callBack) {
	var xhr = new XMLHttpRequest();
	url = encodeURIComponent(url);
	
	inpParm = (inpParm) ? '/' + inpParm : '/';
	xhr.open('GET', url + inpParm, true);
	xhr.send();

	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;
		if (this.status != 200) {
			// Process error
			SetInfo('Error: ' + (this.status ? this.statusText : 'XMLHttpRequest error'), 'error');
			return;
		}
		callBack(this.responseText);
	}

}  
