const fetch = require("node-fetch"),
      group = require("./templates/group"),
      event = require("./templates/event");

class eventbrite {
    constructor(token = process.env.EVENTBRITE_TOKEN) {
        this.organizers = require("./groupIds/eventbrite");
        this.baseAPI = "https://www.eventbriteapi.com/v3/";
        this.apiEvents = this.baseAPI + "organizers/";
        this.apiVenue = this.baseAPI + "venues/";
        this.apiCat = this.baseAPI + "categories/";
        this.apiTopic = this.baseAPI + "subcategories/";
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
                event.cat,
                event.topic
            );
        }
    }

    getVenues(flattened) {
        return flattened.map(event => fetch(this.apiVenue + event.venue_id, this.params)).then(responses =>
            Promise.all(responses.map(res => res.text())))
    }
    getCats(flattened) {
        return flattened.map(event => fetch(this.apiCat + event.category_id, this.params)).then(responses =>
            Promise.all(responses.map(res => res.text())))
    }
    getTopics(flattened) {
        return flattened.map(event => fetch(this.apiTopic + event.subcategory_id, this.params)).then(responses =>
            Promise.all(responses.map(res => res.text())))
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
                //the IDS can be referenced because the api returns the entire event object
                let flattened = [].concat(...json);
                // Adding Venue Info from ID
                Promise.all(flattened.map(event => fetch(this.apiVenue + event.venue_id, this.params))).then(responses =>
                    Promise.all(responses.map(res => res.text()))
                ).then(venues => {
                    venues = venues.map(venue => JSON.parse(venue));
                    let data = flattened.map((event, i) => {
                        event.venue = venues[i].address != undefined ? venues[i].address.localized_address_display : "N/A";
                        return event;
                    }) // Once all venues have been added, return
                    resolve(data);
                });
                // Adding category Info from ID
                Promise.all(flattened.map(event => fetch(this.apiCat + event.category_id, this.params))).then(responses =>
                    Promise.all(responses.map(res => res.text()))
                ).then(cats => {
                    cats = cats.map(cat => JSON.parse(cat));
                    let data = flattened.map((event, i) => {
                        event.cat = cats[i].name;
                        return event;
                    }) // Once all categories have been added, return
                    resolve(data);
                });
                // Adding topic Info from ID
                Promise.all(flattened.map(event => fetch(this.apiTopic + event.subcategory_id, this.params))).then(responses =>
                    Promise.all(responses.map(res => res.text()))
                ).then(topics => {
                    topics = topics.map(topic => JSON.parse(topic));
                    let data = flattened.map((event, i) => {
                        event.topic = topics[i].name;
                        return event;
                    }) // Once all topics have been added, return
                    resolve(data);
                });
            })
        })
    }
}

// new eventbrite().getEvents().then(console.log)

module.exports = eventbrite;
