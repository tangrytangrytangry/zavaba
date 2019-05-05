// Load all periods from server to screen
function zbPeriodList() {

    var runReportParam = "";

    var periods = "";
    // periods = sendGetRequestToServerSync('periodlist');
    // console.log("sendGetRequestToServerSync: periods = " + periods);

    var runReportParam = '?report=' + 'periodlist' +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    periods = sendGetRequestToServerAsync('reports', runReportParam, cbPeriodList);

    function cbPeriodList(periodsData) {
        //console.log("sendGetRequestToServerAsync: periodsData = " + periodsData);

        let li;
        let liCurrPeriodListId;

        var parDataObj = JSON.parse(periodsData);

        var idDivPeriodList = "div_period_list";
        var divPeriodList = $("#" + idDivPeriodList);
        divPeriodList.empty();

        var ulPeriodList = divPeriodList.append("<ul></ul>").addClass("list-group");

        for (let index = 0; index < parDataObj.length; index++) {

            liCurrPeriodListId = getSidePeriodId(parDataObj[index]._id.year, parDataObj[index]._id.month);

            li = $("#" + idDivPeriodList + " :last-child").
                append("<li>" +
                    "Period # " + index.toString() +
                    "  " +
                    parDataObj[index]._id.year +
                    "  " +
                    parDataObj[index]._id.month +
                    "  " +
                    parDataObj[index].count +
                    "</li>");
            li.addClass("list-group-item");

            $("#" + idDivPeriodList + " :last-child")
                .attr("id", liCurrPeriodListId);

            let liCurrPeriodList = document.getElementById(liCurrPeriodListId);
            let currUl = crtHTTPElem('ul', liCurrPeriodList, '', '', '', '');

        } // for (let index = 0; index < parDataObj.length; index++)

    } // cbPeriodList(periodsData) 

    return;

}