import { INodeProperties } from 'n8n-workflow';
import * as read from './read.operation';
import * as update from './update.operation';
import * as del from './delete.operation';

export { read, update, del as delete };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: { resource: ['content'] },
		},
		options: [
			{
				name: 'Get',
				value: 'read',
				description: 'Get mailing content',
				action: 'Get mailing content',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update mailing content',
				action: 'Update mailing content',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete mailing content',
				action: 'Delete mailing content',
			},
		],
		default: 'read',
	},

	...read.description,
	...update.description,
	...del.description,
];
