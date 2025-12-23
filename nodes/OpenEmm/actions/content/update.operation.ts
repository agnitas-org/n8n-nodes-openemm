import {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { contentProperty, mailingProperty } from './common';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['content'], operation: ['update'] },
};

export const properties: INodeProperties[] = [
	mailingProperty,
	contentProperty,
	{
		displayName: 'Content',
		name: 'contentArray',
		placeholder: 'Add Content',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: 'item',
				displayName: 'Item',
				values: [
					{
						displayName: 'Target Name or ID',
						name: 'target_id',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadTargetNames',
						},
						default: '',
						description:
							'Target group of the content. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					},
					{
						displayName: 'Order',
						name: 'order',
						type: 'number',
						default: '',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						typeOptions: {
							editor: 'htmlEditor',
						},
						default: '',
					},
				],
			},
		],
		default: {},
	},
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const mailingId = this.getNodeParameter('mailingId', i) as number;
	const contentNameOrId = this.getNodeParameter('mailingContentNameOrId', i) as number | string;
	const content = this.getNodeParameter('contentArray', i) as {
		item: Array<{
			target_id: number;
			order: number;
			text: string;
		}>;
	};

	const body: IDataObject = {
		content: content.item,
	};

	return await emmRestfulRequest.call(
		this,
		`/content/${mailingId}/${contentNameOrId}`,
		'PUT',
		body,
	);
}
