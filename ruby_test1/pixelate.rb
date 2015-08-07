require 'RMagick'
include Magick

#declare parameters that multiply to 100
$shrinkValue = 0.01
image = ImageList.new("sunset.jpg")
while $shrinkValue < 0.055 do
    smallImage = image.scale($shrinkValue)
    smallImage.write("sunset#$shrinkValue.jpg")
    $shrinkValue = $shrinkValue + 0.005
end

exit
