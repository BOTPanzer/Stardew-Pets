//Util
function random(max) {
  //Random number from 0 to max inclusive
  return Math.floor(Math.random() * (max + 1));
}

function clamp(number, min, max) {
  //Clamp number between min a max
  return Math.min(Math.max(number, min), max);
}

function moveTowards(current, target, delta) {
  const diff = target - current;
  const distance = Math.abs(diff);
  if (distance < delta)
    return target;
  else
    return current + diff / distance * delta;
}

class Vec2 {
  x = 0
  y = 0

  constructor(x, y) {
    this.x = typeof x == 'number' ? x : 0;
    this.y = typeof y == 'number' ? y : this.x;
  }
}

class Timer {
  #active = false;
  #end = 0;
  
  constructor() {}

  get justFinished() { return this.#active && game.frames == this.#end; }
  get finished() { return this.#active && game.frames >= this.#end; }

  count(frames) { 
    this.#active = true;
    this.#end = game.frames + frames; 
  }

  reset() {
    this.#active = false;
  }
}

//Animations
class Animation {

  //Animation info (temporal)
  finished = false;
  #frame = 0;
  #counter = 0;

  //Animation info (permanent)
  #frames = [];
  #speed = 5;   //Duration of each frame
  #loop = true;
  get loop() { return this.#loop; };
  #flip = false;
  get flip() { return this.#flip; };


  constructor(frames, speed, options) {
    //Animation info
    this.#frames = frames;
    this.#speed = speed;
    if (typeof options != 'object') options = {}
    if (typeof options.loop == 'boolean') this.#loop = options.loop;
    if (typeof options.flip == 'boolean') this.#flip = options.flip;

    //Reset current info
    this.reset();
  }

  reset() {
    //Reset current info
    this.#frame = 0;
    this.#counter = 0;
    this.finished = false;
  }

  update() {
    //Not finished
    if (!this.finished) {
      //Add one to counter
      this.#counter++;
  
      //Check if counter finished
      if (this.#counter >= this.#speed) {
        //Counter finished -> Reset it
        this.#counter = 0;
  
        //Next frame
        if (!this.#loop && this.#frame >= this.#frames.length - 1) {
          //Already in last frame & not looping -> Finish animation
          this.finished = true;
        } else {
          //Next frame
          this.#frame++;
          if (this.#frame >= this.#frames.length) this.#frame = 0;
        }
      }
    }

    //Return animation sprite position
    return this.#frames[this.#frame]
  }
}

//AI
class AI {
  
  //States
  static get MOVING() { return 0 };
  static get IDLE() { return 1 };
  static get SPECIAL() { return 2 };

  //AI info
  #pet;
  get pet() { return this.#pet; }
  #state = AI.IDLE;
  get state() { return this.#state; }
  #timer = new Timer();
  get timer() { return this.#timer; }
  #movePos = new Vec2();

  //Moods
  static #moods = ['gigachad', 'happy', 'mad', 'alien', 'pledge'];
  #mood = 'gigachad';
  #moodTimeout;

  //Options (idle)
  #idleDurationBase = 2 * game.fps;       //Minimum duration of idle (in frames)
  #idleDurationVariation = 2 * game.fps;  //Variation of duration for idle (in frames)
  get idleDuration() { return this.#idleDurationBase + random(this.#idleDurationVariation); }

  //Options (sleep)
  #canSleep = true;
  #isSleeping = false;
  #sleepDurationBase = 10 * game.fps;     //Minimum duration of sleep (in frames)
  #sleepDurationVariation = 5 * game.fps; //Variation of duration for sleep (in frames)
  get sleepDuration() { return this.#sleepDurationBase + random(this.#sleepDurationVariation); }

  //Options (special)
  #specialDuration = 2 * game.fps;        //Duration of special (in frames)
  get specialDuration() { return this.#specialDuration; }


  constructor(pet, options) {
    //Save linked pet 
    this.#pet = pet;

    //Random mood
    this.#mood = AI.#moods[Math.floor(Math.random() * AI.#moods.length)];

    //Check options
    if (typeof options == 'object') {
      //Idle options
      if (typeof options.idleDurationBase == 'number') this.#idleDurationBase = options.idleDurationBase;
      if (typeof options.idleDurationVariation == 'number') this.#idleDurationVariation = options.idleDurationVariation;

      //Sleep options
      if (typeof options.canSleep == 'boolean') this.#canSleep = options.canSleep;
      if (typeof options.sleepDurationBase == 'number') this.#sleepDurationBase = options.sleepDurationBase;
      if (typeof options.sleepDurationVariation == 'number') this.#sleepDurationVariation = options.sleepDurationVariation;
      
      //Special options
      if (typeof options.specialDuration == 'number') this.#specialDuration = options.specialDuration;
    }

    //Move towards random point
    this.moveTowardsRandom();
  }

  update() {
    //Get pet (for easier typing)
    const pet = this.pet;

    //State machine
    switch (this.#state) {
      //Moving
      case AI.MOVING: {
        //Move position out of bounds -> Create a new one
        if (this.#movePos.x > pet.maxX || this.#movePos.y > pet.maxY) this.moveTowards(pet.randomPoint);

        //Try to move
        if (this.#movePos.x < pet.pos.x)
          this.moveLeft();
        else if (this.#movePos.x > pet.pos.x)
          this.moveRight();
        else if (this.#movePos.y < pet.pos.y)
          this.moveDown();
        else if (this.#movePos.y > pet.pos.y)
          this.moveUp();
        else 
          this.onMovingEnd();
        break;
      }

      //Idle
      case AI.IDLE: 
        this.onIdle();
        break;

      //Special
      case AI.SPECIAL: 
        this.onSpecial();
        break;
    }
  }

  click() {
    this.setState(AI.SPECIAL);
    if (game.gifting) {
      game.gifting = false;
      showMouse(false);
      this.#mood = 'heart';
    }
    this.showMood();
  }

  //Mood
  showMood() {
    //Show mood
    this.#pet.element.setAttribute('mood', this.#mood);

    //Clear hide mood timeouts & start a new one
    if (this.#moodTimeout != undefined) clearTimeout(this.#moodTimeout)
    this.#moodTimeout = setTimeout(() => {
      this.#pet.element.removeAttribute('mood');
    }, 2000);
  }
  
  //States
  setState(newState) {
    //Not a valid state
    if (typeof newState != 'number') return;

    //Set state
    this.#state = newState;

    //Do something before new state
    switch (newState) {
      //Idle
      case AI.IDLE:
        this.onIdleStart();
        break;

      //Special
      case AI.SPECIAL:
        this.onSpecialStart();
        break;
    }
  }

  //State: IDLE
  onIdleStart() {
    //Animate idle
    this.pet.animate('idle');

    //Start timer
    this.timer.count(this.idleDuration);

    //Reset sleeping
    this.#isSleeping = false;
  }

  onIdle() {
    //Timer didn't finish
    if (!this.timer.finished) return;

    //Reset timer
    this.timer.reset();

    //Check action (75% chance to sleep if it can)
    if (this.#canSleep && !this.#isSleeping && random(99) < 75) {
      //Animate sleep
      this.pet.animate('sleep');

      //Set state to sleep-idle
      this.#isSleeping = true;

      //Start sleep timer
      this.timer.count(this.sleepDuration);
    } else {
      //Move towards a random point
      this.moveTowardsRandom();
    }
  }

  //State: SPECIAL
  onSpecialStart() {
    //Animate special
    this.pet.animate('special', true);

    //Start timer to move again
    this.timer.count(this.specialDuration);
  }

  onSpecial() {
    //Timer didn't finish
    if (!this.timer.finished) return;

    //Reset timer
    this.timer.reset();

    //Move towards a random point
    this.moveTowardsRandom();
  }

  //State: MOVING
  onMovingEnd() {
    //Finished moving -> Go idle
    this.setState(AI.IDLE);
  }

  //Movement
  moveTowards(point) {
    //Change move point
    this.#movePos = point;

    //Set state to moving
    this.setState(AI.MOVING);
  }

  moveTowardsRandom() {
    //Move towards random point
    this.moveTowards(this.pet.randomPoint);
  }

  moveLeft() { 
    const pet = this.pet;
    pet.moveTo(pet.pos.x - 1, pet.pos.y); 
    pet.animate('moveLeft');
  }

  moveRight() { 
    const pet = this.pet;
    pet.moveTo(pet.pos.x + 1, pet.pos.y); 
    pet.animate('moveRight');
  }

  moveUp() { 
    const pet = this.pet;
    pet.moveTo(pet.pos.x, pet.pos.y + 1); 
    pet.animate('moveUp');
  }

  moveDown() { 
    const pet = this.pet;
    pet.moveTo(pet.pos.x, pet.pos.y - 1); 
    pet.animate('moveDown');
  }
}

//Pets
class Pet {

  //Pet info
  #init = false;
  #name = 'Pet';
  get name() { return this.#name; }
  #specie = '';
  get specie() { return this.#specie; }
  #color = 'Pet';
  get color() { return this.#color; }
  #pos = new Vec2();
  get pos() { return this.#pos; }
  #ai;
  get ai() { return this.#ai; }
  #element;
  get element() { return this.#element; }
  size = new Vec2(32);

  //Animations
  #anim;
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5,
      { flip: true }
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'idle': new Animation(
      [[0, 0]], 
      5, 
      { loop: false })
    ,
    'sleep': new Animation(
      [[0, 3], [1, 3]], 
      30, 
      { loop: false }
    ),
    'special': new Animation(
      [[0, 4], [1, 4], [2, 4], [3, 4], [2, 4], [1, 4], [0, 4], [0, 0]], 
      5, 
      { loop: false }
    ),
  };
  
  
  constructor(name, color) {
    //Save pet name & color
    this.#name = name;
    this.#color = color;
  }

  //Init
  init(specie, aiOptions) {
    //Already init
    if (this.#init) return;

    //No specie
    if (specie == '') return;
    this.#specie = specie;

    //Create pet element
    const element = document.createElement('div');
    game.div.appendChild(element);
    this.#element = element;

    //Add classes & move to random point
    element.classList.add('pet');
    element.classList.add(this.specie);
    element.setAttribute('color', this.#color);
    this.respawn();

    //Init AI
    this.#ai = new AI(this, aiOptions);
    element.onclick = () => this.#ai.click();

    //Add pet to pets list
    game.pets.push(this);
  }

  //Update
  update() {
    //Update AI
    this.#ai.update();

    //Update animation sprite
    if (this.#anim != undefined) this.#selectSprite(this.#anim.update())
  }

  //Animations
  animate(name, force) {
    //Not an animation
    if (typeof this.anims[name] != 'object') return;

    //Force animation
    if (typeof force != 'boolean') force = false;

    //Get animation
    let anim = this.anims[name];
    if (Array.isArray(anim)) anim = anim[random(anim.length - 1)];

    //Change current animation & reset it
    if (anim == this.#anim && !force) return;
    this.#anim = anim;
    this.#anim.reset();
    if (anim.flip) this.element.setAttribute('flip', '');
    else this.element.removeAttribute('flip')
  }

  #selectSprite(offset) {
    this.#element.style.setProperty('--offset-x', -(offset[0] * this.size.x) + 'px');
    this.#element.style.setProperty('--offset-y', -(offset[1] * this.size.y) + 'px');
    /*this.#element.style.setProperty('--offset-x', offset[0]);
    this.#element.style.setProperty('--offset-y', offset[1]);*/
  }

  //Movement
  get maxX() { return Math.floor((game.width / game.scale) - this.size.x); }
  get maxY() { return Math.floor((game.height / game.scale) - this.size.y); }
  get randomPoint() { return new Vec2(random(this.maxX), random(this.maxY)); }

  moveTo(x, y) {
    //moveTo(Vec2) instead of moveTo(x, y)
    if (typeof x == 'object') {
      y = x.y;
      x = x.x;
    }

    //Clamp new position
    x = clamp(x, 0, this.maxX);
    y = clamp(y, 0, this.maxY);

    //Update position
    this.#pos.x = x
    this.#pos.y = y

    //Move element
    this.#element.style.setProperty('--position-x', x + 'px');
    this.#element.style.setProperty('--position-y', y + 'px');
    this.#element.style.zIndex = 99999 - y;
  }

  respawn() {
    //Move to random point
    this.moveTo(this.randomPoint);
  }
}

//Pets (cat)
class Cat extends Pet {

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 3], [1, 3], [2, 3], [3, 3]], 
      5
    ),
    'idle': new Animation(
      [[0, 4], [1, 4], [2, 4]], 
      5, 
      { loop: false }
    ),
    'special': new Animation(
      [[0, 5], [1, 5], [2, 5], [3, 5], [0, 5], [2, 4]], 
      5, 
      { loop: false }
    ),
    'sleep': [
      new Animation(
        [[0, 7], [1, 7]], 
        30
      ),
      new Animation(
        [[0, 6], [1, 6], [2, 6], [3, 6]], 
        5, 
        { loop: false }
      )
    ],
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('cat');
  }
}

//Pets (dog)
class Dog extends Pet {

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 3], [1, 3], [2, 3], [3, 3]], 
      5
    ),
    'idle': new Animation(
      [[0, 5], [1, 5], [2, 5], [3, 5]], 
      5, 
      { loop: false })
    ,
    'special': new Animation(
      [[1, 6], [0, 6], [2, 6], [3, 5]], 
      5, 
      { loop: false }
    ),
    'sleep': new Animation(
      [[0, 7], [1, 7]], 
      30
    ),
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('dog');
  }
}

//Pets (tutle)
class Turtle extends Pet {

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 3], [1, 3], [2, 3], [3, 3]], 
      5
    ),
    'idle': new Animation(
      [[0, 4]], 
      5,
      { loop: false }
    ),
    'special': new Animation(
      [[0, 6], [1, 6], [2, 6], [3, 6]], 
      5
    ),
    'sleep': new Animation(
      [[0, 4], [1, 4], [2, 4], [3, 4], [0, 5]], 
      30,
      { loop: false }
    )
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('turtle');
  }
}

//Pets (dino)
class Dino extends Pet {

  //Pet data
  size = new Vec2(16);

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 3], [1, 3], [2, 3], [3, 3]], 
      5
    ),
    'idle': new Animation(
      [[0, 0]], 
      5
    ),
    'special': new Animation(
      [[0, 6], [1, 6], [2, 6], [3, 6], [0, 6], [0, 0]], 
      5, 
      { loop: false }
    ),
    'sleep': new Animation(
      [[0, 4], [1, 4]], 
      30
    ),
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('dino');
  }
}

//Pets (raccoon)
class Raccoon extends Pet {

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], 
      2
    ),
    'moveLeft': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]], 
      2
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]], 
      2
    ),
    'moveRight': new Animation(
      [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]], 
      2
    ),
    'idle': new Animation(
      [[0, 0]], 
      5, 
      { loop: false }
    ),
    'special': new Animation(
      [[8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2], [14, 2], [15, 2]], 
      5, 
      { loop: true }
    )
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('raccoon', { canSleep: false });
  }
}

//Pets (goat, sheep, ostrich, pig)
class Goat extends Pet {

  constructor(name, color) {
    super(name, color);
    this.init('goat');
  }
}

class Sheep extends Pet {

  constructor(name, color) {
    super(name, color);
    this.init('sheep');
  }
}

class Ostrich extends Pet {

  constructor(name, color) {
    super(name, color);
    this.init('ostrich');
  }
}

class Pig extends Pet {

  constructor(name, color) {
    super(name, color);
    this.init('pig');
  }
}

//Pets (rabbit)
class Rabbit extends Pet {

  //Pet data
  size = new Vec2(16);

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 3], [1, 3], [2, 3], [3, 3]], 
      5
    ),
    'idle': new Animation(
      [[0, 0]], 
      5, 
      { loop: false })
    ,
    'sleep': new Animation(
      [[0, 4], [1, 4]], 
      30, 
      { loop: false }
    ),
    'special': new Animation(
      [[0, 6], [1, 6], [2, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 0]], 
      5, 
      { loop: false }
    ),
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('rabbit');
  }
}

//Pets (chicken)
class Chicken extends Pet {

  //Pet data
  size = new Vec2(16);

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 3], [1, 3], [2, 3], [3, 3]], 
      5
    ),
    'idle': new Animation(
      [[0, 0]], 
      5, 
      { loop: false })
    ,
    'special': new Animation(
      [[0, 6], [1, 6], [2, 6], [3, 6], [0, 0]], 
      5, 
      { loop: false }
    ),
    'sleep': new Animation(
      [[0, 4], [1, 4]], 
      5, 
      { loop: false }
    ),
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('chicken');
  }
}

//Pets (cow)
class Cow extends Pet {

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0]], 
      5
    ),
    'moveRight': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5
    ),
    'moveLeft': new Animation(
      [[0, 1], [1, 1], [2, 1], [3, 1]], 
      5,
      { flip: true }
    ),
    'moveUp': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2]], 
      5
    ),
    'idle': new Animation(
      [[0, 0]], 
      5, 
      { loop: false })
    ,
    'special': new Animation(
      [[0, 4], [1, 4], [3, 4], [2, 4], [3, 4], [1, 4], [0, 4]], 
      5, 
      { loop: false }
    ),
    'sleep': new Animation(
      [[0, 3], [1, 3]], 
      30
    ),
  };
  
  constructor(name, color) {
    super(name, color);
    this.init('cow');
  }
}

//Pets (junimo)
class Junimo extends Pet {

  //Pet data
  size = new Vec2(16);

  //Animations
  anims = {
    'moveDown': new Animation(
      [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], 
      2
    ),
    'moveRight': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]], 
      2
    ),
    'moveLeft': new Animation(
      [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]], 
      2,
      { flip: true }
    ),
    'moveUp': new Animation(
      [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]], 
      2
    ),
    'idle': new Animation(
      [[0, 0]], 
      5, 
      { loop: false })
    ,
    'special': [
      new Animation(
        [[4, 3], [5, 3], [6, 3], [7, 3]], 
        5
      ),
      new Animation(
        [[4, 5], [5, 5], [6, 5], [7, 5]], 
        5
      )
    ],
    'sleep': new Animation(
      [[4, 1], [5, 1], [6, 1], [7, 1]], 
      30
    ),
  };

  constructor(name, color) {
    super(name, color);
    this.init('junimo');
  }
}