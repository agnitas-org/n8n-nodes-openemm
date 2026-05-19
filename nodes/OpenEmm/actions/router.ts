import { IDataObject, IExecuteFunctions, } from 'n8n-workflow';
import * as mailing from './mailing';
import * as mailinglist from './mailinglist';
import * as content from './content';
import * as recipient from './recipient';

type OpenEmmExecutable = {
	execute: (this: IExecuteFunctions, i: number) => Promise<IDataObject | IDataObject[]>;
};
type ResourceGroup = Record<string, OpenEmmExecutable>;

const resources: Record<string, ResourceGroup> = {
	recipient: recipient as unknown as ResourceGroup,
	mailing: mailing as unknown as ResourceGroup,
	content: content as unknown as ResourceGroup,
	mailinglist: mailinglist as unknown as ResourceGroup,
};

export async function router(this: IExecuteFunctions, i: number): Promise<IDataObject | IDataObject[]> {
    const resource = this.getNodeParameter('resource', i) as string;
    const operation = this.getNodeParameter('operation', i) as string;
    
    const executable = resources[resource]?.[operation];
    
    if (!executable) {
        throw new Error(`The operation "${operation}" is not known in resource "${resource}".`);
    }
    return await executable.execute.call(this, i);
}
