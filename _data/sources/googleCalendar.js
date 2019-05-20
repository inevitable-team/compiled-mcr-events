const fetch = require("node-fetch"),
group = require("./templates/group"),
event = require("./templates/event");

class googleCalendar {
    constructor() {
        // Converters
        this.groupClass = group;
        this.eventClass = event;
        this.group = (group) => new this.groupClass(name, link, img, members, sinceLast, untilNext, source, ad);
        this.event = (event) => new this.eventClass(name, link, location, desc, startTimeISO, endTimeISO, going, capacity, paid, cost, groupName, groupLink, source, ad);
    }

    async getData() {
       return new Promise(resolve => {
        resolve([[],[]]);
       });
    }

    async getGroups() {
        return new Promise(resolve => {
             resolve([]);
        });
    }

    async getEvents() {
        return new Promise(resolve => {
             resolve([]);
        });
    }
}


module.exports = googleCalendar;