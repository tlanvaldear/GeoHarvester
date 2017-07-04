// #ff6666 NEW - #b5c2ec NOMOREEXISTANT

var xKeep = {};
var yKeep = {};
var cont = [];
var ids = {};
var deflab = {};
var cbmode = false;
var desc = true; // will check if useful
var queries = {};
var pwd = 'tv38çqPL';
var login = 'neo4j';
var connect = 'http://0.0.0.0:7474';
sigma.neo4j.getLabels(
    { url: connect, user:login, password:pwd },
    function(labels) {
        labels.forEach(function(label){
            queries[label] = "MATCH (n:"+label+") OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m"
        });
    }
);


function progressive(){
  console.log("progressive")
    var hide = []; //hidden nodes
    var hide2 = []; // in order to sort by 2015 > 2017 quick
    var hidedges = [];
    var showedges = [];
    var i = 0;
    var sinstance;
    var div;
    cont.forEach(function(si){
        if (si.l == "Oall"){
            div = document.getElementById(si.renderers[0].container.id);
            div.style.height = "80%";
            div.style.width = "80%";
            sinstance = si;
            si.graph.nodes().forEach(function(n){
                if (n.neo4j_data['year'] == "2015"){
                    n.hidden = false;
                    hide.push(n)
                }
                else if (n.neo4j_data['year'] == "2017"){
                    n.hidden = true;
                    hide2.push(n);
                }
                si.refresh();
            });
            si.graph.edges().forEach(function(e){
                if (e.neo4j_data['year'] == "2015"){
                    e.hidden = false;
                    si.refresh();
                    setTimeout(function(){
                        e.hidden = true;
                        si.refresh();
                    }, 3000)
                }
                else if (e.neo4j_data['year'] == "2017"){
                    e.hidden = true;
                    si.refresh();
                    setTimeout(function(){
                        e.hidden = false;
                        si.refresh();
                    }, 3000)
                }
            });
          };
          hide2.forEach(function(n){
              hide.push(n);
          })
    });
    hide.forEach(function(n){
        i++;
        if (i > hide.length){
            hide = [];
            return;
        }
        setTimeout( function(){
                if (n.neo4j_data['year'] == "2015"){
                    n.hidden = true;
                }
                else{
                    n.hidden = false;
                }
                sinstance.refresh();
            }, 3000);
        });
    setTimeout(function(){
      div.style.height = "50%";
      div.style.width = "50%";
      sinstance.refresh();
    }, 5000);
};

function search_s(){
  console.log("search_s");
  var input = document.getElementById("gisearch");
  var ncs = input.value.toUpperCase();
  console.log(ncs)
  var focus = null;
  cont.forEach(function(si){
    if (si.l == "NodeOall"){
      si.graph.nodes().forEach(function(n){
        if (n.neo4j_data['name'].toUpperCase() == ncs){
          focus = n;
        }
      });
      if (focus != null){
        var evdata;
        evdata = si.getEvent('clickNode');
        evdata.node = focus;
        si.dispatchEvent('clickNode',evdata);
      }
    }
    if (focus == null){
      si.dispatchEvent('clickStage');
    }
    si.explored = false;
  })
}

function cbmode_e(){
  console.log("cbmode_e")
    cbmode = !cbmode;
    cont.forEach(function(si){
        if (deflab[si.l] == "true" && document.getElementById('sigma-container-'+si.l.slice(-4)).style.display == 'none'){
            si.kill();
        }
        else{
        query(si.l);
        si.kill();
    }
    })
    cont = [];
    deflab = {};
    query('NodeOall');
}
function query(label){
  console.log("query")
  if (deflab[label] == "true" && document.getElementById('sigma-container-'+label.slice(-4)).style.display == 'block'){
    document.getElementById('sigma-container-'+label.slice(-4)).style.display = 'none';
    return;
  }
  if (!deflab[label]){
      var s = new sigma({
        renderer: {
          container: document.getElementById('sigma-container-'+label.slice(-4)),
          type: 'canvas'
        }});
  sigma.neo4j.cypher(
  { url: connect, user: login, password: pwd },
  queries[label],
  s,
    function(s){
      try{
      cont[cont.length] = s;
      cont[cont.length-1].l = label;
      cont[cont.length-1].explored = false;
      graphstart(s);
    }
    catch(e){
      if (e instanceof TypeError){
        console.log("hi")
        deflab = {}
        query(label)
      }
    }
    });
    deflab[label] = "true";
  }
  cont.forEach(function(si){
      if (!si.isForceAtlas2Running() && document.getElementById(si.renderers[0].container.id).style.display != 'block'){
          si.startForceAtlas2();
          setTimeout( function(){
              si.stopForceAtlas2();
              si.startNoverlap();
        }, 5000);
  }
  });
  document.getElementById('sigma-container-'+label.slice(-4)).style.display = 'block';
}
function graphstart(s) {
  console.log("Graphstart")
//Params for Directed graph
s.settings('defaultEdgeType', 'curvedArrow');
s.settings('minArrowSize', 10);
s.settings('drawLabels',false);
//Camera for recentering on node after click
s.addCamera('cam0');
var listener = s.configNoverlap({nodeMargin: 1.5, scaleNodes: 1.05, gridSize: 75, duration: 1});
var focus;
  // We first need to save the original colors of our
  // nodes and edges, like this:
  s.graph.nodes().forEach(function(n) {
      if (n.neo4j_data['year'] == "2015"){
          if (cbmode == true){
              n.type = 'square';
          }
          else{
              n.type = 'square';
              n.color = '#b5c2ec';
        }
      }
      else if (n.neo4j_data['year'] == "2017"){
          if (cbmode == true){
              n.type = 'diamond';
          }
          else{
              n.type = 'diamond'
              n.color = '#ff6666'; // orange
        }
      }
    n.originalColor = n.color;
    n.label = n.neo4j_data['name'];
    s.refresh();
  });
  s.graph.edges().forEach(function(e) {
      if (e.neo4j_data['year'] == "2015"){
          if (cbmode == true){
              e.type = 'dashed';
          }
          else{
              e.type = 'dashed';
              e.color = '#b5c2ec';
        }
      }
      else if (e.neo4j_data['year'] == "2017"){
          if (cbmode == true){
              e.type = 'dotted';
        }
        else{
            e.type = 'dotted';
            e.color = '#ff6666';
        }
      }
      else {
        e.type = 'curvedArrow';
      }
    e.originalColor = e.color;
  });
  s.startForceAtlas2({
        linLogMode: true,
        outboundAttractionDistribution: !1,
        adjustSizes: !1,
        edgeWeightInfluence: 0,
        scalingRatio: 1,
        strongGravityMode: !1,
        gravity: 1,
        barnesHutOptimize: true,
        barnesHutTheta: 0.5,
        slowDown: 1,
        startingIterations: 1,
        iterationsPerRender: 1,
        worker: true
    });
  setTimeout( function(){
      s.stopForceAtlas2();
      s.startNoverlap();
}, 5000);
  s.bind('clickNode', function(e) {
    var nodeId = e.data.node.id,
        toKeep = s.graph.neighbors(nodeId);
    toKeep[nodeId] = e.data.node;

    s.graph.nodes().forEach(function(n) {
      ids[nodeId] = n;
      if (toKeep[n.id])
        n.color = n.originalColor;
      else{
        n.color = '#eee';
        }
      if (n.id == nodeId){
        focus = n;
        s.cameras[0].goTo({x:focus['read_cam0:x'],y:focus['read_cam0:y'],ratio:0.55});
        cont.forEach(function(si){
          if (si != s && !si.explored){
              si.explored = true;
            si.graph.nodes().forEach(function(nn){
                if (nn.label == n.label && !ids[nn.id]){
                  ids[nn.id] = nn;
                  var ev = si.getEvent('clickNode');
                  ev.node = nn;
                  si.dispatchEvent('clickNode',ev);
                }
            });
          }
        });
      }
    });
    s.graph.edges().forEach(function(e) {
          if (toKeep[e.source] && toKeep[e.target])
            e.color = e.originalColor;
          else
            e.color = '#eee';
    });

    // Since the data has been modified, we need to
    // call the refresh method to make the colors
    // update effective.
    s.refresh();
    ids = [];
  });
  s.bind('click',function(e){
      cont.forEach(function(si){
          si.explored = false;
      })
  })
  s.bind('clickStage', function(e) {
    cont.forEach(function(si){
        si.graph.nodes().forEach(function(n) {
          n.color = n.originalColor;
          if (focus != null){
                  si.cameras[0].goTo({x:0,y:0,ratio:1});
              }

          });
          si.graph.edges().forEach(function(e) {
            e.color = e.originalColor;
          });
          si.refresh();
      });
  focus = null;
  s.refresh();
  });
}
// Add a method to the graph model that returns an
// object with out neighbors of a node inside:
sigma.classes.graph.addMethod('neighbors1', function(nodeId) {
var k,
    neighbors = {},
    index = this.outNeighborsIndex[nodeId];

for (k in index)
  neighbors[k] = this.nodesIndex[k];

return neighbors;
});

sigma.classes.graph.addMethod('neighbors', function(nodeId) {
        var i,
            neighbors = {},
            index = this.outNeighborsIndex.get(nodeId).keyList() || {};
            for (i = 0; i < index.length; i++) {
                neighbors[index[i]] = this.nodesIndex.get(index[i]);
            }
        return neighbors;
});
