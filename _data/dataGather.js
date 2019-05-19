let meetup = require("./sources/meetup"),
    eventbrite = require("./sources/eventbrite"),
    googleCalendar = require("./sources/googleCalendar");

class group {
    constructor(name, link, img, members, sinceLast, untilNext, source, ad) {
        this.name = name;
        this.link = link;
        this.img = img;
        this.members = members;
        this.sinceLast = sinceLast;
        this.untilNext = untilNext;
        this.source = source;
        this.ad = ad;
    }
}

class event {
    constructor(name, link, location, desc, startTimeISO, endTimeISO, going, capacity, paid, cost, groupName, groupLink, source, ad) {
        this.name = name;
        this.link = link;
        this.location = location;
        this.desc = desc;
        this.startTimeISO = startTimeISO;
        this.endTimeISO = endTimeISO;
        this.going = going;
        this.capacity = capacity;
        this.paid = paid;
        this.cost = cost;
        this.groupName = groupName;
        this.groupLink = groupLink;
        this.source = source;
        this.ad = ad;
    }
}

class dataGather {
    constructor() {
        this.eventbrite = new eventbrite();
        this.meetup = new meetup();
        this.googleCalendar = new googleCalendar();
    }

    async getData() {

    }
}

module.exports = dataGather;