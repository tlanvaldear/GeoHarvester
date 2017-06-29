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
>> **TODO** Open multiple graphs (such as `2015 && 2017`), and link them together ~~(node.name ?)~~ **DONE**
>
> **WONTDO** Use Tulip script that makes metaNodes in order to create the families inside the graph
>> Try to display the graph as descending circles
>
> Split-screen and start for graph correlation
>> **Known issue** : borders are useless :frowning: **FIXED ON 06/21**

## 06/21 -
> Corrected another issue with forceAtlas (I don't know how, every other day it just comes back to the "idk, just making everything bounce the hell out of it" state...)
>
> Camera centering on all instances
>
> Graph click connected to every single one
>> **Known issue** : clicking on one graph's node and clicking on the blank part of an other won't clean the first one's edge color. **FIXED ON 06/28**
>
> Border fix by putting coresponding _year_ under its *div*
>
> Dropdown menu to open 2015/2017 or 2015+2017 view
>> **WONTDO** Will create GIS Hierarchy via SVG using Tulip. *See 06/28*
>>
>> **KNOWN ISSUE** opening multiple times the same graph won't erase its previous instance **FIXED ON 06/22**

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
> Added dbImport scripts from Tulip CSVs. see [9f1f347](https://github.com/tlanvaldear/GeoHarvester/commit/9f1f347e066a7ccd4a49e2102ecf187acb4aae4b)
>
> Added color-code and shape-code on diffGraph
>> Set up Color-blind mode in order to avoid visualization difficulties for color-blind people
>
> Replaced Hover-stop for ForceAtlas by Timer.
>
> **KNOWN ISSUE** Opening >2 views leads to errors. Going to watch for this. **FIXED ON 06/28**

## 06/28 -
> Added Progressive mode to see more efficiently differences between 2015 && 2017
>> ~~Still needs edges to be dealt with~~
>
> Fixed issue on Opening >2 views with more patching-up
>
> Set timeout on re-making of ForceAtlas under query()
>
> Fixed **06/21** issue on clickStage event not properly handled
>
> Fixed bug on Color-blind mode that occured if a sigma instance was running inside of a non-displayed container.
>
> Thinking about other visualization tools in order to show more examples of differences

## 06/29 -
> Added research bar to ease specific view on a specific GIS
>
> Added ideas from 06/28 into *ideas.md*
>
> 
