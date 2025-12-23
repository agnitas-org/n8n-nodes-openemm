import {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['mailing'], operation: ['create'] },
};

const properties: INodeProperties[] = [
	{
		displayName: 'Template Name or ID',
		name: 'templateId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'loadTemplateNames',
		},
		placeholder: 'Select template',
		required: true,
		default: '',
		description:
			'Template used for operation. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const templateId = this.getNodeParameter('templateId', i) as number;
	const qs: IDataObject = { templateId };
	return await emmRestfulRequest.call(this, `/mailing`, 'POST', {}, qs);
}
