import { Vec2, Timeout, Util } from './util';
import { type PetCharacter } from './entities/pets';
import { type Decoration } from './entities/decoration';
import { type MonsterCharacter } from './entities/monsters';
import { AIState, PetAIState } from './entities/states';



 /*$   /$$   /$$     /$$ /$$
| $$  | $$  | $$    |__/| $$
| $$  | $$ /$$$$$$   /$$| $$
| $$  | $$|_  $$_/  | $$| $$
| $$  | $$  | $$    | $$| $$
| $$  | $$  | $$ /$$| $$| $$
|  $$$$$$/  |  $$$$/| $$| $$
 \______/    \___/  |__/|_*/

export class Timer {

    //Info
    #active: boolean = false;
    #end: number = 0;

    get justFinished() { return this.#active && Game.frames == this.#end; }
    get finished() { return this.#active && Game.frames >= this.#end; }

    //Functions
    count(frames: number) {
        this.#active = true;
        this.#end = Game.frames + frames;
    }

    reset() {
        this.#active = false;
    }

}



  /*$$$$$              /$$     /$$
 /$$__  $$            | $$    |__/
| $$  \ $$  /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$$
| $$$$$$$$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$ /$$_____/
| $$__  $$| $$        | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$
| $$  | $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
| $$  | $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$ /$$$$$$$/
|__/  |__/ \_______/   \___/  |__/ \______/ |__/  |__/|______*/

//Actions
export enum Action {
    NONE = '',
    GIFT = 'gift',
    BALL = 'ball',
    DECOR = 'decor'
}

//Cursor
export class Cursor {

    //Cursor HTML element
    static #element: HTMLElement = document.getElementById('cursor') as HTMLElement;

    //Position
    static #pos: Vec2 = new Vec2();

    static get pos() { return this.#pos; }
    static get posScaled() { return Cursor.pos.divide(Game.scale).toInt(); }

    static moveTo(pos: Vec2) {
        this.#pos = pos;
        this.#element.style.left = `${pos.x}px`;
        this.#element.style.top =  `${pos.y}px`;
    }

    //Icon
    static #icons = [Action.BALL, Action.GIFT]

    static setIcon(icon: Action) {
        //Valid icons
        icon = this.#icons.includes(icon) ? icon : Action.NONE;

        //Change cursor icon
        this.#element.setAttribute('icon', icon);

        //Toggle real cursor
        document.body.setAttribute('cursor', icon != Action.NONE ? 'none' : '');
    }

}



 /*$      /$$
| $$$    /$$$
| $$$$  /$$$$  /$$$$$$  /$$$$$$$  /$$   /$$  /$$$$$$$
| $$ $$/$$ $$ /$$__  $$| $$__  $$| $$  | $$ /$$_____/
| $$  $$$| $$| $$$$$$$$| $$  \ $$| $$  | $$|  $$$$$$
| $$\  $ | $$| $$_____/| $$  | $$| $$  | $$ \____  $$
| $$ \/  | $$|  $$$$$$$| $$  | $$|  $$$$$$/ /$$$$$$$/
|__/     |__/ \_______/|__/  |__/ \______/ |______*/

//Menus
export class Menus {

    //Black semitransparent menus backdrop
    static #backdrop: HTMLElement = document.getElementById('menus') as HTMLElement;

    //Toggle menus
    static #current: string | null //Name of the currently open menu

    static get current(): string | null { return this.#current; }

    static toggle(name: string | null, show: boolean | null = null) {
        //Invalid name
        if (typeof name !== 'string') return;

        //Get menu
        const menu = document.getElementById(name);
        if (!menu) return;

        //Fix show
        const isVisible = menu.hasAttribute('show');
        if (typeof show !== 'boolean') {
            //Invalid value -> Toggle menu visibility
            show = !isVisible;
        } else if (show == isVisible) {
            //Same state -> Return
            return;
        }

        //Toggle menu
        if (show) {
            //Close currently open menu
            this.close();

            //Show menu
            menu.setAttribute('show', '');
            this.#current = name;
            this.#backdrop.setAttribute('show', '');
        } else {
            //Hide menu
            menu.removeAttribute('show');
            this.#current = null;
            this.#backdrop.removeAttribute('show');
        }
    }

    static close() {
        this.toggle(this.current, false);
    }

}

//Decor mode
export enum DecorAction {
    MOVE = 'move',
    SELL = 'sell'
}

export class DecorMode {

    //Actions
    static #action: DecorAction = DecorAction.MOVE;

    static get action(): DecorAction { return this.#action; }

    static isAction(action: DecorAction) { 
        return this.action == action;
    }

    static setAction(action: DecorAction) {
        switch (action) {
            case DecorAction.MOVE:
                this.#actionButton.innerText = 'Sell';
                this.#helpText.innerText = 'Drag to move';
                break
            case DecorAction.SELL:
                this.#actionButton.innerText = 'Move';
                this.#helpText.innerText = 'Click to sell';
                break
        }
        this.#action = action;
    }

    static toggleAction() {
        if (this.isAction(DecorAction.MOVE)) {
            this.setAction(DecorAction.SELL);
        } else {
            this.setAction(DecorAction.MOVE);
        }
    }

    //UI
    static #overlay: HTMLElement = document.getElementById('decor') as HTMLElement;
    static #helpText: HTMLElement = document.getElementById('decor-help') as HTMLElement;
    static #actionButton: HTMLElement = document.getElementById('decor-action-name') as HTMLElement;
    static #actionsToggleButton: HTMLElement = document.getElementById('actionsDecor') as HTMLElement;

    static showOverlay(show: boolean | null = null) {
        //Fix args
        if (typeof show !== 'boolean') show = !this.#overlay.hasAttribute('show');

        //Toggle
        if (show) {
            this.#actionsToggleButton.innerText = 'Exit Decor Mode';
            this.#overlay.setAttribute('show', '');
        } else {
            this.#actionsToggleButton.innerText = 'Enter Decor Mode';
            this.#overlay.removeAttribute('show');
        }
    }

    //Mode
    static toggle(show: boolean | null = null) {
        //Fix args
        if (typeof show !== 'boolean') show = !Game.isAction(Action.DECOR);

        //Toggle
        if (show) {
            //No decoration
            if (Game.decoration.isEmpty()) {
                Game.showMessage('Buy decoration first', true);
                return;
            }

            //Set action to move decor
            this.setAction(DecorAction.MOVE);

            //Enter decor mode
            Game.setAction(Action.DECOR);
        } else {
            //Stop dragging all
            for (const decoration of Game.decoration) decoration.stopDragging();

            //Exit decor mode
            Game.setAction(Action.NONE);
        }
    }

}



  /*$$$$$                                     /$$$$$$  /$$                                 /$$
 /$$__  $$                                   /$$__  $$| $$                                | $$
| $$  \__/  /$$$$$$  /$$$$$$/$$$$   /$$$$$$ | $$  \ $$| $$$$$$$  /$$  /$$$$$$   /$$$$$$$ /$$$$$$   /$$$$$$$
| $$ /$$$$ |____  $$| $$_  $$_  $$ /$$__  $$| $$  | $$| $$__  $$|__/ /$$__  $$ /$$_____/|_  $$_/  /$$_____/
| $$|_  $$  /$$$$$$$| $$ \ $$ \ $$| $$$$$$$$| $$  | $$| $$  \ $$ /$$| $$$$$$$$| $$        | $$   |  $$$$$$
| $$  \ $$ /$$__  $$| $$ | $$ | $$| $$_____/| $$  | $$| $$  | $$| $$| $$_____/| $$        | $$ /$$\____  $$
|  $$$$$$/|  $$$$$$$| $$ | $$ | $$|  $$$$$$$|  $$$$$$/| $$$$$$$/| $$|  $$$$$$$|  $$$$$$$  |  $$$$//$$$$$$$/
 \______/  \_______/|__/ |__/ |__/ \_______/ \______/ |_______/ | $$ \_______/ \_______/   \___/ |_______/
                                                           /$$  | $$
                                                          |  $$$$$$/
                                                           \_____*/

//Animations
type AnimationFrame = [number, number]

interface Animations {
    [key: string]: Animation
}

export class Animation {

    //Animation info (temporal)
    #frame: number = 0;
    #counter: number = 0;
    #finished: boolean = false;

    get finished(): boolean { return this.#finished; }

    //Animation info (permanent)
    #frames: AnimationFrame[] = [];
    #speed: number = 5;             //Duration of each frame

    //Animation options
    #loop: boolean = true;          //Loop animation
    #flip: boolean = false;         //Flip sprite
    #pixelOffset: boolean = false;  //Use pixels instead of object size for the offset

    get loop(): boolean { return this.#loop; }
    get flip(): boolean { return this.#flip; }
    get pixelOffset(): boolean { return this.#pixelOffset; }


    //State
    constructor(frames: AnimationFrame[], speed: number, config: any = {}) {
        //Animation info
        this.#frames = frames;
        this.#speed = speed;

        //Check config
        if (typeof config.loop === 'boolean') this.#loop = config.loop;
        if (typeof config.flip === 'boolean') this.#flip = config.flip;
        if (typeof config.pixelOffset === 'boolean') this.#pixelOffset = config.pixelOffset;

        //Reset current info
        this.reset();
    }

    reset() {
        //Reset current info
        this.#frame = 0;
        this.#counter = 0;
        this.#finished = false;
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
                    this.#finished = true;
                } else {
                    //Next frame
                    this.#frame++;
                    if (this.#frame >= this.#frames.length) this.#frame = 0;
                }
            }
        }

        //Return animation sprite position
        const offset = this.#frames[this.#frame];
        return new Vec2(offset[0], offset[1]);
    }

}

//Game objects
export class GameObject {

    //Object
    #active: boolean = true;
    #name: string = 'GameObject';

    get active(): boolean { return this.#active; }
    get name(): string { return this.#name; }

    //Position & Size
    #pos: Vec2 = new Vec2();
    #size: Vec2 = new Vec2(16);

    get pos(): Vec2 { return this.#pos; }
    get size(): Vec2 { return this.#size; }

    //Clicks
    #clickable: boolean = true;

    get clickable(): boolean { return this.#clickable; }

    //Rendering (sorting)
    #sortingLayer: number = 0;

    get sortingLayer(): number { return this.#sortingLayer; }
    get sortingOrder(): number { return this.pos.y + this.size.y; }

    //Rendering (sprite sheet)
    #image: HTMLImageElement = new Image();     //Image containing the sprite sheet
    #spriteOffset: Vec2 = new Vec2();           //Offset for sprites inside a sprite sheet
    #spriteSheetOffset: Vec2 = new Vec2();      //Offset for images with multiple sprite sheets

    get image(): HTMLImageElement { return this.#image; }
    get spriteOffset(): Vec2 { return this.#spriteOffset; }
    get spriteSheetOffset(): Vec2 { return this.#spriteSheetOffset; }

    //Animations
    #animations: Animations = {};               //Object of animations with their names as keys
    #animation: Animation | null = null;        //Currently selected animation

    get animations(): Animations { return this.#animations; }
    get animation(): Animation | null { return this.#animation; }


    //Constructor
    constructor(config: any = {}) {
        //Check config
        if (typeof config === 'object') {
            //Object
            if (typeof config.active === 'boolean') this.#active = config.active;
            if (typeof config.name === 'string') this.#name = config.name;

            //Position & size
            if (typeof config.pos === 'object') this.#pos = config.pos;
            if (typeof config.size === 'object') this.#size = config.size;

            //Clicks
            if (typeof config.clickable === 'boolean') this.#clickable = config.clickable;

            //Rendering (sorting)
            if (typeof config.sortingLayer === 'number') this.#sortingLayer = config.sortingLayer;

            //Rendering (sprite sheet)
            if (typeof config.image === 'string') this.#image.src = `${Game.mediaURI}sprites/${config.image}`;
            if (typeof config.spriteOffset === 'object') this.#spriteOffset = config.spriteOffset;
            if (typeof config.spriteSheetOffset === 'object') this.#spriteSheetOffset = config.spriteSheetOffset;

            //Animation
            if (typeof config.animations === 'object') this.#animations = config.animations;
        }

        //Add to game objects list
        Game.objects.push(this);
    }

    remove() {
        //Remove from objects list
        Game.objects.removeItem(this);
    }

    setActive(active: boolean) {
        //Set active
        this.#active = active;
    }

    //Update
    update() {
        //Update animation sprite offset
        if (this.#animation) this.#spriteOffset = this.#animation.update().multiply(this.#animation.pixelOffset ? new Vec2(1) : this.size);
    }

    //Clicks
    isValidMousePos(pos: Vec2) {
        //Not clickable
        if (!this.clickable) return false;

        //Check if clicked inside bounding box
        if (!this.isPosInBounds(pos)) return false;

        //Check if clicked on transparent pixel
        if (!this.isPosInSprite(pos, Game.canvasAlphaTest, Game.contextAlphaTest)) return false;

        //Valid 
        return true;
    }

    isPosInBounds(pos: Vec2) {
        //Return true if pos is inside bounding box
        return pos.x >= this.pos.x && pos.x <= this.pos.x + this.size.x && pos.y >= this.pos.y && pos.y <= this.pos.y + this.size.y;
    }

    isPosInSprite(pos: Vec2, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        //Get relative click position
        const relPos = pos.subtract(this.pos);  

        //Change canvas size to match object size
        canvas.width = this.size.x;
        canvas.height = this.size.y;
        
        //Clear canvas & draw object at origin
        ctx.clearRect(0, 0, this.size.x, this.size.y);
        this.draw(ctx, { pos: new Vec2() });

        //Get pixel at pos & check alpha
        const pixelData = ctx.getImageData(relPos.x, relPos.y, 1, 1).data;
        return pixelData[3] !== 0;
    }

    checkMouseDown(clickPos: Vec2) {
        //Check if mouse pos is valid
        if (!this.isValidMousePos(clickPos)) return false;
        
        //Mouse down event
        return this.mouseDown(clickPos);
    }

    checkMouseUp(clickPos: Vec2) {
        //Check if mouse pos is valid
        if (!this.isValidMousePos(clickPos)) return false;
        
        //Click event
        return this.mouseUp(clickPos);
    }
    
    mouseDown(pos: Vec2) {
        //Mouse down was consumed
        return true;
    }

    mouseUp(pos: Vec2) {
        //Mouse up was consumed
        return true;
    }

    //Rendering
    draw(ctx: CanvasRenderingContext2D, options: any = {}) {
        //Get info
        const pos = (typeof options.pos === 'object' ? options.pos : this.pos);

        //Save context transform
        ctx.save(); 

        //Translate sprite
        ctx.translate(pos.x, pos.y);

        //Flip sprite
        if (this.animation && this.animation.flip) {
            ctx.translate(this.size.x, 0);
            ctx.scale(-1, 1);
        }

        //Draw sprite
        ctx.drawImage(
            this.image,     //Image
            this.spriteSheetOffset.x + this.spriteOffset.x, //Sprite offset x
            this.spriteSheetOffset.y + this.spriteOffset.y, //Sprite offset y
            this.size.x,         //Source sprite width
            this.size.y,         //Source sprite height
            0,              //Position
            0,              //Position
            this.size.x,         //Drawing width
            this.size.y          //Drawing height
        );

        //Restore context transform
        ctx.restore();
    }

    //Animations
    animate(name: string, force: boolean = false) {
        //Not an animation
        if (typeof this.animations[name] !== 'object') return;

        //Fix force animation
        if (typeof force !== 'boolean') force = false;

        //Get animation
        let animation = this.animations[name];
        if (Array.isArray(animation)) animation = animation[Util.randomExclusive(animation.length)];

        //Change current animation & reset it
        if (animation == this.animation && !force) return;
        this.#animation = animation;
        this.animation?.reset();
    }

    //Movement
    get maxPosX() { return Math.floor(Game.windowSizeScaled.x - this.size.x); }
    get maxPosY() { return Math.floor(Game.windowSizeScaled.y - this.size.y); }
    get randomPoint() { return new Vec2(Util.randomInclusive(this.maxPosX), Util.randomInclusive(this.maxPosY)); }

    moveTo(pos: Vec2, options: any = {}) {
        //Clamp new position
        if (!options.ignoreWalls) {
            pos.x = Util.clamp(pos.x, 0, this.maxPosX);
            pos.y = Util.clamp(pos.y, 0, this.maxPosY);
        }

        //Check if moved
        const moved = this.#pos.equals(pos);

        //Update position
        this.#pos = pos;

        //Return if moved
        return !moved;
    }

    respawn() {
        //Move to random point
        this.moveTo(this.randomPoint);
    }

}

//Ball object
export class Ball extends GameObject {

    //Constructor
    constructor(config: any = {}) {
        //Object
        config.active = false;
        config.name = 'Ball';

        //Size, rendering & animations
        config.size = new Vec2(9, 18);
        config.image = `ball.png`;
        config.animations = {
            'bounce': new Animation(
                [[0, 0], [0, 2], [0, 4], [0, 6], [0, 9], [0, 6], [0, 4], [0, 2], [0, 0], [0, 2], [0, 4], [0, 2], [0, 0], [0, 2], [0, 0]],
                1,
                { loop: false, pixelOffset: true }
            )
        };
        
        //Create object
        super(config);
    }

    setActive(active: boolean) {
        super.setActive(active);

        //Bounce
        this.animate('bounce', true);
    }

    //Pets
    onReached() {
        //Tell pets to stop moving towards the ball
        for (const pet of Game.pets) {
            if (pet.ai.state == PetAIState.MOVE_BALL) {
                pet.ai.setState(AIState.IDLE);
            }
        }

        //Hide ball
        this.setActive(false);
    }

}



 /*$$$$$$$                     /$$
| $$_____/                    |__/
| $$       /$$$$$$$   /$$$$$$  /$$ /$$$$$$$   /$$$$$$
| $$$$$   | $$__  $$ /$$__  $$| $$| $$__  $$ /$$__  $$
| $$__/   | $$  \ $$| $$  \ $$| $$| $$  \ $$| $$$$$$$$
| $$      | $$  | $$| $$  | $$| $$| $$  | $$| $$_____/
| $$$$$$$$| $$  | $$|  $$$$$$$| $$| $$  | $$|  $$$$$$$
|________/|__/  |__/ \____  $$|__/|__/  |__/ \_______/
                     /$$  \ $$
                    |  $$$$$$/
                     \_____*/

export class Game {

    //VSCode
    static #vscode: any;

    static get vscode(): any { return this.#vscode; }

    //Media folder URI
    static #mediaURI: string = document.body.getAttribute('media')!;

    static get mediaURI(): string { return this.#mediaURI; }

    //Window
    static #scale: number = 2;
    static #windowSize: Vec2 = new Vec2(window.innerWidth, window.innerHeight);
    static #windowSizeScaled: Vec2 = new Vec2(window.innerWidth / 2, window.innerHeight / 2);

    static get scale(): number { return this.#scale; }
    static get windowSize(): Vec2 { return this.#windowSize; }
    static get windowSizeScaled(): Vec2 { return this.#windowSizeScaled; }

    static setScale = (scale: number) => {
        //Update scale
        this.#scale = scale;
        this.onResize();
    }

    static onResize = () => {
        //Update game window size
        this.#windowSize = new Vec2(window.innerWidth, window.innerHeight);
        this.#windowSizeScaled = this.windowSize.divide(this.scale);

        //Update buffer canvas size
        this.canvasBuffer.width = this.windowSize.x;
        this.canvasBuffer.height = this.windowSize.y;

        //Fit all pets & monsters on screen
        this.pets.forEach(pet => pet.moveTo(pet.pos))
        this.monsters.forEach(monster => monster.moveTo(monster.pos))
    }

    //Update
    static #fps: number = 30;    //Game framerate
    static #frames: number = 0;  //Frames since game start

    static get fps(): number { return this.#fps; }
    static get frames(): number { return this.#frames; }

    static update = () => {
        //Check if window size changed
        if (this.windowSize.x != window.innerWidth || this.windowSize.y != window.innerHeight) this.onResize();

        //Next frame
        this.#frames++;

        //Update objects
        for (const obj of this.objects) {
            //Not active
            if (!obj.active) continue;

            //Draw object
            obj.update();
        }

        //Draw objects
        requestAnimationFrame(this.draw);
    }

    //Rendering
    static #background: HTMLElement = document.getElementById('background') as HTMLElement;
    static #canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;         //Real canvas
    static #canvasBuffer: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;    //Double buffer rendering (to prevent flickers after resizing the screen)
    static #canvasAlphaTest: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement; //Used to check for clicks in transparent pixels
    static #context: CanvasRenderingContext2D;
    static #contextBuffer: CanvasRenderingContext2D;
    static #contextAlphaTest: CanvasRenderingContext2D;

    static get background(): HTMLElement { return this.#background; }
    static get canvas(): HTMLCanvasElement { return this.#canvas; }
    static get canvasBuffer(): HTMLCanvasElement { return this.#canvasBuffer; }
    static get canvasAlphaTest(): HTMLCanvasElement { return this.#canvasAlphaTest; }
    static get context(): CanvasRenderingContext2D { return this.#context; }
    static get contextBuffer(): CanvasRenderingContext2D { return this.#contextBuffer; }
    static get contextAlphaTest(): CanvasRenderingContext2D { return this.#contextAlphaTest; }

    static draw = () => {
        //Clear canvas
        this.contextBuffer.clearRect(0, 0, this.canvasBuffer.width, this.canvasBuffer.height);

        //Sort objects
        this.sortObjects();

        //Check if in decor mode
        const inDecorMode = this.isAction(Action.DECOR);

        //Draw objects
        for (const obj of this.objects) {
            //Not active
            if (!obj.active) continue;

            //Check if in decor mode and object is not decor
            if (inDecorMode && !(obj as Decoration).isDecoration) continue;

            //Draw object
            obj.draw(this.contextBuffer);
        }

        //Draw double bufffer into real canvas
        this.canvas.width = this.canvasBuffer.width;
        this.canvas.height = this.canvasBuffer.height;
        this.context.drawImage(this.canvasBuffer, 0, 0);
    }

    //Game objects
    static #objects: GameObject[] = [];         //List of all the game objects (gets sorted every frame to check clicks and render back-to-front)
    static #ball: Ball;                         //Pets ball object, gets init later
    static #pets: PetCharacter[] = [];          //List of all the pets       (do not sort, positions must be the same as in extension.ts)
    static #decoration: Decoration[] = [];      //List of all the decoration (do not sort, positions must be the same as in extension.ts)
    static #monsters: MonsterCharacter[] = [];  //List of all the monsters
    static #monsterSpawner: Timeout = new Timeout(() => this.vscode.postMessage({ type: 'spawn_monster' }));

    static get objects() { return this.#objects; }
    static get ball() { return this.#ball; }
    static get pets() { return this.#pets; }
    static get decoration() { return this.#decoration; }
    static get monsters() { return this.#monsters; }
    static get monsterSpawner() { return this.#monsterSpawner; }

    static sortObjects = () => {
        //Sort objects back-to-front
        this.objects.sort((a, b) => { return a.sortingLayer != b.sortingLayer ? a.sortingLayer - b.sortingLayer : a.sortingOrder - b.sortingOrder; }); 
    }

    //Money
    static #money: number = 0;
    static #moneyText: HTMLElement = document.getElementById('money-text') as HTMLElement;

    static get money(): number { return this.#money; }

    static setMoney = (amount: number) => {
        this.#money = amount;
        this.#moneyText.innerText = `${amount}G`;
    }

    static addMoney = (amount: number) => {
        this.setMoney(this.money + amount);
        this.showMessage(`${amount >= 0 ? '+' : '-'}${Math.abs(amount)}G`);
        this.vscode.postMessage({ 
            type: 'money', 
            value: this.money 
        });
    }

    //Current action being performed
    static #action: Action = Action.NONE;

    static get action(): Action { return this.#action; };

    static isAction = (action: Action) => { 
        return this.action == action;
    }

    static setAction = (action: Action) => {
        //Update action & cursor
        this.#action = action;
        Cursor.setIcon(action);

        //Close menus & toggle decor mode overlay
        Menus.close();
        DecorMode.showOverlay(this.isAction(Action.DECOR));
    }

    //Messages
    static #messages: HTMLElement = document.getElementById('messages') as HTMLElement

    static showMessage = (content: string, isLong = false) => {
        //Create message element
        const message = document.createElement('span');
        message.classList.add('message');
        message.innerText = content;
        if (isLong) message.setAttribute('long', '');
        this.#messages.appendChild(message);

        //Set timeout to remove message element
        setTimeout(() => message.remove(), isLong ? 3000 : 2000);
    }

    //Game loop
    static #deltaAccumulation: number = 0;
    static #lastFrameTimestamp: number;
    static #animationFrame: number;

    static gameLoop = (timestamp: number) => {
        //Check if last frame timestamp is init
        if (!this.#lastFrameTimestamp) this.#lastFrameTimestamp = timestamp;

        //Calculate delta accumulation
        this.#deltaAccumulation += timestamp - this.#lastFrameTimestamp;
        this.#lastFrameTimestamp = timestamp;

        //Calculate the amount of updates needed to perform
        const interval = (1000 / this.fps);
        const updates = Math.floor(this.#deltaAccumulation / interval);

        //Perform updates
        for (let update = 0; update < updates; update++) this.update();

        //Update delta accumulation
        this.#deltaAccumulation = this.#deltaAccumulation - (updates * interval);

        //Keep the loop going
        this.#animationFrame = requestAnimationFrame(this.gameLoop);
    }

    static start = (vscode: any) => {
        //Save vscode ref
        this.#vscode = vscode

        //Init canvas contexts
        this.#context = this.canvas.getContext('2d')!;
        this.#contextBuffer = this.canvasBuffer.getContext('2d', { willReadFrequently: true })!;
        this.#contextAlphaTest = this.canvasAlphaTest.getContext('2d', { willReadFrequently: true })!;

        //Create ball
        this.#ball = new Ball();

        //Start game loop
        cancelAnimationFrame(this.#animationFrame);
        this.#animationFrame = requestAnimationFrame(this.gameLoop);
    }

    static reset = () => {
        //Remove pets
        for (const pet of Game.pets) Game.objects.removeItem(pet);
        this.#pets = [];

        //Remove decor
        for (const decor of Game.decoration) Game.objects.removeItem(decor);
        this.#decoration = [];

        //Close menus & exit decor mode
        Menus.close();
        DecorMode.toggle(false);
    }

}