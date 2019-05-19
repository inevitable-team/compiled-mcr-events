const fetch = require("node-fetch");

class eventbrite {
    constructor() {
        this.organizers = require("./groupIds/eventbrite");
        this.apiEvents = "https://www.eventbriteapi.com/v3/events/search?organizer.id=";
        this.token = "DEUFZCPYAAJE4ZKBNPZX";
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
            Promise.all(this.urls.map(url => fetch(url, { headers: { 'Authorization': "Bearer " +  this.token } }))).then(responses =>
                Promise.all(responses.map(res => res.text()))
            ).then(texts => {
                let json = texts.map(text => JSON.parse(text))
                .filter(groupEvents => !groupEvents.hasOwnProperty("error_detail"))
                .map(groupEvents => groupEvents.events);
                let flatterned = [].concat(...json);
                resolve(flatterned);
            })
        })
    }
}

// new eventbrite().getEvents().then(console.log)

module.exports = eventbrite;