import { IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { mailingIdProperty } from './common';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['mailing'], operation: ['copy'] },
};

const properties: INodeProperties[] = [mailingIdProperty];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const mailingId = this.getNodeParameter('mailingId', i) as number;
	return await emmRestfulRequest.call(this, `/mailing/${mailingId}/copy`, 'POST', {});
}
