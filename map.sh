#!/bin/bash


echo "---> Georeferencing the image"

gdal_translate \
-of GTiff \
-r bilinear \
-a_srs EPSG:4326 \
-gcp 12000 0 2.35703 48.8927 \
-gcp 24000 10000 2.43459 48.8501 \
-gcp 12000 20000 2.35703 48.8076 \
-gcp 0 10000 2.27947 48.8501 \
BigMap.png \
BigMap.tif

echo "---> Generate image mosaic"

gdalwarp \
-of GTiff \
BigMap.tif \
BigMapMosaic.tif

echo "---> Generate tiles"

gdal2tiles.py BigMap.tif