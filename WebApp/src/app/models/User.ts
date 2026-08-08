import { CommonFunctions } from "../utilities/CommonFunctions";
import { CGridColumnFilterOption } from "./GridColumnFilterOption";
import { IActionButtonCellRendererRowData } from "../features/fkMgmt/CellRenderers/ActionButtonsCellRenderer/ActionButtonCellRendererRowData";

export class CUser {
    Id: number;
    Username: string;
    FullName: string;
    EMail: string;
    IsActive: boolean;
    Roles: string[] = [];

    constructor() {
        this.Id = -1;
        this.Username = '';
        this.FullName = '';
        this.EMail = '';
        this.IsActive = false;
    }

    get RolesStr(): string {
        return this.Roles.join(', ');
    }
    static readFromAPIResult(data: any[]): Array<CUser> {

        const users = new Array<CUser>();
        const length = data.length;
        for (let i = 0; i < length; i++) {
            const newUser = new CUser();
            newUser.readSingleFromAPIResult(data[i]);
            users.push(newUser);
        }
        return users;
    }

    readSingleFromAPIResult(data: any) {

        this.Id = data.id;
        this.Username = data.un;
        this.FullName = data.fNm;
        this.EMail = data.em;
        this.IsActive = data.a;
        if(CommonFunctions.isValid(data.r)) {
            this.Roles = data.r;
        }
    }

}

export class CUserForAddEdit extends CUser implements IActionButtonCellRendererRowData {
    static readonly MAX_FULL_NAME_SIZE = 100;
    static readonly MAX_USER_NAME_SIZE = 100;
    Password: string;
    IsLocked: boolean;
    OldFullName: string;
    OldEMail: string;

    constructor() {
        super();
        this.Password = '';
        this.IsLocked = false;
        this.OldFullName = '';
        this.OldEMail = '';
        
    }

    get FullNameTooltip(): string {
        if(this.isFullNameValid()) {
            return this.FullName;
        } else {
            return `Full name cannot be longer than ${CUserForAddEdit.MAX_FULL_NAME_SIZE} characters`;
        }
    }
    get EmailTooltip(): string {
        if(this.isEmailValid()) {
            return this.EMail;
        } else {
            return `Invalid email address`;
        }
    }

    FullNameSaveInProgress = false;
    EmailSaveInProgress = false;
    isFullNameValid(): boolean {
        return CommonFunctions.isStringNullOrEmpty(this.FullName) ||
            CUserForAddEdit.MAX_FULL_NAME_SIZE >= this.FullName.trim().length;
    }

    isEmailValid(): boolean {
        return CommonFunctions.isStringNullOrEmpty(this.EMail) || 
            CommonFunctions.isValidEmail(this.EMail);
    }

    getDataForRegisterAPI(): any {
        return {
            UserName: this.Username,
            Email: this.EMail,
            FullName: this.FullName,
            Password: this.Password,
            Roles: this.Roles
        };
    }

    showDelete(): boolean {
        return true;
    }
    static override readFromAPIResult(data: any[]): Array<CUserForAddEdit> {

        const users = new Array<CUserForAddEdit>();
        const length = data.length;
        for (let i = 0; i < length; i++) {
            const newUser = new CUserForAddEdit();
            newUser.readSingleFromAPIResult(data[i]);
            users.push(newUser);
        }
        
        return users;
    }

    override readSingleFromAPIResult(data: any) {
        this.IsLocked = data.l;
        super.readSingleFromAPIResult(data);
    }

    get RolesTooltip() {
        let rolesHtml = '';
        this.Roles.forEach(r => {
            rolesHtml += `<span >${r}</span><br>`;
        });

        return `
            <div>
                ${rolesHtml}
            </div>
        `;
    }
}

export class CUserRoleSelection {
    Role: string;
    Selected: boolean;

    constructor(role: string, isSelected: boolean) {
       this.Role = role;
       this.Selected = isSelected;
    }
}