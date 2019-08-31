
var divEventList, $divEventList, idDivEventList;
var ulEventList, $ulEventList, idUlEventList;
var ulEvListPagination, $ulEvListPagination, idUlEvListPagination;
var liPagination, $liPagination, idLiPagination;
var currentScreenPage = 0, maxPageNumber = 0;
var currPageLang = "";

var screenSearchMode = {};
var idInputSearchMain = "searchMain", inputSearchMain, $inputSearchMain, searchMainValue = "";
var idInputSearchButton = "searchMainButton", inputSearchMainButton, $inputSearchMainButton, searchMainValueButton = "";

// Load last events from server to screen
function zbLastEventList(mode = 'INIT') {

    var runReportParam = "";
    var events = "";
    var event = "";
    var ulEventList = "";
    var li = "";
    var elText = "";
    var elID = "";

    var evData = {};
    currentScreenPage = 0;
    maxPageNumber = 1;

    inputSearchMain = document.getElementById(idInputSearchMain);
    screenSearchMode = JSON.parse(sessionStorage.getItem('screenSearchMode'));

    // Init main page search value


    if (screenSearchMode) {
        inputSearchMain.value = screenSearchMode.searchtext;
    }
    else {
        screenSearchMode = {};
        screenSearchMode.searchmode = mode;
        screenSearchMode.searchtext = "";
        sessionStorage.setItem('screenSearchMode', JSON.stringify(screenSearchMode));
    }

    runReportParam = '?report=' + 'eventlist' +
        '&deepListMonths=' + globalEventHistoryMonthsDeep.toString() +
        '&filterObject=' + JSON.stringify(screenSearchMode) +
        '&salt=' + Math.random().toString(36).substr(2, 5);

    events = sendGetRequestToServerAsync('reports', runReportParam, cbListAllEvents);

    return null;

} // zbLastEventList()

// Show current screen page
function showCurrentScreenPage(parChangeMode) {

    var elId;
    var elData;
    var li;
    var navPeriodIsActive = false, dateObj = {};

    // Show active screen page number in pagination
    $("#" + idUlEvListPagination).children().removeClass("active");
    $("#" + getPaginationId(currentScreenPage)).addClass('active');

    // Disable "Previous" if it is the first page
    $("#" + idUlEvListPagination).children().removeClass("disabled");
    if (currentScreenPage === 1) {
        $("#" + getPaginationId(-1)).addClass('disabled');
    }

    // Disable "Next" if it is the last page
    if (currentScreenPage === maxPageNumber) {
        $("#" + getPaginationId(0)).addClass('disabled');
    }

    // Read all events
    $ulEventList = $("#" + idUlEventList).children();

    // Show only events from current page
    for (let i = 0; i < $ulEventList.length; i++) {
        elId = $ulEventList[i].id;
        elData = $("#" + elId).data();
        li = document.getElementById(elId);

        if (elData.pagenumber === currentScreenPage) {
            li.style.display = "block";

            // Show active period on side bar navigator
            if (!navPeriodIsActive) {
                if (parChangeMode === "CHANGE_PAGE") {
                    navPeriodIsActive = true;
                    dateObj = cvtCharDate8ToObj(elData.evdate);
                    activateNavBarPeriod(dateObj.yyyy, dateObj.mm);
                }
            }

            if (elData.evloaded != 'Y') {

                elData.evloaded = 'Y';
                $("#" + elId).data(elData);

                // All one event data to screen
                showOneEventData(elData.evdate, elData.evnumber);

            }
        }
        else {
            li.style.display = "none";
            continue;
        }

    }

} // showCurrentScreenPage()

// All one event data to screen
function showOneEventData(evDate, evNumber) {

    // One event data
    runReportParam = '?report=' + 'oneevent' +
        '&eventDate=' + evDate +
        '&eventNumber=' + evNumber +
        '&salt=' + Math.random().toString(36).substr(2, 5);
    event = sendGetRequestToServerAsync('reports', runReportParam, cbOneEventData);

    // One event texts
    runReportParam = '?report=' + 'oneeventdesc' +
        '&eventDate=' + evDate +
        '&eventNumber=' + evNumber +
        '&salt=' + Math.random().toString(36).substr(2, 5);
    event = sendGetRequestToServerAsync('reports', runReportParam, cbOneEventDesc);

} // showOneEventData()

// Load to screen pictures for one event
function cbOneEventData(oneEventData) {

    //console.log("cbOneEvent: oneEventData = " + oneEventData);

    var evData = {};

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

    evData = $("#" + currEventId).data();
    evData[getPictureId()] = objEventData[0].data.picture.text.trim();
    evData[getAttachmentId()] = objEventData[0].data.attachment.text.trim();
    $("#" + currEventId).data(evData);

    return null;

} // function cbOneEventData()

// Load to screen descriptions for one event
function cbOneEventDesc(oneEventTexts) {
    //console.log("cbOneEventDesc: oneEventTexts = " + oneEventTexts);

    var evData = {}, currEventId = "", currLi, currEvent;
    var oneEventTextsObj = JSON.parse(oneEventTexts);

    /*    
    [
       {
            "data": {
                "text": "English description"
            },
            "log": {
                "usernamecrt": "q",
                "created": "2019-07-14T10:31:26.500Z"
            },
            "_id": "5d2b047ef06ed82db8e58823",
            "date": 20190714,
            "item": 3,
            "langcode": "EN",
            "active": "Y",
            "__v": 0
        }
    ]
    */

    for (let index = 0; index < oneEventTextsObj.length; index++) {
        const langText = oneEventTextsObj[index];
        //console.log("langText = " + langText.date + " " + langText.item + " " +
        //    langText.active + " : " + langText.langcode + " - " + langText.data.text);

        currEventId = getListEventId(langText.date, langText.item);

        evData = $("#" + currEventId).data();
        evData[getTextId(langText.langcode)] = langText.data.text.trim();
        $("#" + currEventId).data(evData);

        if (currPageLang == langText.langcode) {

            currEvent = $("#" + currEventId);
            currLi = document.getElementById(currEventId);

            // Show event description in proper language
            currEvent.append("<p>" +
                langText.langcode + " - " +
                langText.data.text +
                "</p>");

        }
    }

    /*
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
    
    */

    return null;
} // cbOneEventDesc()

// Show events to screen - call back function
function cbListAllEvents(eventsData) {
    //console.log("sendGetRequestToServerAsync: eventsData = " + eventsData);

    var paramEventsData = JSON.parse(eventsData);

    var currentPageNumber = 1,
        currentEventNumberOnPage = 0;

    idDivEventList = "div_event_list";
    idUlEventList = "ul_event_list";
    idUlEvListPagination = "ul_ev_list_pagination";

    $divEventList = $("#" + idDivEventList);
    if (screenSearchMode.searchmode == 'INIT' || screenSearchMode.searchmode == 'SEARCH') {

        currPageLang = document.getElementById("main-select-lang").lang.toUpperCase();

        divEventList = document.getElementById(idDivEventList);
        ulEventList = document.getElementById(idUlEventList);
        ulEvListPagination = document.getElementById(idUlEvListPagination);

        $divEventList.data({
            currentscreenpage: 1,
            maxpagenumber: 1
        });

        // In pagination changed page number by mouse click
        // ulEvListPagination.addEventListener('mouseup', function (ev) {
        $("#" + idUlEvListPagination).on("click", "li", function (ev) {
            changeCurrentScreenPage(ev);
        });

        // Refresh screen screen when <Search> field changed
        searchMain.addEventListener('keyup', function (ev) {
            searchFieldChanged(ev);
            return;
        });

        // Refresh screen screen when <Search> button pressed
        searchMainButton.addEventListener('mouseup', function (ev) {
            searchButtonPressed(ev);
            return;
        });

    }
    currentScreenPage = $divEventList.data().currentscreenpage;

    $ulEventList = $("#" + idUlEventList);
    $ulEventList.empty();

    // Start pagination
    $ulEvListPagination = $("#" + idUlEvListPagination);
    $ulEvListPagination.empty();

    // Pagination - previous page 
    elID = getPaginationId(-1);
    elText = '<span class="page-link">Previous</span>';
    liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);

    // Pagination - current page
    elID = getPaginationId(currentPageNumber);
    elText = '<span class="page-link">' + currentPageNumber.toString() + '</span>';
    liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);
    $("#" + elID).data({ pagenumber: currentPageNumber });

    // Show all event data
    for (let index = 0; index < paramEventsData.length; index++) {

        currentEventNumberOnPage = currentEventNumberOnPage + 1;

        // Add pagination elemet for the new page
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

        elText = "Event # " + (paramEventsData.length - index).toString() +
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

        // All one event data to screen
        showOneEventData(eventDate, eventNumber);

    } // for (let index = 0; index < paramEventsData.length; index++)

    // End pagination
    elID = getPaginationId(0);
    elText = '<span class="page-link">Next</span>';
    liPagination = crtHTTPElem('li', ulEvListPagination, 'page-item', '', '', elText, elID);

    // Save the maximum page number
    evData = $divEventList.data();
    evData.maxpagenumber = maxPageNumber;
    $divEventList.data(evData);

    // Show current screen page
    showCurrentScreenPage();

    // On the sidebar hide periods, which are not presented in the event list
    hideInactivePeriods();

    return null;

} // cbListAllEvents()

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

        // Previous number
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
    $divEventList.data(evData);

    // Show current screen page
    showCurrentScreenPage("CHANGE_PAGE");

    return null;

} // changeCurrentScreenPage()

// Refresh screen screen when <Search> field changed
function searchFieldChanged(ev) {

    screenSearchMode = JSON.parse(sessionStorage.getItem('screenSearchMode'));

    if (inputSearchMain.value.trim() != screenSearchMode.searchtext.trim()) {
        screenSearchMode.searchtext = inputSearchMain.value.trim();

        if (screenSearchMode.searchtext != "") {
            screenSearchMode.searchmode = "SEARCH";
            sessionStorage.setItem('screenSearchMode', JSON.stringify(screenSearchMode));
        } else {
            // If search field was cleared then refresh screen
            screenSearchMode.searchmode = "INIT";
            sessionStorage.setItem('screenSearchMode', JSON.stringify(screenSearchMode));
            zbLastEventList(screenSearchMode.searchmode);
        }
    }

    return;

} // searchFieldChanged()

// Refresh screen screen when <Search> button pressed
function searchButtonPressed(ev) {

    screenSearchMode.searchmode = "SEARCH";
    screenSearchMode.searchtext = inputSearchMain.value.trim();
    sessionStorage.setItem('screenSearchMode', JSON.stringify(screenSearchMode));
    zbLastEventList(screenSearchMode.searchmode);

    return;

} // searchButtonPressed()

// On the sidebar hide periods, which are not presented in the event list
function hideInactivePeriods() {

    var arrPeriods = ulPeriodList.getElementsByTagName('li');
    var period, periodData = {};

    var arrEvents = ulEventList.getElementsByTagName('li');
    var event, eventData = {}, eventDateObj = {};

    var foundEventForPeriod = false;

    for (let index = 0; index < arrPeriods.length; index++) {
        period = arrPeriods[index];
        periodData = $("#" + period.id).data();
        // periodData = {periodyear: 2019, periodmonth: 7, periodcount: 12}
        foundEventForPeriod = false;

        for (let index2 = 0; index2 < arrEvents.length; index2++) {
            event = arrEvents[index2];
            eventData = $("#" + event.id).data();
            // eventData = {pagenumber: 1, evdate: "20190714", evnumber: "3", evactive: "Y", evloaded: "Y"}

            eventDateObj = cvtCharDate8ToObj(eventData.evdate);
            // eventDateObj = {yyyy: 2019, mm: 7, dd: 14}

            if (periodData.periodyear == eventDateObj.yyyy &&
                periodData.periodmonth == eventDateObj.mm) {
                foundEventForPeriod = true;
                break;
            }
        } // for (let index2 = 0; index2 < arrEvents.length; index2++)

        // Hide sidebar period which does not have events
        if (!foundEventForPeriod) {
            let liPeriod = document.getElementById(period.id);
            liPeriod.style.display = "none";
        } // if (!foundEventForPeriod)

    } // for (let index = 0; index < arrPeriods.length; index++) 

} // hideInactivePeriods()
