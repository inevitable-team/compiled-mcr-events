# CompiledMCR Events (Manchester Tech Meetups)

This is an aggregator for groups / events across a variety of services, which is then outputted on a website, in a JSON format, and a iCal file (which can be added/shown in a calendar).

OLD VERSION: [https://github.com/Sean12697/MeetupManchesterTech](https://github.com/Sean12697/MeetupManchesterTech)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
    - [Sources](#sources)
        - [Meetup](#meetup)
        - [EventBrite](#eventbrite)
        - [Google Calendar](#google-calendar)
- [Usage](#usage)
- [Deploying](#deploying)
- [Contributing](#contributing)

## Prerequisites

To start using this project, you will need to have the following programs installed:

- [NodeJS](https://nodejs.org/en/)

## Installation

Once you have NodeJS installed, run the following command at the root of the project to download all the dependencies:

```
npm i
```

## Configuration

If you wish to modify the project you will likely wish to modify the following aspects.

### Sources

The source code that pulls in the groups/events from the various sources can be found in [~/_data/dataGather.js](_data/dataGather.js).

This script requires the declaration of class files specified with a `getData()` function that returns a 2D array of `[ [group], [event] ]`.

#### Meetup

The Meetup class uses group IDs from [~/_data/sources/groupIds/meetup.js](_data/sources/groupIds/meetup.js) for now, which can be updated/replaced with ease (no other API requirements).

#### EventBrite

The EventBrite class uses organizations objects from [~/_data/sources/groupIds/eventbrite.js](_data/sources/groupIds/eventbrite.js) for now, which can be updated/replaced with ease.

Eventbrite does require an API key, which can be found on [their website](https://www.eventbrite.com/platform/api-keys/), although a Public key is being used in this example which works.

#### Google Calendar

The Google Calendar class can be found [~/_data/sources/googleCalendar.js](_data/sources/googleCalendar.js), which can be initialized with another Calendar ID, with the example of the TechNW calendar below:

```
this.googleCalendar = new googleCalendar("a73q3trj8bssqjifgolb1q8fr4@group.calendar.google.com", "https://technw.uk/calendar", "TechNW", googleCalendarKey)
```

## Usage

Once installed and configured, you can then run the following command:

```
npm run start
```

Which will then generate the website in the `_site` folder, along with the following files within that folder:

- ical: ~/data/events.ical
- Events JSON: ~/data/events.json
- Groups JSON: ~/data/groups.json

## Deploying

If you wish to deploy this as a service, the recommended way would be to push it to [Netlify](https://www.netlify.com), with `npm start` as the build command and `_site` as the build directory.

## Contributing

This project is part of the much greater CompiledMCR project (infrastructure below), meaning potentially only minor PR's will be accepted for refinements, feature updates and bug fixes.

If you do wish to folk it for another city, please do link back and a central Compiled website will be constructed soon.

![CompiledMCR Project Infrastructure](https://i.imgur.com/80G49TU.png)