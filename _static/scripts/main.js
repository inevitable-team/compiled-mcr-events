const nn = (txt) => (txt || "").toLowerCase().replace(/[^a-z0-9]/gi, '');
let events = [], groups = [], toastUiEvents = [], eventsSearchElement, groupsSearchElement;
let todayButton, prevButton, nextButton, range, view, Calendar, container, calendar;

window.addEventListener("load", function () {

    checkUrl();

    apsc(document.getElementsByClassName('type')).forEach((t, i) => {
        t.addEventListener('click', function () {
            apsc(document.getElementsByClassName('type')).forEach((x) => {
                x.setAttribute('id', '')
            });
            apsc(document.getElementsByClassName('itemsContainer')).forEach((x) => {
                x.style.display = 'none'
            });
            t.setAttribute('id', 'selected');
            document.getElementsByClassName('itemsContainer')[i].style.display =
                'block';
        });
    })

    document.getElementById("toTop").addEventListener("click", () => window.scrollTo(0, 0));

    eventsSearchElement = document.getElementById("eventsSearchBox");
    groupsSearchElement = document.getElementById("groupsSearchBox");
    todayButton = document.getElementById('today');
    prevButton = document.getElementById('prev');
    nextButton = document.getElementById('next');
    range = document.getElementById('navbar--range');
    view = document.getElementById('view-selection');
    setupToastCalendar();

    groupsSearchElement.addEventListener("keyup", searchGroups);
    document.getElementById("groupsClearSearch").addEventListener("click", clearGroupsSearch);

    eventsSearchElement.addEventListener("keyup", searchEvent);
    document.getElementById("eventsClearSearch").addEventListener("click", clearEventSearch);

    todayButton.addEventListener('click', function () {
        calendar.today();
        displayEvents();
        displayRenderRange();
    });

    prevButton.addEventListener('click', function () {
        calendar.prev();
        displayEvents();
        displayRenderRange();
    });

    nextButton.addEventListener('click', function () {
        calendar.next();
        displayEvents();
        displayRenderRange();
    });

    view.addEventListener('change', function () {
        calendar.changeView(this.value);
        displayEvents();
        displayRenderRange();
    })

    let url = window.location.href.replace("index.html", "");

    getData(`${url}data/events.json`, data => {
        events = data;
        toastUiEvents = mapToastUiEvents(data);
        displayEvents();
        displayRenderRange();
        setDefaultView(view);
    });

    getData(`${url}data/groups.json`, data => {
        groups = data;
    });
});

function setupToastCalendar() {
    Calendar = tui.Calendar;
    container = document.getElementById("calendar");
    calendar = new Calendar(container, {
        defaultView: "month",
        useDetailPopup: true,
        isReadOnly: true,
        calendars: [
            {
                id: "Meetup",
                name: "Meetup",
            },
            {
                id: "Eventbrite",
                name: "Eventbrite",
            },
            {
                id: "TechNW",
                name: "TechNW",
            },
            {
                id: "Manchester Tech Events",
                name: "Manchester Tech Events",
            },
        ],
        week: {
            startDayOfWeek: 1,
            taskView: false,
        },
        month: {
            startDayOfWeek: 1
        },
    });
}

function mapToastUiEvents(events) {
    return events.map((event, index) => {
        return {
            id: index,
            calendarId: event.source,
            title: event.name,
            body: `
            <br/>
            <a href="${event.link}" target="_blank">🖇️ Sign-up Link 🖇️</a>
            <br/>
            <br/>
            ${event.desc}`,
            location: event.location,
            start: event.startTimeISO,
            end: event.endTimeISO,
            isReadOnly: true,
            backgroundColor: "#7eb7e7"
        }
    })
}

function displayEvents() {
    calendar.clear();
    calendar.createEvents(toastUiEvents);
}

function displayRenderRange() {
    range.textContent = getNavbarRange(calendar.getDateRangeStart(), calendar.getDateRangeEnd(), view.value);
}

function setDefaultView(viewElement) {
    viewElement.value = window.innerWidth > 600 ? "month" : "day";
    calendar.changeView(viewElement.value);
}

function searchGroups() {
    if (groupsSearchElement.value.length == 0) { clearGroupsSearch(); return; }
    let results = groups.filter(group => nn(group.name).includes(nn(groupsSearchElement.value))).map(dataToHTML.groupHTML).join("");
    document.getElementById("groupsItems").innerHTML = results;
}

function searchEvent() {
    if (eventsSearchElement.value.length == 0) { clearEventSearch(); return; }
    let value = eventsSearchElement.value;
    let results = events.filter(event => !nn(event.name).includes(nn(value)) || !nn(event.desc).includes(nn(value)) || !nn(event.location).includes(nn(value))).map(dataToHTML.eventHTML).join("");
    document.getElementById("eventsItems").innerHTML = results;
}

function clearGroupsSearch() {
    let results = groups.map(dataToHTML.groupHTML).join("");
    groupsSearchElement.value = "";
    document.getElementById("groupsItems").innerHTML = results;
}

function clearEventSearch() {
    let results = events.map(dataToHTML.eventHTML).join("");
    eventsSearchElement.value = "";
    document.getElementById("eventsItems").innerHTML = results;

}

function checkUrl() {
    if (window.location.hostname == "mcrmeetup.tech") {
        let header = document.getElementsByTagName("header")[0];
        var warning = document.createElement('div');
        warning.innerHTML = 'This URL will no longer be in use, please start using <a href="https://events.compiledmcr.com/">https://events.compiledmcr.com/</a>!';
        warning.className = 'warning';
        header.parentNode.insertBefore(warning, header);
    }
}

function getData(url, callback) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            callback(data);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getNavbarRange(tzStart, tzEnd, viewType) {
    var start = tzStart.toDate();
    var end = tzEnd.toDate();
    var middle;
    if (viewType === 'month') {
        middle = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);

        return moment(middle).format('MMM YYYY');
    }
    if (viewType === 'day') {
        return moment(start).format('DD MMM YYYY');
    }
    if (viewType === 'week') {
        return moment(start).format('DD MMM YYYY') + ' ~ ' + moment(end).format('DD MMM YYYY');
    }
    throw new Error('no view type');
}

function apsc(e) {
    return Array.prototype.slice.call(e)
}