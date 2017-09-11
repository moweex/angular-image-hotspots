Angular Image Hotspots
===================
----------
A directive that create responsive image with overlaying hotspots. You can specify, hotspot position, title, href, and radius. You can specify the position in pixel values or percentage values relative to the image dimensions by using.

Directive Usage
----------

    <img-map
    #imgMap
    src="IMAGE_URL"
    [markers]="POSITION_ARRAY"
    [titles]="TITLES_ARRAY"
    [url]="URLS_ARRAY"
    [markerRadius]="NUMBER"
    [isPercentage]="BOOLEAN">
    </img-map>

 
