import {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { emmRestfulRequest } from '../../transport';
import { getRecipientFieldsFromNode, recipientFieldsProperty } from './common';

const displayOptions = {
	show: { resource: ['recipient'], operation: ['read'] },
};

const properties: INodeProperties[] = [recipientFieldsProperty];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const qs: IDataObject = {};
	const recipientFields = getRecipientFieldsFromNode.call(this, i);
	recipientFields.forEach(({ name, value }) => (qs[name as string] = value));
	return await emmRestfulRequest.call(this, `/recipient`, 'GET', {}, qs);
}
