"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebViewProvider = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
//Extension
let config = vscode.workspace.getConfiguration('stardew-pets');
let extensionPath;
let webview;
//Pets (species & names)
const species = {
    cat: ['black', 'gray', 'orange', 'white', 'yellow', 'purple'],
    dog: ['blonde', 'gray', 'brown', 'dark brown', 'light brown', 'purple'],
    dino: [],
    turtle: ['green', 'purple'],
    raccoon: [],
    goat: ['adult', 'baby'],
    sheep: ['adult', 'baby'],
    ostrich: ['adult', 'baby'],
    pig: ['adult', 'baby'],
    rabbit: ['adult', 'baby'],
    chicken: ['white adult', 'blue adult', 'brown adult', 'black adult', 'white baby', 'blue baby', 'brown baby', 'black baby'],
    cow: ['white adult', 'brown adult', 'white baby', 'brown baby'],
    junimo: ['white', 'black', 'gray', 'pink', 'red', 'orange', 'yellow', 'green', 'cyan', 'purple', 'brown'],
};
const names = [
    'Alex', 'lau',
    'Ángela', 'Raúl',
    'Álvaro', 'Victor',
    'Aitor', 'Chao',
    'Rodri', 'Adri',
    'Oliva', 'Pablo',
    'Sara', 'Mar',
    'David', 'Unai',
    'Nadia', 'Miriam',
    'Irene', 'Diana',
    'Aitana',
];
//Pets
let petsPath;
let pets = new Array();
class PetItem {
    index;
    label;
    description;
    constructor(index, name, description) {
        this.index = index;
        this.label = name;
        this.description = description;
    }
}
//Save & load pets
function loadPetsFile() {
    if (fs.existsSync(petsPath)) {
        //Read pets from pets.json
        try {
            //Try to read pets file
            pets = JSON.parse(fs.readFileSync(petsPath, 'utf8'));
            if (!Array.isArray(pets))
                pets = new Array();
        }
        catch (e) {
            //Failed -> Reset pets
            pets = new Array();
        }
    }
    else {
        //Create pets.json file
        savePets();
    }
}
function savePets() {
    fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2));
}
function loadPet(pet) {
    //Sends a pet to the webview
    webview.postMessage({
        type: 'add',
        specie: pet.specie,
        name: pet.name,
        color: pet.color,
    });
}
//Add & remove pets
function addPet(pet) {
    //Add to list & save json
    pets.push(pet);
    savePets();
    //load pet in webview
    loadPet(pet);
}
function removePet(index, save) {
    //Remove from pets
    pets.splice(index, 1);
    //Remove from webview
    webview.postMessage({
        type: 'remove',
        index: index,
    });
    //Save pets
    if (save)
        savePets();
}
/*$$$$$              /$$     /$$                       /$$
/$$__  $$            | $$    |__/                      | $$
| $$  \ $$  /$$$$$$$ /$$$$$$   /$$ /$$    /$$ /$$$$$$  /$$$$$$    /$$$$$$
| $$$$$$$$ /$$_____/|_  $$_/  | $$|  $$  /$$/|____  $$|_  $$_/   /$$__  $$
| $$__  $$| $$        | $$    | $$ \  $$/$$/  /$$$$$$$  | $$    | $$$$$$$$
| $$  | $$| $$        | $$ /$$| $$  \  $$$/  /$$__  $$  | $$ /$$| $$_____/
| $$  | $$|  $$$$$$$  |  $$$$/| $$   \  $/  |  $$$$$$$  |  $$$$/|  $$$$$$$
|__/  |__/ \_______/   \___/  |__/    \_/    \_______/   \___/   \______*/
function activate(context) {
    /*$$$$$   /$$                           /$$
   /$$__  $$ | $$                          | $$
  | $$  \__//$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$
  |  $$$$$$|_  $$_/   |____  $$ /$$__  $$|_  $$_/
   \____  $$ | $$      /$$$$$$$| $$  \__/  | $$
   /$$  \ $$ | $$ /$$ /$$__  $$| $$        | $$ /$$
  |  $$$$$$/ |  $$$$/|  $$$$$$$| $$        |  $$$$/
   \______/   \___/   \_______/|__/         \__*/
    console.log('My pets is now active 😽');
    //Get extension folder & pets file path
    extensionPath = context.extensionPath;
    petsPath = extensionPath + '/pets.json';
    //Load pets array
    loadPetsFile();
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
            });
        }
        //Scale changed
        if (event.affectsConfiguration("stardew-pets.scale")) {
            webview.postMessage({
                type: 'scale',
                value: config.get('scale')
            });
        }
    });
    /*$$$$$                                                                  /$$
   /$$__  $$                                                                | $$
  | $$  \__/  /$$$$$$  /$$$$$$/$$$$  /$$$$$$/$$$$   /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$$
  | $$       /$$__  $$| $$_  $$_  $$| $$_  $$_  $$ |____  $$| $$__  $$ /$$__  $$ /$$_____/
  | $$      | $$  \ $$| $$ \ $$ \ $$| $$ \ $$ \ $$  /$$$$$$$| $$  \ $$| $$  | $$|  $$$$$$
  | $$    $$| $$  | $$| $$ | $$ | $$| $$ | $$ | $$ /$$__  $$| $$  | $$| $$  | $$ \____  $$
  |  $$$$$$/|  $$$$$$/| $$ | $$ | $$| $$ | $$ | $$|  $$$$$$$| $$  | $$|  $$$$$$$ /$$$$$$$/
   \______/  \______/ |__/ |__/ |__/|__/ |__/ |__/ \_______/|__/  |__/ \_______/|______*/
    //The commands have to be defined in package.json in order to be added here
    const commandAddPet = vscode.commands.registerCommand('stardew-pets.addPet', async () => {
        //Ask for a specie
        const specie = await vscode.window.showQuickPick(Object.keys(species), {
            title: 'Select a pet',
            placeHolder: 'pet',
        });
        if (specie == null)
            return;
        //Ask for a variant
        let variants = Array();
        for (let i = 0; i < species[specie].length; i++) {
            const variant = species[specie][i];
            //Get adult/baby start index
            let index = variant.indexOf(' adult');
            if (index == -1)
                index = variant.indexOf(' baby');
            //Get name & description
            let name = (index == -1 ? variant : variant.substring(0, index)).trim();
            let description = (index == -1 ? '' : variant.substring(index)).trim();
            variants.push(new PetItem(i, name, description));
        }
        const tmpvariant = variants.length == 0 ? new PetItem(0, '', '') : await vscode.window.showQuickPick(variants, {
            title: 'Select a variant',
            placeHolder: 'variant',
        });
        if (tmpvariant == null)
            return;
        const variant = (tmpvariant.label + ' ' + tmpvariant.description).trim();
        //Ask for a name
        const tmpname = names[Math.floor(Math.random() * names.length)];
        const name = await vscode.window.showInputBox({
            title: 'Choose a name for your pet',
            placeHolder: 'name',
            value: tmpname,
            valueSelection: [0, tmpname.length],
            validateInput: text => {
                return text === '' ? 'Please input a name for your pet' : null;
            }
        });
        if (name == null)
            return;
        //Add pet
        addPet({
            specie: specie,
            name: name,
            color: variant,
        });
        //New pet!
        vscode.window.showInformationMessage(`Say hi to ${name}!`);
    });
    const commandRemovePet = vscode.commands.registerCommand('stardew-pets.removePet', async () => {
        //Get pet names
        let items = Array();
        for (let i = 0; i < pets.length; i++) {
            const pet = pets[i];
            items.push(new PetItem(i, pet.name, pet.color + ' ' + pet.specie));
        }
        //Ask for pet
        const pet = await vscode.window.showQuickPick(items, {
            title: 'Select a pet to remove',
            placeHolder: 'pet',
            matchOnDescription: true,
        });
        if (pet == null)
            return;
        //Remove pet
        removePet(pet.index, true);
        //Bye pet!
        vscode.window.showInformationMessage('Bye ' + pet.label + '!');
    });
    const commandGift = vscode.commands.registerCommand('stardew-pets.gift', async () => {
        webview.postMessage({ type: 'gift' });
    });
    const commandSettings = vscode.commands.registerCommand('stardew-pets.settings', async () => {
        //vscode.commands.executeCommand('workbench.action.openSettings', 'StardewPets');
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:Botpa.stardew-pets');
    });
    const commandOpenPetsFile = vscode.commands.registerCommand('stardew-pets.openPetsFile', async () => {
        const uri = vscode.Uri.file(petsPath);
        const success = await vscode.commands.executeCommand('vscode.openFolder', uri);
    });
    const commandReloadPetsFile = vscode.commands.registerCommand('stardew-pets.reloadPetsFile', async () => {
        //Remove all pets
        const petsLength = pets.length;
        for (let i = 0; i < petsLength; i++)
            removePet(0, false);
        //Reload pets file
        loadPetsFile();
        //Load pets
        for (let i = 0; i < pets.length; i++)
            loadPet(pets[i]);
    });
    context.subscriptions.push(commandAddPet, commandRemovePet, commandGift, commandSettings, commandOpenPetsFile, commandReloadPetsFile);
}
/*$$$$$$                                  /$$     /$$                       /$$
| $$__  $$                                | $$    |__/                      | $$
| $$  \ $$  /$$$$$$   /$$$$$$   /$$$$$$$ /$$$$$$   /$$ /$$    /$$ /$$$$$$  /$$$$$$    /$$$$$$
| $$  | $$ /$$__  $$ |____  $$ /$$_____/|_  $$_/  | $$|  $$  /$$/|____  $$|_  $$_/   /$$__  $$
| $$  | $$| $$$$$$$$  /$$$$$$$| $$        | $$    | $$ \  $$/$$/  /$$$$$$$  | $$    | $$$$$$$$
| $$  | $$| $$_____/ /$$__  $$| $$        | $$ /$$| $$  \  $$$/  /$$__  $$  | $$ /$$| $$_____/
| $$$$$$$/|  $$$$$$$|  $$$$$$$|  $$$$$$$  |  $$$$/| $$   \  $/  |  $$$$$$$  |  $$$$/|  $$$$$$$
|_______/  \_______/ \_______/ \_______/   \___/  |__/    \_/    \_______/   \___/   \______*/
function deactivate() {
    console.log('My pets is now deactivated 😿');
}
/*$      /$$           /$$       /$$    /$$ /$$
| $$  /$ | $$          | $$      | $$   | $$|__/
| $$ /$$$| $$  /$$$$$$ | $$$$$$$ | $$   | $$ /$$  /$$$$$$  /$$  /$$  /$$
| $$/$$ $$ $$ /$$__  $$| $$__  $$|  $$ / $$/| $$ /$$__  $$| $$ | $$ | $$
| $$$$_  $$$$| $$$$$$$$| $$  \ $$ \  $$ $$/ | $$| $$$$$$$$| $$ | $$ | $$
| $$$/ \  $$$| $$_____/| $$  | $$  \  $$$/  | $$| $$_____/| $$ | $$ | $$
| $$/   \  $$|  $$$$$$$| $$$$$$$/   \  $/   | $$|  $$$$$$$|  $$$$$/$$$$/
|__/     \__/ \_______/|_______/     \_/    |__/ \_______/ \_____/\__*/
class WebViewProvider {
    context;
    static viewType = 'stardew-pets';
    view;
    constructor(context) {
        this.context = context;
    }
    postMessage(message) {
        this.view?.webview.postMessage(message);
    }
    resolveWebviewView(webviewView, context, _token) {
        this.view = webviewView; //Needed so we can use it in postMessageToWebview
        const webview = webviewView.webview;
        //Allow scripts in the webview
        webview.options = {
            enableScripts: true
        };
        //Set the HTML content for the webview
        webview.html = this.getHtmlContent(webviewView.webview);
        //Handle messages
        webview.onDidReceiveMessage((message) => {
            switch (message.type) {
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
                    //Load pets
                    pets.forEach(pet => { loadPet(pet); });
                    break;
            }
        });
    }
    getHtmlContent(webview) {
        //You can reference local files (like CSS or JS) via vscode-resource URIs
        const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'style.css'));
        const petsJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'pets.js'));
        const mainJS = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'main.js'));
        //HTML
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${style}" rel="stylesheet">
        <title>stardew pets 😸</title>
      </head>
      <body>
        <div id="pets" background="${config.get('background')}"></div>
        <div id="mouse"></div>
        <script src="${petsJS}"></script>
        <script src="${mainJS}"></script>
      </body>
      </html>
    `;
    }
}
exports.WebViewProvider = WebViewProvider;
//# sourceMappingURL=extension.js.map