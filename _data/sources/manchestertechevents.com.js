const fetch = require("node-fetch"),
      event = require("./templates/event");

class manchestertechevents {
    constructor() {
        this.url = "https://manchestertechevents.com/";
        this.name = "Manchester Tech Events";
    }

    async getData() {
        const apiKey = process.env.MANCHESTER_TECH_EVENTS_TOKEN;
        if (!apiKey) {
            console.warn("Warning: MANCHESTER_TECH_EVENTS_TOKEN environment variable is not set.");
            return [[], []];
        }

        try {
            const response = await fetch("https://sxfvfofzpzqhdzogwnjy.supabase.co/rest/v1/rpc/get_approved_events", {
                method: "POST",
                headers: {
                    "apikey": apiKey,
                    "content-type": "application/json"
                }
            });

            if (!response.ok) {
                console.warn(`Warning: Failed to fetch events, status: ${response.status}`);
                return [[], []];
            }

            const data = await response.json();

            // Map API response to event instances with real data
            const parsedEvents = data.map(ev => {
                const startDate = new Date(ev.date);
                const durationMinutes = ev.duration || 0;
                const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

                return new event(
                    ev.title || "No Title",
                    ev.description || "",
                    ev.venue || "",
                    ev.link || "",
                    startDate.toISOString(),
                    endDate.toISOString(),
                    null,
                    null,
                    null,
                    null,
                    this.name,
                    this.url,
                    this.name,
                    false,
                    true,
                    false,
                    [],
                    []
                );
            }).filter(event => new Date(event.startTimeISO) > new Date());

            return [[], parsedEvents];
        } catch (error) {
            console.warn("Warning: Error fetching events:", error);
            return [[], []];
        }
    }
}

module.exports = manchestertechevents;
