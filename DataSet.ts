import { getISODate } from './util.ts'
import { config } from "./config.ts";

export class DataSet {
    name: string;
    dirPath: string;
    private lastStr: string | null = null;
    constructor(name: string) {
        this.name = name;
        this.dirPath = `data/sets/${this.name}`;
        Deno.mkdir(this.dirPath, { recursive: true });
    }
    getfilePath(date?: Date) {
        if (!date) date = new Date();
        return `${this.dirPath}/${getISODate(date)}`;
    }
    async readAll(date?: Date) {
        const path = this.getfilePath(date);
        try {
            var stat = await Deno.stat(path);
            if (!stat.isFile) return '';
            return await Deno.readTextFile(path);
        } catch (error) {
            return '';
        }
    }
    async append(str: string) {
        const path = this.getfilePath();
        const f = await Deno.open(path, { create: true, append: true });
        str += '\n';
        await f.write(new TextEncoder().encode(str));
        f.close();
        this.lastStr = str;
    }
    async getLast() {
        return this.lastStr;
    }
}

export const dataSets = {
    sets: {} as Record<string, DataSet>,
    get(name: any) {
        return Object.prototype.hasOwnProperty.call(this.sets, name)
            ? (this.sets as any)[name] as DataSet
            : null;
    }
};

config.datasets.forEach(name => dataSets.sets[name] = new DataSet(name));
