import {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { mailingIdProperty } from './common';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['mailing'], operation: ['send'] },
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
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'number',
				default: '',
				description:
					'Optional customerId for actionbased mailings. To send an actionbased mailing to a single recipient, this is the only data needed in the request body.',
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				default: '',
				description:
					'Optional profile data to override in ACTION_BASED mailing. This data is not persisted in already existing recipient database data.',
			},
			{
				displayName: 'Send Date',
				name: 'sendDate',
				type: 'dateTime',
				default: '',
				description:
					'Optional date-time of sending (ISO-8601). Not needed for actionbased mailings.',
			},
			{
				displayName: 'Send Type',
				name: 'sendType',
				type: 'options',
				default: 'W',
				options: [
					{ name: 'ACTION_BASED', value: 'E' },
					{ name: 'ADMIN', value: 'A' },
					{ name: 'DATE_BASED', value: 'R' },
					{ name: 'TEST', value: 'T' },
					{ name: 'WORLD', value: 'W' },
				],
				description:
					'Optional type of recipients used for this send action. (WORLD("W") , TEST("T"), ADMIN("A"), DATE_BASED("R"), ACTION_BASED("E")). Only needed wen using TEST("T") or ADMIN("A")',
			},
			{
				displayName: 'User Status',
				name: 'userStatus',
				type: 'number',
				default: '',
				description:
					'Optional customer status, only if user is waiting for confirm (Waiting-For-DOI status 5)',
			},
		],
	},
];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const mailingId = this.getNodeParameter('mailingId', i) as number;
	const additionalFields = this.getNodeParameter('options', i);
	const body: IDataObject = {};

	if (additionalFields.sendType) {
		body.send_type = additionalFields.sendType;
	}
	if (additionalFields.sendDate) {
		body.send_date = additionalFields.sendDate;
	}
	if (additionalFields.customerId) {
		body.customer_id = additionalFields.customerId;
	}
	if (additionalFields.userStatus) {
		body.user_status = additionalFields.userStatus;
	}
	if (additionalFields.data) {	
		body.data = JSON.parse(additionalFields.data! as string);
	}
	return await emmRestfulRequest.call(this, `/send/${mailingId}`, 'POST', body);
}
