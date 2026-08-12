import {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { mailingIdProperty } from './common';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['mailing'], operation: ['update'] },
};

const properties: INodeProperties[] = [
	mailingIdProperty,
	{
		displayName: 'Additional Parameters',
		name: 'options',
		type: 'collection',
		placeholder: 'Add parameter',
		default: {},
		options: [
			{
				displayName: 'Click Action Name or ID',
				name: 'clickActionId',
				type: 'options',
				placeholder: 'Select trigger',
				default: '',
				description:
					'ActionID for clicks. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'loadTriggerNames',
				},
			},
			{
				displayName: 'Content Type',
				name: 'mailingContentType',
				type: 'options',
				default: 'advertising',
				options: [
					{ name: 'Advertising', value: 'advertising' },
					{ name: 'Transaction', value: 'transaction' },
				],
				description: 'Optional content type of mailing (advertising, transaction)',
			},
			{
				displayName: 'Description',
				name: 'mailingDescription',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Optional short description of this mailing',
				description: 'A note about the meaning of this mailing',
			},
			{
				displayName: 'Mailing List Name or ID',
				name: 'mailinglistNameOrId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'loadMailinglistNames',
				},
				default: '',
				placeholder: 'Select mailinglist',
				description:
					'Name of the mailinglist to set for this mailing. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Mailing Type',
				name: 'mailingType',
				type: 'options',
				default: 'NORMAL',
				description: 'The mailing type used to update the mailing',
				options: [
					{ name: 'Action-Based Mailing', value: 'ACTION_BASED' },
					{ name: 'Date-Based Mailing', value: 'DATE_BASED' },
					{ name: 'Followup Mailing', value: 'FOLLOW_UP' },
					{ name: 'Interval-Based Mailing', value: 'INTERVAL' },
					{ name: 'Normal Mailing', value: 'NORMAL' },
				],
			},
			{
				displayName: 'Open Action Name or ID',
				name: 'openActionId',
				type: 'options',
				placeholder: 'Select trigger',
				default: '',
				description:
					'ActionID for openings. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				typeOptions: {
					loadOptionsMethod: 'loadTriggerNames',
				},
			},
			{
				displayName: 'Pre-Header',
				name: 'preHeader',
				type: 'string',
				default: '',
				description: 'The pre-header used to update the mailing',
			},
			{
				displayName: 'Reply Address',
				name: 'replyAddress',
				type: 'string',
				default: '',
				description: 'Reply e-mail used to update the mailing',
			},
			{
				displayName: 'Reply Full Name',
				name: 'replyFullName',
				type: 'string',
				default: '',
				description: 'Reply-to full name used to update the mailing',
			},
			{
				displayName: 'Sender Address',
				name: 'senderAddress',
				type: 'string',
				default: '',
				description: 'Sender e-mail used to update the mailing',
			},
			{
				displayName: 'Sender Full Name',
				name: 'senderFullName',
				type: 'string',
				default: '',
				description: 'Sender full name used to update the mailing',
			},
			{
				displayName: 'Shortname',
				name: 'mailingShortname',
				type: 'string',
				default: '',
				placeholder: 'New mailing name',
				description: 'The name used to update the mailing',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'The subject used to update the mailing',
			},
			{
				displayName: 'Target Expression',
				name: 'targetExpression',
				type: 'string',
				default: '',
				description:
					'Expression for targetgroups (Single targetgroupID or multiple IDs seprated by "&" or "|" getrennt, only single type of operator allowed)',
			},
		],
	},
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const mailingId = this.getNodeParameter('mailingId', i) as number;
	const additionalFields = this.getNodeParameter('options', i);

	const body: IDataObject = {};

	if (additionalFields.mailingShortname) {
		body.shortname = additionalFields.mailingShortname;
	}
	if (additionalFields.mailingDescription) {
		body.description = additionalFields.mailingDescription;
	}
	if (additionalFields.mailingType) {
		body.mailingtype = additionalFields.mailingType;
	}
	if (additionalFields.mailinglistNameOrId) {
		if (typeof additionalFields.mailinglistNameOrId === 'number') {
			body.mailinglist_id = additionalFields.mailinglistNameOrId;
		} else {
			body.mailinglist_shortname = additionalFields.mailinglistNameOrId;
		}
	}
	if (additionalFields.mailingContentType) {
		body.mailing_content_type = additionalFields.mailingContentType;
	}
	if (additionalFields.targetExpression) {
		body.target_expression = additionalFields.targetExpression;
	}
	if (additionalFields.openActionId != null) {
		body.open_action_id = additionalFields.openActionId;
	}
	if (additionalFields?.clickActionId != null) {
		body.click_action_id = additionalFields.clickActionId;
	}
	if (additionalFields?.subject != null) {
		body.subject = additionalFields.subject;
	}
	if (additionalFields?.preHeader != null) {
		body.preHeader = additionalFields.preHeader;
	}
	if (additionalFields?.replyAddress != null) {
		body.reply_address = additionalFields.replyAddress;
	}
	if (additionalFields?.replyFullName != null) {
		body.reply_fullname = additionalFields.replyFullName;
	}
	if (additionalFields?.senderAddress != null) {
		body.sender_address = additionalFields.senderAddress;
	}
	if (additionalFields?.senderFullName != null) {
		body.sender_fullname = additionalFields.senderFullName;
	}
	return await emmRestfulRequest.call(this, `/mailing/${mailingId}`, 'PUT', body);
}
