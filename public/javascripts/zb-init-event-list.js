// Load last events from server to screen
function zbLastEventList() {

    var runReportParam = "";

    var events = "";

    var runReportParam = '?report=' + 'eventlist' +
        '&deepListMonths=' + globalEventHistoryMonthsDeep.toString() +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    events = sendGetRequestToServerAsync('reports', runReportParam, cbListAll);

    function cbListAll(eventsData) {
        console.log("sendGetRequestToServerAsync: eventsData = " + eventsData);

        return;

        let li;

        var parDataObj = JSON.parse(eventsData);

        var divPeriodList = $("#div_period_list");
        divPeriodList.empty();

        var ulPeriodList = divPeriodList.append("<ul></ul>").addClass("list-group");
        for (let index = 0; index < parDataObj.length; index++) {

            li = ulPeriodList.append("<li>" +
                "Item # " + index.toString() +
                "  " +
                parDataObj[index]._id.year +
                "  " +
                parDataObj[index]._id.month +
                "  " +
                parDataObj[index].count +
                "</li>");
            li.addClass("list-group-item");


        }
    }

    return;

}