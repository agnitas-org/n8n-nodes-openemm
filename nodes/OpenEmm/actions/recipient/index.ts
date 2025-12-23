import { INodeProperties } from 'n8n-workflow';
import * as create from './create.operation';
import * as read from './read.operation';
import * as update from './update.operation';
import * as del from './delete.operation';

export { read, create, update, del as delete };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		options: [
			{
				name: 'Get',
				value: 'read',
				description: 'Get recipient',
				action: 'Get recipient',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create recipient',
				action: 'Create recipient',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update profile and binding data of recipient',
				action: 'Update recipient',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete recipient',
				action: 'Delete recipient',
			},
		],
		default: 'create',
		displayOptions: {
			show: {
				resource: ['recipient'],
			},
		},
	},

	...create.description,
	...read.description,
	...update.description,
	...del.description,
];
