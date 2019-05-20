const fetch = require("node-fetch"),
      group = require("./templates/group"),
      event = require("./templates/event");

class eventbrite {
    constructor() {
        this.organizers = require("./groupIds/eventbrite");
        this.baseAPI = "https://www.eventbriteapi.com/v3/";
        this.apiEvents = this.baseAPI + "events/search?organizer.id=";
        this.apiVenue = this.baseAPI + "venues/";
        this.token = "DEUFZCPYAAJE4ZKBNPZX";
        this.params = { headers: { 'Authorization': "Bearer " +  this.token } };
        this.urls = this.organizers.map(g => this.apiEvents + g.id);
        // Converters
        this.groupClass = group;
        this.eventClass = event;
        this.group = (group) => new this.groupClass(group.name, group.url, group.img, null, null, null, "Eventbrite", false);
        this.event = (event) => new this.eventClass(event.name.text, event.url, event.venue, event.description.text || "", event.start.utc, event.end.utc, "going", event.capacity, event.id_free ? false : true, "cost", event.groupName, event.groupLink, "Eventbrite", false);
    }

    async getData() {
        return new Promise(resolve => {
            this.getEvents().then(events => {
                let data = [this.getGroups().map(this.group), events.map(this.event)];
                resolve(data);
            });
        });
    }

    getGroups() {
        return this.organizers;
    }

    async getEvents() {
        return new Promise(resolve => {
            Promise.all(this.urls.map(url => fetch(url, this.params))).then(responses =>
                Promise.all(responses.map(res => res.text()))
            ).then(texts => {
                // Building Events
                let json = texts.map(text => JSON.parse(text))
                .filter(groupEvents => !groupEvents.hasOwnProperty("error_detail"))
                .map(groupEvents => groupEvents.events).map((groupEvents, i) => groupEvents.map(event => {
                    event.groupName = this.organizers[i].name;
                    event.groupLink = this.organizers[i].url;
                    return event;
                }));
                let flatterned = [].concat(...json);
                // Adding Venue Info from ID
                Promise.all(flatterned.map(event => fetch(this.apiVenue + event.venue_id, this.params))).then(responses =>
                    Promise.all(responses.map(res => res.text()))
                ).then(venues => {
                    venues = venues.map(venue => JSON.parse(venue))
                    let data = flatterned.map((event, i) => {
                        event.venue = venues[i].address.localized_address_display;
                        return event;
                    }) // Once all venues have been added, return
                    resolve(data);
                });
            })
        })
    }
}

// new eventbrite().getEvents().then(console.log)

module.exports = eventbrite;