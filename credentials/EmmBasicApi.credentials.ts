import type {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class EmmBasicApi implements ICredentialType {
	name = 'emmBasicApi';

	displayName = 'EMM Basic Auth API';

	documentationUrl = 'https://emm.agnitas.de/manual/en/pdf/EMM_Restful_Documentation.html';

	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'System URL',
			name: 'systemUrl',
			type: 'string',
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.systemUrl}}',
			url: '/n8n/basic-auth-test.action',
			timeout: 10000,
		},
	};
}
