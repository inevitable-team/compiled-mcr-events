let fs = require('fs-extra'),
    shell = require('shelljs'),
    beautify = require('beautify'),
    Path = require('path'),
    Axios = require('axios'),
    dataGatherClass = require(`${__dirname}/_data/dataGather`),
    htmlConverter = require(`${__dirname}/_static/scripts/dataToHTML`),
    indexLayout = require(`${__dirname}/_layout/index`);

    require('events').EventEmitter.prototype._maxListeners = 0;

// Moving static files to site
shell.mkdir('-p', `${__dirname}/_site`);
shell.rm('-rf', `${__dirname}/_site/*`);
fs.copySync(`${__dirname}/_static`, `${__dirname}/_site`);

// Creating Data
shell.mkdir('-p', `${__dirname}/_exports`);
shell.mkdir('-p', `${__dirname}/_site/data`);
let dataGather = new dataGatherClass();

dataGather.getData().then(data => {
    // Promise.all(data[0].map(downloadImage)).then().then(groupsWithLocalImages => {
    //     data[0] = groupsWithLocalImages;
        // Got data and images
        fs.writeFileSync(`${__dirname}/_exports/groups.json`, beautify(JSON.stringify(data[0]), { format: 'json' }), () => {});
        fs.writeFileSync(`${__dirname}/_exports/events.json`, beautify(JSON.stringify(data[1]), { format: 'json' }), () => {});
        // Output
        fs.writeFileSync(`${__dirname}/_site/data/groups.json`, beautify(JSON.stringify(data[0]), { format: 'json' }), () => {});
        fs.writeFileSync(`${__dirname}/_site/data/events.json`, beautify(JSON.stringify(data[1]), { format: 'json' }), () => {});
        // Creating HTML
        let eventsHTML = data[1].map(htmlConverter.eventHTML).join(""),
            groupsHTML = data[0].map(htmlConverter.groupHTML).join("");
        let index = indexLayout(eventsHTML, groupsHTML);
        fs.writeFileSync(`${__dirname}/_site/index.html`, index, () => {});

        // shell.mkdir('-p', `${__dirname}/_site/imgOptimized`);
        // require("./resize")({
        //     src: './_site/img',
        //     dest: './_site/imgOptimized',
        //     width: 120,
        //     height: 120
        // })
    // });
});

async function downloadImage(group) {
    if (!group.img.includes("http")) return group; // If not image on the internet
    const url = group.img,
    ext = group.img.split(".").pop()
    // name = group.img.split("/").pop(),
    name = group.name.toLowerCase().replace(/[^a-z]+/gi, '-') + "." + ext,
    path = Path.resolve(__dirname, '_site/img', name),
    writer = fs.createWriteStream(path);

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            group.img = `./img/${name}`;
            resolve(group);
        })
        writer.on('error', () => resolve(group))
    })
}