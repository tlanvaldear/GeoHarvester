// #ff6666 NEW - #b5c2ec NOMOREEXISTANT

var xKeep = {};
var yKeep = {};
var cont = [];
var ids = {};
var deflab = {};
var cbmode = false;
var showlabels = document.getElementById("labelsh").checked; // will check if useful
var queries = {};

var x = document.getElementById("myCheck");
var hide = x.checked;





function showhide(){
  console.log('showlabels: '+showlabels);
  cont.forEach(function(si){
    si.settings('drawLabels',showlabels?true:false);
    si.refresh();
  });
}
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
        if (si.l == "NodeOall"){
            sinstance = si;
            si.graph.nodes().forEach(function(n){
                if (n.type == "square"){
                    n.hidden = false;
                    hide.push(n)
                }
                else if (n.type == "diamond"){
                    n.hidden = true;
                    hide2.push(n);
                }
                si.refresh();
            });
            si.graph.edges().forEach(function(e){
                if (e.type == "dashed"){
                    e.hidden = false;
                    si.refresh();
                    setTimeout(function(){
                        e.hidden = true;
                        si.refresh();
                    }, 5000)
                }
                else if (e.type == "dotted"){
                    e.hidden = true;
                    si.refresh();
                    setTimeout(function(){
                        e.hidden = false;
                        si.refresh();
                    }, 5000)
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
                if (n.type == "square"){
                    n.hidden = true;
                }
                else{
                    n.hidden = false;
                }
                sinstance.refresh();
            }, 5000);
        });
};

function search_s(){
  console.log("search_s");
  var input = document.getElementById("gisearch");
  var ncs = input.value.toUpperCase();
  var focus = null;
  cont.forEach(function(si){
    if (si.l == "NodeOall"){
      si.graph.nodes().forEach(function(n){
        if (n.label.toUpperCase() == ncs){
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
    var fileName = '/json/'+label+'.json'
  console.log("query")
  if (deflab[label] == "true" && document.getElementById('sigma-container-'+label.slice(-4)).style.display == 'block'){
    document.getElementById('sigma-container-'+label.slice(-4)).style.display = 'none';
    return;
  }
  if (!deflab[label]){
      var s = new sigma({
        renderer: {
          container: 'sigma-container-'+label.slice(-4),
          type: 'canvas'
        }});
  sigma.parsers.json(
  fileName,
  s,
    function(s){
      try{
      console.log("New graph")
      cont[cont.length] = s;
      cont[cont.length-1].l = label;
      cont[cont.length-1].explored = false;
      s.graph.nodes().forEach(function(n){
          n.x = Math.cos(Math.PI * 2 * Number(n.id) / 111);
          n.y = Math.sin(Math.PI * 2 * Number(n.id) / 111);
          s.refresh();
      });
      var frListener = sigma.layouts.fruchtermanReingold.configure(s, {
        iterations: 500,
        easing: 'quadraticInOut',
        duration: 800
      });
      // Bind the events:
      frListener.bind('start stop interpolate', function(e) {
        console.log(e.type);
      });
      // Start the Fruchterman-Reingold algorithm:
      sigma.layouts.fruchtermanReingold.start(s);
      graphstart(s);
    }
    catch(e){
      if (e instanceof TypeError){
        alert("JavaScript encountered a TypeError. Resetting everything and requerying...")
        deflab = {}
        query(label)
      }
    }
    });
    deflab[label] = "true";
    document.getElementById('sigma-container-'+label.slice(-4)).style.display = 'block';
    return;
  }
  document.getElementById('sigma-container-'+label.slice(-4)).style.display = 'block';
  cont.forEach(function(si){
    if (si.l == label){
      sigma.layouts.fruchtermanReingold.start(si);
    }
  });
}
function graphstart(s) {
  console.log("Graphstart")
//Params for Directed graph
s.settings('defaultEdgeType', 'curvedArrow');
s.settings('minArrowSize', 10);
s.settings('drawLabels',showlabels?true:false);
s.settings('labelAlignment',"top")
//Camera for recentering on node after click
s.addCamera('cam0');
var listener = s.configNoverlap({nodeMargin: 1.5, scaleNodes: 1.05, gridSize: 75, duration: 1});
var focus;
  // We first need to save the original colors of our
  // nodes and edges, like this:
  s.graph.nodes().forEach(function(n) {
      if (n.type == "square"){
          if (cbmode == true){
              n.color = '#000'
          }
          else{
              n.color = '#b5c2ec';
        }
        n.noeuds = "Élément moisson 2015 non subsistant"
      }
      else if (n.type == "diamond"){
          if (cbmode == true){
              n.color = '#000';
          }
          else{
              n.color = '#ff6666'; // orange
        }
        n.noeuds = "Élément nouveau moisson 2017"
      }
      else {
        n.noeuds = "Élément commun"
      }
    n.originalColor = n.color;
    s.refresh();
  });
  s.graph.edges().forEach(function(e) {
      if (e.type == "dashed"){
          if (cbmode == true){
              e.color = '#000';
          }
          else{
              e.color = '#b5c2ec';
        }
        e.aretes = "Élément moisson 2015 non subsistant"
      }
      else if (e.type == "dotted"){
          if (cbmode == true){
              e.color = '#000';
        }
        else{
            e.color = '#ff6666';
        }
        e.aretes = "Élément nouveau moisson 2017"
      }
      else {
        e.type = 'curvedArrow';
        e.aretes = 'Élément commun'
      }
    e.originalColor = e.color;
    s.refresh;
  });
//   s.startForceAtlas2({
//         linLogMode: true,
//         outboundAttractionDistribution: !1,
//         adjustSizes: !1,
//         edgeWeightInfluence: 0,
//         scalingRatio: 1,
//         strongGravityMode: !1,
//         gravity: 1,
//         barnesHutOptimize: true,
//         barnesHutTheta: 0.5,
//         slowDown: 1,
//         startingIterations: 1,
//         iterationsPerRender: 1,
//         worker: true
//     });
//   setTimeout( function(){
//       s.stopForceAtlas2();
//       s.startNoverlap();
// }, 5000);
  s.bind('clickNode', function(e) {
    var nodeId = e.data.node.id,
        toKeep = s.graph.neighbors(nodeId);
    toKeep[nodeId] = e.data.node;

    s.graph.nodes().forEach(function(n) {
      ids[nodeId] = n;
      if (toKeep[n.id]){
        n.color = n.originalColor;
        n.hidden = false;
      }
      else{
        n.color = '#eee';
        n.hidden = hide;
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
          if (toKeep[e.source] && toKeep[e.target]){
            e.color = e.originalColor;
            e.hidden = false;
          }
          else{
            e.color = '#eee';
            e.hidden = hide;
          }
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
          n.hidden = false;
          if (focus != null){
                  si.cameras[0].goTo({x:0,y:0,ratio:1});
              }

          });
          si.graph.edges().forEach(function(e) {
            e.color = e.originalColor;
            e.hidden = false;
          });
          si.refresh();
      });
  focus = null;
  s.refresh();
  });
  if (s.l == "NodeOall"){
    var palet = {
      sch: {
        yearn: {
          'Élément commun' : 'equilateral',
          'Élément moisson 2015 non subsistant': 'square',
          'Élément nouveau moisson 2017': 'diamond'
        },
        yeare: {
          'Élément commun': 'curvedArrow',
          'Élément moisson 2015 non subsistant': 'dashed',
          'Élément nouveau moisson 2017': 'dotted'
        }
      }
    };
    var styl = {
      nodes: {
        type:{
          by: 'noeuds',
          scheme: 'sch.yearn'
        }
      },
      edges: {
        type: {
          by: 'aretes',
          scheme: 'sch.yeare'
        }
      }
    };

    var design = sigma.plugins.design(s, {
      palette: palet,
      styles: styl
    });
    design.apply()
    var legendPlugin;
    s.settings('legendWidth',300)
    legendPlugin = sigma.plugins.legend(s);
    legendPlugin.setExternalCSS(['http://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css']);
    legendPlugin.setPlacement('right');
    legendPlugin.draw();
  }
}
// Add a method to the graph model that returns an
// object with out neighbors of a node inside:

sigma.classes.graph.addMethod('neighbors', function(nodeId) {
        var i,
            neighbors = {},
            index = this.outNeighborsIndex.get(nodeId).keyList() || {};
            for (i = 0; i < index.length; i++) {
                neighbors[index[i]] = this.nodesIndex.get(index[i]);
            }
        return neighbors;
});



//
