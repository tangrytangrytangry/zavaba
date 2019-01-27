// Load all periods from server to screen
function zbPeriodList() {

    var periods = sendGetRequestToServerSync('periodlist');

    console.log("sendGetRequestToServerSync: periods = " + periods);

    return;

}