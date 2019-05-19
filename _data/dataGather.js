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
        this.sources = [this.eventbrite, this.meetup, this.googleCalendar];
        // Importing Classes
        this.group = group;
        this.event = event;
        // Converters
        this.eventbriteGroup = (group) => new this.group(group.name, group.url, group.img, null, null, null, "Eventbrite", false);
        this.eventbriteEvent = (event) => new this.event(event.name.text, event.url, event.venue, event.description.text || "", event.start.utc, event.end.utc, "going", event.capacity, !event.id_free, "cost", event.groupName, event.groupLink, "Eventbrite", false);
        this.meetupGroup = (group) => new this.group(name, link, img, members, sinceLast, untilNext, source, ad);
        this.meetupEvent = (event) => new this.event(name, link, location, desc, startTimeISO, endTimeISO, going, capacity, paid, cost, groupName, groupLink, source, ad);
        this.googleCalenderGroup = (group) => new this.group(name, link, img, members, sinceLast, untilNext, source, ad);
        this.googleCalenderEvent = (event) => new this.event(name, link, location, desc, startTimeISO, endTimeISO, going, capacity, paid, cost, groupName, groupLink, source, ad);
    }

    async getData() {
        return new Promise(resolve => {
            Promise.all(this.sources.map(api => api.getData())).then(data => {
                console.log(data);
                let groups = [].concat(data[0][0].map(this.eventbriteGroup), data[1][0].map(this.meetupGroup), data[2][0].map(this.googleCalenderGroup))
                let events = [].concat(data[0][1].map(this.eventbriteEvent), data[1][1].map(this.meetupEvent), data[2][1].map(this.googleCalenderEvent))
                resolve([groups, events]);
            })
        });
    }
}

new dataGather().getData().then(res => console.log(res))

module.exports = dataGather;