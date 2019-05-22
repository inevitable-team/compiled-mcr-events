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

    eventsSearchElement = document.getElementById("eventsClearSearch");
    groupsSearchElement = document.getElementById("groupsSearchBox");

    groupsSearchElement.addEventListener("change", () => searchGroups);
    document.getElementById("groupsClearSearch").addEventListener("click", () => clearGroupsSearch);

    eventsSearchElement.addEventListener("change", () => searchEvent);
    document.getElementById("eventsClearSearch").addEventListener("click", () => clearEventSearch);

    let url = window.location.href.replace("index.html", "");

    getData(`${url}data/events.json`, data => {
        events = data;
    })
    getData(`${url}data/groups.json`, data => {
        groups = data;
    })
});

function searchGroups() {
    document.getElementById("groupsItems").innerHTML = groups.filter(group => nn(group.name).includes(nn(groupsSearchElement.value))).map(dataToHTML.groupHTML).join("");
}

function searchEvent() {
    document.getElementById("eventsItems").innerHTML = events.filter(event => nn(event.name).includes(nn(eventsSearchElement.value)) || nn(event.desc).includes(nn(eventsSearchElement.value)) || nn(event.location).includes(nn(eventsSearchElement.value))).map(dataToHTML.eventsHTML).join("");
}

function clearGroupsSearch() {
    groupsSearchElement.value = "";
    document.getElementById("groupsItems").innerHTML = groups.map(dataToHTML.groupHTML).join("");
}

function clearEventSearch() {
    eventsSearchElement.value = "";
    document.getElementById("eventsItems").innerHTML = events.map(dataToHTML.eventsHTML).join("");

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