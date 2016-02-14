var fs = require('fs');
var im= require('imagemagick');
var Q = require('q');

function getInfo(name) {
    var deferred = Q.defer();
    im.identify(name, function(err, features){
        if (err) throw err;
        deferred.resolve({
            name: features.artifacts.filename,
            shortName: features.artifacts.filename.substring(features.artifacts.filename.lastIndexOf('/')+1, features.artifacts.filename.lastIndexOf('.')), //find second '.'
            width: features.width
        });
    });
    return deferred.promise;
}

function makeDirectory(info) {
    var deferred = Q.defer();
    fs.mkdir('./Images/' + info.shortName, function(err) {
        if (err) throw err;
        deferred.resolve(info);
    });
    return deferred.promise;
}

function resizeImage(sourcePath, destPath, size, type) {
    var deferred = Q.defer();
    im.resize({
        srcPath: sourcePath,
        dstPath: destPath,
        width:   size,
        format: type
    }, function(err, stdout, stderr){
        if (err) deferred.reject(err);
        deferred.resolve();
    });
    return deferred.promise;
}

function scaleToWidth(sourcePath, destPath, width) {
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

function pixelateImage(sourcePath, destDir, shortName, size, type) {
    var deferred = Q.defer();
    resizeImage(sourcePath,
                shortName + '-' + size + '-tiny.' + type,
                size, type)
    .then(function(){
        return scaleToWidth(shortName + '-' + size + '-tiny.' + type,
                    './' + destDir + '/' + shortName + '-' + size + '-pixel.' + type,
                    300);
    })
    .then(function(tempImage) {
        deferred.resolve(
            deleteImage(tempImage)
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
        if(files[i].search('jpg') != -1 || files[i].search('jpeg') != -1 || files[i].search('JPG') != -1){
            getInfo('./Images/' + files[i])
            .then(function(info) {
                return makeDirectory(info);
            })
            .then(function(info){
                return Q.all([
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 5, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 6, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 7, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 8, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 9, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 10, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 11, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 12, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 13, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 14, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 15, 'png'),
                    pixelateImage(info.name, './Images/' + info.shortName, info.shortName, 16, 'png')
                ]);
            })
            .catch(function(error) {
                console.log(error);
            })
            .done(function() {
                console.log('DONE');
            });
        }
    }
});
