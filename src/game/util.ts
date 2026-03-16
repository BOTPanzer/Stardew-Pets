 /*$   /$$   /$$     /$$ /$$
| $$  | $$  | $$    |__/| $$
| $$  | $$ /$$$$$$   /$$| $$
| $$  | $$|_  $$_/  | $$| $$
| $$  | $$  | $$    | $$| $$
| $$  | $$  | $$ /$$| $$| $$
|  $$$$$$/  |  $$$$/| $$| $$
 \______/    \___/  |__/|_*/

//Classes
export class Vec2 {

    //Values
    x = 0;
    y = 0;

    //Constructor
    constructor(x: number | Vec2 = 0, y: number | null = null) {
        if (typeof x === 'number') {
            //Init from numbers
            this.x = x;
            this.y = (typeof y == 'number' ? y : x);
        } else {
            //Init from another Vec2
            this.x = x.x;
            this.y = x.y;
        }
    }

    //Functions
    clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    equals(v: Vec2): boolean {
        return (this.x == v.x && this.y == v.y);
    }

    add(n: Vec2 | number): Vec2 {
        if (typeof n === 'object') {
            return new Vec2(this.x + n.x, this.y + n.y);
        } else {
            return new Vec2(this.x + n, this.y + n);
        }
    }

    subtract(n: Vec2 | number): Vec2 {
        if (typeof n === 'object') {
            return new Vec2(this.x - n.x, this.y - n.y);
        } else {
            return new Vec2(this.x - n, this.y - n);
        }
    }

    multiply(n: Vec2 | number): Vec2 {
        if (typeof n === 'object') {
            return new Vec2(this.x * n.x, this.y * n.y);
        } else {
            return new Vec2(this.x * n, this.y * n);
        }
    }

    divide(n: Vec2 | number): Vec2 {
        if (typeof n === 'object') {
            return new Vec2(this.x / n.x, this.y / n.y);
        } else {
            return new Vec2(this.x / n, this.y / n);
        }
    }

    module(n: Vec2 | number): Vec2 {
        if (typeof n === 'number') {
            return new Vec2(this.x % n, this.y % n);
        } else {
            return new Vec2(this.x % n.x, this.y % n.y);
        }
    }

    toInt(): Vec2 {
        return new Vec2(Math.floor(this.x), Math.floor(this.y));
    }

    toIntRound(): Vec2 {
        return new Vec2(Math.round(this.x), Math.round(this.y));
    }

    toIntCeil(): Vec2 {
        return new Vec2(Math.ceil(this.x), Math.ceil(this.y));
    }

    magnitude(): number { 
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    clampMagnitude(max: number): Vec2 {
        const magnitude = this.magnitude();
        if (magnitude > max) {
            return this.divide(magnitude).multiply(max);
        } else {
            return new Vec2(this);
        }
    }

    normalized(): Vec2 { 
        return this.divide(this.magnitude());
    }

    moveTowards(towards: Vec2, delta: number): Vec2 {
        const dir = towards.subtract(this);
        if (dir.magnitude() > delta) {
            return this.add(dir.normalized().multiply(delta));
        } else {
            return towards;
        }
    }

    toString(): string {
        return `(${this.x}, ${this.y})`;
    }
    
}

export class Timeout {

    //Info
    #fun: () => void
    #timeout: NodeJS.Timeout | undefined

    //Constructor
    constructor(fun: () => void, duration: number = 0) {
        this.#fun = fun;
        if (duration > 0) this.wait(duration);
    }

    //Functions
    wait(duration: number) {
        this.stop();
        this.#timeout = setTimeout(this.#fun, duration);
    }

    stop() {
        clearTimeout(this.#timeout);
    }

}

export class Util {

    //Math
    static randomExclusive(max: number) {
        //Random number from 0 to max exclusive
        return Math.floor(Math.random() * (max));
    }

    static randomInclusive(max: number) {
        //Random number from 0 to max inclusive
        return Math.floor(Math.random() * (max + 1));
    }

    static clamp(x: number, min: number, max: number) {
        //Clamp x between min and max
        return Math.min(Math.max(x, min), max);
    }

    static moveTowards(current: number, target: number, delta: number) {
        //Get distance
        const diff = target - current;
        const distance = Math.abs(diff);

        //Move towards target
        return (distance < delta ? target : current + diff / distance * delta);
    }

    //Text
    static titleCase(text: string) {
        const parts = text.toLowerCase().split(' ');
        for (var i = 0; i < parts.length; i++) parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
        return parts.join(' ');
    }

}

//Array extensions
declare global {
    interface Array<T> {
        removeAt<T>(index: number): T
        removeItem<T>(item: T): number
        isEmpty(): boolean
    }
}

Array.prototype.removeAt = function<T>(index: number): T {
    const item = this[index];
    this.splice(index, 1);
    return item;
}

Array.prototype.removeItem = function<T>(item: T): number {
    const index = this.indexOf(item);
    this.splice(index, 1);
    return index;
}

Array.prototype.isEmpty = function(): boolean {
    return (this.length === 0);
}