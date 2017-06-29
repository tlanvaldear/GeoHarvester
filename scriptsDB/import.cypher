USING PERIODIC COMMIT 10000
Load CSV with headers from "file:///nodes.csv" As csv FIELDTERMINATOR ";"
CREATE (n:NodeOall {name: csv.name, year: csv.year});

USING PERIODIC COMMIT 10000
Load CSV with headers from "file:///edges.csv" As csv FIELDTERMINATOR ";"
Match (n:NodeOall {name:csv.source})
Match (m:NodeOall {name:csv.destination})
Merge (n)-[r:MOISSONNE {year:csv.year}]->(m);

