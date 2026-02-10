import {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
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
						displayName: 'ID',
						name: 'id',
						type: 'string',
						required: true,
						default: '',
						description: 'The unique ID of the mailing content block to update',
					},
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
						default: 0,
						typeOptions: {
							minValue: 0,
						},
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
			id: number;
			target_id: number;
			order: number;
			text: string;
		}>;
	};

	if (!content.item || content.item.length === 0) {
		throw new NodeOperationError(this.getNode(), 'At least one Content item is required.');
	}

	for (let i = 0; i < content.item.length; i++) {
		content.item[i].id = Number(content.item[i].id);

		if (!Number.isInteger(content.item[i].id) || content.item[i].id <= 0) {
			throw new NodeOperationError(
				this.getNode(),
				`Content item #${i + 1}: ID is required and must be a positive number (> 0).`,
			);
		}
	}

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
