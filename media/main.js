const vscode = acquireVsCodeApi();

const game = {
  //Div where the pets are stored
  div: document.getElementById('pets'),

  //Window
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 2,
  mouse: {
    div: document.getElementById('mouse'),
    pos: new Vec2(),
  },
  gifting: false,

  //Frames & framerate
  frames: 0,  //Frames since game start
  fps: 30,
  
  //List with all the pets
  pets: []
};





 /*$       /$$             /$$
| $$      |__/            | $$
| $$       /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
| $$      | $$ /$$_____/|_  $$_/   /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$_____/
| $$      | $$|  $$$$$$   | $$    | $$$$$$$$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$
| $$      | $$ \____  $$  | $$ /$$| $$_____/| $$  | $$| $$_____/| $$       \____  $$
| $$$$$$$$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$       /$$$$$$$/
|________/|__/|_______/    \___/   \_______/|__/  |__/ \_______/|__/      |______*/

//Messages from VSCode
window.addEventListener('message', event => {
  //The JSON data sent by the extension
  const message = event.data; 

  //Check message type
  switch (message.type.toLowerCase()) {
    //Update gift
    case 'gift':
      game.gifting = !game.gifting;
      break;

    //Create a pet
    case 'add':
      switch (message.specie) {
        //Create a cat
        case 'cat':
          new Cat(message.name, message.color);
          break;

        //Create a dog
        case 'dog':
          new Dog(message.name, message.color);
          break;

        //Create a raccoon
        case 'raccoon':
          new Raccoon(message.name, message.color);
          break;

        //Create a dino
        case 'dino':
          new Dino(message.name, message.color);
          break;

        //Create a turtle
        case 'turtle':
          new Turtle(message.name, message.color);
          break;

        //Create a goat
        case 'goat':
          new Goat(message.name, message.color);
          break;

        //Create a sheep
        case 'sheep':
          new Sheep(message.name, message.color);
          break;

        //Create a ostrich
        case 'ostrich':
          new Ostrich(message.name, message.color);
          break;

        //Create a pig
        case 'pig':
          new Pig(message.name, message.color);
          break;

        //Create a rabbit
        case 'rabbit':
          new Rabbit(message.name, message.color);
          break;

        //Create a chicken
        case 'chicken':
          new Chicken(message.name, message.color);
          break;

        //Create a cow
        case 'cow':
          new Cow(message.name, message.color);
          break;

        //Create a junimo
        case 'junimo':
          new Junimo(message.name, message.color);
          break;
      }
      break;

    //Remove a pet
    case 'remove':
      const pet = game.pets[message.index];
      pet.element.remove()
      game.pets.splice(message.index, 1);
      break;

    //Update background
    case 'background':
      game.div.setAttribute('background', message.value.toLowerCase());
      break;

    //Update scale
    case 'scale':
      switch (message.value.toLowerCase()) {
        case 'small':
          game.scale = 1;
          break;
        case 'medium':
        default:
          game.scale = 2;
          break;
        case 'big':
          game.scale = 3;
          break;
      }
      document.body.style.setProperty('--scale', game.scale);
      onResize();
      break;
  }
});

//Mouse
function showMouse(show) {
  if (typeof show != 'boolean') show = false;
  game.mouse.div.style.opacity = show ? 1 : 0;
}

game.div.onclick = (event) => {
  game.gifting = false;
  showMouse(false);
}

game.div.onmousemove = (event) => {
  game.mouse.pos = new Vec2(event.clientX, event.clientY);
  game.mouse.div.style.left = game.mouse.pos.x + 'px';
  game.mouse.div.style.top = game.mouse.pos.y + 'px';
}

game.div.onmouseenter = (event) => {
  showMouse(game.gifting);
}

game.div.onmouseleave = (event) => {
  showMouse(false);
}

//Resize window
function onResize() {
  //Update game window size
  game.width = window.innerWidth;
  game.height = window.innerHeight;

  //Fit all pets on screen
  game.pets.forEach((pet) => pet.moveTo(pet.pos));
}





 /*$
| $$
| $$        /$$$$$$   /$$$$$$   /$$$$$$
| $$       /$$__  $$ /$$__  $$ /$$__  $$
| $$      | $$  \ $$| $$  \ $$| $$  \ $$
| $$      | $$  | $$| $$  | $$| $$  | $$
| $$$$$$$$|  $$$$$$/|  $$$$$$/| $$$$$$$/
|________/ \______/  \______/ | $$____/
                              | $$
                              | $$
                              |_*/

function update() {
  //Window size changed
  if (game.width != window.innerWidth || game.height != window.innerHeight) onResize();

  //Next frame
  game.frames++;

  //Update pets
  game.pets.forEach((pet) => pet.update());
}





 /*$                           /$$
| $$                          |__/
| $$        /$$$$$$   /$$$$$$  /$$  /$$$$$$$
| $$       /$$__  $$ /$$__  $$| $$ /$$_____/
| $$      | $$  \ $$| $$  \ $$| $$| $$
| $$      | $$  | $$| $$  | $$| $$| $$
| $$$$$$$$|  $$$$$$/|  $$$$$$$| $$|  $$$$$$$
|________/ \______/  \____  $$|__/ \_______/
                     /$$  \ $$ 
                    |  $$$$$$/
                     \_____*/

//Start loop
const timer = setInterval(update, 1000 / game.fps)

//Tell vscode game loaded
vscode.postMessage({ type: 'init' });
//vscode.postMessage({ type: 'error', text: 'bomba' });
//vscode.postMessage({ type: 'info', text: 'bomba' });
