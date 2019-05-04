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

        var parDataObj = JSON.parse(periodsData);

        var idDivPeriodList = "div_period_list";
        var divPeriodList = $("#" + idDivPeriodList);
        divPeriodList.empty();

        var ulPeriodList = divPeriodList.append("<ul></ul>").addClass("list-group");

        for (let index = 0; index < parDataObj.length; index++) {

            li = ulPeriodList.append("<li>" +
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
                .attr("id", getSidePeriodId(parDataObj[index]._id.year,
                    parDataObj[index]._id.month));
            //$("#" + getSidePeriodId(
            //    parDataObj[index]._id.year,
            //    parDataObj[index]._id.month)).
            //    append("<ul></ul>").addClass("list-group");

        } // for (let index = 0; index < parDataObj.length; index++)


        for (let idx = 0; idx < parDataObj.length; idx++) {

            $("#" + getSidePeriodId(
                parDataObj[idx]._id.year,
                parDataObj[idx]._id.month) 
                ).
                append("<ul></ul>").addClass("list-group");

        } // for (let idx = 0; idx < parDataObj.length; idx++)

    } // cbPeriodList(periodsData) 

    return;

}