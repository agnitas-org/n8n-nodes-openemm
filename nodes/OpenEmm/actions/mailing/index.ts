import { INodeProperties } from 'n8n-workflow';
import * as create from './create.operation';
import * as read from './read.operation';
import * as update from './update.operation';
import * as del from './delete.operation';
import * as copy from './copy.operation';
import * as send from './send.operation';

export { copy, create, del as delete, read, send, update };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: { resource: ['mailing'] },
		},
		options: [
			{
				name: 'Copy',
				value: 'copy',
				description: 'Copy mailing',
				action: 'Copy mailing',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create mailing',
				action: 'Create mailing',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete mailing',
				action: 'Delete mailing',
			},
			{
				name: 'Get',
				value: 'read',
				description: 'Get mailing',
				action: 'Get mailing',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send mailing',
				action: 'Send mailing',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update mailing',
				action: 'Update mailing',
			},
		],
		default: 'send',
	},

	...create.description,
	...read.description,
	...update.description,
	...del.description,
	...copy.description,
	...send.description,
];
