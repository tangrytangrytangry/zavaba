// Load last events from server to screen
function zbLastEventList(mode = 'INIT') {

    var runReportParam = "";
    var events = "";
    var event = "";
    var ulEventList = "";
    var li = "";
    var elText = "";
    var elID = "";

    var currentScreenPage = 0, evData = {};

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

        var currentPageNumber = 1,
            maxPageNumber = 1,
            currentEventNumberOnPage = 0;

        idDivEventList = "div_event_list";
        idUlEventList = "ul_event_list";
        idUlEvListPagination = "ul_ev_list_pagination";

        $divEventList = $("#" + idDivEventList);
        if (mode === 'INIT') {

            divEventList = document.getElementById(idDivEventList);
            ulEventList = document.getElementById(idUlEventList);
            ulEvListPagination = document.getElementById(idUlEvListPagination);

            $divEventList.data({
                currentscreenpage: 1,
                maxpagenumber: 1
            });

            // In pagination changed page number by mouse click
            //ulEvListPagination.addEventListener('mouseup', function (ev) {
            $("#" + idUlEvListPagination).on("click", "li", function (ev) {
                changeCurrentScreenPage(ev);
            });

        }
        currentScreenPage = $divEventList.data().currentscreenpage;

        $ulEventList = $("#" + idUlEventList);
        $ulEventList.empty();

        // Start pagination
        $ulEvListPagination = $("#" + idUlEvListPagination);
        $ulEvListPagination.empty();

        elID = getPaginationId(-1);
        elText = '<span class="page-link">Previous</span>';
        liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);

        elID = getPaginationId(currentPageNumber);
        elText = '<span class="page-link">' + currentPageNumber.toString() + '</span>';
        liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);
        $("#" + elID).data({ pagenumber: currentPageNumber });

        // Show all event data
        for (let index = 0; index < paramEventsData.length; index++) {

            currentEventNumberOnPage = currentEventNumberOnPage + 1;

            if (currentEventNumberOnPage > globalNumberEventsOnPage) {
                currentEventNumberOnPage = 1;
                currentPageNumber = currentPageNumber + 1;
                maxPageNumber = currentPageNumber;

                elID = getPaginationId(currentPageNumber);
                elText = '<span class="page-link">' + currentPageNumber.toString() + '</span>';
                liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);
                $("#" + elID).data({ pagenumber: currentPageNumber });
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
            evData = {
                pagenumber: currentPageNumber,
                evdate: eventDate,
                evnumber: eventNumber,
                evactive: eventActive
            };
            $("#" + elID).data(evData);

            if (currentScreenPage == currentPageNumber) {
                li.style.display = "block";
                evData.evloaded = 'Y';
                $("#" + elID).data(evData);
            }
            else {
                li.style.display = "none";
                evData.evloaded = 'N';
                $("#" + elID).data(evData);
                continue;
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

        // End pagination
        elID = getPaginationId(0);
        elText = '<span class="page-link">Next</span>';
        liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);

        // Show active screen page number in pagination
        $("#" + getPaginationId(currentScreenPage)).addClass('active');

        // Disable "Previous" if it is the first page
        if (currentScreenPage === 1) {
            $("#" + getPaginationId(-1)).addClass('disabled');
        }

        // Disable "Next" if it is the last page
        if (currentScreenPage === maxPageNumber) {
            $("#" + getPaginationId(0)).addClass('disabled');
        }
        evData = $divEventList.data();
        evData.maxpagenumber = maxPageNumber;
        evData = $divEventList.data(evData);

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


    // In pagination changed page number by mouse click
    function changeCurrentScreenPage(event) {

        let idPagination;

        if (event.target.parentElement.tagName === 'UL') {
            idPagination = event.target.id;
        } else {
            idPagination = event.target.parentElement.id;
        }

        currentScreenPage = $divEventList.data().currentscreenpage;
        maxPageNumber = $divEventList.data().maxpagenumber;

        // Calculate screen page number to show
        switch (idPagination) {

            // Prevous number
            case getPaginationId(-1):

                if (currentScreenPage <= 1) {
                    return null;
                } else {
                    currentScreenPage = currentScreenPage - 1;
                }
                break;

            // Next number
            case getPaginationId(0):

                if (currentScreenPage >= maxPageNumber) {
                    return null;
                } else {
                    currentScreenPage = currentScreenPage + 1;
                }
                break;

                break;

            // Specific number
            default:

                evData = $("#" + idPagination).data();

                if (currentScreenPage === evData.pagenumber) {
                    return null;
                } else {
                    currentScreenPage = evData.pagenumber;
                }

                break;
        }

        // Save current screen page
        evData = $divEventList.data();
        evData.currentscreenpage = currentScreenPage;
        $("#" + idPagination).data(evData);

        // Show current screen page
        showCurrentScreenPage();

        return null;

    } // changeCurrentScreenPage()

    // Show current screen page
    function showCurrentScreenPage() {

    } // showCurrentScreenPage()

    return null;

} // zbLastEventList()