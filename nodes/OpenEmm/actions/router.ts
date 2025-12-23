import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import * as mailing from './mailing';
import * as mailinglist from './mailinglist';
import * as content from './content';
import * as recipient from './recipient';

type OpenEmmExecutable = {
	execute: (this: IExecuteFunctions, i: number) => Promise<IDataObject>;
};
type ResourceGroup = Record<string, OpenEmmExecutable>;

const resources: Record<string, ResourceGroup> = {
	recipient: recipient as unknown as ResourceGroup,
	mailing: mailing as unknown as ResourceGroup,
	content: content as unknown as ResourceGroup,
	mailinglist: mailinglist as unknown as ResourceGroup,
};

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();

	const returnData: INodeExecutionData[] = [];
	for (let i = 0; i < items.length; i++) {
		returnData.push(...(await tryExecuteOperation.call(this, i)));
	}
	return [returnData];
}

async function tryExecuteOperation(
	this: IExecuteFunctions,
	i: number,
): Promise<INodeExecutionData[]> {
	try {
		return this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray((await executeOperation.call(this, i)) as IDataObject),
			{ itemData: { item: i } },
		);
	} catch (error) {
		if (this.continueOnFail()) {
			return [{ json: { error: error.message } }];
		}
		throw error;
	}
}

async function executeOperation(this: IExecuteFunctions, i: number): Promise<IDataObject> {
	const resource = this.getNodeParameter('resource', 0);
	const operation = this.getNodeParameter('operation', 0);
	return resources[resource as string]?.[operation]?.execute.call(this, i) ?? [];
}
