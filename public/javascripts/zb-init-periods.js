
var divPeriodList, $divPeriodList, idDivPeriodList;
var ulPeriodList, $ulPeriodList, idUlPeriodList;

// Load all periods from server to screen
function zbPeriodList(mode = 'INIT') {

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

        if (mode === 'INIT') {

            idDivPeriodList = "div_period_list";
            idUlPeriodList = "ul_period_list";

            $divPeriodList = $("#" + idDivPeriodList);
            $ulPeriodList = $("#" + idUlPeriodList);
            $ulPeriodList.empty();

            divPeriodList = document.getElementById(idDivPeriodList);
            ulPeriodList = document.getElementById(idUlPeriodList);

            // In pertiod list changed period by mouse click
            $("#" + idUlPeriodList).on("click", "li", function (ev) {
                changeCurrentScreenPeriod(ev);
            });

        }

        var parDataObj = JSON.parse(periodsData);

        for (let index = 0; index < parDataObj.length; index++) {

            liCurrPeriodListId = getSidePeriodId(parDataObj[index]._id.year, parDataObj[index]._id.month);

            elText = '<a href="#section1">' +
                "Period # " + index.toString() +
                "  " +
                parDataObj[index]._id.year +
                "  " +
                parDataObj[index]._id.month +
                "  " +
                parDataObj[index].count +
                "</li>";

            li = crtHTTPElem('li', ulPeriodList, "list-group-item", '', '', elText, liCurrPeriodListId);
            $("#" + liCurrPeriodListId).data({
                periodyear: parDataObj[index]._id.year,
                periodmonth: parDataObj[index]._id.month
            });

            if (index == 0) {
                $("#" + liCurrPeriodListId).addClass('active');
            }

        } // for (let index = 0; index < parDataObj.length; index++)

    } // cbPeriodList() 

    // In pertiod list changed period by mouse click
    function changeCurrentScreenPeriod(event) {

        let idPeriod = "";
        let periodData = {};
        let periodYear = 0;
        let periodMonth = 0;
        let pageNumber = 1;
        let evData = {};
        let elId = "", elData = {}, dateObj = {};

        if (event.target.parentElement.tagName === 'UL') {
            idPeriod = event.target.id;
        } else {
            idPeriod = event.target.parentElement.id;
        }

        periodData = $("#" + idPeriod).data();

        periodYear = periodData.periodyear;
        periodMonth = periodData.periodmonth;

        // Read all events and find on which page
        // this period appears 
        $ulEventList = $("#" + idUlEventList).children();

        for (let i = 0; i < $ulEventList.length; i++) {
            elId = $ulEventList[i].id;
            elData = $("#" + elId).data();

            dateObj = cvtCharDate8ToObj(elData.evdate);

            if (dateObj.yyyy == periodYear && dateObj.mm == periodMonth) {
                pageNumber = elData.pagenumber;
                break;
            }

        }

        // Save new current screen page number
        evData = $divEventList.data();
        evData.currentscreenpage = pageNumber;
        $divEventList.data(evData);
        currentScreenPage = pageNumber;

        // Show active period on side bar navigator
        activateNavBarPeriod(periodYear, periodMonth);

        // Show current screen page
        showCurrentScreenPage();

        return null;

    } // changeCurrentScreenPeriod()

    return;

}
// Activate period on navigation period side bar
function activateNavBarPeriod(parPerYear, parPerMonth) {
    
    $("#" + idUlPeriodList).children().removeClass("active");
    $("#" + getSidePeriodId(parPerYear, parPerMonth)).addClass('active');

    return;

}
