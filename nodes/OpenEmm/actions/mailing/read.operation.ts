import { IDataObject, IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { mailingNameOrIdProperty } from './common';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['mailing'], operation: ['read'] },
};

const properties: INodeProperties[] = [mailingNameOrIdProperty];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const qs: IDataObject = { view: 'light' };
	const mailing = this.getNodeParameter('mailingNameOrId', i) as string;
	return await emmRestfulRequest.call(
		this,
		`/mailing/${encodeURIComponent(mailing)}`,
		'GET',
		{},
		qs,
	);
}
