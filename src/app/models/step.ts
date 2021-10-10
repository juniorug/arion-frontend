import { AditionalInfo } from "./aditional-info";

export class Step {
    stepID: string;
    stepName: string;
    stepOrder: number;
    actorType: string;
    deleted: boolean;
    aditionalInfoMap: AditionalInfo[];

    constructor(){
        this.aditionalInfoMap = [];
    }
}
