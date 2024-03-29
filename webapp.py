#!/usr/bin/python
# -*- coding: utf-8 -*-

from flask import *
from socket import *
import sys
from neo4j.v1 import GraphDatabase, basic_auth

#NE PAS MODIFIER LA LIGNE SUIVANTE
app = Flask(__name__)

driver = GraphDatabase.driver("bolt://localhost", auth=basic_auth("neo4j", "tv38çqPL"))
session = driver.session()

@app.route("/graph")
def home():
  labels = []
  i = 0
  clr = '#000000'
  jsondict = {}
  for n in session.run("MATCH (n) RETURN DISTINCT LABELS(n)"):
    labels.append(n[0][0])
  for lab in labels:
    nl = {}
    jsondict[lab] = ""
    jsondict[lab] += "{"
    for n in session.run("MATCH (n:"+lab+")-[r]->(m) RETURN id(n),id(m),id(r),r.year"):
      if lab == "NodeOall":
        if i == 0:
          jsondict[lab] += '"edges" : ['
          i+=1
        else:
          jsondict[lab] += ','
        clr = '#000000'
        typ = 'curvedArrow'
        if n[3] == '2015':
          clr = '#b5c2ec'
          typ = 'dashed'
        elif n[3] == '2017':
          clr = '#ff6666'
          typ = 'dotted'
        jsondict[lab] += '{"source" : "'+repr(n[0])+'", "target" : "'+repr(n[1])+'", "id" : "'+repr(n[2])+'", "color" : "'+clr+'", "type" : "'+typ+'"}'
      else:
        if i == 0:
          jsondict[lab] += u'"edges" : ['
          i+=1
        else:
          jsondict[lab] += ','
        clr = '#000000'
        jsondict[lab] += '{"source" : "'+repr(n[0])+'", "target" : "'+repr(n[1])+'", "id" : "'+repr(n[2])+'", "color" : "'+clr+'"}'

    jsondict[lab] += '],'
    i = 0
    for n in session.run("MATCH (n:"+lab+") RETURN DISTINCT n.name,n.year,id(n)"):
      if n[0] not in nl and lab == "NodeOall":
        nl[n[0]] = n[1]
        if i == 0:
          jsondict[lab] += '"nodes" : ['
          i+=1
        else:
          jsondict[lab] += ','
        clr = '#000000'
        typ = 'equilateral'
        if n[1] == '2015':
          clr = '#b5c2ec'
          typ = 'square'
        elif n[1] == '2017':
          clr = '#ff6666'
          typ = 'diamond'
        jsondict[lab] += '{ "label" : "'+n[0].replace("'","")+'", "id" : "'+repr(n[2])+'", "color" : "'+clr+'", "type" : "'+typ+'", "x" : "Math.random()", "y": "Math.random()" }'
      elif n[0] not in nl:
        nl[n[0]] = n[1]
        if i == 0:
          jsondict[lab] += '"nodes" : ['
          i+=1
        else:
          jsondict[lab] += ','
        clr = '#000000'
        jsondict[lab] += '{ "label" : "'+n[0].replace("'","")+'", "id" : "'+repr(n[2])+'", "color" : "'+clr+'", "x" : "Math.random()", "y": "Math.random()" }'
    jsondict[lab] += ']}'
    i = 0
  return render_template("safe.html", dmq=json.loads(jsondict['Node2015']), dmds=json.loads(jsondict['Node2017']), b=json.loads(jsondict['NodeOall']))

@app.route("/<any>/<el>")
def plug(any,el):
  return app.send_static_file(el)

@app.route("/", methods=['GET', 'POST'])
def h():
  if request.method == 'POST':
    typ = request.form['typ']
    if typ == 'graph':
      return redirect(url_for("home"), code=302)
    if typ == 'cpch':
      return redirect(url_for("hist"), code=302)
    return typ

  form = ''
  form += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'
  form += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>'
  form += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>'

  form+='<center>'
  form+='<div class="jumbotron">'
  form+= '<h1>Visuels comparatifs</h1>'
  form+= '<p>Issus de données récupérées dans le cadre du projet GEOBS</p>'
  form+= '<p><font size=2>Moissonnage des IDG de 2015 et 2017</font></p>'
  form+='</div>'
  form+='</center>'

  form+= '<div style="margin:200px; margin-top:30px;">'
  form += '<form action="" method="post" class="form-horizontal" data-fv-framework="bootstrap" data-fv-icon-valid="glyphicon glyphicon-ok"  data-fv-icon-invalid="glyphicon glyphicon-remove"  data-fv-icon-validating="glyphicon glyphicon-refresh">'
  form += '<div class ="form-group>"'
  form +='<p>Type de visuel souhaité : <select name="typ"> <option value="graph">Graphe des moissons</option><option value="cpch">Histogramme du degré de moisson</option></select></p>'
  form +='<input style="max-width:100px; display:inline;" class="form-control" type="submit" value="Envoyer" />'
  form +='</div>'
  form+='</form>'
  form+='</div>'

  return form

@app.route("/hist", methods=['GET', 'POST'])
def hist():
  if request.method == 'POST':
    if request.form['mode'] == "cpc":
      return redirect(url_for("cpc"),code=302)
    dmq = {}
    dmds = {}
    both = {}
    side = "(k)-[]-()"
    if request.form['mode'] == "In":
      side = "(k)<-[]-()"
    elif request.form['mode'] == "Out":
      side = "(k)-[]->()"

    for count in session.run("MATCH (k:NodeOall) return k.name,k.year "):
      if count[1] != 'x':
        for acount in session.run("MATCH (k:Node"+count[1]+" {name:'"+count[0].replace("'","")+"'}) with k, size("+side+") as degree return degree"):
          both[count[0]] = [acount[0] if count[1] == "2015" else 0,0 if count[1] == "2015" else acount[0]]
      else:
        for acount in session.run("MATCH (k:Node2015 {name: '"+count[0]+"'}) with k, size("+side+") as degree return degree"):
          dmq[count[0]] = acount[0]
        for bcount in session.run("MATCH (k:Node2017 {name: '"+count[0]+"'}) with k, size("+side+") as degree return degree"):
          dmds[count[0]] = bcount[0]
        both[count[0]] = [dmq[count[0]],dmds[count[0]]]
    # f =open("static/hist.csv","w")
    # f.write(u"SIG,Moissons 2015,Moissons 2017\n")
    csv = [['SIG','Moissons 2015','Moissons 2017']]
    # keylist = both.keys()
    keylist = sorted(both)
    # keylist.sort()
    for key in keylist:
      if both[key] == [0,0]:
        continue
      else:
        # f.write(u''+key.replace("(","").replace(")","")+','+repr(value[0])+','+repr(value[1])+'\n')
        csv.append([key.replace("(","").replace(")",""), repr(both[key][0]), repr(both[key][1])])
    return render_template("histogram.html", data=csv)
  form = ''
  form += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'
  form += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>'
  form += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>'

  form+='<center>'
  form+='<div class="jumbotron">'
  form+= '<h1>Sélection du type de visuel</h1>'
  form+= '<p>Histogrammes</p>'
  form+='</div>'
  form+='</center>'

  form+= '<div style="margin:200px; margin-top:30px;">'
  form += '<form action="" method="post" class="form-horizontal" data-fv-framework="bootstrap" data-fv-icon-valid="glyphicon glyphicon-ok"  data-fv-icon-invalid="glyphicon glyphicon-remove"  data-fv-icon-validating="glyphicon glyphicon-refresh">'
  form += '<div class ="form-group>"'
  form +='<p>Type de visuel souhaité : <select name="mode"> <option value="In">Degré entrant</option><option value="Out">Degré Sortant</option> <option value="InOut">Degré</option><option value="cpc">Cas par Cas</option></select></p>'
  form +='<input style="max-width:100px; display:inline;" class="form-control" type="submit" value="Envoyer" />'
  form +='</div>'
  form+='</form>'
  form+='</div>'

  return form

@app.route("/cpc",methods=['GET', 'POST'])
def cpc():
  if request.method == 'POST':
    nodes = []
    sig= request.form['sig'].replace(" ","")
    both = {}
    dmq = {}
    dmds = {}
    side = ["(k)-[]-()","(k)<-[]-()","(k)-[]->()"]
    here = False
    for name in session.run("MATCH (n:NodeOall) return n.name ORDER BY n.name"):
      nodes.append(name[0])
    for el in nodes:
      if el.upper() == sig.upper():
        here = True
        for y in session.run("MATCH (k:NodeOall {name: '"+el+"'}) return k.year"):
          if y[0] != 'x':
            for acount in session.run("MATCH (k:Node"+y[0]+" {name:'"+el.replace("'","")+"'}) with k, size((k)-[]-()) as degree return degree"):
              both["Somme"] = [acount[0] if y[0] == "2015" else 0,0 if y[0] == "2015" else acount[0]]
            for acount in session.run("MATCH (k:Node"+y[0]+" {name:'"+el.replace("'","")+"'}) with k, size((k)<-[]-()) as degree return degree"):
              both["Moissonné"] = [acount[0] if y[0] == "2015" else 0,0 if y[0] == "2015" else acount[0]]
            for acount in session.run("MATCH (k:Node"+y[0]+" {name:'"+el.replace("'","")+"'}) with k, size((k)-[]->()) as degree return degree"):
              both["Moissonneur"] = [acount[0] if y[0] == "2015" else 0,0 if y[0] == "2015" else acount[0]]
          else:
            i=0
            for sid in side:
              for acount in session.run("MATCH (k:Node2015 {name: '"+el.replace("'","")+"'}) with k, size("+sid+") as degree return degree"):
                dmq[el.replace("'","")] = acount[0]
              for bcount in session.run("MATCH (k:Node2017 {name: '"+el.replace("'","")+"'}) with k, size("+sid+") as degree return degree"):
                dmds[el.replace("'","")] = bcount[0]
              if i == 0:
                both["Somme"] = [dmq[el.replace("'","")],dmds[el.replace("'","")]]
              elif i == 1:
                both["Moissonné"] = [dmq[el.replace("'","")],dmds[el.replace("'","")]]
              elif i == 2:
                both["Moissonneur"] = [dmq[el.replace("'","")],dmds[el.replace("'","")]]
              i += 1
          # f =open("static/hist.csv","w")
        csv = [['SIG','Moissons 2015','Moissons 2017']]
        for key,value in both.items():
          if value == [0,0]:
            continue
          else:
            # f.write(u''+key.replace("(","").replace(")","")+','+repr(value[0])+','+repr(value[1])+'\n')
            csv.append([key.replace("(","").replace(")",""), repr(value[0]), repr(value[1])])
    if here == False:
      return redirect("/cpc",code=302)
    return render_template("histcpc.html", idg=sig, data=csv)

  form = ''
  form += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'
  form += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>'
  form += '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>'
  form+='<center>'
  form+='<div class="jumbotron">'
  form+= '<h1>Formulaire de recherche</h1>'
  form+= '<p>Observez les différences de moissonnage par année d\'un SIG spécifique</p>'
  form+='</div>'
  form+='</center>'
  form+= '<div style="margin:200px; margin-top:30px;">'
  form += '<form action="" method="post" id="trollSelect" class="form-horizontal" data-fv-framework="bootstrap" data-fv-icon-valid="glyphicon glyphicon-ok"  data-fv-icon-invalid="glyphicon glyphicon-remove"  data-fv-icon-validating="glyphicon glyphicon-refresh">'
  form += '<div class ="form-group>"'
  form +='<p>IDG : <select name="sig">'
  for idgl in session.run("MATCH (n:NodeOall) return n.name ORDER BY n.name"):
    form += '<option value='+str(idgl[0])+'>'+str(idgl[0])+'</option>'
  form += '</select></p>'
  form +='<input style="max-width:100px; display:inline;" class="form-control" type="submit" value="Envoyer" />'
  form +='</div>'
  form+='</form>'
  form+='</div>'
  return form


#NE SURTOUT PAS MODIFIER
if __name__ == "__main__":
   app.run(debug=True)
