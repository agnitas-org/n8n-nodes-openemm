import { INodeProperties } from 'n8n-workflow';

export const mailingProperty: INodeProperties = {
	displayName: 'Mailing Name or ID',
	name: 'mailingId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'loadMailingNames',
	},
	placeholder: 'Select mailing',
	required: true,
	default: '',
	description:
		'Mailing used for operation. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};

export const contentProperty: INodeProperties = {
	displayName: 'Content Name or ID',
	name: 'mailingContentNameOrId',
	type: 'options',
	typeOptions: {
		loadOptionsMethod: 'loadMailingDynTagNames',
		loadOptionsDependsOn: ['mailingId'],
	},
	default: '',
	placeholder: 'Select content',
	description:
		'Mailing content used for operation. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
};
