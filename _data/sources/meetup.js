const {gql, request} = require("graphql-request"),
    group = require("./templates/group"),
    event = require("./templates/event");

class meetup {
    constructor(token = process.env.MEETUP_TOKEN, requestTimeout = (process.env.REQUEST_TIMEOUT || 0)) {
        this.requestTimeout = requestTimeout;
        this.groups = require("./groupIds/meetup").filter((value, index, self) => self.indexOf(value) === index);

        // Helper function for retrying async functions with exponential backoff
        this.retryAsync = async (fn, retries = 3, delay = 1000) => {
            try {
                return await fn();
            } catch (error) {
                if (retries === 0) throw error;
                await new Promise(res => setTimeout(res, delay));
                return this.retryAsync(fn, retries - 1, delay * 2);
            }
        };

        this.queryEvent = gql`
            query($group: String!) {
                groupByUrlname(urlname: $group) {
                        events {
                            edges {
                                    node {
                                    title
                                    eventUrl
                                    venues {
                                        name
                                        address
                                        postalCode
                                    }
                                    description
                                    dateTime
                                    endTime
                                    rsvps {
                                    yesCount
                                    }
                                    maxTickets
                                    }
                            }
                        }
                        name
                        link
                        activeTopics {
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
                    keyGroupPhoto {
                        id
                        baseUrl
                    }
                    memberships {
                        totalCount
                    }
                    activeTopics {
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
            (group.groupByUrlname.memberships || {totalCount: undefined}).totalCount,
            null,
            null,
            "Meetup",
            group.groupByUrlname.activeTopics.map(t => t.name),
            false
        );
        this.event = (event) => {
                return new this.eventClass(
                    event.title,
                    event.eventUrl,
                    this.rtnEventVenue(event),
                    this.removeHTML(event.description || ""),
                    event.dateTime,
                    event.endTime,
                    event.rsvps.yesCount,
                    event.maxTickets || Infinity,
                    null,
                    null,
                    event.name,
                    event.link,
                    "Meetup",
                    false,
                    event.venues.some(event => event.name == "Online event"),
                    event.venues.some(event => event.name != "Online event"),
                    [],
                    event.activeTopics
                );
        };
    }

    rtnGroupImg(group) {
        let thumb = './img/blank_meetup.png';
        if (group.groupByUrlname.hasOwnProperty('keyGroupPhoto')) {
            if (group.groupByUrlname.keyGroupPhoto != null) thumb = "https://secure-content.meetupstatic.com/images/classic-events/" + group.groupByUrlname.keyGroupPhoto.id + '/1000x1000.webp';
        }
        return thumb;
    }

    rtnEventFee(event) {
        return event.price ? ((event.currency == "GBP") ? "£" : event.currency) + (Math.round(event.price * 100) / 100) : null;
    }

    rtnEventVenue(event) {
        let inPersonVenues = event.venues.filter(venue => venue.name != "Online event");
        if (inPersonVenues.length == 0) return "Online";
        let mainVenue = inPersonVenues[0];
        let venueName = (mainVenue != null) ? mainVenue.name : "N/A";
        let venueAddress = (mainVenue != null) ? mainVenue.address : "";
        let venuePostcode = (mainVenue != null) ? mainVenue.postalCode : "";
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
                try {
                    return await this.retryAsync(() => request('https://api.meetup.com/gql-ext', this.queryGroup, {group: groupId}));
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        console.warn(`Warning: Group not found: ${groupId}`);
                        return null;
                    }
                    // For other errors, log warning and return null to continue processing other groups
                    console.warn(`Warning: Failed to fetch group details for ${groupId}: ${error.message}`);
                    return null;
                }
            }))).then(responses =>
                Promise.all(responses)
            ).then(texts => {
                let json = texts.filter(e => e != null && e.groupByUrlname != null).map(this.group);
                resolve(json);
            })
        })
    }

    async getEvents() {
        return new Promise(resolve => {
            Promise.all(this.groups.map((groupId, i) => new Promise(resolve => setTimeout(() => resolve(groupId), i*this.requestTimeout)).then(async groupId => {
                console.log('Fetching events for: ', groupId);
                return await this.retryAsync(() => request('https://api.meetup.com/gql-ext', this.queryEvent, {group: groupId,}));
            }))).then(responses =>
                Promise.all(responses)
            ).then(texts => {
                let converted = [].concat(...texts.filter(e => e.groupByUrlname != null).map(group => {
                    return group.groupByUrlname.events.edges.map(event => {
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
