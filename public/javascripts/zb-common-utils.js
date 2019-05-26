
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

} // sendGetRequestToServerAsync()  

function getFileBaseName(path) {
  let separator = '/'

  const windowsSeparator = '\\'

  if (path.includes(windowsSeparator)) {
    separator = windowsSeparator
  }

  return path.slice(path.lastIndexOf(separator) + 1)
} // getFileBaseName()

// Create HTTP element
function crtHTTPElem(tag, main, cls, name, disp, txt, id) {
	var el = document.createElement(tag);
	if (tag == 'ul') {el.type = 'none';}
	main.appendChild(el);
	if (cls) {el.className = cls;}
	if (name) {
		el.name = name;
		el.id = name;
	}
	if (disp) {el.style.display = 'none';}
	if (txt) {el.innerHTML = txt;}
	if (id) {el.id = id;}
	return el;
} // crtHTTPElem()

// For home screen
function getListEventId(evDate, evItem) {
	return "home_list_event_" + evDate.toString() + "_" + evItem.toString();
} // getListEventId()

// For home screen
function getSideEventId(evDate, evItem) {
	return "home_side_event_" + evDate.toString() + "_" + evItem.toString();
} // getSideEventId()

// For home screen
function getSidePeriodId(perYear, perMonth) {
	return "home_side_period_" + perYear.toString() + "_" + perMonth.toString();
} // getSidePeriodId()
