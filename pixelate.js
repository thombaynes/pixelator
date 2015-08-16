var fs = require('fs');
var im= require('imagemagick');
var Q = require('q');
var shrinkSize = 10;

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
//    }, deferred.resolve(err, stdout, stderr));
    return deferred.promise;
}

function pixelateImage(info, size) {
    var deferred = Q.defer();
    resizeImage('./Images/' + info.name,
                './Images/' + info.shortName + size + '.jpg',
                size)
    .then(function(){
        //TODO use resized to resize the image again.
        deferred.resolve(
            resizeImage( './Images/' + info.shortName + size + '.jpg',
                        './Images/' + info.shortName + info.width + '.jpg',
                        info.width)
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
                return pixelateImage(info, shrinkSize);
            })
            .catch(function(error) {
                console.log(error);
            });
        }
        else {
            //do nothing
        }
    }
    //Loop through images
    //1 make dir with name
    //resize to 5 through 20 pixels across
});
