const nn = (txt) => (txt || "").toLowerCase().replace(/[^a-z0-9]/gi,'');
let events = [], groups = [], eventsSearchElement, groupsSearchElement;

window.addEventListener("load", function () {
    
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

    groupsSearchElement.addEventListener("keyup", searchGroups);
    document.getElementById("groupsClearSearch").addEventListener("click", clearGroupsSearch);

    eventsSearchElement.addEventListener("keyup", searchEvent);
    document.getElementById("eventsClearSearch").addEventListener("click", clearEventSearch);

    let url = window.location.href.replace("index.html", "");

    getData(`${url}data/events.json`, data => {
        events = data;
    })
    getData(`${url}data/groups.json`, data => {
        groups = data;
    })
});

function searchGroups() {
    if (groupsSearchElement.value.length == 0) { clearGroupsSearch(); return; }
    let results = groups.filter(group => nn(group.name).includes(nn(groupsSearchElement.value))).map(dataToHTML.groupHTML).join("");
    document.getElementById("groupsItems").innerHTML = results;
}

function searchEvent() {
    if (eventsSearchElement.value.length == 0) { clearEventSearch(); return; }
    let value = eventsSearchElement.value;
    let results = events.filter(event => !nn(event.name).includes(nn(value)) && !nn(event.desc).includes(nn(value)) && !nn(event.location).includes(nn(value))).map(dataToHTML.eventHTML).join("");
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

function apsc(e) {
    return Array.prototype.slice.call(e)
}