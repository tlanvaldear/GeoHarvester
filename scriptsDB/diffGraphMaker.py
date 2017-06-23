#!/usr/bin/python3

from neo4j.v1 import GraphDatabase, basic_auth


def usage():
	print("usage : diffGraphMaker.py NODETYPE1 NODETYPE2")


if len(argv) == 3:
	nodetype1 = argv[1]
    nodetype2 = argv[2]
    # CREATE NODE FOR EACH ONE SEEN ON MATCH(n:nodetype) WITH UNIQUE CONSTRAINT ON IT, BY CREATING A CSV FILE
    # FOR EACH EDGE SEEN ON MATCH (n:nodetype)-[r]->(m) RETURN r :
    ##          MAKE IT GO INTO THE DICTIONARY d{source:|target:|year:}
    ##          IF ONE IS SEEN ON EACH YEAR, MAKE IT year:x
    ##          CREATE EDGES WITH THOSE CONSTRAINTS : SOURCE/TARGET/YEAR(5|7|x) BY CREATING A CSV FILE OF THE DICTIONARY
    ##          CREATE CYPHER COMMAND THAT WILL READ THE 3 CSV FILES AND IMPORT THEM ON NodeOall
else:
	usage()
