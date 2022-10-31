// https://caolan.org/posts/writing_for_node_and_the_browser.html
(function(exports){

    exports.months = new Map([
        [1, 'January'],
        [2, 'February'],
        [3, 'March'],
        [4, 'April'],
        [5, 'May'],
        [6, 'June'],
        [7, 'July'],
        [8, 'August'],
        [9, 'September'],
        [10, 'October'],
        [11, 'November'],
        [12, 'December']
    ]);
    
    exports.abvMonths = new Map([
        [1, 'Jan'],
        [2, 'Feb'],
        [3, 'March'],
        [4, 'Apr'],
        [5, 'May'],
        [6, 'Jun'],
        [7, 'Jul'],
        [8, 'Aug'],
        [9, 'Sept'],
        [10, 'Oct'],
        [11, 'Nov'],
        [12, 'Dec']
    ]);

    exports.abvDays = new Map([
        [0, "Sun"],
        [1, "Mon"],
        [2, "Tue"],
        [3, "Wed"],
        [4, "Thur"],
        [5, "Fri"],
        [6, "Sat"]
    ]);

    exports.eventHTML = event => {
        return `
            <div class="item">
                <p class="date blue">${exports.htmlDate(event.startTimeISO)} - ${exports.htmlDate(event.endTimeISO)}</p>
                <h3 class="title"><a target="_blank" href="${event.link}" rel="noreferrer">${event.name}</a></h3>
                <p class="eventName gray"><a target="_blank" href="${event.groupLink}" rel="noreferrer">${event.groupName}</a> | ${event.source}</p>
                <div class="locationDiv">
                    <img class="locationImg" src="./img/location.svg" alt="Location Icon">
                    <p class="location gray">${event.location || "Location Unavailable"}</p>
                </div>
            </div>
        `
    }

    exports.groupHTML = group => {
        return `
        <div class="group">
            <div class="groupImg"><img src="${group.img || "http://www.afglaw.co.uk/wp-content/uploads/2018/07/blank-user.png"}"></div>
            <div class="groupText">
                <p class="groupName">${group.name}</p>
                <p>Members: ${group.members || "N/A"}<br>${group.links.map(link => '<a href="' + link.link + '" target="_blank" rel="noreferrer"><img src="./img/icons/' + link.type + '.png"></a>').join("")}</p>
            </div>
        </div>
        `
    }

    exports.htmlDate = string => {
        let date = new Date(string);
        return `${exports.abvDays.get(date.getDay())}, ${exports.abvMonths.get(date.getMonth()+1)} ${date.getDate()}, ${exports.timeConvert(date)}`;
    }

    exports.timeConvert = date => {
        let ampm, x, i =
            `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() == 0 ? "00" : date.getMinutes()}`;
        if (i.substring(0, 2) > 12) {
            ampm = "PM";
            x = i.substring(0, 2) % 12 + ":" + i.substring(3, 5) + " " + ampm;
        } else {
            ampm = "AM";
            x = i.substring(0, 2) + ":" + i.substring(3, 5) + " " + ampm;
        }
        return x.substr(0, 1) == "0" ? x.slice(1) : x;
    }

    exports.formatDate = date => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }

   exports.test = function(){
        return 'hello world'
    };

})(typeof exports === 'undefined'? this['dataToHTML']={}: exports);
