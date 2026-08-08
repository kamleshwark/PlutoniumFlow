export class CHeaderInfoPair {
    Header: string;
    Info: string;

    constructor();
    constructor(header: string, info: string);

    constructor(header?: string, info?: string) {
        this.Header = header;
        this.Info = info;
    }
}
