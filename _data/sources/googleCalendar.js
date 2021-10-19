const fetch = require("node-fetch"),
group = require("./templates/group"),
event = require("./templates/event");

class googleCalendar {
    constructor(calendarId, urlLink, name, calendarKey) {
        this.url = `https://www.googleapis.com/calendar/v3/calendars/${ calendarId }/events?key=${ calendarKey }&maxResults=9999&singleEvents=true&orderBy=starttime&timeMin=${ this.ISODateString(new Date()) }&timeMax=${ this.ISODateString(new Date((new Date().valueOf()) + 31540000000)) }`;
        this.link = urlLink || "";
        this.name = name || "N/A";
        // Converters
        this.eventClass = event;
        this.event = (event) => new this.eventClass(
            event.summary,
            event.htmlLink,
            event.location,
            this.removeHTML(event.description || ""),
            event.start.dateTime,
            event.end.dateTime || event.start.dateTime,
            null,
            null,
            null,
            null,
            this.name, 
            this.link,
            this.name,
            false,
            this.chkOnline(event.location),
            ! this.chkOnline(event.location),
            null.map(e => e)
        );
    }

    chkOnline(location) {
        if(location == undefined) {
            location = "";
        }
        return !!(location.includes("Online") || location.includes("online"));
    }

    async getData() {
       return new Promise(resolve => {
           this.getEvents().then(events => {
               let filteredEvents = events.filter(e => e.hasOwnProperty("summary")).map(this.event);
               resolve([[], filteredEvents]);
           });
       });
    }

    async getEvents() {
        return new Promise(resolve => {
            fetch(this.url).then((res) => { 
                return res.json()
              }).then((jsonData) => {
                resolve(jsonData.items)
              })
        });
    }

    ISODateString(d) {
        let pad = (n) => n < 10 ? '0' + n : n;
        return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z';
    }

    removeHTML(html) {
        return html.replace(/(<([^>]+)>)/ig, "");
    }
}

module.exports = googleCalendar;
