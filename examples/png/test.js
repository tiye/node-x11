//var logo = require('./node-png').readPng('./node-logo.png');
var logo = require('./node-png').readPng(process.argv[2]);
var x11 = require('../../lib/x11');

var Exposure = x11.eventMask.Exposure;
var KeyPress = x11.eventMask.KeyPress;
var KeyRelease = x11.eventMask.KeyRelease;
var ButtonPress = x11.eventMask.ButtonPress;
var ButtonRelease = x11.eventMask.ButtonRelease;
var PointerMotion = x11.eventMask.PointerMotion;

x11.createClient(function(display)
{
    var X = display.client;
    X.require('big-requests', function(BigReq)
    {
         X.require('render', function(Render) {
             X.Render = Render;
             BigReq.Enable(function(maxLen)
             {
       
      var root = display.screen[0].root;
      var white = display.screen[0].white_pixel;
      var black = display.screen[0].black_pixel;
  
      var win = X.AllocID();
      X.CreateWindow(
         win, root,
         0, 0, logo.width, logo.height,
         1, 1, 0,
         {
             backgroundPixel: white, eventMask: Exposure|KeyPress|ButtonPress|PointerMotion
         }
      );
      X.MapWindow(win);

      var gc = X.AllocID();
      X.CreateGC(gc, win);

      var pixmaplogo = X.AllocID();
      X.CreatePixmap(pixmaplogo, win, 24, logo.width, logo.height);
      X.PolyFillRectangle(pixmaplogo, gc, [0, 0, 1000, 1000]);
      X.PutImage(2, pixmaplogo, gc, logo.width, logo.height, 0, 0, 0, 24, logo.data);
      
      var piclogo = X.AllocID();
      Render.CreatePicture(piclogo, pixmaplogo, Render.rgb24);
      
      var picWin = X.AllocID();
      Render.CreatePicture(picWin, win, Render.rgb24);

X.on('event', function(ev) {
        if (ev.type == 12) // expose
        {
             Render.Composite(3, piclogo, 0, picWin, 0, 0, 0, 0, 0, 0, logo.width, logo.height);
        }
});

X.on('error', function(err) {
    console.log(err);
});

             });
         });
    });
});
