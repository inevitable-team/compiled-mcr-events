let fs = require('fs'),
    shell = require('shelljs'),
    beautify = require('beautify'),
    dataGatherClass = require("./_data/dataGather");

shell.mkdir('-p', './_site');

// TESTING
shell.mkdir('-p', './_exports');
let dataGather = new dataGatherClass();
dataGather.getData().then(data => {
    fs.writeFileSync(`./_exports/groups`, beautify(data[0], {format: 'json'}), () => {});
    fs.writeFileSync(`./_exports/events`, beautify(data[1], {format: 'json'}), () => {});
});

