let fs = require('fs-extra'),
    shell = require('shelljs'),
    beautify = require('beautify'),
    dataGatherClass = require(`${__dirname}/_data/dataGather`),
    htmlConverter = require(`${__dirname}/_static/scripts/dataToHTML`),
    indexLayout = require(`${__dirname}/_layout/index`);

// Moving static files to site
shell.mkdir('-p', `${__dirname}/_site`);
shell.rm('-rf', `${__dirname}/_site/*`);
fs.copySync(`${__dirname}/_static`, `${__dirname}/_site`);

// Creating Data
shell.mkdir('-p', `${__dirname}/_exports`);
shell.mkdir('-p', `${__dirname}/_site/data`);
let dataGather = new dataGatherClass();
dataGather.getData().then(data => {
    // TESTING
    fs.writeFileSync(`${__dirname}/_exports/groups.json`, beautify(JSON.stringify(data[0]), {format: 'json'}), () => {});
    fs.writeFileSync(`${__dirname}/_exports/events.json`, beautify(JSON.stringify(data[1]), {format: 'json'}), () => {});
    // Output
    fs.writeFileSync(`${__dirname}/_site/data/groups.json`, beautify(JSON.stringify(data[0]), {format: 'json'}), () => {});
    fs.writeFileSync(`${__dirname}/_site/data/events.json`, beautify(JSON.stringify(data[1]), {format: 'json'}), () => {});
    // Creating HTML
    let eventsHTML = data[1].map(htmlConverter.eventHTML).join(""), groupsHTML = data[0].map(htmlConverter.groupHTML).join("");
    let index = indexLayout(eventsHTML, groupsHTML);
    fs.writeFileSync(`${__dirname}/_site/index.html`, index, () => {});
});