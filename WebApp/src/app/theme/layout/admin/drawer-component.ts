export enum DrawerComponent {
    eNone = 0,
    eProjectAddEditDrawer,
    eImportProjectTasksDrawer,
    eFKHierarchyCreationFKSubItemAddEditDrawer,
    eAddEditIssuesDrawer,
    eL1PlanningDateSettingsDrawer,
    eGanttChartDrawer,
    eAddEditBudgetDrawer,
    eSubtasksMgmtDrawer,
    eMilestoneDefinitionDrawer,
    eFKGateDefinitionDrawer,
    eTaskRemarksDrawer,
    eNewUserDrawer
}

export class CDrawerRequestData {
    Component:DrawerComponent;
    Class:string;
    Data:any;
}
