
//Send GET-request to the server
function sendGetRequestToServer(url, inpParm) {
    var xhr = new XMLHttpRequest();
    url = encodeURIComponent(url);
    inpParm = (inpParm) ? '/' + inpParm : '';
    xhr.open('GET', url + inpParm, false);
    xhr.send();
    return xhr.responseText;
}  