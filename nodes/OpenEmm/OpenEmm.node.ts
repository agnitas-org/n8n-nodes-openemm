import {
	INodeExecutionData,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import * as loadOptions from './methods/loadOptions';
import * as mailinglist from './actions/mailinglist';
import * as recipient from './actions/recipient';
import * as content from './actions/content';
import * as mailing from './actions/mailing';
import { router } from './actions/router';

export class OpenEmm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenEMM',
		name: 'openEmm',
		icon: { light: 'file:../../icons/openEmm.svg', dark: 'file:../../icons/openEmm.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume EMM API',
		defaults: { name: 'OpenEMM' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'emmBasicApi',
				required: true,
				displayOptions: {
					show: { authentication: ['basic'] },
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [{ name: 'Basic', value: 'basic' }],
				default: 'basic',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Mailing',
						value: 'mailing',
					},
					{
						name: 'Mailing Content',
						value: 'content',
					},
					{
						name: 'Mailing List',
						value: 'mailinglist',
					},
					{
						name: 'Recipient',
						value: 'recipient',
					},
				],
				default: 'mailing',
				required: true,
			},

			...mailing.description,
			...content.description,
			...mailinglist.description,
			...recipient.description,
		],
	};

	methods = { loadOptions };

async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const responseData = await router.call(this, i);

                const executionData = this.helpers.constructExecutionMetaData(
                    this.helpers.returnJsonArray(responseData as JsonObject | JsonObject[]),
                    { itemData: { item: i } },
                );
                returnData.push(...executionData);
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ 
                        json: { error: (error as Error).message },
                        pairedItem: { item: i } 
                    });
                    continue;
                }
                throw new NodeApiError(
                    this.getNode(), 
                    error as JsonObject, 
                    { itemIndex: i }
                );
            }
        }
        return [returnData];
    }
}
