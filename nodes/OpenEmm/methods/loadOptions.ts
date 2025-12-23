import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { emmApiRequest } from '../transport';

export async function loadMailinglistNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	return getSortedNamesForSelection(
		await emmApiRequest.call(this, `/n8n/mailinglists.action`, 'GET'),
	);
}

export async function loadRecipientFields(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const currentOperation = this.getNodeParameter('operation');
	const fields: Record<string, string> = await emmApiRequest.call(
		this,
		`/n8n/recipient-fields.action`,
		'GET',
	);
	return Object.entries(fields)
		.map(([column, shortname]) => ({
			column,
			shortname,
		}))
		.filter((field) => currentOperation !== 'create' || field.column != 'email')
		.map((field) => ({
			name: field.shortname,
			value: field.column,
		}));
}

export async function loadMailingNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	return getSortedNamesForSelection(await emmApiRequest.call(this, '/n8n/mailings/names.action', 'GET'));
}

export async function loadTemplateNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	return getSortedNamesForSelection(await emmApiRequest.call(this, '/n8n/templates.action', 'GET'));
}

export async function loadTriggerNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	return [
		{ value: 0, name: 'No Trigger' },
		...getSortedNamesForSelection(await emmApiRequest.call(this, '/n8n/triggers.action', 'GET')),
	];
}

export async function loadMailingDynTagNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const mailingId = this.getNodeParameter('mailingId', 0) as number;
	return getSortedNamesForSelection(
		await emmApiRequest.call(this, `/n8n/mailings/${mailingId}/contents/names.action`, 'GET'),
	);
}

export async function loadTargetNames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const targets = getNamesForSelection(
		await emmApiRequest.call(this, `/n8n/content-targets/names.action`, 'GET'),
	);
	targets.unshift({ value: 0, name: 'All recipients' });
	return targets;
}

function getSortedNamesForSelection(names: Record<string, string>) {
	return getNamesForSelection(names).sort((a, b) => a.name.localeCompare(b.name));
}

function getNamesForSelection(names: Record<string, string>) {
	return [...Object.entries(names).map(([id, name]) => ({ value: Number(id), name }))];
}
