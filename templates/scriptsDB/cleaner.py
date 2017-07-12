#!/usr/bin/python3
from sys import *
import csv
from shutil import copyfile
from os import remove
def usage():
	print("usage : cleaner.py AAAANom.csv")

i = 0
f = open("clean_"+argv[1],"w")
if len(argv) == 2:
	with open(argv[1], 'rb') as csvfile:
		handler = csv.reader(csvfile, delimiter=";")
		for row in handler:
			for el in row:
				el = el.replace('"','')
				el = el.replace(" ",'')
				i+=1
				if i < len(row):
					f.write(el+";")
				else:
					f.write(el)
					i = 0
			f.write("\n")
	f.close()
	copyfile("clean_"+argv[1],argv[1])
	remove("clean_"+argv[1])
else:
	usage()

