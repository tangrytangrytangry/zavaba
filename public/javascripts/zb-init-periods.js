// Load all periods from server to screen
function zbPeriodList(mode='INIT') {

    var runReportParam = "";

    var periods = "";
    // periods = sendGetRequestToServerSync('periodlist');
    // console.log("sendGetRequestToServerSync: periods = " + periods);

    var runReportParam = '?report=' + 'periodlist' +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    periods = sendGetRequestToServerAsync('reports', runReportParam, cbPeriodList);

    function cbPeriodList(periodsData) {
        //console.log("sendGetRequestToServerAsync: periodsData = " + periodsData);

        let li, elText = "";;
        let liCurrPeriodListId;

        var parDataObj = JSON.parse(periodsData);

        var idDivPeriodList = "div_period_list";
        var idUlPeriodList = "ul_period_list";

        var $divPeriodList = $("#" + idDivPeriodList);
        var $ulPeriodList = $("#" + idUlPeriodList);
        $ulPeriodList.empty();

        divPeriodList = document.getElementById(idDivPeriodList);
        ulPeriodList = document.getElementById(idUlPeriodList);

        for (let index = 0; index < parDataObj.length; index++) {

            liCurrPeriodListId = getSidePeriodId(parDataObj[index]._id.year, parDataObj[index]._id.month);

            elText = "Period # " + index.toString() +
                "  " +
                parDataObj[index]._id.year +
                "  " +
                parDataObj[index]._id.month +
                "  " +
                parDataObj[index].count +
                "</li>";

            li = crtHTTPElem('li', ulPeriodList, "list-group-item", '', '', elText, liCurrPeriodListId);

        } // for (let index = 0; index < parDataObj.length; index++)

    } // cbPeriodList(periodsData) 

    return;

}