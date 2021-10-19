const fetch = require("node-fetch"),
      group = require("./templates/group"),
      event = require("./templates/event");

class eventbrite {
    constructor(token = process.env.EVENTBRITE_TOKEN) {
        this.organizers = require("./groupIds/eventbrite");
        this.baseAPI = "https://www.eventbriteapi.com/v3/";
        this.apiEvents = this.baseAPI + "organizers/";
        this.apiVenue = this.baseAPI + "venues/";
        this.token = token; // Can be generated from the following link: https://www.eventbrite.com/platform/api-keys/
        this.params = { headers: { 'Authorization': "Bearer " +  this.token } };
        this.urls = this.organizers.map(g => this.apiEvents + g.id + "/events/?status=live");
        // Converters
        this.groupClass = group;
        this.eventClass = event;
        this.group = (group) => new this.groupClass(group.id, group.name, "", group.url, group.img || "./img/blank_eventbrite.jpg", null, null, null, "Eventbrite", false);
        this.event = (event) => {
            let description = "";
            if (event.summary) description = event.summary;
            if (event.description) if (event.description.text) description = event.description.text;
            return new this.eventClass(
                event.name.text,
                event.url,
                event.venue,
                description,
                event.start.utc,
                event.end.utc,
                null,
                event.capacity,
                event.id_free,
                null,
                event.groupName,
                event.groupLink,
                "Eventbrite",
                false,
                event.online_event,
                ! event.online_event,
                [(event.subcategory_id || event.category_id)]
            );
        }
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
                let json = texts.map((text, i) => {
                    try {
                        let parsed = JSON.parse(text);
                        if (parsed.hasOwnProperty("error_description")) console.log(this.urls[i], parsed.error_description);
                        if (parsed.hasOwnProperty("events")) if (parsed.events.length == 0) console.log(this.urls[i], "No upcoming/found events!");
                        return parsed;
                    } catch (e) {
                        console.log("Issue Getting Eventbrite Events: ", e);
                        return { error_detail: "Unknown Error in Parsing!" };
                    }
                }).filter(groupEvents => groupEvents.hasOwnProperty("events"))
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
                    venues = venues.map(venue => JSON.parse(venue));
                    let data = flatterned.map((event, i) => {
                        event.venue = venues[i].address != undefined ? venues[i].address.localized_address_display : "N/A";
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
