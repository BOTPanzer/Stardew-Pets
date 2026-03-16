import { Vec2, Util } from '../util';
import { Animation, Game } from '../engine';
import { Character, AI } from './characters';
import { AIState } from './states';



 /*$      /$$                                 /$$
| $$$    /$$$                                | $$
| $$$$  /$$$$  /$$$$$$  /$$$$$$$   /$$$$$$$ /$$$$$$    /$$$$$$   /$$$$$$   /$$$$$$$
| $$ $$/$$ $$ /$$__  $$| $$__  $$ /$$_____/|_  $$_/   /$$__  $$ /$$__  $$ /$$_____/
| $$  $$$| $$| $$  \ $$| $$  \ $$|  $$$$$$   | $$    | $$$$$$$$| $$  \__/|  $$$$$$
| $$\  $ | $$| $$  | $$| $$  | $$ \____  $$  | $$ /$$| $$_____/| $$       \____  $$
| $$ \/  | $$|  $$$$$$/| $$  | $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$       /$$$$$$$/
|__/     |__/ \______/ |__/  |__/|_______/    \___/   \_______/|__/      |______*/

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
export class MonsterAI extends AI {

    //State
    constructor(config: any) { 
        //Fix config & disable sleep
        if (typeof config !== 'object') config = {};
        config.canSleep = false;
        
        //Base AI
        super(config); 
    }

    //Click
    click() {
        //Alredy clicked
        if (this.state == AIState.SPECIAL) return;

        //Give money to player
        Game.addMoney(40 + 5 * Util.randomInclusive(8)); //40 - 80 gold

        //Wait to spawn a new monster
        Game.monsterSpawner.wait(30 * 1000);

        //Play special animation
        this.setState(AIState.SPECIAL);
    }

    //State: SPECIAL
    onEnd_special() {
        //Remove monster from game
        this.character.remove();
    }

}

//Characters
export class MonsterCharacter extends Character<MonsterAI> {

    //Monster info
    #specie = '';
    #color = 'Color';

    get specie() { return this.#specie; }
    get color() { return this.#color; }


    //Constructor
    constructor(specie: any, color: any, config: any = {}, config_ai: any = {}) {
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
    mouseUp(pos: Vec2) {
        //Notify AI emeny was clicked
        this.ai.click();

        //Consume event
        return true;
    }

}

//Slime
export class Slime extends MonsterCharacter {

    constructor(color: string) {
        //Default config
        const config: any = {
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
export class Bug extends MonsterCharacter {

    constructor(color: string) {
        //Default config
        const config: any = {
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
export class Golem extends MonsterCharacter {

    constructor(color: string) {
        //Default config
        const config: any = {
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
export class Crab extends MonsterCharacter {

    constructor(color: string) {
        //Default config
        const config: any = {
            size: new Vec2(16, 24),
            animations: MonsterAnimations.CRAB
        };

        //Color sprite sheet offset
        switch (color.toLowerCase()) {
            default:
            case 'rock':
                config.spriteSheetOffset = new Vec2();
                break;
            case 'rock dangerous':
                config.spriteSheetOffset = new Vec2(64, 0);
                break;
            case 'lava':
                config.spriteSheetOffset = new Vec2(128, 0);
                break;
            case 'lava dangerous':
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