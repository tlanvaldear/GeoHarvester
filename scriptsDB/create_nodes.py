#!/usr/bin/python3

from sys import *
import csv
from neo4j.v1 import GraphDatabase, basic_auth
driver = GraphDatabase.driver("bolt://localhost", auth=basic_auth("neo4j", "87cEbq9d"))
session = driver.session()



def usage():
	print("usage : create_nodes.py AAAA.csv")


filename = ""

if len(argv) == 2:
	for letter in range(4):
		filename+=argv[1][letter]
	print("Node"+filename)
	session.run("CREATE CONSTRAINT ON (n:Node"+filename+") ASSERT n.name IS UNIQUE")
	session.run('USING PERIODIC COMMIT 1000\n LOAD CSV WITH HEADERS FROM "file:///'+argv[1]+'" AS csv FIELDTERMINATOR ";" \n MERGE (a:Node'+filename+' {name: csv.source}) \nMERGE (b:Node'+filename+' {name: csv.target}) \nMerge (a)-[:MOISSONNE]->(b);')
else:
	usage()

session.close()
