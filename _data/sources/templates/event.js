module.exports = class event {
    constructor(name, link, location, desc, startTimeISO, endTimeISO, going, capacity, free, cost, groupName, groupLink, source, ad, is_online_event, is_offline_event, cats, topics) {
        this.name = name;
        this.link = link;
        this.location = location;
        this.desc = desc;
        this.startTimeISO = startTimeISO;
        this.endTimeISO = endTimeISO;
        this.going = going;
        this.capacity = capacity;
        this.free = free;
        this.cost = cost;
        this.groupName = groupName;
        this.groupLink = groupLink;
        this.source = source;
        this.ad = ad;
        this.is_online_event = is_online_event;
        this.is_offline_event = is_offline_event;
        this.cats = cats;
        this.topics = topics;
    }
}