// Load last events from server to screen
function zbLastEventList() {

    var runReportParam = "";
    var events = "";
    var event = "";
    var ulEventList = "";
    var li = "";
    var elText = "";
    var elID = "";

    var divEventList, currUl;

    runReportParam = '?report=' + 'eventlist' +
        '&deepListMonths=' + globalEventHistoryMonthsDeep.toString() +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    events = sendGetRequestToServerAsync('reports', runReportParam, cbListAllEvents);

    function cbListAllEvents(eventsData) {
        //console.log("sendGetRequestToServerAsync: eventsData = " + eventsData);

        var paramEventsData = JSON.parse(eventsData);

        var idDivEventList = "div_event_list";
        divEventList = $("#" + idDivEventList);
        divEventList.empty();

        //ulEventList = divEventList.append("<ul></ul>").addClass("list-group");

        divEventList = document.getElementById(idDivEventList);
        currUl = crtHTTPElem('ul', divEventList, "list-group", '', '', '');

        // Show event data
        for (let index = 0; index < paramEventsData.length; index++) {

            let eventDate = paramEventsData[index].date.toString();
            let eventNumber = paramEventsData[index].item.toString();

            /*  li = ulEventList.append("<li>" +
                     "Event # " + index.toString() +
                     "  " +
                     paramEventsData[index].date +
                     "  " +
                     paramEventsData[index].item +
                     "</li>");
                     li.addClass("list-group-item");
                     $("#" + idDivEventList + " :last-child")
                     .attr("id", getListEventId(paramEventsData[index].date,
                     paramEventsData[index].item));
            */

            elText = "Event # " + index.toString() +
                "  " +
                paramEventsData[index].date +
                "  " +
                paramEventsData[index].item;
            elID = getListEventId(paramEventsData[index].date,
                paramEventsData[index].item);

            li = crtHTTPElem('li', currUl, "list-group-item", '', '', elText, elID);

            // Add event to the period side bar        
            //addEventToSideBar(paramEventsData[index].date,
            //    paramEventsData[index].item);

            // One event data
            runReportParam = '?report=' + 'oneevent' +
                '&eventDate=' + eventDate +
                '&eventNumber=' + eventNumber +
                '&salt=' + Math.random().toString(36).substr(2, 5);
            event = sendGetRequestToServerAsync('reports', runReportParam, cbOneEventData);

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

            function cbOneEventData(oneEventData) {

                //console.log("cbOneEvent: oneEventData = " + oneEventData);
                let objEventData = JSON.parse(oneEventData);
                //console.log("cbOneEvent: objEventData = " + objEventData);
                let pictureURL = window.location.origin + objEventData[0].data.picture.lurl;

                let currEventId = getListEventId(objEventData[0].date, objEventData[0].item);
                let currEvent = $("#" + currEventId);

                let currLi = document.getElementById(currEventId);

                /*li = ulEventList.append("<li>" +
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
*/

                // Show event picture
                currEvent.append("<img></img>");
                $("#" + currEventId + " :last-child")
                    .attr({
                        src: pictureURL,
                        alt: objEventData[0].data.picture.text
                    });

                return null;

            } // function cbOneEventData()

        } // for (let index = 0; index < paramEventsData.length; index++)

        return null;

    } // cbListAllEvents()

    // Add event to the period side bar        
    function addEventToSideBar(evDate, evItem) {

        let eventDateStr;
        let eventDate;
        let eventYear;
        let eventMonth;
        let periodId;
        let eventId;

        eventDateStr = evDate.toString();
        eventDateStr = eventDateStr.substr(0, 4) + "-" +
            eventDateStr.substr(4, 2) + "-" +
            eventDateStr.substr(6, 2);
        eventDate = new Date(eventDateStr);
        //console.log("addEventToSideBar: eventDate = " + eventDate);

        eventYear = eventDate.getFullYear();
        eventMonth = eventDate.getMonth() + 1;
        //console.log("addEventToSideBar: eventYear = " + eventYear);
        //console.log("addEventToSideBar: eventMonth = " + eventMonth);

        periodId = getSidePeriodId(eventYear, eventMonth);
        //console.log("addEventToSideBar: periodId = " + periodId);
        eventId = getSideEventId(evDate, evItem)
        //console.log("addEventToSideBar: eventId = " + eventId);

        /*
        $("#" + periodId)

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
    let currEventId = getListEventId(objEventData[0].date, objEventData[0].item);
    let currEvent = $("#" + currEventId);
    currEvent.append("<img></img>");
    $("#" + currEventId + " :last-child")
        .attr({
            src: pictureURL,
            alt: objEventData[0].data.picture.text
        });

    return null;
    */

    } // addEventToSideBar()

    return null;

} // zbLastEventList()