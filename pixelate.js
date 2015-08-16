var fs = require('fs');
var im= require('imagemagick');
var Q = require('q');

function getInfo(name) {
    var deferred = Q.defer();
    im.identify(name, function(err, features){
        deferred.resolve({
            name: features.artifacts.filename,
            shortName: features.artifacts.filename.substr(0, features.artifacts.filename.indexOf('.')),
            width: features.width
        });
    });
    return deferred.promise;
}

function resizeImage(sourcePath, destPath, size) {
    var deferred = Q.defer();
    im.resize({
        srcPath: sourcePath,
        dstPath: destPath,
        width:   size
    }, function(err, stdout, stderr){
        if (err) deferred.reject(err);
        deferred.resolve();
    });
    return deferred.promise;
}

function convertImage(sourcePath, destPath, width) {
    var deferred = Q.defer();
    im.convert([sourcePath, '-scale', width + 'x' + width, destPath],
        function(err, stdout){
            if (err) deferred.reject(err);
            deferred.resolve(sourcePath);
        });
    return deferred.promise;
}

function deleteImage(sourcePath) {
    var deferred = Q.defer();
    fs.unlink(sourcePath, function (err) {
        if (err) throw err;
        deferred.resolve();
    });
    return deferred.promise;
}

function pixelateImage(info, size) {
    var deferred = Q.defer();
    resizeImage('./Images/' + info.name,
                './Images/' + info.shortName + '-' + size + '-tiny.jpg',
                size)
    .then(function(){
        return convertImage('./Images/' + info.shortName + '-' + size + '-tiny.jpg',
                    './Images/' + info.shortName + '-' + size + '-pixel.jpg',
                    300);
    })
    .then(function(tinyImage) {
        deferred.resolve(
            deleteImage(tinyImage)
        );
    })
    .catch(function(error) {
        deferred.reject(error);
    });
    return deferred.promise;
}

//Read Images Directory, find all image names
fs.readdir('./Images', function (err, files) {
    if (err) throw err;
    for(var i = 0; i < files.length; i++) {
        if(files[i].search('jpg') != -1 || files[i].search('jpeg') != -1){
            getInfo(files[i])
            .then(function(info){
//                return pixelateImage(info, j);
                return Q.all([
                    pixelateImage(info, 5),
                    pixelateImage(info, 6),
                    pixelateImage(info, 7),
                    pixelateImage(info, 8),
                    pixelateImage(info, 9),
                    pixelateImage(info, 10),
                    pixelateImage(info, 11),
                    pixelateImage(info, 12),
                    pixelateImage(info, 13),
                    pixelateImage(info, 14),
                    pixelateImage(info, 15),
                    pixelateImage(info, 16),
                    pixelateImage(info, 17),
                    pixelateImage(info, 18),
                    pixelateImage(info, 19),
                    pixelateImage(info, 20)
                ]);
            })
            .catch(function(error) {
                console.log(error);
            })
            .done();
        }
        else {
            //do nothing
        }
    }
});
