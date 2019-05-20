module.exports = class event {
    constructor(name, link, location, desc, startTimeISO, endTimeISO, going, capacity, paid, cost, groupName, groupLink, source, ad) {
        this.name = name;
        this.link = link;
        this.location = location;
        this.desc = desc;
        this.startTimeISO = startTimeISO;
        this.endTimeISO = endTimeISO;
        this.going = going;
        this.capacity = capacity;
        this.paid = paid;
        this.cost = cost;
        this.groupName = groupName;
        this.groupLink = groupLink;
        this.source = source;
        this.ad = ad;
    }
}