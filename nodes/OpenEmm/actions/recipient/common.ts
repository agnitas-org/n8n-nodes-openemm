import { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { emmRestfulRequest } from '../../transport';

export const emailProperty: INodeProperties = {
	displayName: 'Email or ID',
	name: 'emailOrId',
	type: 'string',
	placeholder: 'e.g. recipient@email.com',
	required: true,
	default: '',
	description: 'Email address or ID of the recipient',
};

export const manageSubscriptionProperty: INodeProperties = {
	displayName: 'Manage Subscription',
	name: 'manageSubscription',
	type: 'boolean',
	default: false,
};

export const mailinglistProperty: INodeProperties = {
	displayName: 'Mailing List Name or ID',
	name: 'mailinglistNameOrId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'loadMailinglistNames',
	},
	placeholder: 'Select mailinglist',
	displayOptions: {
		show: {
			manageSubscription: [true],
		},
	},
	default: '',
	description:
		'Mailing list to change binding. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

export const statusProperty: INodeProperties = {
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{ name: 'Active', value: 1 },
		{ name: 'Bounced', value: 2 },
		{ name: 'Opt-Out By Admin', value: 3 },
		{ name: 'Opt-Out By Recipient', value: 4 },
		{ name: 'Waiting For Double Opt-In Confirmation', value: 5 },
		{ name: 'On Blocklist', value: 6 },
		{ name: 'Temporary Suspended', value: 7 },
	],
	displayOptions: {
		show: {
			manageSubscription: [true],
		},
	},
	default: 1,
	description: 'Subscription status of recipient. Default - Active.',
};

export const recipientFieldsProperty: INodeProperties = {
	displayName: 'Recipient Fields',
	name: 'recipientFields',
	placeholder: 'Add Recipient Field',
	type: 'fixedCollection',
	default: {},
	typeOptions: { multipleValues: true },
	description: 'Profile fields of the recipient',
	options: [
		{
			name: 'recipientFieldsValues',
			displayName: 'Field',
			values: [
				{
					displayName: 'Field Name or ID',
					name: 'name',
					type: 'options',
					typeOptions: {
						loadOptionsMethod: 'loadRecipientFields',
					},
					required: true,
					description:
						'Recipient Field Name. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
					default: '',
				},
				{
					displayName: 'Field Value',
					name: 'value',
					required: true,
					type: 'string',
					default: '',
					description: 'Recipient field value',
				},
			],
		},
	],
};

export function getRecipientFieldsFromNode(this: IExecuteFunctions, i: number): IDataObject[] {
	return (
		((this.getNodeParameter('recipientFields', i) as IDataObject)
			.recipientFieldsValues as IDataObject[]) || []
	);
}

export async function createOrUpdateRecipient(this: IExecuteFunctions, i: number, update: boolean) {
	const emailOrId = this.getNodeParameter('emailOrId', i) as string;
	const recipientFields = getRecipientFieldsFromNode.call(this, i).filter((field) => {
		const val = field.value;
		return val !== '' && val !== null && val !== undefined;
	});
	const body: IDataObject = /^\d+$/.test(emailOrId)
		? { customer_id: parseInt(emailOrId, 10) }
		: { email: emailOrId };
	recipientFields.forEach(({ name, value }) => (body[name as string] = value));

	const qs: IDataObject = {};
	if (this.getNodeParameter('manageSubscription', i) as boolean) {
		const mailinglist = this.getNodeParameter('mailinglistNameOrId', i) as number;
		const status = this.getNodeParameter('status', i) as number;
		if (mailinglist > 0 && status > 0) {
			qs.mailinglist = mailinglist;
			qs.status = status;
		}
	}
	return await emmRestfulRequest.call(this, `/recipient`, update ? 'PUT' : 'POST', body, qs);
}
