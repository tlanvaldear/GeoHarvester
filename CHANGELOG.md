#GeoHarvester

## 06/19 -
> Started Neo4j + SigmaJS implementation
>
> Added forceAtlas layout
>
> Created repository
>

## 06/20 -
> Corrected issues with forceAtlas and overlapping nodes/edges using sigma.Noverlap
>
> Started camera centering on selected node
>> **TODO** Open multiple graphs (such as `2015 && 2017`), and link them together ~~(node.name ?)~~
>
> **TODO** Use Tulip script that makes metaNodes in order to create the families inside the graph
>> Try to display the graph as descending circles
>
> Split-screen and start for graph correlation
>> **Known issue** : borders are useless :frowning:

## 06/21 -
> Corrected another issue with forceAtlas (I don't know how, every other day it just comes back to the "idk, just making everything bounce the hell out of it" state...)
>
> Camera centering on all instances
>
> Graph click connected to every single one
>> **Known issue** : clicking on one graph's node and clicking on the blank part of an other won't clean the first one's edge color.
>
> Border fix by putting coresponding _year_ under its *div*
>
> Dropdown menu to open 2015/2017 or 2015+2017 view
>> **WIP** Will create GIS Hierarchy via SVG using Tulip.
>>
>> **KNOWN ISSUE** opening multiple times the same graph won't erase its previous instance

## 06/22 -
> Replaced Dropdown Menu by Buttons.
>> Edited ` query(label)` in order to fix 06/21's issue #2
>
> **TODO** link zoom/pan inbetween all opened containers
>
> Put JSApp on js/index.js

## 06/23 -
> Fixed "*bug*" on the Button trigger event that led browser's js console to crash
>> Changes made to the code: Removed Doctype.
>
> Graphs that were hidden back by the user are now actualized to the current selection if any (restarts forceAtlas for the moment)
>
> Switched to Canvas Mode to make graphs great again with more seeable arrows

## 06/26 -
> Added diffGraph that shows differences between two years
>
> Added script to create a diffGraph from two years' nodes already in the database
>
> Added color-code and shape-code on diffGraph
>> Set up Color-blind mode in order to avoid visualization difficulties for color-blind people
>
