var select = function (root, selector) {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
};

var loadSvg = function (xmlStr, cb) {
  const xx = new window.DOMParser().parseFromString(xmlStr, "image/svg+xml");

  return cb(xx);
};

// module aliases
let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Vertices = Matter.Vertices,
  Bodies = Matter.Bodies,
  Svg = Matter.Svg;

// create an engine
let engine = Engine.create();
let world = engine.world;

// create a renderer
let render = Render.create({
  element: document.querySelector("#matterjs-canvas-container"),
  engine: engine,
  options: {
    wireframes: false,
    background: "rgb(255,255,255)",
    wireframeStrokeStyle: "transparent",
  },
});

const canvasDOMEl = document.querySelector("#matterjs-canvas-container canvas");

const w = window.innerWidth;
const h = window.innerHeight;

canvasDOMEl.setAttribute("height", `${window.innerHeight}px`);
canvasDOMEl.setAttribute("width", `${window.innerWidth}px`);

let factorX = 50;
let factorY = 150;

let posX = 260;
let posY = 103;

// O
loadPath(
  `M128.52,86.1v-3.35h29.47v3.35c0,16.09,3.6,28.97,9.71,37.41,5.63,7.78,14.13,12.91,27.7,12.91s22.07-5.13,27.7-12.91c6.11-8.44,9.71-21.32,9.71-37.41v-3.35h29.47v3.6c-.04,19.64-4.36,39.09-15.2,54.06-11.36,15.7-28.94,25.08-51.68,25.08s-40.32-9.39-51.68-25.08c-10.88-15.03-15.2-34.58-15.2-54.31Z" style="fill: #000; stroke-width: 0px`,
  posX,
  posY
);

// O 2
loadPath(
  `M128.52,79.4v3.35h29.47v-3.35c0-16.09,3.6-28.97,9.71-37.41,5.63-7.78,14.13-12.91,27.7-12.91s22.07,5.13,27.7,12.91c6.11,8.44,9.71,21.32,9.71,37.41v3.35h29.47v-3.6c-.04-19.64-4.36-39.09-15.2-54.06C235.72,9.39,218.14,0,195.4,0s-40.32,9.39-51.68,25.08c-10.88,15.03-15.2,34.58-15.2,54.31Z" style="fill: #000; stroke-width: 0px`,
  posX,
  posY - 34
);

//rotation bit
loadPath(`M0,35.27L35.27,0l20.84,20.84L20.84,56.11,0,35.27Z`, posX, 87, "red");

posY = 95;

// r
loadPath(`M31.85,0h50.04v30.71H31.85V0Z`, 335, posY - 16.5, "#A6A1FB");
loadPath(`M0,0h31.84v112.59H0V0Z`, 320, posY);

posY = 150;

// smile 1
loadPath(
  `M32.65,53.38c0,162.36,131.61,293.97,293.97,293.97v32.65C146.23,380,0,233.77,0,53.38h32.65Z`,
  250,
  posY,
  "#02AB4E"
);

// smile 2
loadPath(
  `M620.55,53.41c0,162.34-131.6,293.94-293.94,293.94v32.65c180.37,0,326.59-146.22,326.59-326.59h-32.65`,
  408,
  posY
);

// 1
loadPath(
  `M82.14.5v133.76h-31.74V42.18l-28.85,28.85L.71,50.2,50.4.5h0s0,0,0,0h0s0,0,0,0h31.74Z`,
  390,
  posY - 70
);

// 1 part 2
loadPath(`M0,0h117.89v30.61H0V0Z`, 392, posY - 36, "#FFB800");

function loadPath(str, x, y = 0, fillStyle = "black") {
  loadSvg(
    `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 653.2 380">
  <path d="${str}" />`,
    (root) => {
      var vertexSets = select(root, "path").map(function (path) {
        return Vertices.scale(Svg.pathToVertices(path, 0), 0.4, 0.4);
      });

      Composite.add(
        world,
        Bodies.fromVertices(
          x + factorX,
          y + factorY,
          vertexSets,
          {
            render: {
              fillStyle,
              lineWidth: 0,
            },
          },
          true
        )
      );
    }
  );
}

function loadPolygon(str, x, y = 0, zoom = 100, fillStyle = "black") {
  loadSvg(
    `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 653.2 380">
  ${str}`,
    () => {
      Composite.add(
        world,
        Bodies.fromVertices(
          x + factorX,
          y + factorY,
          Vertices.fromPath(str),
          {
            render: {
              fillStyle,
              lineWidth: 0,
            },
          },
          true
        )
      );
    }
  );
}

let ground = Bodies.rectangle(400, 610, 810, 60, {
  isStatic: true,
  force: 0,
  render: {
    fillStyle: "white",
  },
});

Composite.add(world, ground);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.9,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// run the renderer
Render.run(render);

// create runner
let runner = Runner.create();

// // run the engine
setTimeout(() => {
  Runner.run(runner, engine);
}, 2000);

setTimeout(() => {
  const opacity = 1;

  const intervalID = setInterval(() => {
    opacity -= 0.05;
    document.querySelector("#matterjs-canvas-container").style.opacity =
      opacity;

    if (opacity < 0) {
      document.querySelector("#matterjs-canvas-container").remove();
      clearInterval(intervalID);
    }
  });
}, 5000);
