const fetch = require("node-fetch"),
      cheerio = require('cheerio'),
      event = require("./templates/event");

class manchestertechevents {
    constructor() {
        this.url = "https://manchestertechevents.com/";
        this.name = "Manchester Tech Events";
    }

    async getData() {
       return new Promise(async resolve => {
            // Load JSON Data in Page
            let response = await fetch(this.url);
            let body = await response.text();
            let $ = cheerio.load(body);
            let data = JSON.parse($('script[type="application/json"]').get(0).firstChild.data);
            let events = data.props.pageProps.recordMap.block;

            let parsedEvents = Object.keys(events).map(eventId => events[eventId].value).filter(e => e?.["properties"]?.[">~`X"]).map(e => {
                e = e["properties"];
                return new event(
                    e["title"] ? `${e["title"][0][0]} ${e["Z^;n"] ? "(" + e["Z^;n"][0][0] + ")" : ""}` : "",
                    e["L=u~"] ? e["L=u~"][0][0] : "",
                    e["NMxS"] ? e["NMxS"].map(e => e[0]).join(", ") : "",
                    e["BFfG"] ? e["BFfG"][0][0] : "",
                    `${e[">~`X"][0][1][0][1].start_date}T${e[">~`X"][0][1][0][1].start_time}:00Z`,
                    e["HPJU"] ? `${e["HPJU"][0][1][0][1].start_date}T${e["HPJU"][0][1][0][1].start_time}:00Z` : `${e[">~`X"][0][1][0][1].start_date}T${e[">~`X"][0][1][0][1].start_time}:00Z`,
                    null,
                    null,
                    null,
                    null,
                    e["dh`y"] ? e["dh`y"][0][0] : this.name,
                    e["dquW"] ? `mailto:${e["dquW"][0][0]}` : this.url,
                    this.name,
                    false,
                    true,
                    false,
                    [],
                    []
                );
            }).filter(event => new Date(event.startTimeISO) > new Date());

            resolve([[], parsedEvents]);
       });
    }
}

module.exports = manchestertechevents;
