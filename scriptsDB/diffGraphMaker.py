#!/usr/bin/python3
# -*- coding:utf-8 -*-

from neo4j.v1 import GraphDatabase, basic_auth
import sys
driver = GraphDatabase.driver("bolt://localhost", auth=basic_auth("neo4j", "tv38çqPL"))
session = driver.session()
def usage():
	print("usage : diffGraphMaker.py NODETYPE1 NODETYPE2 OverallNodeType")
	print("example : diffGraphMaker.py Node2015 Node2017 NodeOall")


dic_edges = {}
dic_nodes = {}

if len(sys.argv) == 4:
	nodetype1 = sys.argv[1]
	year1 = nodetype1[-4:]
	nodetype2 = sys.argv[2]
	year2 = nodetype2[-4:]
	session.run("CREATE CONSTRAINT ON (n:"+sys.argv[3]+") ASSERT n.name IS UNIQUE;")
	for n in session.run("MATCH (n:"+nodetype1+") RETURN n.name"):
		dic_nodes[n[0]] = year1
	for n in session.run("MATCH (n:"+nodetype2+") RETURN n.name"):
		if n[0] in dic_nodes.keys():
			dic_nodes[n[0]] = "x"
		else:
			dic_nodes[n[0]] = year2
	csv1 = open("nodes.csv","w")
	csv1.write("name;year\n")
	for key, value in dic_nodes.items() :
	    csv1.write(key+";"+value+"\n")
	csv1.close()
	for n in session.run("MATCH (n:"+nodetype1+")-[]->(m) RETURN n.name,m.name"):
		dic_edges[(n[0],n[1])] = year1
	for n in session.run("MATCH (n:"+nodetype2+")-[]->(m) RETURN n.name,m.name"):
		if (n[0],n[1]) in dic_edges.keys():
			dic_edges[(n[0],n[1])] = "x"
		else:
			dic_edges[(n[0],n[1])] = year2

	csv1 = open("edges.csv","w")
	csv1.write("source;destination;year\n")
	for key,value in dic_edges.items():
		csv1.write(key[0]+";"+key[1]+";"+value+"\n")
	csv1.close()
	cypher = open("import.cypher","w")
	cypher.write("USING PERIODIC COMMIT 10000\n")
	cypher.write('Load CSV with headers from "file:///nodes.csv" As csv FIELDTERMINATOR ";"\n')
	cypher.write('CREATE (n:'+sys.argv[3]+' {name: csv.name, year: csv.year});\n\n')
	cypher.write("USING PERIODIC COMMIT 10000\n")
	cypher.write('Load CSV with headers from "file:///edges.csv" As csv FIELDTERMINATOR ";"\n')
	cypher.write('Match (n:'+sys.argv[3]+' {name:csv.source})\n')
	cypher.write('Match (m:'+sys.argv[3]+' {name:csv.destination})\n')
	cypher.write('Merge (n)-[r:MOISSONNE {year:csv.year}]->(m);\n\n')
	cypher.close()

else:
	usage()
