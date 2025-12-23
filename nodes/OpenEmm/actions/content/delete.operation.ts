import { IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { contentProperty, mailingProperty } from './common';
import { emmRestfulRequest } from '../../transport';

const displayOptions = {
	show: { resource: ['content'], operation: ['delete'] },
};

const properties: INodeProperties[] = [mailingProperty, contentProperty];

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions, i: number) {
	const mailingId = this.getNodeParameter('mailingId', i) as number;
	const contentNameOrId = this.getNodeParameter('mailingContentNameOrId', i) as string;
	return await emmRestfulRequest.call(
		this,
		`/content/${mailingId}/${encodeURIComponent(contentNameOrId)}`,
		'DELETE',
	);
}
