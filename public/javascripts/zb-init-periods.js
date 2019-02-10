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

        let li;

        var parDataObj = JSON.parse(periodsData);

        var divPeriodList = $("#div_period_list");
        divPeriodList.empty();

        var ulPeriodList = divPeriodList.append("<ul></ul>").addClass("list-group");
        for (let index = 0; index < parDataObj.length; index++) {

            li = ulPeriodList.append("<li>" +
                "Item # " + index.toString() + "</li>");
            li.addClass("list-group-item");


        }
    }

    return;

}