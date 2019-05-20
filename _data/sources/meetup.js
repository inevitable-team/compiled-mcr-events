const fetch = require("node-fetch"),
    group = require("./templates/group"),
    event = require("./templates/event");

class meetup {
    constructor() {
        this.groups = require("./groupIds/meetup");
        this.apiEvents = (group) => 'https://api.meetup.com/' + group + '/events';
        this.apiPastEvents = (group) => 'https://api.meetup.com/' + group + '/events?desc=true&status=past';
        this.apiGroup = (group) => 'https://api.meetup.com/' + group;
        this.header = {
            method: 'GET',
            dataType: 'jsonp'
        };
        // Converters
        this.groupClass = group;
        this.eventClass = event;
        this.group = (group) => new this.groupClass(name, link, img, members, sinceLast, untilNext, source, ad);
        this.event = (event) => new this.eventClass(event.name, event.link, this.rtnVenue(event), this.removeHTML(event.description || ""), event.time, event.time + (event.duration || 7200000), event.yes_rsvp_count, event.rsvp_limit || Infinity, event.hasOwnProperty('fee') ? false : true, this.rtnFee(event), event.group.name, "https://www.meetup.com/" + event.group.urlname, "Meetup", false);
    }

    rtnFee(event) {
        return event.hasOwnProperty('fee') ? ((event.fee.currency == "GBP") ? "£" : event.fee.currency) + (Math.round(event.fee.amount * 100) / 100) : null;
    }

    rtnVenue(event) {
        let venueName = (event.hasOwnProperty('venue')) ? event.venue.name : "N/A";
        let venueAddress = (event.hasOwnProperty('venue')) ? event.venue.address_1 : "";
        let venuePostcode = (event.hasOwnProperty('venue')) ? event.venue.city : "";
        let venue = (venueName == "N/A") ? "N/A" : venueName + ' - ' + venueAddress + ' (' + venuePostcode + ')';
        return venue.replace("undefined", "").replace("undefined", "").replace(' - ()', "");
    }

    async getData() {
        return new Promise(resolve => {
            resolve([
                [],
                []
            ]);
        });
    }

    async getGroups() {
        return new Promise(resolve => {
            resolve([]);
        });
    }

    async getEvents() {
        return new Promise(resolve => {
            Promise.all(this.groups.map(groupId => fetch(this.apiEvents(groupId), this.header))).then(responses =>
                Promise.all(responses.map(res => res.text()))
            ).then(texts => {
                let json = texts.map(t => JSON.parse(t));
                let converted = [].concat(...json).filter(e => !e.hasOwnProperty("errors")).map(this.event);
                resolve(converted);
            })
        })
    }

    removeHTML(html) {
        return html.replace(/(<([^>]+)>)/ig, "");
    }
}

new meetup().getEvents().then(console.log)


module.exports = meetup;