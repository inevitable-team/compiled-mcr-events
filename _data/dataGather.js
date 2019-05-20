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
                let groups = data.reduce((total, curr) => total.concat(curr[0]), []).sort((a, b) => a.groupName - b.groupName);
                let events = data.reduce((total, curr) => total.concat(curr[1]), []).sort((a, b) => {
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    return 0;
                });
                resolve([groups, events]);
            })
        });
    }
}

module.exports = dataGather;