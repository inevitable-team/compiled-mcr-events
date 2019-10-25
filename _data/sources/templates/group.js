module.exports = class group {
    constructor(name, desc, link, img, members, sinceLast, untilNext, source, ad) {
        this.name = name;
        this.desc = desc.replace(/(<([^>]+)>)/ig, "");
        this.link = link;
        this.img = img;
        this.members = members;
        this.sinceLast = sinceLast;
        this.untilNext = untilNext;
        this.source = source;
        this.ad = ad;
    }
}