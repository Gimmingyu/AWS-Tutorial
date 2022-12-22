import {
	AssumeRoleCommand,
	AssumeRoleCommandOutput,
	STSClient,
} from '@aws-sdk/client-sts';

export async function getSTSClient(): Promise<STSClient> {
	return new STSClient({
		region: process.env.REGION,
		credentials: {
			accessKeyId: process.env.ACCESS_KEY_ID,
			secretAccessKey: process.env.SECRET_ACCESS_KEY,
		},
	});
}

export async function getAssumeRoleCommand(): Promise<AssumeRoleCommand> {
	return new AssumeRoleCommand({
		RoleArn: process.env.ROLE_ARN,
		RoleSessionName: process.env.ROLE_SESSION_NAME,
		DurationSeconds: parseInt(process.env.ROLE_DURATION_SECOND),
	});
}

export async function assumeRole(
	client: STSClient,
	command: AssumeRoleCommand
): Promise<AssumeRoleCommandOutput> {
	return await client.send(command);
}
