import { IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import {
	createOrUpdateRecipient,
	mailinglistProperty,
	manageSubscriptionProperty,
	recipientFieldsProperty,
	statusProperty,
} from './common';

const displayOptions = {
	show: { resource: ['recipient'], operation: ['create'] },
};

const properties: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'emailOrId',
		type: 'string',
		placeholder: 'e.g. recipient@email.com',
		required: true,
		default: '',
		description: 'Email address of the recipient',
	},
	manageSubscriptionProperty,
	mailinglistProperty,
	statusProperty,
	recipientFieldsProperty,
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	return await createOrUpdateRecipient.call(this, i, false);
}
