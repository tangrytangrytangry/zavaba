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

        var paramEventsData = JSON.parse(eventsData);

        var divEventList = $("#div_event_list");
        divEventList.empty();

        ulEventList = divEventList.append("<ul></ul>").addClass("list-group");

        // Show event data
        for (let index = 0; index < paramEventsData.length; index++) {

            let eventDate = paramEventsData[index].date.toString();
            let eventNumber = paramEventsData[index].item.toString();

            li = ulEventList.append("<li>" +
                "Event # " + index.toString() +
                "  " +
                paramEventsData[index].date +
                "  " +
                paramEventsData[index].item +
                "</li>");
            li.addClass("list-group-item");
            $("#div_event_list :last-child")
                .attr("id", getEventId(paramEventsData[index].date, paramEventsData[index].item));

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
            } // cbOneEventDesc()

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

                // Show event picture
                let currId = getEventId(objEventData[0].date, objEventData[0].item);
                let currEvent = $("#" + currId);
                currEvent.append("<img></img>");
                $("#" + currId + " :last-child")
                    .attr({
                        src: pictureURL,
                        alt: objEventData[0].data.picture.text
                    });

                return null;

            } // function cbOneEvent()

        } // for (let index = 0; index < paramEventsData.length; index++)

        return null;

    } // cbListAll()

    function getEventId(evDate, evItem) {
        return "home_event_" + evDate.toString() + "_" + evItem.toString();
    } // getEventId()

    return null;

} // zbLastEventList()