let meetup = require("./sources/meetup"),
    eventbrite = require("./sources/eventbrite"),
    googleCalendar = require("./sources/googleCalendar");

class dataGather {
    constructor() {
        this.eventbrite = new eventbrite();
        this.meetup = new meetup();
        this.googleCalendar = new googleCalendar();
        this.sources = [this.eventbrite, this.meetup, this.googleCalendar];
    }

    async getData() {
        return new Promise(resolve => {
            Promise.all(this.sources.map(api => api.getData())).then(data => {
                let groups = data.reduce((total, curr) => total.concat(curr[0]), []);
                let events = data.reduce((total, curr) => total.concat(curr[1]), []);
                resolve([groups, events]);
            })
        });
    }
}

module.exports = dataGather;