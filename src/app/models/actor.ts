import { AditionalInfo } from "./aditional-info";

export class Actor {
    actorID: string;
    actorType: string;
    actorName: string;
    deleted: boolean;
    aditionalInfoMap: AditionalInfo[];

    constructor(){
        this.aditionalInfoMap = [];
    }
}
