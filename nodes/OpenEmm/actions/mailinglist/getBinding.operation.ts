import { IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['mailinglist'], operation: ['getBinding'] },
};

const properties: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'emailOrRecipientId',
		type: 'string',
		required: true,
		placeholder: 'e.g. recipient@email.com',
		default: '',
		description: 'Email address of the recipient',
	},
	{
		displayName: 'Mailing List Name or ID',
		name: 'mailinglistNameOrId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'loadMailinglistNames',
		},
		placeholder: 'Select mailinglist',
		required: true,
		default: '',
		description:
			'Mailing list to change binding. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const emailOrRecipientId = this.getNodeParameter('emailOrRecipientId', i) as string;
	const mailinglist = this.getNodeParameter('mailinglistNameOrId', i) as number;
	return await emmRestfulRequest.call(this, `/binding/${emailOrRecipientId}/${mailinglist}`, 'GET');
}
