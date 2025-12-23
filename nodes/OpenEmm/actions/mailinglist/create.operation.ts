import {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['mailinglist'], operation: ['create'] },
};

export const properties: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		placeholder: 'e.g. Weekly updates',
		default: '',
		required: true,
		description: 'Name of mailing list to target',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		default: '',
		placeholder: 'Optional short description of this mailing list',
		description: 'A note about the meaning of this mailing list',
	},
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const name = this.getNodeParameter('name', i) as string;
	const description = this.getNodeParameter('description', i) as string;
	const body: IDataObject = { name, description };
	return await emmRestfulRequest.call(this, `/mailinglist/${0}`, 'PUT', body, {});
}
