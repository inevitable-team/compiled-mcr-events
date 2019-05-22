let events = [], groups = [];

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

    let url = window.location.href.replace("index.html", "");

    getData(`${url}data/events.json`, data => {
        events = data;
    })
    getData(`${url}data/groups.json`, data => {
        groups = data;
    })
});

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