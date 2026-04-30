import { Vec2, Util } from './util';
import { Action, Cursor, Menus, DecorAction, DecorMode, Game } from './engine';
import { Cat, Dog, Raccoon, Dino, Duck, Turtle, Goat, Sheep, Ostrich, Pig, Rabbit, Chicken, Cow, Parrot, Horse, Junimo } from './entities/pets';
import { DecorationPresets, Decoration } from './entities/decoration';
import { Slime, Bug, Crab, Golem } from './entities/monsters';



//VSCode API
declare global {
    interface VsCodeApi {
        postMessage(msg: any): void;
        getState(): any;
        setState(value: any): void;
    }
    function acquireVsCodeApi(): any;
}

const vscode: VsCodeApi = acquireVsCodeApi();



 /*$$$$$$$                              /$$     /$$
| $$_____/                             | $$    |__/
| $$    /$$   /$$ /$$$$$$$   /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$   /$$$$$$$
| $$$$$| $$  | $$| $$__  $$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$ /$$_____/
| $$__/| $$  | $$| $$  \ $$| $$        | $$    | $$| $$  \ $$| $$  \ $$|  $$$$$$
| $$   | $$  | $$| $$  | $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$ \____  $$
| $$   |  $$$$$$/| $$  | $$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$ /$$$$$$$/
|__/    \______/ |__/  |__/ \_______/   \___/  |__/ \______/ |__/  |__/|______*/

//Actions menu
function toggleActionBall() {
    //Close actions menu & decor mode UI
    Menus.close();

    //Ball is visible -> Remove it
    if (Game.ball.active) Game.ball.onReached();
    
    //Toggle ball action
    Game.setAction(Game.isAction(Action.BALL) ? Action.NONE : Action.BALL);
}

function toggleActionGift() {
    //Close actions menu
    Menus.close();

    //Toggle gift action
    Game.setAction(Game.isAction(Action.GIFT) ? Action.NONE : Action.GIFT);
}

function toggleActionDecor() {
    //Close actions menu
    Menus.close(); 
    
    //Toggle decor mode
    DecorMode.toggle();
}

//Store menu
function createStoreItem(name: string, price: number = 0) {
    //Item element
    const element = document.createElement('div');
    element.classList.add('menuButton', 'storeButton');

    //Name text element
    const text = document.createElement('span');
    text.innerText = Util.titleCase(name.toLowerCase().replaceAll('_', ' '));
    element.append(text);

    //Add price to text
    if (price > 0) text.innerHTML += `<br><span class="storeButtonMoney" ${price > Game.money ? 'expensive' : ''}>${price}G</span>`;

    //Return element
    return element;
}

function openStoreMenu() {
    //Empty list
    const content = document.getElementById('store-content') as HTMLElement;
    content.innerHTML = '';

    //Add back button
    const back = createStoreItem('> Back');
    back.onclick = () => Menus.toggle('actions', true);
    content.appendChild(back);

    //Create decoration categories
    for (const category of Object.keys(DecorationPresets)) {
        //Create item element
        const element = createStoreItem(category);
        element.onclick = () => openStoreCategoryMenu(category);
        content.appendChild(element);
    }

    //Scroll to top
    content.scrollTop = 0;
    setTimeout(() => { content.scrollTop = 0; }, 0); //Scroll on a timer to wait until elements are rendered

    //Show store menu
    Menus.toggle('store', true);
}

function openStoreCategoryMenu(category: string) {
    //Empty list
    const content = document.getElementById('store-content') as HTMLElement;
    content.innerHTML = '';

    //Add back button
    const back = createStoreItem('> Back');
    back.onclick = openStoreMenu;
    content.appendChild(back);

    //Create category items
    for (const name of Object.keys(DecorationPresets[category])) {
        //Get decoration preset
        const preset = DecorationPresets[category][name];

        //Create item element
        const element = createStoreItem(preset.name, preset.price);
        content.appendChild(element);
        
        //Add image to element
        const imgBox = document.createElement('div');
        const img = document.createElement('div');
        img.style.setProperty('--image', `url('./sprites/decoration.png')`)
        img.style.setProperty('--width', `${preset.size.x}px`)
        img.style.setProperty('--height', `${preset.size.y}px`)
        img.style.setProperty('--scale', `${50 / Math.max(preset.size.x, preset.size.y)}`)
        img.style.setProperty('--spriteOffset', `${-preset.spriteOffset.x}px ${-preset.spriteOffset.y}px`)
        imgBox.prepend(img);
        element.prepend(imgBox);

        //Add buy function
        element.onclick = () => {
            //Check if decoration price is valid
            if (typeof preset.price !== 'number') return;

            //Check if player has enough money
            if (Game.money < preset.price) return;

            //Consume money
            Game.addMoney(-preset.price);

            //Close actions menu
            Menus.close();

            //Create decoration
            const decor = new Decoration(preset);

            //Enter decor mode (after creating decoration, else it will ask the user to buy one)
            DecorMode.toggle(true);

            //Center decoration with mouse & start dragging it
            const decorCenterRelativePos = decor.size.multiply(0.5);
            decor.moveTo(decor.snapPos(Cursor.posScaled.subtract(decorCenterRelativePos)));
            decor.startDragging(decorCenterRelativePos);

            //Notify decor added
            vscode.postMessage({
                type: 'add_decor',
                x: decor.pos.x,
                y: decor.pos.y,
                category: category,
                name: name
            });
        }
    }

    //Scroll to top
    content.scrollTop = 0;
    setTimeout(() => { content.scrollTop = 0; }, 0); //Scroll on a timer to wait until elements are rendered
}

//Register events (general)
document.getElementById('menus')!.onclick = () => Menus.close()

//Register events (actions)
document.getElementById('action-ball')!.onclick = toggleActionBall
document.getElementById('action-gift')!.onclick = toggleActionGift
document.getElementById('action-store')!.onclick = openStoreMenu
document.getElementById('action-decor')!.onclick = toggleActionDecor

//Register events (decor mode)
document.getElementById('decor-action')!.onclick = () => DecorMode.toggleAction()
document.getElementById('decor-exit')!.onclick = () => DecorMode.toggle(false)



 /*$       /$$             /$$
| $$      |__/            | $$
| $$       /$$  /$$$$$$$ /$$$$$$    /$$$$$$  /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$$
| $$      | $$ /$$_____/|_  $$_/   /$$__  $$| $$__  $$ /$$__  $$ /$$__  $$ /$$_____/
| $$      | $$|  $$$$$$   | $$    | $$$$$$$$| $$  \ $$| $$$$$$$$| $$  \__/|  $$$$$$
| $$      | $$ \____  $$  | $$ /$$| $$_____/| $$  | $$| $$_____/| $$       \____  $$
| $$$$$$$$| $$ /$$$$$$$/  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$       /$$$$$$$/
|________/|__/|_______/    \___/   \_______/|__/  |__/ \_______/|__/      |______*/

//Messages from VSCode
window.addEventListener('message', (event) => {
    //The JSON data sent by the extension
    const message = event.data;

    //Check message type
    switch (message.type.toLowerCase()) {
        //
        // Game
        //

        //Init game
        case 'init':
            document.body.removeAttribute('hide');
            break;

        //Reset game
        case 'reset':
            Game.reset();
            break;

        //Init money
        case 'money': 
            Game.setMoney(message.value);
            break;

        //
        // Settings
        //

        //Update background
        case 'background':
            Game.background.setAttribute('background', message.value.toLowerCase());
            break;

        //Update scale
        case 'scale':
            switch (message.value.toLowerCase()) {
                case 'small':
                    Game.setScale(1);
                    break;
                case 'big':
                    Game.setScale(3);
                    break;
                case 'medium':
                default:
                    Game.setScale(2);
                    break;
            }
            document.body.style.setProperty('--scale', `${Game.scale}`);
            break;

        //Update monsters toggle
        case 'monsters':
            //Clear monsters
            for (const monster of Game.monsters) monster.remove();
            
            //Toggle spawner
            if (message.value) {
                //Toggle on
                Game.monsterSpawner.wait(30 * 1000);
            } else {
                //Toggle off
                Game.monsterSpawner.stop();
            }
            break;

        //
        // Game objects
        //

        //Spawn a pet/decor/monster
        case 'spawn_pet': {
            const name = message.name;
            const specie = message.specie.toLowerCase();
            const color = message.color.toLowerCase();
            switch (specie) {
                case 'cat':
                    new Cat(name, color);
                    break;
                case 'dog':
                    new Dog(name, color);
                    break;
                case 'raccoon':
                    new Raccoon(name, color);
                    break;
                case 'dino':
                    new Dino(name, color);
                    break;
                case 'duck':
                    new Duck(name, color);
                    break;
                case 'turtle':
                    new Turtle(name, color);
                    break;
                case 'goat':
                    new Goat(name, color);
                    break;
                case 'sheep':
                    new Sheep(name, color);
                    break;
                case 'ostrich':
                    new Ostrich(name, color);
                    break;
                case 'pig':
                    new Pig(name, color);
                    break;
                case 'rabbit':
                    new Rabbit(name, color);
                    break;
                case 'chicken':
                    new Chicken(name, color);
                    break;
                case 'cow':
                    new Cow(name, color);
                    break;
                case 'parrot':
                    new Parrot(name, color);
                    break;
                case 'horse':
                    new Horse(name, color);
                    break;
                case 'junimo':
                    new Junimo(name, color);
                    break;
            }
            break;
        }

        case 'spawn_decor': {
            const pos = new Vec2(message.x, message.y)
            const category = message.category.toUpperCase().replaceAll(' ', '_');
            const name = message.name.toUpperCase().replaceAll(' ', '_');
            new Decoration(DecorationPresets[category][name], { pos: pos });
            break;
        }

        case 'spawn_monster': {
            const specie = message.specie.toLowerCase();
            const color = message.color.toLowerCase();
            switch (specie) {
                case 'slime':
                    new Slime(color);
                    break;
                case 'bug':
                    new Bug(color);
                    break;
                case 'crab':
                    new Crab(color);
                    break;
                case 'golem':
                    new Golem(color);
                    break;
            }
            break;
        }

        //Remove a pet
        case 'remove_pet':
            Game.pets[message.index].remove();
            break;

        //
        // Menus
        //

        //Toggle actions menu
        case 'actions':
            //Stop ball/gift action
            if (Game.isAction(Action.BALL) || Game.isAction(Action.GIFT)) Game.setAction(Action.NONE);

            //Show actions menu
            Menus.toggle('actions');

            //Scroll to the top
            document.getElementById('actions-content')!.scrollTop = 0;
            break;
    }
})

//Cursor events
document.body.onmousedown = (event) => {
    //Menu open -> Ignore click
    if (Menus.current) return;

    //Get scaled mouse position
    const pos = Cursor.posScaled;

    //Perform action
    switch (Game.action) {
        //Decor mode
        case Action.DECOR: {
            //Sort objects
            Game.sortObjects();

            //Check to drag decoration from nearest to farthest object
            for (let i = Game.objects.length - 1; i >= 0; i--) {
                //Get object
                const obj = Game.objects[i];

                //Check if its decoration
                if (!(obj as Decoration).isDecoration) continue;

                //Check event
                if (obj.checkMouseDown(pos)) break;
            }
            break;
        }
    }
}

document.body.onmouseup = (event) => {
    //Menu open -> Ignore click
    if (Menus.current) return;

    //Get scaled mouse position
    const pos = Cursor.posScaled;

    //Perform action
    switch (Game.action) {
        //Decor mode
        case Action.DECOR: {
            //Check decor action
            switch (DecorMode.action) {
                //Move
                case DecorAction.MOVE:
                    //Stop moving all
                    for (const decoration of Game.decoration) decoration.stopDragging();
                    break;

                //Sell
                case DecorAction.SELL:
                    //Sort objects
                    Game.sortObjects();

                    //Check to click decoration from nearest to farthest object
                    for (let i = Game.objects.length - 1; i >= 0; i--) {
                        //Get object
                        const obj = Game.objects[i];

                        //Check if its decoration
                        if (!(obj as Decoration).isDecoration) continue;

                        //Check event
                        if (obj.checkMouseUp(pos)) break;
                    }
                    break;
            }
            break;
        }

        //Place ball
        case Action.BALL: {
            //Move ball
            Game.ball.moveTo(pos.subtract(Game.ball.size.multiply(new Vec2(0.5, 1)).toInt()));
            Game.ball.setActive(true);

            //Move all pets towards ball
            for (const pet of Game.pets) pet.moveTowardsBall(pos);

            //Clear current action
            Game.setAction(Action.NONE);
            break;
        }

        //Other
        default:
            //Sort objects
            Game.sortObjects();

            //Check for clicks from nearest to farthest object
            for (let i = Game.objects.length - 1; i >= 0; i--) {
                //Get object
                const obj = Game.objects[i];

                //Check event
                if (obj.checkMouseUp(pos)) break;
            }
            
            //Clear current action
            Game.setAction(Action.NONE);
            break;
    }
}

document.onmousemove = (event) => {
    //Mouse moved -> Update cursor position
    Cursor.moveTo(new Vec2(event.clientX, event.clientY))
}

document.onmouseenter = (event) => {
    //Mouse entered screen -> Show cursor
    Cursor.setIcon(Game.action)
}

document.onmouseleave = (event) => {
    //Mouse left screen -> Hide cursor
    Cursor.setIcon(Action.NONE)
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

//Start game loop
Game.start(vscode);

//Tell VSCode the game was loaded
vscode.postMessage({ type: 'init' })