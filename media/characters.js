//AI
class AI {

    //States
    static get IDLE() { return 'idle' };
    static get MOVE() { return 'move' };
    static get SPECIAL() { return 'special' };

    //AI info
    #character;
    #state = AI.IDLE;
    #timer = new Timer();
    #movePos = new Vec2();
    
    get character() { return this.#character; }
    get state() { return this.#state; }
    get timer() { return this.#timer; }

    //Config (idle)
    #idleDurationBase = 2 * Game.fps;       //Minimum duration of idle (in frames)
    #idleDurationVariation = 2 * Game.fps;  //Variation of duration for idle (in frames)

    get idleDuration() { return this.#idleDurationBase + Util.randomInclusive(this.#idleDurationVariation); }

    //Config (sleep)
    #canSleep = true;
    #isSleeping = false;
    #sleepDurationBase = 10 * Game.fps;     //Minimum duration of sleep (in frames)
    #sleepDurationVariation = 5 * Game.fps; //Variation of duration for sleep (in frames)

    get sleepDuration() { return this.#sleepDurationBase + Util.randomInclusive(this.#sleepDurationVariation); }

    //Config (special)
    #specialDuration = 2 * Game.fps;        //Duration of special (in frames)

    get specialDuration() { return this.#specialDuration; }


    //Constructor
    constructor(config) {
        //No config
        if (typeof config !== 'object') return;

        //Idle config
        if (typeof config.idleDurationBase == 'number') this.#idleDurationBase = config.idleDurationBase;
        if (typeof config.idleDurationVariation == 'number') this.#idleDurationVariation = config.idleDurationVariation;

        //Sleep config
        if (typeof config.canSleep == 'boolean') this.#canSleep = config.canSleep;
        if (typeof config.sleepDurationBase == 'number') this.#sleepDurationBase = config.sleepDurationBase;
        if (typeof config.sleepDurationVariation == 'number') this.#sleepDurationVariation = config.sleepDurationVariation;

        //Special config
        if (typeof config.specialDuration == 'number') this.#specialDuration = config.specialDuration;
    }

    assign(character) {
        //Assign character 
        this.#character = character;
    }

    //Click
    click() {}

    //Movement
    _moveTowardsMovePos() {
        //Move position out of bounds -> Create a new one
        if (this.#movePos.x > this.character.maxPosX || this.#movePos.y > this.character.maxPosY) {
            this.moveTowards(this.character.randomPoint);
            return true
        }

        //Try to move
        if (this.#movePos.x < this.character.pos.x)
            this.moveLeft();
        else if (this.#movePos.x > this.character.pos.x)
            this.moveRight();
        else if (this.#movePos.y < this.character.pos.y)
            this.moveUp();
        else if (this.#movePos.y > this.character.pos.y)
            this.moveDown();
        else
            return false

        //Moved
        return true
    }

    moveTowards(point) {
        //Change move point
        this.#movePos = point;

        //Set state to moving
        this.setState(AI.MOVE);
    }

    moveTowardsRandom() {
        //Move towards random point
        this.moveTowards(this.character.randomPoint);
    }

    moveLeft() {
        this.character.moveTo(new Vec2(this.character.pos.x - 1, this.character.pos.y));
        this.character.animate('moveLeft');
    }

    moveRight() {
        this.character.moveTo(new Vec2(this.character.pos.x + 1, this.character.pos.y));
        this.character.animate('moveRight');
    }

    moveUp() {
        this.character.moveTo(new Vec2(this.character.pos.x, this.character.pos.y - 1));
        this.character.animate('moveUp');
    }

    moveDown() {
        this.character.moveTo(new Vec2(this.character.pos.x, this.character.pos.y + 1));
        this.character.animate('moveDown');
    }

    //State
    update() {
        //Run on update for current state
        const onUpdate = this[`onUpdate_${this.state}`];
        if (typeof onUpdate === 'function') onUpdate.call(this);
    }

    setState(newState) {
        //Not a valid state
        if (typeof newState !== 'string') return;

        //Run on end for old state
        const onEnd = this[`onEnd_${this.state}`];
        if (typeof onEnd === 'function') onEnd.call(this);

        //Set state
        this.#state = newState;

        //Run on start for new state
        const onStart = this[`onStart_${this.state}`];
        if (typeof onStart === 'function') onStart.call(this);
    }

    //State: IDLE
    onStart_idle() {
        //Animate idle
        this.character.animate('idle');

        //Start timer
        this.timer.count(this.idleDuration);

        //Reset sleeping
        this.#isSleeping = false;
    }

    onUpdate_idle() {
        //Timer didn't finish
        if (!this.timer.finished) return;

        //Reset timer
        this.timer.reset();

        //Check action (75% chance to sleep if it can)
        if (this.#canSleep && !this.#isSleeping && Util.randomExclusive(100) < 75) {
            //Animate sleep
            this.character.animate('sleep');

            //Set state to sleep-idle
            this.#isSleeping = true;

            //Start sleep timer
            this.timer.count(this.sleepDuration);
        } else {
            //Move towards a random point
            this.moveTowardsRandom();
        }
    }

    //State: MOVE
    onUpdate_move() {
        //Try to move
        if (this._moveTowardsMovePos()) return;
        
        //Didn't move -> Point reached, animate idle
        this.setState(AI.IDLE);
    }

    //State: SPECIAL
    onStart_special() {
        //Animate special
        this.character.animate('special', true);

        //Start timer to move again
        this.timer.count(this.specialDuration);
    }

    onUpdate_special() {
        //Timer didn't finish
        if (!this.timer.finished) return;

        //Reset timer
        this.timer.reset();

        //Move towards a random point
        this.moveTowardsRandom();
    }

}

//Characters
class Character extends GameObject {

    //Object
    get isCharacter() { return true; }

    //AI
    #ai;

    get ai() { return this.#ai; }


    //Constructor
    constructor(config, ai) {
        super(config);

        //Assign AI
        this.#ai = ai
        ai.assign(this)

        //Respawn character
        this.respawn();
    }

    //Update
    update() {
        //Update AI
        this.ai.update();

        //Update game object
        super.update();
    }
    
    //Click
    onclick() {
        //Notify AI a click happened
        this.ai.onclick();
    }

}


 /*$$$$$$             /$$
| $$__  $$           | $$
| $$  \ $$ /$$$$$$  /$$$$$$   /$$$$$$$
| $$$$$$$//$$__  $$|_  $$_/  /$$_____/
| $$____/| $$$$$$$$  | $$   |  $$$$$$
| $$     | $$_____/  | $$ /$$\____  $$
| $$     |  $$$$$$$  |  $$$$//$$$$$$$/
|__/      \_______/   \___/ |______*/

//Animations
class PetAnimations {

    static get DEFAULT() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
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
        } 
    };
    
    static get CAT() { 
        return {
            'idle': new Animation(
                [[0, 4], [1, 4], [2, 4]],
                5,
                { loop: false }
            ),
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
    }
        
    static get DOG() { 
        return {
            'idle': new Animation(
                [[0, 5], [1, 5], [2, 5], [3, 5]],
                5,
                { loop: false }
            ),
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
    }

    static get TURTLE() { 
        return {
            'idle': new Animation(
                [[0, 4]],
                5,
                { loop: false }
            ),
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
            'special': new Animation(
                [[0, 6], [1, 6], [2, 6], [3, 6]],
                5
            ),
            'sleep': new Animation(
                [[0, 4], [1, 4], [2, 4], [3, 4], [0, 5]],
                5,
                { loop: false }
            )
        };
    }

    static get DINO() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
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
    }

    static get DUCK() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
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
            'special': new Animation(
                [[0, 6], [1, 6], [2, 6], [3, 6], [2, 6], [3, 6], [2, 6], [1, 6], [0, 6]],
                5,
                { loop: false }
            ),
            'sleep': new Animation(
                [[0, 7], [1, 7]],
                30
            ),
        };
    }

    static get RACCOON() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
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
            'special': new Animation(
                [[8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2], [14, 2], [15, 2]],
                5,
                { loop: true }
            )
        };
    }

    static get RABBIT() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
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
            'special': new Animation(
                [[0, 6], [1, 6], [2, 6], [3, 6], [2, 6], [1, 6], [0, 6], [0, 0]],
                5,
                { loop: false }
            ),
            'sleep': new Animation(
                [[0, 4], [1, 4]],
                30,
                { loop: false }
            ),
        };
    }

    static get CHICKEN() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
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
            'special': new Animation(
                [[0, 6], [1, 6], [2, 6], [1, 6], [2, 6], [1, 6], [0, 6], [0, 0]],
                5,
                { loop: false }
            ),
            'sleep': new Animation(
                [[0, 4], [1, 4]],
                5,
                { loop: false }
            ),
        };
    }

    static get COW() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
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
    }

    static get JUNIMO() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false })
            ,
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
    }

}

//AI
class PetMoods {

    //Sprite size
    static size = new Vec2(9);

    //Special moods
    static get HEART() { return new Vec2(1, 3); }
    static get RANDOM() { return PetMoods[PetMoods.#moods[Util.randomExclusive(PetMoods.#moods.length)]]; }

    //Normal moods
    static #moods = ['GIGACHAD', 'HAPPY', 'MAD', 'ALIEN', 'PLEDGE', 'BLUSH'];

    static get GIGACHAD() { return new Vec2(11, 1); }
    static get HAPPY() { return new Vec2(0, 0); }
    static get MAD() { return new Vec2(2, 1); }
    static get ALIEN() { return new Vec2(1, 2); }
    static get PLEDGE() { return new Vec2(8, 1); }
    static get BLUSH() { return new Vec2(8, 0); }

}

class PetAI extends AI {

    //States
    static get MOVE_BALL() { return 'moveball' };

    //Moods
    #moodSprite = new Image();
    #moodOffset = new Vec2();
    #moodElevation = 0; //Elevation is reversed, positive is down, negative is up
    #moodShow = false;
    #moodHideTimeout = new Timeout(() => this.#moodShow = false);
    #moodHeartTimeout = new Timeout(() => this.#setRandomMood());


    //State
    constructor(config) {
        super(config);

        //Check config
        if (typeof config === 'object') {
            //Mood elevation
            if (typeof config.moodElevation === 'number') this.#moodElevation = config.moodElevation;
        }

        //Init moods sprite
        this.#moodSprite.src = `${Game.mediaURI}sprites/emotes.png`;

        //Random mood
        this.#setRandomMood()
    }

    //Click
    click() {
        //Has gift?
        if (Game.isAction(Action.GIFT)) {
            //Consume gift
            Game.setAction(Action.NONE);

            //Set mood to heart
            this.#setHeartMood()
        }

        //Show mood
        this.showMood();

        //Play special animation
        this.setState(AI.SPECIAL);
    }

    //Mood
    #setMood(moodOffset) {
        this.#moodOffset = moodOffset.mult(PetMoods.size);
    }

    #setHeartMood() {
        //Change mood to heart
        this.#setMood(PetMoods.HEART);

        //Clear heart mood timeout & start a new one
        this.#moodHeartTimeout.wait(10 * 60 * 1000); //Heart stays for 10 minutes
    }

    #setRandomMood() {
        //Change mood to a random one
        this.#setMood(PetMoods.RANDOM);
    }

    showMood() {
        //Show mood
        this.#moodShow = true;

        //Clear hide mood timeout & start a new one
        this.#moodHideTimeout.wait(2000);
    }

    drawMood(ctx) {
        //Mood is hidden
        if (!this.#moodShow) return;

        //Draw mood
        ctx.drawImage(
            this.#moodSprite,
            this.#moodOffset.x,
            this.#moodOffset.y, 
            PetMoods.size.x,
            PetMoods.size.y,
            this.character.pos.x + Math.round((this.character.size.x - PetMoods.size.x) / 2),
            this.character.pos.y + this.#moodElevation,
            PetMoods.size.x,
            PetMoods.size.y
        );
    }

    //Movement
    moveTowards(point, towardsBall) {
        super.moveTowards(point)

        //Move towards ball
        if (towardsBall) this.setState(PetAI.MOVE_BALL);
    }

    //State: MOVING or MOVING_BALL
    onUpdate_moveball() {
        //Try to move
        if (this._moveTowardsMovePos()) return;

        //Didn't move -> Point reached, notify game that the ball was reached
        Game.ball.onReached()

        //Set mood to heart & show mood
        this.#setHeartMood()
        this.showMood();

        //Animate special
        this.setState(AI.SPECIAL);
    }

}

//Characters
class PetCharacter extends Character {

    //Pet info
    #specie = '';
    #color = 'Color';

    get specie() { return this.#specie; }
    get color() { return this.#color; }
    

    //Constructor
    constructor(name, specie, color, config = {}, config_ai = {}) {
        //Add name & image to config
        config.name = name;
        config.image = `pets/${specie.toLowerCase()}.png`;

        //Create character
        super(config, new PetAI(config_ai));
        
        //Save pet info
        this.#specie = specie;
        this.#color = color;

        //Move towards random point
        this.ai.moveTowardsRandom();

        //Add to pets list
        Game.pets.push(this);
    }

    remove() {
        super.remove();

        //Remove from pets list
        Game.pets.removeItem(this);
    }

    //Clicks
    mouseUp(pos) {
        //Notify AI pet was clicked
        this.ai.click();

        //Consume event
        return true;
    }

    //Rendering
    draw(ctx, options) {
        //Draw character
        super.draw(ctx, options);
        
        //Draw AI mood
        this.ai.drawMood(ctx);
    }

    //Movement
    moveTowardsBall(ballPos) {
        //Fix position to have the pet feet at the ball
        const pos = ballPos.sub(this.size.mult(new Vec2(0.5, 0.8)).toInt())

        //Clamp new position
        pos.x = Util.clamp(pos.x, 0, this.maxPosX);
        pos.y = Util.clamp(pos.y, 0, this.maxPosY);

        //Update position
        this.ai.moveTowards(pos, true)
    }

}

class PetCharacterBig extends PetCharacter {

    constructor(name, specie, color, config = {}, config_ai = {}) {
        //Change pet size to big
        config.size = new Vec2(32);

        //Create pet
        super(name, specie, color, config, config_ai);
    }

}

//Cat
class Cat extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.CAT
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'black':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'gray':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'orange':
                config.spriteSheetOffset = new Vec2(256, 0);
                break;
            case 'white':
                config.spriteSheetOffset = new Vec2(384, 0);
                break;
            case 'yellow':
                config.spriteSheetOffset = new Vec2(512, 0);
                break;
            case 'purple':
                config.spriteSheetOffset = new Vec2(640, 0);
                break;
            case 'black and white':
                config.spriteSheetOffset = new Vec2(768, 0);
                break;
        }

        //Create pet
        super(name, 'cat', color, config, {
            moodElevation: 3
        });
    }

}

//Dog
class Dog extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.DOG
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'blonde':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'gray':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'brown':
                config.spriteSheetOffset = new Vec2(256, 0);
                break;
            case 'dark brown':
                config.spriteSheetOffset = new Vec2(384, 0);
                break;
            case 'light brown':
                config.spriteSheetOffset = new Vec2(512, 0);
                break;
            case 'purple':
                config.spriteSheetOffset = new Vec2(640, 0);
                break;
        }

        //Create pet
        super(name, 'dog', color, config, {
            moodElevation: -6
        });
    }
    
}

//Tutle
class Turtle extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.TURTLE
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'green':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'purple':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
        }

        //Create pet
        super(name, 'turtle', color, config, {
            moodElevation: 2
        });
    }

}

//Dino
class Dino extends PetCharacter {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.DINO
        };

        //Create pet
        super(name, 'dino', color, config, {
            moodElevation: -11
        });
    }

}

//Duck
class Duck extends PetCharacter {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.DUCK
        };

        //Create pet
        super(name, 'duck', color, config, {
            moodElevation: -8
        });
    }

}

//Raccoon
class Raccoon extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.RACCOON
        };

        //Create pet
        super(name, 'raccoon', color, config, {
            moodElevation: -4,
            canSleep: false
        });
    }

}

//Goat, sheep, ostrich, pig
class Goat extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.DEFAULT
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
        }

        //Create pet
        super(name, 'goat', color, config, {
            moodElevation: (color == 'adult' ? -7 : -3)
        });
    }

}

class Sheep extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.DEFAULT
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
        }

        //Create pet
        super(name, 'sheep', color, config, {
            moodElevation: (color == 'adult' ? -3 : 0)
        });
    }

}

class Ostrich extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.DEFAULT
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
        }

        //Create pet
        super(name, 'ostrich', color, config, {
            moodElevation: (color == 'adult' ? -8 : 2)
        });
    }

}

class Pig extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.DEFAULT
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
        }

        //Create pet
        super(name, 'pig', color, config, {
            moodElevation: (color == 'adult' ? -8 : -4)
        });
    }

}

//Rabbit
class Rabbit extends PetCharacter {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.RABBIT
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(64, 0);
                break;
        }

        //Create pet
        super(name, 'rabbit', color, config, {
            moodElevation: (color == 'adult' ? -10 : -8)
        });
    }

}

//Chicken
class Chicken extends PetCharacter {
    
    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.CHICKEN
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'white adult':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'white baby':
                config.spriteSheetOffset = new Vec2(64, 0);
                break;
            case 'blue adult':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'blue baby':
                config.spriteSheetOffset = new Vec2(192, 0);
                break;
            case 'brown adult':
                config.spriteSheetOffset = new Vec2(256, 0);
                break;
            case 'brown baby':
                config.spriteSheetOffset = new Vec2(320, 0);
                break;
            case 'black adult':
                config.spriteSheetOffset = new Vec2(384, 0);
                break;
            case 'black baby':
                config.spriteSheetOffset = new Vec2(448, 0);
                break;
        }

        //Create pet
        super(name, 'chicken', color, config, {
            moodElevation: (color.includes('adult') ? -10 : -2)
        });
    }

}

//Cow
class Cow extends PetCharacterBig {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.COW
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'white adult':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'white baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'brown adult':
                config.spriteSheetOffset = new Vec2(256, 0);
                break;
            case 'brown baby':
                config.spriteSheetOffset = new Vec2(384, 0);
                break;
        }

        //Create pet
        super(name, 'cow', color, config, {
            moodElevation: (color.includes('adult') ? -3 : -1)
        });
    }

}

//Junimo
class Junimo extends PetCharacter {

    constructor(name, color) {
        //Default config
        const config = {
            animations: PetAnimations.JUNIMO
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'white':
                config.spriteSheetOffset = new Vec2(0, 0);
                break;
            case 'black':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'gray':
                config.spriteSheetOffset = new Vec2(256, 0);
                break;
            case 'pink':
                config.spriteSheetOffset = new Vec2(384, 0);
                break;
            case 'red':
                config.spriteSheetOffset = new Vec2(0, 96);
                break;
            case 'orange':
                config.spriteSheetOffset = new Vec2(128, 96);
                break;
            case 'yellow':
                config.spriteSheetOffset = new Vec2(256, 96);
                break;
            case 'green':
                config.spriteSheetOffset = new Vec2(384, 96);
                break;
            case 'cyan':
                config.spriteSheetOffset = new Vec2(0, 192);
                break;
            case 'purple':
                config.spriteSheetOffset = new Vec2(128, 192);
                break;
            case 'brown':
                config.spriteSheetOffset = new Vec2(256, 192);
                break;
        }

        //Create pet
        super(name, 'junimo', color, config, {
            moodElevation: -9
        });
    }

}


 /*$$$$$$$                                   /$$
| $$_____/                                  |__/
| $$       /$$$$$$$   /$$$$$$  /$$$$$$/$$$$  /$$  /$$$$$$   /$$$$$$$
| $$$$$   | $$__  $$ /$$__  $$| $$_  $$_  $$| $$ /$$__  $$ /$$_____/
| $$__/   | $$  \ $$| $$$$$$$$| $$ \ $$ \ $$| $$| $$$$$$$$|  $$$$$$
| $$      | $$  | $$| $$_____/| $$ | $$ | $$| $$| $$_____/ \____  $$
| $$$$$$$$| $$  | $$|  $$$$$$$| $$ | $$ | $$| $$|  $$$$$$$ /$$$$$$$/
|________/|__/  |__/ \_______/|__/ |__/ |__/|__/ \_______/|______*/

//Animations
class MonsterAnimations {

    static get SLIME() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                4,
                { loop: false },
            ),
            'moveDown': new Animation(
                [[0, 0], [1, 0], [2, 0], [3, 0]],
                4,
            ),
            'moveRight': new Animation(
                [[0, 1], [1, 1], [2, 1], [3, 1]],
                4,
            ),
            'moveLeft': new Animation(
                [[0, 2], [1, 2], [2, 2], [3, 2]],
                4,
            ),
            'moveUp': new Animation(
                [[0, 3], [1, 3], [2, 3], [3, 3]],
                4,
            ),
            'special': new Animation(
                [[0, 4], [1, 4], [2, 4]],
                4,
                { loop: false },
            ),
        } 
    };

    static get BUG() { 
        return {
            'idle': new Animation(
                [[0, 0], [1, 0], [2, 0], [3, 0]],
                4,
            ),
            'moveDown': new Animation(
                [[0, 0], [1, 0], [2, 0], [3, 0]],
                4,
            ),
            'moveRight': new Animation(
                [[0, 1], [1, 1], [2, 1], [3, 1]],
                4,
            ),
            'moveLeft': new Animation(
                [[0, 3], [1, 3], [2, 3], [3, 3]],
                4,
            ),
            'moveUp': new Animation(
                [[0, 2], [1, 2], [2, 2], [3, 2]],
                4,
            ),
            'special': new Animation(
                [[0, 4], [1, 4]],
                4,
                { loop: false },
            ),
        } 
    };

    static get GOLEM() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                4,
                { loop: false },
            ),
            'moveDown': new Animation(
                [[0, 0], [1, 0], [2, 0], [3, 0]],
                4,
            ),
            'moveRight': new Animation(
                [[0, 1], [1, 1], [2, 1], [3, 1]],
                4,
            ),
            'moveLeft': new Animation(
                [[0, 3], [1, 3], [2, 3], [3, 3]],
                4,
            ),
            'moveUp': new Animation(
                [[0, 2], [1, 2], [2, 2], [3, 2]],
                4,
            ),
            'special': new Animation(
                [[0, 6], [1, 6]],
                4,
                { loop: false },
            ),
        } 
    };

    static get CRAB() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                4,
                { loop: false },
            ),
            'moveDown': new Animation(
                [[1, 0], [2, 0], [3, 0]],
                4,
            ),
            'moveRight': new Animation(
                [[1, 1], [2, 1], [3, 1]],
                4,
            ),
            'moveLeft': new Animation(
                [[1, 2], [2, 2], [3, 2]],
                4,
            ),
            'moveUp': new Animation(
                [[1, 3], [2, 3], [3, 3]],
                4,
            ),
            'special': new Animation(
                [[0, 5], [1, 5]],
                4,
                { loop: false },
            ),
        } 
    };

}

//AI
class MonsterAI extends AI {

    //State
    constructor(config) { 
        //Fix config & disable sleep
        if (typeof config !== 'object') config = {};
        config.canSleep = false;
        
        //Base AI
        super(config); 
    }

    //Click
    click() {
        //Alredy clicked
        if (this.state == AI.SPECIAL) return;

        //Give money to player
        Game.addMoney(40 + 5 * Util.randomInclusive(8)); //40 - 80 gold

        //Wait to spawn a new monster
        Game.monsterSpawner.wait(30 * 1000);

        //Play special animation
        this.setState(AI.SPECIAL);
    }

    //State: SPECIAL
    onEnd_special() {
        //Remove monster from game
        this.character.remove();
    }

}

//Characters
class MonsterCharacter extends Character {

    //Monster info
    #specie = '';
    #color = 'Color';

    get specie() { return this.#specie; }
    get color() { return this.#color; }


    //Constructor
    constructor(specie, color, config = {}, config_ai = {}) {
        //Add name & image to config
        config.name = Util.titleCase(specie);
        config.image = `monsters/${specie.toLowerCase()}.png`;
        
        //Create character
        super(config, new MonsterAI(config_ai));

        //Save info
        this.#specie = specie;
        this.#color = color;

        //Move towards random point
        this.ai.moveTowardsRandom();
        
        //Add to monsters list
        Game.monsters.push(this);
    }

    remove() {
        super.remove();

        //Remove from monsters list
        Game.monsters.removeItem(this);
    }

    //Clicks
    mouseUp(pos) {
        //Notify AI emeny was clicked
        this.ai.click();

        //Consume event
        return true;
    }

}

//Slime
class Slime extends MonsterCharacter {

    constructor(color) {
        //Default config
        const config = {
            size: new Vec2(16, 24),
            animations: MonsterAnimations.SLIME
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'iron':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'tiger':
                config.spriteSheetOffset = new Vec2(64, 0);
                break;
        }

        //Create pet
        super('slime', color, config, {
            specialDuration: 0.4 * Game.fps
        });
    }

}

//Bug
class Bug extends MonsterCharacter {

    constructor(color) {
        //Default config
        const config = {
            size: new Vec2(16),
            animations: MonsterAnimations.BUG
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'normal':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'normal dangerous':
                config.spriteSheetOffset = new Vec2(64, 0);
                break;
            case 'armored':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'armored dangerous':
                config.spriteSheetOffset = new Vec2(192, 0);
                break;
        }

        //Create pet
        super('bug', color, config, {
            specialDuration: 0.4 * Game.fps
        });
    }

}

//Golem
class Golem extends MonsterCharacter {

    constructor(color) {
        //Default config
        const config = {
            size: new Vec2(16, 24),
            animations: MonsterAnimations.GOLEM
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'stone':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'stone dangerous':
                config.spriteSheetOffset = new Vec2(64, 0);
                break;
            case 'iridium':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'wilderness':
                config.spriteSheetOffset = new Vec2(192, 0);
                break;
        }

        //Create pet
        super('golem', color, config, {
            specialDuration: 0.4 * Game.fps
        });
    }

}

//Crab
class Crab extends MonsterCharacter {

    constructor(color) {
        //Default config
        const config = {
            size: new Vec2(16, 24),
            animations: MonsterAnimations.CRAB
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'rock':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'rock':
                config.spriteSheetOffset = new Vec2(64, 0);
                break;
            case 'lava':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'lava':
                config.spriteSheetOffset = new Vec2(192, 0);
                break;
            case 'iridium':
                config.spriteSheetOffset = new Vec2(256, 0);
                break;
            case 'truffle':
                config.spriteSheetOffset = new Vec2(320, 0);
                break;
            case 'stickbug':
                config.spriteSheetOffset = new Vec2(384, 0);
                break;
            case 'magma cap':
                config.spriteSheetOffset = new Vec2(448, 0);
                break;
        }

        //Create pet
        super('crab', color, config, {
            specialDuration: 0.4 * Game.fps
        });
    }

}