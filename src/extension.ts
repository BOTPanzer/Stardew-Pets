import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';



//Extension
let config = vscode.workspace.getConfiguration('stardew-pets');
let webview: WebViewProvider;
let extensionStorageFolder: string = '';



//Enums
const MonsterSpecies: { [key: string]: string[] } = {
    Slime:      ['Iron', 'Tiger'],
    Bug:        ['Normal', 'Normal Dangerous', 'Armored', 'Armored Dangerous'],
    Golem:      ['Stone', 'Stone Dangerous', 'Iridium', 'Wilderness'],
    Crab:       ['Rock', 'Rock Dangerous', 'Lava', 'Lava Dangerous', 'Iridium', 'Truffle', 'Stickbug', 'Magma Cap'],
}

const PetSpecies: { [key: string]: string[] } = {
    Cat:        ['Black', 'Gray', 'Orange', 'White', 'Yellow', 'Purple'],
    Dog:        ['Blonde', 'Gray', 'Brown', 'Dark Brown', 'Light Brown', 'Purple'],
    Turtle:     ['Green', 'Purple'],
    Dino:       [],
    Duck:       [],
    Raccoon:    [],
    Goat:       ['Adult', 'Baby'],
    Sheep:      ['Adult', 'Baby'],
    Ostrich:    ['Adult', 'Baby'],
    Pig:        ['Adult', 'Baby'],
    Rabbit:     ['Adult', 'Baby'],
    Chicken:    ['White Adult', 'White Baby', 'Blue Adult', 'Blue Baby', 'Brown Adult', 'Brown Baby', 'Black Adult', 'Black Baby'],
    Cow:        ['White Adult', 'White Baby', 'Brown Adult', 'Brown Baby'],
    Parrot:     ['Green Adult', 'Green Baby', 'Blue Adult', 'Blue Baby', 'Golden Joja'],
    Horse:      [],
    Junimo:     ['White', 'Black', 'Gray', 'Pink', 'Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Purple', 'Brown'],
}

const Names: string[] = [
    'Alex',     'Raúl',     'Aitor',    'Chao',
    'Mar',      'Sara',     'Pablo',    'Laura',
    'Ángela',   'David',    'Unai',     'Aitana',
    'Nadia',    'Miriam',   'Álvaro',   'Victor',
    'Rodri',    'Adri',     'Oliva',    'Irene',
    'Lucía',    'Artyom',   'Judy',     'Panam'
]



//Save
type Pet = {
    name: string;
    specie: string;
    color: string;
}

type Decoration = {
    x: 0,
    y: 0,
    category: string;
    name: string;
}

class Save {

    public money: number = 0;
    public pets: Array<Pet> = new Array<Pet>();
    public decoration: Array<Decoration> = new Array<Decoration>();

}

let savePath: string;
let save = new Save();

function loadGame() {
    //Storage folder does not exist -> Create it
    if (!fs.existsSync(extensionStorageFolder)) fs.mkdirSync(extensionStorageFolder, { recursive: true });

    //Bool to check if the save was updated to save its file after load
    let saveUpdated: boolean = false;

    //Check if save file exists
    if (fs.existsSync(savePath)) {
        //Exists -> Load save
        try {
            //Read save
            save = JSON.parse(fs.readFileSync(savePath, 'utf8'));
        } catch (e) {
            //Failed -> Reset save
            save = new Save();

            //Load old pets file if it exists
            loadPetsFile();

            //Save updated
            saveUpdated = true;
        }
    } else {
        //Does not exist -> Load old pets file if it exists
        loadPetsFile();

        //Save updated
        saveUpdated = true;
    }

    //Invalid money value
    if (typeof save.money !== 'number') {
        //Reset money value
        save.money = 0;

        //Save updated
        saveUpdated = true;
    }

    //Invalid pets list
    if (!Array.isArray(save.pets)) {
        //Reset pets list
        save.pets = new Array<Pet>();

        //Save updated
        saveUpdated = true;
    }

    //Invalid decoration list
    if (!Array.isArray(save.decoration)) {
        //Reset decoration list
        save.decoration = new Array<Decoration>();

        //Save updated
        saveUpdated = true;
    }

    //Save game file
    if (saveUpdated) saveGame();
}

function saveGame() {
    fs.writeFileSync(savePath, JSON.stringify(save, null, 4));
}

function initGame() {
    //Send background
    webview.postMessage({
        type: 'background',
        value: config.get('background')
    });

    //Send scale
    webview.postMessage({
        type: 'scale',
        value: config.get('scale')
    });

    //Send monsters toggle
    webview.postMessage({
        type: 'monsters',
        value: config.get('monsters')
    });

    //Send money
    webview.postMessage({
        type: 'money',
        value: save.money
    });

    //Load pets
    for (const pet of save.pets) loadPet(pet);

    //Load decor
    for (const decor of save.decoration) loadDecor(decor);

    //Finish
    webview.postMessage({ type: 'init' });
}

function loadPetsFile() {
    //Get old pets save file path
    const petsPath = path.join(extensionStorageFolder, 'pets.json');

    //Check if old pets file exists
    if (fs.existsSync(petsPath)) {
        //Exists -> Load it
        try {
            //Read file
            save.pets = JSON.parse(fs.readFileSync(petsPath, 'utf8'));

            //Check if pets list is valid
            if (Array.isArray(save.pets)) {
                //Valid -> Delete file
                fs.unlinkSync(petsPath);
            } else {
                //Invalid -> Throw error
                throw new Error('Failed to read old pets file');
            }
        } catch (e) {
            //Failed -> Reset pets list
            save.pets = new Array<Pet>();
        }
    } else {
        //Does not exist -> Reset pets list
        save.pets = new Array<Pet>();
    }
}

//Pets
class PetItem implements vscode.QuickPickItem {

    public index: number;
    public label: string;
    public description: string;
    public iconPath: vscode.Uri;

    constructor(context: vscode.ExtensionContext, index: number, specie: string, variant: string, name: string, description: string) {
        this.index = index;
        this.label = name;
        this.description = description;
        const fileName = (variant === '' ? specie : `${specie}_${variant}`).toLowerCase().replaceAll(' ', '_')
        this.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'icons', 'pets', `${fileName}.png`))
    }

}

function loadPet(pet: Pet) {
    //Sends a pet to the webview
    webview.postMessage({
        type: 'spawn_pet',
        name: pet.name,
        specie: pet.specie,
        color: pet.color,
    });
}

function addPet(pet: Pet) {
    //Add to list & save json
    save.pets.push(pet);
    saveGame();

    //load pet in webview
    loadPet(pet);
}

function removePet(index: number, saveFile: boolean) {
    //Remove from pets
    save.pets.splice(index, 1);

    //Remove from webview
    webview.postMessage({
        type: 'remove_pet',
        index: index,
    });

    //Save pets
    if (saveFile) saveGame();
}

//Decoration
function loadDecor(decor: Decoration) {
    //Sends a decoration to the webview
    webview.postMessage({
        type: 'spawn_decor',
        x: decor.x,
        y: decor.y,
        category: decor.category,
        name: decor.name,
    });
}

//Selections
async function selectPetSpecie(context: vscode.ExtensionContext): Promise<string | null> {
    //Create items
    const items = Object.keys(PetSpecies).map(specie => {
        const variants = PetSpecies[specie]
        return new PetItem(context, 0, specie, variants.length == 0 ? '' : variants[0], specie, variants.join(', '))
    });

    //Ask for a specie
    const item = await vscode.window.showQuickPick(items, {
        title: 'Select a pet to add',
        placeHolder: 'Pet'
    });

    //Return specie
    return (item == null ? null : item.label);
}

async function selectPetVariant(context: vscode.ExtensionContext, specie: string): Promise<string | null> {
    //Create items
    const items = PetSpecies[specie].map(variant => {
        //Get adult/baby start index
        let index = variant.indexOf(' adult');
        if (index == -1) index = variant.indexOf(' baby');

        //Get name & description
        let name = (index == -1 ? variant : variant.substring(0, index)).trim();
        let description = (index == -1 ? '' : variant.substring(index)).trim();
        return new PetItem(context, 0, specie, variant, name, description);
    })

    //Check items
    if (items.length == 0) return '';

    //Ask for a variant
    const item = await vscode.window.showQuickPick(items, {
        title: `Select a ${specie.toLowerCase()} variant`,
        placeHolder: 'Variant',
    });

    //Return variant
    return (item == null ? null : `${item.label} ${item.description}`.trim());
}



  /*$$$$$              /$$     /$$                       /$$
 /$$__  $$            | $$    |__/                      | $$
| $$  \ $$  /$$$$$$$ /$$$$$$   /$$ /$$    /$$ /$$$$$$  /$$$$$$    /$$$$$$
| $$$$$$$$ /$$_____/|_  $$_/  | $$|  $$  /$$/|____  $$|_  $$_/   /$$__  $$
| $$__  $$| $$        | $$    | $$ \  $$/$$/  /$$$$$$$  | $$    | $$$$$$$$
| $$  | $$| $$        | $$ /$$| $$  \  $$$/  /$$__  $$  | $$ /$$| $$_____/
| $$  | $$|  $$$$$$$  |  $$$$/| $$   \  $/  |  $$$$$$$  |  $$$$/|  $$$$$$$
|__/  |__/ \_______/   \___/  |__/    \_/    \_______/   \___/   \______*/

export function activate(context: vscode.ExtensionContext) {

      /*$$$$$   /$$                           /$$
     /$$__  $$ | $$                          | $$
    | $$  \__//$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$
    |  $$$$$$|_  $$_/   |____  $$ /$$__  $$|_  $$_/
     \____  $$ | $$      /$$$$$$$| $$  \__/  | $$
     /$$  \ $$ | $$ /$$ /$$__  $$| $$        | $$ /$$
    |  $$$$$$/ |  $$$$/|  $$$$$$$| $$        |  $$$$/
     \______/   \___/   \_______/|__/         \__*/

    //Extension is active
    console.log('Stardew Pets is now active 😽');

    //Get extension folder & save file path
    extensionStorageFolder = context.globalStorageUri.path.substring(1);
    savePath = path.join(extensionStorageFolder, 'save.json');

    //Load save file
    loadGame();



     /*$      /$$           /$$       /$$    /$$ /$$
    | $$  /$ | $$          | $$      | $$   | $$|__/
    | $$ /$$$| $$  /$$$$$$ | $$$$$$$ | $$   | $$ /$$  /$$$$$$  /$$  /$$  /$$
    | $$/$$ $$ $$ /$$__  $$| $$__  $$|  $$ / $$/| $$ /$$__  $$| $$ | $$ | $$
    | $$$$_  $$$$| $$$$$$$$| $$  \ $$ \  $$ $$/ | $$| $$$$$$$$| $$ | $$ | $$
    | $$$/ \  $$$| $$_____/| $$  | $$  \  $$$/  | $$| $$_____/| $$ | $$ | $$
    | $$/   \  $$|  $$$$$$$| $$$$$$$/   \  $/   | $$|  $$$$$$$|  $$$$$/$$$$/
    |__/     \__/ \_______/|_______/     \_/    |__/ \_______/ \_____/\__*/

    webview = new WebViewProvider(context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(WebViewProvider.viewType, webview));

    vscode.workspace.onDidChangeConfiguration(event => {
        //Update config
        config = vscode.workspace.getConfiguration('stardew-pets');

        //Background changed
        if (event.affectsConfiguration("stardew-pets.background")) {
            webview.postMessage({
                type: 'background',
                value: config.get('background')
            })
        }

        //Scale changed
        if (event.affectsConfiguration("stardew-pets.scale")) {
            webview.postMessage({
                type: 'scale',
                value: config.get('scale')
            })
        }

        //Monsters toggle changed
        if (event.affectsConfiguration("stardew-pets.monsters")) {
            webview.postMessage({
                type: 'monsters',
                value: config.get('monsters')
            })
        }
    })



      /*$$$$$                                                                  /$$
     /$$__  $$                                                                | $$
    | $$  \__/  /$$$$$$  /$$$$$$/$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$$
    | $$       /$$__  $$| $$_  $$_  $$| $$_  $$_  $$ |____  $$| $$__  $$ /$$__  $$ /$$_____/
    | $$      | $$  \ $$| $$ \ $$ \ $$| $$ \ $$ \ $$  /$$$$$$$| $$  \ $$| $$  | $$|  $$$$$$
    | $$    $$| $$  | $$| $$ | $$ | $$| $$ | $$ | $$ /$$__  $$| $$  | $$| $$  | $$ \____  $$
    |  $$$$$$/|  $$$$$$/| $$ | $$ | $$| $$ | $$ | $$|  $$$$$$$| $$  | $$|  $$$$$$$ /$$$$$$$/
     \______/  \______/ |__/ |__/ |__/|__/ |__/ |__/ \_______/|__/  |__/ \_______/|______*/

    //Commands have to be defined in package.json in order to be added here

    //Add pet
    const commandAddPet = vscode.commands.registerCommand('stardew-pets.addPet', async () => {
        //Ask for a specie
        const specie = await selectPetSpecie(context);
        if (specie == null) return;

        //Ask for a variant
        const variant = await selectPetVariant(context, specie);
        if (variant == null) return;

        //Ask for a name
        const tempName = Names[Math.floor(Math.random() * Names.length)];
        const name = await vscode.window.showInputBox({
            title: 'Choose a name for your pet',
            placeHolder: 'Name',
            value: tempName,
            valueSelection: [0, tempName.length],
            validateInput: text => (text === '' ? 'Please input a name for your pet' : null)
        });
        if (name == null) return;

        //Add pet
        addPet({
            specie: specie,
            name: name,
            color: variant,
        });

        //New pet!
        vscode.window.showInformationMessage(`Say hi to ${name}!`);
    });

    //Remove pet
    const commandRemovePet = vscode.commands.registerCommand('stardew-pets.removePet', async () => {
        //Get pet names
        let items = Array<PetItem>();
        for (let i = 0; i < save.pets.length; i++) {
            const pet = save.pets[i];
            items.push(new PetItem(context, i, pet.specie, pet.color, pet.name, pet.color + ' ' + pet.specie));
        }

        //Ask for pet
        const pet = await vscode.window.showQuickPick(items, {
            title: 'Select a pet to remove',
            placeHolder: 'Pet',
            matchOnDescription: true,
        });
        if (pet == null) return;

        //Remove pet
        removePet(pet.index, true);

        //Bye pet!
        vscode.window.showInformationMessage('Bye ' + pet.label + '!');
    });

    //Actions
    const commandAction = vscode.commands.registerCommand('stardew-pets.actions', async () => {
        webview.postMessage({ type: 'actions' });
    });

    //Open settings
    const commandSettings = vscode.commands.registerCommand('stardew-pets.settings', async () => {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:Botpa.stardew-pets');
    });

    //Open save file
    const commandOpenSaveFile = vscode.commands.registerCommand('stardew-pets.openSaveFile', async () => {
        const uri = vscode.Uri.file(savePath);
        const success = await vscode.commands.executeCommand('vscode.openFolder', uri);
    });

    //Reload save file
    const commandReloadSaveFile = vscode.commands.registerCommand('stardew-pets.reloadSaveFile', async () => {
        //Reset extension
        webview.postMessage({ type: 'reset' });

        //Reload save file
        loadGame();

        //Init game again
        initGame();
    });

    //Add commands
    context.subscriptions.push(commandAddPet, commandRemovePet, commandAction, commandSettings, commandOpenSaveFile, commandReloadSaveFile);
}



 /*$$$$$$                                  /$$     /$$                       /$$              
| $$__  $$                                | $$    |__/                      | $$              
| $$  \ $$  /$$$$$$   /$$$$$$   /$$$$$$$ /$$$$$$   /$$ /$$    /$$ /$$$$$$  /$$$$$$    /$$$$$$ 
| $$  | $$ /$$__  $$ |____  $$ /$$_____/|_  $$_/  | $$|  $$  /$$/|____  $$|_  $$_/   /$$__  $$
| $$  | $$| $$$$$$$$  /$$$$$$$| $$        | $$    | $$ \  $$/$$/  /$$$$$$$  | $$    | $$$$$$$$
| $$  | $$| $$_____/ /$$__  $$| $$        | $$ /$$| $$  \  $$$/  /$$__  $$  | $$ /$$| $$_____/
| $$$$$$$/|  $$$$$$$|  $$$$$$$|  $$$$$$$  |  $$$$/| $$   \  $/  |  $$$$$$$  |  $$$$/|  $$$$$$$
|_______/  \_______/ \_______/ \_______/   \___/  |__/    \_/    \_______/   \___/   \______*/

export function deactivate() {
    console.log('Stardew Pets is now deactivated 😿')
}



 /*$      /$$           /$$       /$$    /$$ /$$                        
| $$  /$ | $$          | $$      | $$   | $$|__/                        
| $$ /$$$| $$  /$$$$$$ | $$$$$$$ | $$   | $$ /$$  /$$$$$$  /$$  /$$  /$$
| $$/$$ $$ $$ /$$__  $$| $$__  $$|  $$ / $$/| $$ /$$__  $$| $$ | $$ | $$
| $$$$_  $$$$| $$$$$$$$| $$  \ $$ \  $$ $$/ | $$| $$$$$$$$| $$ | $$ | $$
| $$$/ \  $$$| $$_____/| $$  | $$  \  $$$/  | $$| $$_____/| $$ | $$ | $$
| $$/   \  $$|  $$$$$$$| $$$$$$$/   \  $/   | $$|  $$$$$$$|  $$$$$/$$$$/
|__/     \__/ \_______/|_______/     \_/    |__/ \_______/ \_____/\__*/

export class WebViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'stardew-pets';

    private view?: vscode.WebviewView;

    constructor(private readonly context: vscode.ExtensionContext) { }

    public postMessage(message: any) {
        this.view?.webview.postMessage(message);
    }

    public async resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
        //Needed so we can use it in postMessageToWebview
        this.view = webviewView;

        //Get webview
        const webview = webviewView.webview;

        //Allow scripts in the webview
        webview.options = {
            enableScripts: true
        };

        //Set the HTML content for the webview
        webview.html = await this.getHtmlContent(webviewView.webview);

        //Handle messages
        webview.onDidReceiveMessage(message => {
            switch (message.type.toLowerCase()) {
                //Error message
                case 'error':
                    vscode.window.showErrorMessage(message.text);
                    break;

                //Info message
                case 'info':
                    vscode.window.showInformationMessage(message.text);
                    break;

                //Init pets
                case 'init':
                    initGame();
                    break;

                //Update money
                case 'money':
                    save.money = message.value;
                    saveGame();
                    break;

                //Spawn monster
                case 'spawn_monster': {
                    //Get specie
                    const species = Object.keys(MonsterSpecies);
                    const specie = species[Math.floor(Math.random() * species.length)];

                    //Get color
                    const colors = MonsterSpecies[specie]
                    const color =  colors[Math.floor(Math.random() * colors.length)];

                    //Spawn monster
                    this.postMessage({
                        type: 'spawn_monster',
                        specie: specie,
                        color: color,
                    });
                    break;
                }

                //Decoration
                case 'move_decor': {
                    //Get decoration
                    const index = message.index;
                    const decoration = save.decoration[index];

                    //Update position
                    decoration.x = message.x;
                    decoration.y = message.y;

                    //Save game
                    saveGame();
                    break;
                }

                case 'add_decor': {
                    //Create decoration
                    const decoration: Decoration = {
                        x: message.x,
                        y: message.y,
                        category: message.category,
                        name: message.name
                    };

                    //Add decoration to list
                    save.decoration.push(decoration);

                    //Save game
                    saveGame();
                    break;
                }

                case 'remove_decor': {
                    //Get decoration
                    const index = message.index;
                    save.decoration.splice(index, 1);

                    //Save game
                    saveGame();
                    break;
                }
            }
        });
    }

    private async getHtmlContent(webview: vscode.Webview): Promise<string> {
        //Read HTML file
        const htmlPath = vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.html');
        const fileData = await vscode.workspace.fs.readFile(htmlPath);
        const htmlContent = new TextDecoder().decode(fileData);

        //Replace media folder URI placeholder with path
        return htmlContent.replaceAll('{media}', `${webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media'))}/`);
    }

}
