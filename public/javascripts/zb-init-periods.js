// Load all periods from server to screen
function zbPeriodList() {

    var runReportParam = "";

    var periods = "";
    // periods = sendGetRequestToServerSync('periodlist');
    // console.log("sendGetRequestToServerSync: periods = " + periods);

    var runReportParam = '?report=' + 'periodlist' +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    periods = sendGetRequestToServerAsync('reports', runReportParam, cb);

    function cb(periodsData) {
        console.log("sendGetRequestToServerAsync: periods = " + periodsData);
    }

    return;

}