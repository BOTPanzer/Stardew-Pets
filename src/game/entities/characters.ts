import { Vec2, Util } from '../util';
import { Timer, GameObject, Game } from '../engine';



  /*$$$$$  /$$                                                /$$
 /$$__  $$| $$                                               | $$
| $$  \__/| $$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$$ /$$$$$$    /$$$$$$   /$$$$$$   /$$$$$$$
| $$      | $$__  $$ |____  $$ /$$__  $$|____  $$ /$$_____/|_  $$_/   /$$__  $$ /$$__  $$ /$$_____/
| $$      | $$  \ $$  /$$$$$$$| $$  \__/ /$$$$$$$| $$        | $$    | $$$$$$$$| $$  \__/|  $$$$$$
| $$    $$| $$  | $$ /$$__  $$| $$      /$$__  $$| $$        | $$ /$$| $$_____/| $$       \____  $$
|  $$$$$$/| $$  | $$|  $$$$$$$| $$     |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$| $$       /$$$$$$$/
 \______/ |__/  |__/ \_______/|__/      \_______/ \_______/   \___/   \_______/|__/      |______*/

//AI
export enum AIState {
    IDLE = 'idle',
    MOVE = 'move',
    SPECIAL = 'special'
}

export class AI {

    //AI info
    #character!: Character<AI>;
    #state: string = AIState.IDLE;
    #timer: Timer = new Timer();
    #movePos: Vec2 = new Vec2();

    get character(): Character<AI> { return this.#character; }
    get state(): string { return this.#state; }
    get timer(): Timer { return this.#timer; }

    //Config (idle)
    #idleDurationBase: number = 2 * Game.fps;       //Minimum duration of idle (in frames)
    #idleDurationVariation: number = 2 * Game.fps;  //Variation of duration for idle (in frames)

    get idleDuration() { return this.#idleDurationBase + Util.randomInclusive(this.#idleDurationVariation); }

    //Config (sleep)
    #canSleep: boolean = true;
    #isSleeping: boolean = false;
    #sleepDurationBase: number = 10 * Game.fps;     //Minimum duration of sleep (in frames)
    #sleepDurationVariation: number = 5 * Game.fps; //Variation of duration for sleep (in frames)

    get sleepDuration(): number { return this.#sleepDurationBase + Util.randomInclusive(this.#sleepDurationVariation); }

    //Config (special)
    #specialDuration: number = 2 * Game.fps;        //Duration of special (in frames)

    get specialDuration(): number { return this.#specialDuration; }


    //Constructor
    constructor(config: any) {
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

    assign(character: Character<AI>) {
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
            return this.moveLeft();
        else if (this.#movePos.x > this.character.pos.x)
            return this.moveRight();
        else if (this.#movePos.y < this.character.pos.y)
            return this.moveUp();
        else if (this.#movePos.y > this.character.pos.y)
            return this.moveDown();
        else
            return false
    }

    moveTowards(point: Vec2) {
        //Change move point
        this.#movePos = point;

        //Set state to moving
        this.setState(AIState.MOVE);
    }

    moveTowardsRandom() {
        //Move towards random point
        this.moveTowards(this.character.randomPoint);
    }

    moveLeft() {
        this.character.animate('moveLeft');
        return this.character.moveTo(new Vec2(this.character.pos.x - 1, this.character.pos.y));
    }

    moveRight() {
        this.character.animate('moveRight');
        return this.character.moveTo(new Vec2(this.character.pos.x + 1, this.character.pos.y));
    }

    moveUp() {
        this.character.animate('moveUp');
        return this.character.moveTo(new Vec2(this.character.pos.x, this.character.pos.y - 1));
    }

    moveDown() {
        this.character.animate('moveDown');
        return this.character.moveTo(new Vec2(this.character.pos.x, this.character.pos.y + 1));
    }

    //State
    update() {
        //Run on update for current state
        const onUpdate = (this as any)[`onUpdate_${this.state}`];
        if (typeof onUpdate === 'function') onUpdate.call(this);
    }

    setState(newState: string) {
        //Not a valid state
        if (typeof newState !== 'string') return;

        //Run on end for old state
        const onEnd = (this as any)[`onEnd_${this.state}`];
        if (typeof onEnd === 'function') onEnd.call(this);

        //Set state
        this.#state = newState;

        //Run on start for new state
        const onStart = (this as any)[`onStart_${this.state}`];
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
        this.setState(AIState.IDLE);
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
export class Character<AI_T extends AI> extends GameObject {

    //Object
    get isCharacter(): boolean { return true; }

    //AI
    #ai: AI_T;

    get ai(): AI_T { return this.#ai; }


    //Constructor
    constructor(config: any, ai: AI_T) {
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

}