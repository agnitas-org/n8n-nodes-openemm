import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function emmRestfulRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	path: string,
	method: IHttpRequestMethods,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	path = `/restful${path}`;
	return emmApiRequest.call(this, path, method, body, qs);
}

export async function emmApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	path: string,
	method: IHttpRequestMethods,
	body: IDataObject = {},
	qs: IDataObject = {},
) {
	try {
		const credentials = await this.getCredentials('emmBasicApi');
		const options: IHttpRequestOptions = {
			url: `${credentials.systemUrl}${path}`,
			headers: { Accept: 'application/json' },
			method,
			qs,
			body,
			json: true,
		};

		if (Object.keys(body as IDataObject).length === 0) {
			delete options.body;
		}

		return await this.helpers.httpRequestWithAuthentication.call(this, 'emmBasicApi', options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
