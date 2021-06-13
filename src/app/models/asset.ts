import {Actor} from "./actor";
import {Step} from "./step";
import {AssetItem} from "./asset-item";

export class Asset {
    assetID: string;
    assetName: string;
    description: string;
    assetItems: AssetItem[];
    actors: Actor[];
    steps: Step[];
    deleted: boolean;
    aditionalInfoMap: Map<string,string>;
}
