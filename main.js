
var $canvas = document.querySelector("canvas");
var ctx = $canvas.getContext("2d");

var arts = new ArtAssets();
var arte = new ArtEditor(arts);

var u = new Universe();
var lvl = new Level();

var le = new LevelEditor(u);
var game = new Game(u);
