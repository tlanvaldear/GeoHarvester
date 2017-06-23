//TODO:Make JSONfile out of it
// #ff6666 NEW - #b5c2ec NONEXISTANT
var queries = {
  "2015": "MATCH (n:Node2015) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m",
  "2017": "MATCH (n:Node2017) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m",
  "oall": "MATCH (n:Nodeoall) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m",
  "eaniemeanieminymoe" : "MATCH (n)-[r]->(m) RETURN r,n,m",
};
var pwd = '87cEbq9d';
var login = 'neo4j';
var connect = 'http://0.0.0.0:7474';
var xKeep = {};
var yKeep = {};
var cont = [];
var ids = {};
var deflab = {};
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
  queries[label],
  s,
    function(s){
      cont[cont.length] = s;
      cont[cont.length-1].sh = true;
      graphstart(s);
    });
    deflab[label] = "true";
  }
  cont.forEach(function(si){
      if (!si.isForceAtlas2Running() && document.getElementById(si.renderers[0].container.id).style.display != 'block'){
          si.startForceAtlas2();
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
    n.originalColor = n.color;
    n.label = n.neo4j_data['name'];
    s.refresh();
  });
  s.graph.edges().forEach(function(e) {
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
  s.bind('overNode',function(e) {
    //if a node is hovered, stop Forces from calculating
    s.stopForceAtlas2();
  });
  s.bind('clickNode', function(e) {
    var nodeId = e.data.node.id,
        toKeep = s.graph.neighbors(nodeId);
    toKeep[nodeId] = e.data.node;

    s.graph.nodes().forEach(function(n) {
      ids[n.id] = n;
      if (toKeep[n.id])
        n.color = n.originalColor;
      else{
        n.color = '#eee';
        }
      if (n.id == nodeId){
        focus = n;
        s.cameras[0].goTo({x:focus['read_cam0:x'],y:focus['read_cam0:y'],ratio:0.55});
        cont.forEach(function(si){
          if (si != s){
            si.graph.nodes().forEach(function(nn){
                if (nn.label == n.label && !ids[nn.id]){
                  ids[nn.id] = nn;
                  var ev = e;
                  ev.data.node = nn;
                  si.dispatchEvent('clickNode',ev.data);
                  // si.cameras[0].goTo({x:nn['read_cam0:x'],y:nn['read_cam0:y'],ratio:0.55});
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

// Calling neo4j to get all its relationship type
sigma.neo4j.getTypes(
    { url: connect, user:login, password:pwd },
    function(rel) {
        console.log("Relationship types " + rel);
    }
);
// Calling neo4j to get all its node label
sigma.neo4j.getLabels(
    { url: connect, user:login, password:pwd },
    function(labels) {
        console.log("Node labels " + labels);
    }
);
