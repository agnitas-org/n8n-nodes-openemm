import { IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import {
	createOrUpdateRecipient,
	emailProperty,
	mailinglistProperty,
	manageSubscriptionProperty,
	recipientFieldsProperty,
	statusProperty,
} from './common';

const displayOptions = {
	show: { resource: ['recipient'], operation: ['update'] },
};

const properties: INodeProperties[] = [
	emailProperty,
	manageSubscriptionProperty,
	mailinglistProperty,
	statusProperty,
	recipientFieldsProperty,
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	return await createOrUpdateRecipient.call(this, i, true);
}
