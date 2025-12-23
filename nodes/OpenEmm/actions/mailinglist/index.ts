import { INodeProperties } from 'n8n-workflow';
import * as create from './create.operation';
import * as getBinding from './getBinding.operation';

export { create, getBinding };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create mailing list',
			},
			{
				name: 'Get Recipient Binding',
				value: 'getBinding',
				action: 'Get recipient binding',
			},
		],
		default: 'create',
		displayOptions: {
			show: { resource: ['mailinglist'] },
		},
	},

	...create.description,
	...getBinding.description,
];
