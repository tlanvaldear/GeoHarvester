# GeoHarvester
May 15 - July 28 / Geographic data visualization and analysis | GIS-to-GIS harvesting progression visualization webapp

# Dependencies

[Neo4j 3.0](https://neo4j.com/download/?ref=home) - Used as support for graph data

[Sigma.js](https://github.com/jacomyal/sigma.js) - Graph drawing library

CSV Files to import into Neo4j

# How to use

- Import your data to Neo4j.

- Start your Neo4j server

- Setup your password into `index.html`

- Edit `neo4j/conf/neo4j.conf` file in order to open access to `0.0.0.0`

- If not on a webserver, use `python -m SimpleHTTPServer` in the root directory of *GeoHarvester*

- Connect to [0.0.0.0:8000](http://0.0.0.0:8000) 
