import type {
	INodeType,
	IDataObject,
	IHookFunctions,
	IWebhookResponseData,
	IWebhookFunctions,
	INodeTypeDescription,
} from 'n8n-workflow';

export class OpenEmmTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenEMM Trigger',
		name: 'openEmmTrigger',
		icon: 'file:../../icons/openEmm.svg',
		subtitle:
			'={{ $parameter["events"]?.length ? "Events: " + $parameter["events"].length : "No events selected" }}',
		group: ['trigger'],
		version: 1,
		description: 'Interact with EMM',
		defaults: { name: 'OpenEMM Trigger' },
		inputs: [],
		outputs: ['main'],
		usableAsTool: true,
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'EMM webhooks',
				options: [
					{
						name: 'Link Clicked',
						value: 'linkClicked',
						description: 'Triggered when a recipients clicks on a link in a mail',
					},
					{
						name: 'Mail Bounced',
						value: 'mailBounced',
						description:
							"Triggered when a mail couldn't be sent to the recipient due to a permanent error " +
							'(like unknown or invalid mail address)',
					},
					{
						name: 'Mail Delivered',
						value: 'mailDelivered',
						description: 'Triggered when mail has been successfully delivered to recipient',
					},
					{
						name: 'Mail Opened',
						value: 'mailOpened',
						description: 'Triggered when recipient has opened the mail in a mail client',
					},
					{
						name: 'Mailing Sent',
						value: 'mailingSent',
						description:
							'Triggered when mailing has been sent to all recipients and each email has ' +
							'either been delivered to its recipients or the delivery lead to a hard bounce',
					},
					{
						name: 'Mailing Unsubscribed',
						value: 'mailingUnsubscribed',
						description:
							'Triggered when the recipient has unsubscribed the mailing' +
							'(recipient binding has changed to "opt_out")',
					},
					{
						name: 'Profile Field Changed',
						value: 'profileFieldChanged',
						description: "Triggered when recipient's profile field changes",
					},
					{
						name: 'Test Mail Delivered',
						value: 'testMailDelivered',
						description: 'Triggered when test mail has been successfully delivered to recipient',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject[])],
		};
	}
}
