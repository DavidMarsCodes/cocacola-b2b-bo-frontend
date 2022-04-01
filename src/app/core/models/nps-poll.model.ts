export interface NpsPoll {
    active: string;
    description?:string;
    mainQuestion?: string;
    pollId: number;
    applyToAll?: boolean;
    scaleFrom?: number;
    scaleFromName?: string;
    scaleTo?: number;
    scaleToName?: string;
    secondaryActive?: boolean;
    secondaryQuestion?: string;
    section?: string;
    validTo?: string;
}

