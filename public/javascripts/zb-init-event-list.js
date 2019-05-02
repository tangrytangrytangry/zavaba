// Load last events from server to screen
function zbLastEventList() {

    var runReportParam = "";
    var events = "";
    var event = "";
    var ulEventList = "";
    var li = "";

    runReportParam = '?report=' + 'eventlist' +
        '&deepListMonths=' + globalEventHistoryMonthsDeep.toString() +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    events = sendGetRequestToServerAsync('reports', runReportParam, cbListAll);

    function cbListAll(eventsData) {
        //console.log("sendGetRequestToServerAsync: eventsData = " + eventsData);

        var parEventsData = JSON.parse(eventsData);

        var divEventList = $("#div_event_list");
        divEventList.empty();

        ulEventList = divEventList.append("<ul></ul>").addClass("list-group");
        for (let index = 0; index < parEventsData.length; index++) {

            li = ulEventList.append("<li>" +
                "Event # " + index.toString() +
                "  " +
                parEventsData[index].date +
                "  " +
                parEventsData[index].item +
                "</li>");
            li.addClass("list-group-item");

            let eventDate = parEventsData[index].date.toString();
            let eventNumber = parEventsData[index].item.toString();

            // One event data
            runReportParam = '?report=' + 'oneevent' +
                '&eventDate=' + eventDate +
                '&eventNumber=' + eventNumber +
                '&salt=' + Math.random().toString(36).substr(2, 5);
            event = sendGetRequestToServerAsync('reports', runReportParam, cbOneEvent);

            // One event texts
            runReportParam = '?report=' + 'oneeventdesc' +
                '&eventDate=' + eventDate +
                '&eventNumber=' + eventNumber +
                '&salt=' + Math.random().toString(36).substr(2, 5);
            event = sendGetRequestToServerAsync('reports', runReportParam, cbOneEventDesc);

            function cbOneEventDesc(oneEventTexts) {
                //console.log("cbOneEventDesc: oneEventTexts = " + oneEventTexts);

                return null;
            }

            function cbOneEvent(oneEventData) {

                //console.log("cbOneEvent: oneEventData = " + oneEventData);
                var objEventData = JSON.parse(oneEventData);
                //console.log("cbOneEvent: objEventData = " + objEventData);
                var pictureURL = window.location.origin + objEventData[0].data.picture.lurl;

                li = ulEventList.append("<li>" +
                    "Picture: " + index.toString() +
                    "  " +
                    objEventData[0].date +
                    "  " +
                    objEventData[0].item +
                    "  " +
                    objEventData[0].data.picture.name +
                    "  " +
                    pictureURL +
                    "</li>");
                li.addClass("list-group-item");

                return null;

            } // function cbOneEvent(oneEventData)

        } // for (let index = 0; index < parEventsData.length; index++)

        return null;

    }

    return null;

}