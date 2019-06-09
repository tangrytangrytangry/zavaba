// Load last events from server to screen
function zbLastEventList(mode = 'INIT') {

    var runReportParam = "";
    var events = "";
    var event = "";
    var ulEventList = "";
    var li = "";
    var elText = "";
    var elID = "";

    var divEventList, $divEventList, idDivEventList;
    var ulEventList, $divEventList, $ulEventList, ulEventList;
    var ulEvListPagination, $ulEvListPagination, idUlEvListPagination;
    var liPagination, $liPagination, idLiPagination;

    runReportParam = '?report=' + 'eventlist' +
        '&deepListMonths=' + globalEventHistoryMonthsDeep.toString() +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    events = sendGetRequestToServerAsync('reports', runReportParam, cbListAllEvents);

    function cbListAllEvents(eventsData) {
        //console.log("sendGetRequestToServerAsync: eventsData = " + eventsData);

        var paramEventsData = JSON.parse(eventsData);

        var currentPageNumber = 1, currentEventNumberOnPage = 0;

        idDivEventList = "div_event_list";
        idUlEventList = "ul_event_list";
        idUlEvListPagination = "ul_ev_list_pagination";

        $divEventList = $("#" + idDivEventList);
        if (mode === 'INIT') {
            $divEventList.data({
                currentScreenPage: 1
            });
        }
        var currentScreenPage = $divEventList.data().currentScreenPage;

        $ulEventList = $("#" + idUlEventList);
        $ulEventList.empty();

        $ulEvListPagination = $("#" + idUlEvListPagination);
        //$ulEvListPagination.empty();

        divEventList = document.getElementById(idDivEventList);
        ulEventList = document.getElementById(idUlEventList);
        ulEvListPagination = document.getElementById(idUlEvListPagination);

        elID = currentScreenPage.toString();
        elText = '<a class="page-link" href="#">Previous</a>';
        liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);

        // Show event data
        for (let index = 0; index < paramEventsData.length; index++) {

            currentEventNumberOnPage = currentEventNumberOnPage + 1;

            if (currentEventNumberOnPage > globalNumberEventsOnPage) {
                currentEventNumberOnPage = 1;
                currentPageNumber = currentPageNumber + 1;
            }

            let eventDate = paramEventsData[index].date.toString();
            let eventNumber = paramEventsData[index].item.toString();
            let eventActive = paramEventsData[index].active;

            elText = "Event # " + index.toString() +
                "  " +
                paramEventsData[index].date +
                "  " +
                paramEventsData[index].item +
                "  " +
                eventActive +
                "  page=" +
                currentPageNumber;
            elID = getListEventId(paramEventsData[index].date,
                paramEventsData[index].item);

            li = crtHTTPElem('li', ulEventList, "list-group-item", '', '', elText, elID);
            $("#" + elID).data({ pagenumber: currentPageNumber });

            if (currentScreenPage != currentPageNumber) {
                li.style.display = "none";
                continue;
            }
            else {
                li.style.display = "block";
            }

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