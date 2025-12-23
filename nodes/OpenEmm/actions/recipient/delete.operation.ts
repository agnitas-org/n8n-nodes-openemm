import { IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { emmRestfulRequest } from '../../transport';
import { emailProperty } from './common';

const displayOptions = {
	show: { resource: ['recipient'], operation: ['delete'] },
};

const properties: INodeProperties[] = [emailProperty];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const emailOrId = this.getNodeParameter('emailOrId', i) as string;
	return await emmRestfulRequest.call(this, `/recipient/${emailOrId}`, 'DELETE');
}
