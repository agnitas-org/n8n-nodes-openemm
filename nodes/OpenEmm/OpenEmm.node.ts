import type { IExecuteFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';
import * as loadOptions from './methods/loadOptions';
import * as mailinglist from './actions/mailinglist';
import * as recipient from './actions/recipient';
import * as content from './actions/content';
import * as mailing from './actions/mailing';
import { router } from './actions/router';

export class OpenEmm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenEMM',
		name: 'openEmm',
		icon: 'file:openEmm.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume EMM API',
		defaults: { name: 'OpenEMM' },
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'emmBasicApi',
				required: true,
				displayOptions: {
					show: { authentication: ['basic'] },
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [{ name: 'Basic', value: 'basic' }],
				default: 'basic',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Mailing',
						value: 'mailing',
					},
					{
						name: 'Mailing Content',
						value: 'content',
					},
					{
						name: 'Recipient',
						value: 'recipient',
					},
					{
						name: 'Mailing List',
						value: 'mailinglist',
					},
				],
				default: 'mailing',
				required: true,
			},

			...mailing.description,
			...content.description,
			...mailinglist.description,
			...recipient.description,
		],
	};

	methods = { loadOptions };

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
