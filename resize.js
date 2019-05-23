// https://coderwall.com/p/1sxjkw/image-batch-resize-in-node-js
let async = require('async'),
    fs = require('fs'),
    im = require('imagemagick'),
    maxworkers = require('os').cpus().length,
    path = require('path');

function resize(params) {
    var queue = async.queue(resizeimg, maxworkers);

    fs.readdir(params.src, function (err, files) {
        files.forEach(function (file) {
            queue.push({
                src: path.join(params.src, '/', file),
                dest: path.join(params.dest, '/', file),
                width: params.width,
                height: params.height
            })
        });
    });
}

function resizeimg(params, cb) {
    var imoptions = {
        srcPath: params.src,
        dstPath: params.dest
    };
    if (params.width !== undefined) imoptions.width = params.width;
    if (params.height !== undefined) imoptions.height = params.height
    im.resize(imoptions, cb);
}

module.exports = resize;