//TODO:Make JSONfile out of it
// #ff6666 NEW - #b5c2ec NONEXISTANT

//IF YOU ADDDED A BUTTON PLEASE CREATE A NEW LINE FOR THE QUERY
// YOU CAN USE THE BASIC QUERIES THAT ARE ALREADY WRITTEN - JUST
// REMEMBER TO REPLACE THE LAST FOUR LETTERS OF THE NODELABEL TO YOUR
// NEW LABEL'S ONE.
var queries = {
  "2015": "MATCH (n:Node2015) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m",
  "2017": "MATCH (n:Node2017) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m",
  "Oall": "MATCH (n:NodeOall) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m",
};
var pwd = '87cEbq9d';
var login = 'neo4j';
var connect = 'http://0.0.0.0:7474';
var xKeep = {};
var yKeep = {};
var cont = [];
var ids = {};
var deflab = {};
var cbmode = false;

function progressive(){
    var hide = []; //hidden nodes
    var hide2 = []; // in order to sort by 2015 > 2017 quick
    var hidedges = [];
    var showedges = [];
    var i = 0;
    var sinstance;
    cont.forEach(function(si){
        if (si.l == "Oall"){
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
};

function cbmode_e(){
    cbmode = !cbmode;
    cont.forEach(function(si){
        query(si.l);
        si.kill();
    })
    cont = [];
    deflab = {};
    query('Oall');
}
function query(label){
  if (deflab[label] == "true" && document.getElementById('sigma-container-'+label).style.display == 'block'){
    document.getElementById('sigma-container-'+label).style.display = 'none';
    return;
  }
  if (!deflab[label]){
      var s = new sigma({
  renderer: {
    container: document.getElementById('sigma-container-'+label),
    type: 'canvas'
}});
  sigma.neo4j.cypher(
  { url: connect, user: login, password: pwd },
  queries[label], //check for any possibility to use cypher.getLabels in order to get a full queries json object. Can easily be done in Python, though
  s,
    function(s){
      cont[cont.length] = s;
      cont[cont.length-1].l = label;
      cont[cont.length-1].explored = false;
      graphstart(s);
    });
    deflab[label] = "true";
  }
  cont.forEach(function(si){
      if (!si.isForceAtlas2Running() && document.getElementById(si.renderers[0].container.id).style.display != 'block'){
          si.startForceAtlas2();
          setTimeout( function(){
              si.stopForceAtlas2();
        }, 5000);
  }
  });
  document.getElementById('sigma-container-'+label).style.display = 'block';
}
function graphstart(s) {
//Params for Directed graph
s.settings('defaultEdgeType', 'arrow');
s.settings('minArrowSize', 10);
//Camera for recentering on node after click
s.addCamera('cam0');
var listener = s.configNoverlap({nodeMargin: 1, scaleNodes: 1.05, gridSize: 75, duration: 1});
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
    e.originalColor = e.color;
  });
  s.startForceAtlas2({
        linLogMode: true,
        outboundAttractionDistribution: !1,
        adjustSizes: false,
        edgeWeightInfluence: 0,
        scalingRatio: 0.5,
        strongGravityMode: !1,
        gravity: 1,
        barnesHutOptimize: false,
        barnesHutTheta: 0.5,
        slowDown: 1,
        startingIterations: 1,
        iterationsPerRender: 1,
        worker: true
    });
  s.startNoverlap();
  setTimeout( function(){
      s.stopForceAtlas2();
}, 5000);
    //if a node is hovered, stop Forces from calculating
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
                  var ev = e;
                  ev.data.node = nn;
                  si.dispatchEvent('clickNode',ev.data);
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
sigma.classes.graph.addMethod('neighbors', function(nodeId) {
var k,
    neighbors = {},
    index = this.outNeighborsIndex[nodeId] || {};

for (k in index)
  neighbors[k] = this.nodesIndex[k];

return neighbors;
});

// Calling neo4j to get all its node label
// TODO: find a way to get queries(label) working on this one...
// Currently leads to sigma error 'data property on undefined'...
sigma.neo4j.getLabels(
    { url: connect, user:login, password:pwd },
    function(labels) {
        labels.forEach(function(label){
            queries[label] = "MATCH (n:"+label+") OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m"
        });
    }
);
