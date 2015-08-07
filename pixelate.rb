require 'RMagick'
include Magick

#declare parameters that multiply to 100
$shrinkValue = 0.02
image = ImageList.new("sunset.jpg")
#while $shrinkValue < 1.055 do
    smallImage = image.scale($shrinkValue)
    $growValue = 5000
byebug    largeImage = smallImage.scale($growValue)
    largeImage.write("sunset#$shrinkValue.jpg")
    $shrinkValue = $shrinkValue + 0.005
#end

exit
