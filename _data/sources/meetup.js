const {gql, request} = require("graphql-request"),
    group = require("./templates/group"),
    event = require("./templates/event");

class meetup {
    constructor(token = process.env.MEETUP_TOKEN, requestTimeout = (process.env.REQUEST_TIMEOUT || 0)) {
        this.requestTimeout = requestTimeout;
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
                                isOnline
                            }
                        }
                    }
                    name
                    link
                    topics {
                        name
                    }
                }
            }
        `;
        this.apiPastEvents = (group) => 'https://api.meetup.com/' + group + '/events?desc=true&status=past';
        this.queryGroup = gql`
            query($group: String!) {
                groupByUrlname(urlname: $group) {
                    urlname
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
                    topics {
                      name
                    }
                }
            }
        `;
        // Converters
        this.groupClass = group;
        this.eventClass = event;
        this.group = (group) => new this.groupClass(
            group.groupByUrlname.urlname,
            group.groupByUrlname.name,
            group.groupByUrlname.description || "",
            group.groupByUrlname.link, this.rtnGroupImg(group),
            (group.groupByUrlname.memberships || {count: undefined}).count,
            null,
            null,
            "Meetup",
            group.groupByUrlname.topics.map(t => t.name),
            false
        );
        this.event = (event) => {
                return new this.eventClass(
                    event.title,
                    event.shortUrl,
                    this.rtnEventVenue(event),
                    this.removeHTML(event.description || ""),
                    event.dateTime,
                    event.endTime,
                    event.going,
                    event.maxTickets || Infinity,
                    event.price == null,
                    this.rtnEventFee(event),
                    event.name,
                    event.link,
                    "Meetup",
                    false,
                    event.isOnline,
                    ! event.isOnline,
                    [],
                    event.topics
                );
        };
    }

    rtnGroupImg(group) {
        let thumb = './img/blank_meetup.png';
        if (group.groupByUrlname.hasOwnProperty('logo')) {
            thumb = group.groupByUrlname.logo.baseUrl + group.groupByUrlname.logo.id + '/1000x1000.webp';
        }
        return thumb;
    }

    rtnEventFee(event) {
        return event.price ? ((event.currency == "GBP") ? "£" : event.currency) + (Math.round(event.price * 100) / 100) : null;
    }

    rtnEventVenue(event) {
        if (event.isOnline) return "Online";
        let venueName = (event.venue != null) ? event.venue.name : "N/A";
        let venueAddress = (event.venue != null) ? event.venue.address : "";
        let venuePostcode = (event.venue != null) ? event.venue.postalCode : "";
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
            Promise.all(this.groups.map((groupId, i) => new Promise(resolve => setTimeout(() => resolve(groupId), i*this.requestTimeout)).then(async groupId => {
                console.log('Fetching group details for: ', groupId);
                return await request('https://api.meetup.com/gql', this.queryGroup, {group: groupId,});
            }))).then(responses =>
                Promise.all(responses)
            ).then(texts => {
                let json = texts.filter(e => e.groupByUrlname != null).map(this.group);
                resolve(json);
            })
        })
    }

    async getEvents() {
        return new Promise(resolve => {
            Promise.all(this.groups.map((groupId, i) => new Promise(resolve => setTimeout(() => resolve(groupId), i*this.requestTimeout)).then(async groupId => {
                console.log('Fetching events for: ', groupId);
                return await request('https://api.meetup.com/gql', this.queryEvent, {group: groupId,});
            }))).then(responses =>
                Promise.all(responses)
            ).then(texts => {
                let converted = [].concat(...texts.filter(e => e.groupByUrlname != null).map(group => {
                    return group.groupByUrlname.unifiedEvents.edges.map(event => {
                        event.node.name = group.groupByUrlname.name;
                        event.node.link = group.groupByUrlname.link;
                        event.node.topics = (group.groupByUrlname.topics || []).map(e => e.name);
                        return event.node;
                    });
                })).map(this.event);
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
