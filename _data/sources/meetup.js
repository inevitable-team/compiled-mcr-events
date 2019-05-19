const fetch = require("node-fetch");

class meetup {
    constructor() {
        this.groups = require("./groupIds/meetup");
    }

    async getData() {
        return new Promise(resolve => {
            resolve("");
        });
     }
 
     async getGroups() {
         return new Promise(resolve => {
             resolve("");
         });
     }
 
     async getEvents() {
         return new Promise(resolve => {
             resolve("");
         });
     }
 }


module.exports = meetup;