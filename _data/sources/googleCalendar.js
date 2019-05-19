const fetch = require("node-fetch");

class googleCalendar {
    constructor() {

    }

    async getData() {
       return new Promise(resolve => {
        resolve([[],[]]);
       });
    }

    async getGroups() {
        return new Promise(resolve => {
             resolve([]);
        });
    }

    async getEvents() {
        return new Promise(resolve => {
             resolve([]);
        });
    }
}


module.exports = googleCalendar;