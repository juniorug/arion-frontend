import {Actor} from "./actor";
import {Step} from "./step";
import {AssetItem} from "./asset-item";
import { AditionalInfo } from "./aditional-info";

export class Asset {
    assetID: string;
    assetName: string;
    description: string;
    assetItems: AssetItem[];
    actors: Actor[];
    steps: Step[];
    deleted: boolean;
    aditionalInfoMap: AditionalInfo[];

    constructor(){
        this.assetItems = [];
        this.actors = [];
        this.steps = [];
        this.aditionalInfoMap = [];
    }
}
