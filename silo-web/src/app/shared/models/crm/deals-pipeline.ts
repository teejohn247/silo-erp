export interface KanbanStage {
    id: string;
    _id?: any;
    name: string;
    order: number;
    color?: string;
    theme?: string;
}

export interface KanbanItem {
    id: string;
    stageId: string;
    data: any;
    theme?: string;
    /** optional if you want stable ordering persisted */
    sortOrder?: number;
}

export type KanbanMoveEvent = {
    itemId: string;
    fromStageId: string;
    toStageId: string;
    previousIndex: number;
    currentIndex: number;
    item: KanbanItem;
};