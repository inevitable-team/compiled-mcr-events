const {gql, request} = require("graphql-request"),
    group = require("./templates/group"),
    event = require("./templates/event");

class meetup {
    constructor(token = process.env.MEETUP_TOKEN) {
        this.groups = require("./groupIds/meetup").filter((value, index, self) => self.indexOf(value) === index);
        this.queryEvent = gql`
            query($group: String!) {
                groupByUrlname(urlname: $group) {
                    unifiedEvents {
                        edges {
                            node {
                                title
                                shortUrl
                                venue {
                                    name
                                    address
                                    postalCode
                                }
                                description
                                dateTime
                                endTime
                                going
                                maxTickets
                                price
                                currency
                            }
                        }
                    }
                    name
                    link
                }
            }
        `;
        this.apiPastEvents = (group) => 'https://api.meetup.com/' + group + '/events?desc=true&status=past';
        this.queryGroup = gql`
            query($group: String!) {
                groupByUrlname(urlname: $group) {
                    id
                    name
                    description
                    link
                    logo {
                        id
                        baseUrl
                    }
                    memberships {
                        count
                    }
                }
            }
        `;
        // Converters
        this.groupClass = group;
        this.eventClass = event;
        this.group = (group) => new this.groupClass(
            group.data.groupByUrlname.link,
            group.data.groupByUrlname.name,
            group.data.groupByUrlname.description || "",
            group.data.groupByUrlname.link, this.rtnGroupImg(group),
            group.data.groupByUrlname.memberships.count,
            null,
            null,
            "Meetup",
            false
        );
        this.event = (event) => {
            if(event.unifiedEvents != null && event.unifiedEvents.edges != null){
                new this.eventClass(
                    event.data.groupByUrlname.unifiedEvents.edges.node.title,
                    event.data.groupByUrlname.unifiedEvents.edges.node.shortUrl,
                    this.rtnEventVenue(event),
                    this.removeHTML(event.data.groupByUrlname.unifiedEvents.edges.node.description || ""),
                    event.data.groupByUrlname.unifiedEvents.edges.node.dateTime,
                    event.data.groupByUrlname.unifiedEvents.edges.node.endTime,
                    event.data.groupByUrlname.unifiedEvents.edges.node.going,
                    event.data.groupByUrlname.unifiedEvents.edges.node.maxTickets || Infinity,
                    event.data.groupByUrlname.unifiedEvents.edges.node.price == null,
                    this.rtnEventFee(event),
                    event.data.groupByUrlname.name,
                    event.data.groupByUrlname.link,
                    "Meetup",
                    false
                );
            }
        };
    }

    rtnGroupImg(group) {
        let thumb = './img/blank_meetup.png';
        if (group.hasOwnProperty('logo')) {
            thumb = group.data.groupByUrlname.logo.baseUrl + group.data.groupByUrlname.logo.id + '/1000x1000.webp';
        }
        return thumb;
    }

    rtnEventFee(event) {
        return event.data.groupByUrlname.unifiedEvents.edges.node.price ? ((event.data.groupByUrlname.unifiedEvents.edges.node.currency == "GBP") ? "£" : event.data.groupByUrlname.unifiedEvents.edges.node.currency) + (Math.round(event.data.groupByUrlname.unifiedEvents.edges.node.price * 100) / 100) : null;
    }

    rtnEventVenue(event) {
        let venueName = (event.data.groupByUrlname.unifiedEvents.edges.node.venue != null) ? event.data.groupByUrlname.unifiedEvents.edges.node.venue.name : "N/A";
        let venueAddress = (event.data.groupByUrlname.unifiedEvents.edges.node.venue != null) ? event.data.groupByUrlname.unifiedEvents.edges.node.venue.address : "";
        let venuePostcode = (event.data.groupByUrlname.unifiedEvents.edges.node.venue != null) ? event.data.groupByUrlname.unifiedEvents.edges.node.venue.postalCode : "";
        let venue = (venueName == "N/A") ? "N/A" : venueName + ' - ' + venueAddress + ' (' + venuePostcode + ')';
        return venue.replace("undefined", "").replace("undefined", "").replace(' - ()', "");
    }

    async getData() {
        return new Promise(resolve => {
            this.getGroups().then(groups => {
                this.getEvents().then(events => {
                    resolve([groups, events]);
                })
            });
        });
    }

    async getGroups() {
        return new Promise(resolve => {
            Promise.all(this.groups.map((groupId, i) => new Promise(resolve => setTimeout(() => resolve(groupId), i*400)).then(async groupId => {
                console.log('Fetching group details for: ', groupId);
                return await request('https://api.meetup.com/gql', this.queryGroup, {group: groupId,});
            }))).then(responses =>
                Promise.all(responses)
            ).then(texts => {
                let json = texts.filter(e => !e.hasOwnProperty("errors")).map(this.group);
                resolve(json);
            })
        })
    }

    async getEvents() {
        return new Promise(resolve => {
            Promise.all(this.groups.map((groupId, i) => new Promise(resolve => setTimeout(() => resolve(groupId), i*400)).then(async groupId => {
                console.log('Fetching events for: ', groupId);
                return await request('https://api.meetup.com/gql', this.queryEvent, {group: groupId,});
            }))).then(responses =>
                Promise.all(responses)
            ).then(texts => {
                let converted = [].concat(...(texts)).filter(e => !e.hasOwnProperty("errors")).map(this.event);
                resolve(converted);
            })
        })
    }

    removeHTML(html) {
        return html.replace(/(<([^>]+)>)/ig, "");
    }
}

// new meetup().getEvents().then(console.log)
// new meetup().getGroups().then(console.log)

module.exports = meetup;
