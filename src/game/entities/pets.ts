import { Vec2, Timeout, Util } from '../util';
import { Action, Animation, Game } from '../engine';
import { Character, AI } from './characters';
import { AIState, PetAIState } from './states';



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
    }

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

    static get PARROT() { 
        return {
            'idle': new Animation(
                [[0, 0]],
                5,
                { loop: false }
            ),
            'moveUp': new Animation(
                [[8, 0], [9, 0], [10, 0]],
                5
            ),
            'moveRight': new Animation(
                [[2, 0], [3, 0], [4, 0]],
                5,
                { flip: true }
            ),
            'moveDown': new Animation(
                [[5, 0], [6, 0], [7, 0]],
                5
            ),
            'moveLeft': new Animation(
                [[2, 0], [3, 0], [4, 0]],
                5
            ),
            'special': new Animation(
                [[0, 0], [1, 0], [0, 0], [1, 0], [0, 0]],
                5,
                { loop: false }
            )
        };
    }

    static get HORSE() { 
        return {
            'idle': new Animation(
                [[0, 1]],
                5,
                { loop: false }
            ),
            'moveDown': new Animation(
                [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
                2
            ),
            'moveLeft': new Animation(
                [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
                2,
                { flip: true }
            ),
            'moveUp': new Animation(
                [[1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2]],
                2
            ),
            'moveRight': new Animation(
                [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
                2
            ),
            'special': new Animation(
                [[0, 3], [1, 3], [2, 3], [3, 3], [2, 3], [3, 3], [2, 3], [1, 3], [0, 3]],
                5,
                { loop: false }
            )
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
    static size: Vec2 = new Vec2(9);

    //Special moods
    static get HEART() { return new Vec2(1, 3); }
    static get RANDOM() { return (PetMoods as any)[PetMoods.#moods[Util.randomExclusive(PetMoods.#moods.length)]]; }

    //Normal moods
    static #moods: string[] = ['HAPPY', 'BLUSH', 'ASHAMED', 'CRY', 'MAD', 'IDK', 'PLEDGE', 'GIGACHAD', 'ALIEN', 'DEVIL', 'SILLY', 'MUSIC'];

    static get HAPPY(): Vec2 { return new Vec2(0, 0); }
    static get BLUSH(): Vec2 { return new Vec2(8, 0); }
    static get ASHAMED(): Vec2 { return new Vec2(9, 0); }
    static get CRY(): Vec2 { return new Vec2(13, 0); }
    static get MAD(): Vec2 { return new Vec2(2, 1); }
    static get IDK(): Vec2 { return new Vec2(5, 1); }
    static get PLEDGE(): Vec2 { return new Vec2(8, 1); }
    static get GIGACHAD(): Vec2 { return new Vec2(11, 1); }
    static get ALIEN(): Vec2 { return new Vec2(1, 2); }
    static get DEVIL(): Vec2 { return new Vec2(2, 2); }
    static get SILLY(): Vec2 { return new Vec2(13, 1); }
    static get MUSIC(): Vec2 { return new Vec2(6, 3); }

}

export class PetAI extends AI {

    //Moods
    #moodSprite: HTMLImageElement = new Image();
    #moodOffset: Vec2 = new Vec2();
    #moodElevation: number = 0; //Elevation is inverted, positive is down, negative is up
    #moodShow: boolean = false;
    #moodHideTimeout: Timeout = new Timeout(() => this.#moodShow = false);
    #moodHeartTimeout: Timeout = new Timeout(() => this.#setRandomMood());


    //State
    constructor(config: any) {
        super(config);

        //Check config
        if (typeof config === 'object') {
            //Mood elevation
            if (typeof config.moodElevation === 'number') this.#moodElevation = -config.moodElevation; //Elevation is inverted
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
        this.setState(AIState.SPECIAL);
    }

    //Mood
    #setMood(moodOffset: Vec2) {
        this.#moodOffset = moodOffset.multiply(PetMoods.size);
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

    drawMood(ctx: CanvasRenderingContext2D) {
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
    moveTowards(point: Vec2, towardsBall: boolean = false) {
        super.moveTowards(point)

        //Move towards ball
        if (towardsBall) this.setState(PetAIState.MOVE_BALL);
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
        this.setState(AIState.SPECIAL);
    }

}

//Characters
export class PetCharacter extends Character<PetAI> {

    //Pet info
    #specie: string = '';
    #color: string = 'Color';

    get specie(): string { return this.#specie; }
    get color(): string { return this.#color; }


    //Constructor
    constructor(name: string, specie: string, color: string, config: any = {}, config_ai: any = {}) {
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
    mouseUp(pos: Vec2) {
        //Notify AI pet was clicked
        this.ai.click();

        //Consume event
        return true;
    }

    //Rendering
    draw(ctx: CanvasRenderingContext2D, options: any) {
        //Draw character
        super.draw(ctx, options);

        //Draw AI mood
        this.ai.drawMood(ctx);
    }

    //Movement
    moveTowardsBall(ballPos: Vec2) {
        //Fix position to have the pet feet at the ball
        const pos = ballPos.subtract(this.size.multiply(new Vec2(0.5, 0.8)).toInt());

        //Clamp new position
        pos.x = Util.clamp(pos.x, 0, this.maxPosX);
        pos.y = Util.clamp(pos.y, 0, this.maxPosY);

        //Update position
        this.ai.moveTowards(pos, true);
    }

}

//Cat
export class Cat extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.CAT
        };

        //AI config
        const config_ai: any = {
            moodElevation: -3
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
        }

        //Create pet
        super(name, 'cat', color, config, config_ai);
    }

}

//Dog
export class Dog extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.DOG
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'blonde':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 4;
                break;
            case 'gray':
                config.spriteSheetOffset = new Vec2(128, 0);
                config_ai.moodElevation = 4;
                break;
            case 'brown':
                config.spriteSheetOffset = new Vec2(256, 0);
                config_ai.moodElevation = 6;
                break;
            case 'dark brown':
                config.spriteSheetOffset = new Vec2(384, 0);
                config_ai.moodElevation = 4;
                break;
            case 'light brown':
                config.spriteSheetOffset = new Vec2(512, 0);
                config_ai.moodElevation = 1;
                break;
            case 'purple':
                config.spriteSheetOffset = new Vec2(640, 0);
                config_ai.moodElevation = 4;
                break;
        }

        //Create pet
        super(name, 'dog', color, config, config_ai);
    }
    
}

//Tutle
export class Turtle extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.TURTLE
        };

        //AI config
        const config_ai: any = {
            moodElevation: -2
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
        super(name, 'turtle', color, config, config_ai);
    }

}

//Dino
export class Dino extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(16),
            animations: PetAnimations.DINO
        };

        //AI config
        const config_ai: any = {
            moodElevation: 10
        };

        //Create pet
        super(name, 'dino', color, config, config_ai);
    }

}

//Duck
export class Duck extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(16),
            animations: PetAnimations.DUCK
        };

        //AI config
        const config_ai: any = {
            moodElevation: 8
        };

        //Create pet
        super(name, 'duck', color, config, config_ai);
    }

}

//Raccoon
export class Raccoon extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.RACCOON
        };

        //AI config
        const config_ai: any = {
            moodElevation: 4,
            canSleep: false
        };

        //Create pet
        super(name, 'raccoon', color, config, config_ai);
    }

}

//Goat, sheep, ostrich, pig
export class Goat extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.DEFAULT
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 7;
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                config_ai.moodElevation = 3;
                break;
        }

        //Create pet
        super(name, 'goat', color, config, config_ai);
    }

}

export class Sheep extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.DEFAULT
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 3;
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
        }

        //Create pet
        super(name, 'sheep', color, config, config_ai);
    }

}

export class Ostrich extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.DEFAULT
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 10;
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                config_ai.moodElevation = -3;
                break;
        }

        //Create pet
        super(name, 'ostrich', color, config, config_ai);
    }

}

export class Pig extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.DEFAULT
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 8;
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                config_ai.moodElevation = 4;
                break;
        }

        //Create pet
        super(name, 'pig', color, config, config_ai);
    }

}

//Rabbit
export class Rabbit extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            animations: PetAnimations.RABBIT
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 10;
                break;
            case 'baby':
                config.spriteSheetOffset = new Vec2(64, 0);
                config_ai.moodElevation = 8;
                break;
        }

        //Create pet
        super(name, 'rabbit', color, config, config_ai);
    }

}

//Chicken
export class Chicken extends PetCharacter {
    
    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(16),
            animations: PetAnimations.CHICKEN
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'white adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 10;
                break;
            case 'white baby':
                config.spriteSheetOffset = new Vec2(64, 0);
                config_ai.moodElevation = 2;
                break;
            case 'blue adult':
                config.spriteSheetOffset = new Vec2(128, 0);
                config_ai.moodElevation = 10;
                break;
            case 'blue baby':
                config.spriteSheetOffset = new Vec2(192, 0);
                config_ai.moodElevation = 4;
                break;
            case 'brown adult':
                config.spriteSheetOffset = new Vec2(256, 0);
                config_ai.moodElevation = 10;
                break;
            case 'brown baby':
                config.spriteSheetOffset = new Vec2(320, 0);
                config_ai.moodElevation = 3;
                break;
            case 'black adult':
                config.spriteSheetOffset = new Vec2(384, 0);
                config_ai.moodElevation = 10;
                break;
            case 'black baby':
                config.spriteSheetOffset = new Vec2(448, 0);
                config_ai.moodElevation = 3;
                break;
        }

        //Create pet
        super(name, 'chicken', color, config, config_ai);
    }

}

//Cow
export class Cow extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.COW
        };

        //AI config
        const config_ai: any = {};

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'white adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 3;
                break;
            case 'white baby':
                config.spriteSheetOffset = new Vec2(128, 0);
                config_ai.moodElevation = 1;
                break;
            case 'brown adult':
                config.spriteSheetOffset = new Vec2(256, 0);
                config_ai.moodElevation = 3;
                break;
            case 'brown baby':
                config.spriteSheetOffset = new Vec2(384, 0);
                config_ai.moodElevation = 2;
                break;
        }

        //Create pet
        super(name, 'cow', color, config, config_ai);
    }

}

//Parrot
export class Parrot extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(24),
            animations: PetAnimations.PARROT
        };

        //AI config
        const config_ai: any = {
            canSleep: false
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'green adult':
                config.spriteSheetOffset = new Vec2();
                config_ai.moodElevation = 7;
                break;
            case 'green baby':
                config.spriteSheetOffset = new Vec2(0, 24);
                config_ai.moodElevation = 5;
                break;
            case 'blue adult':
                config.spriteSheetOffset = new Vec2(0, 48);
                config_ai.moodElevation = 6;
                break;
            case 'blue baby':
                config.spriteSheetOffset = new Vec2(0, 72);
                config_ai.moodElevation = 3;
                break;
            case 'golden joja':
                config.spriteSheetOffset = new Vec2(0, 96);
                config_ai.moodElevation = 9;
                break;
        }

        //Create pet
        super(name, 'parrot', color, config, config_ai);
    }

}

//Horse
export class Horse extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(32),
            animations: PetAnimations.HORSE
        };

        //AI config
        const config_ai: any = {
            canSleep: false
        };

        //Create pet
        super(name, 'horse', color, config, config_ai);
    }

}

//Junimo
export class Junimo extends PetCharacter {

    constructor(name: string, color: string) {
        //Object config
        const config: any = {
            size: new Vec2(16),
            animations: PetAnimations.JUNIMO
        };

        //AI config
        const config_ai: any = {
            moodElevation: 9
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
        super(name, 'junimo', color, config, config_ai);
    }

}