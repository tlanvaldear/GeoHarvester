# GeoHarvester
May 15 - July 28 / Geographic data visualization and analysis | GIS-to-GIS harvesting progression visualization webapp

# Dependencies

[Neo4j 3.0](https://neo4j.com/download/?ref=home) - Used as support for graph data

[Sigma.js](https://github.com/jacomyal/sigma.js) - Graph drawing library

CSV Files to import into Neo4j

# How to use

- Import your data to Neo4j.

- Start your Neo4j server

- Setup your password into `js/index.js`

- Edit your neo4j conf file `YOUR_NEO4J_PATH/conf/neo4j.conf` in order to open access to `0.0.0.0`

- If not on a webserver or using the degraded js version, use `python -m SimpleHTTPServer` in the root directory of *GeoHarvester*
>> Else skip to Using Flask
- Connect to [0.0.0.0:8000](http://0.0.0.0:8000)

## Using Flask
 
  - Start webapp.py in a python virtualenv.
  
  - Connect to your localhost, port 5000.
  

