const fetch = require("node-fetch");

class eventbrite {
    constructor() {
        this.organizers = require("./groupIds/eventbrite");
        this.baseAPI = "https://www.eventbriteapi.com/v3/";
        this.apiEvents = this.baseAPI + "events/search?organizer.id=";
        this.apiVenue = this.baseAPI + "venues/";
        this.token = "DEUFZCPYAAJE4ZKBNPZX";
        this.params = { headers: { 'Authorization': "Bearer " +  this.token } };
        this.urls = this.organizers.map(g => this.apiEvents + g.id);
        // this.fetch = new fetch();
    }

    async getData() {
        return new Promise(resolve => {
            this.getEvents().then(events => {
                let data = [this.getGroups(), events];
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