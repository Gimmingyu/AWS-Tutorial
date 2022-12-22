import {
	SecretsManagerClient,
	GetSecretValueCommand,
	SecretsManagerClientConfig,
	GetSecretValueCommandOutput,
	GetSecretValueCommandInput,
} from '@aws-sdk/client-secrets-manager';
import { Credentials } from '@aws-sdk/client-sts';

export async function getSecretManagerClientConfig(
	credentials: Credentials
): Promise<SecretsManagerClientConfig> {
	return {
		region: process.env.REGION,
		credentials: {
			accessKeyId: credentials.AccessKeyId,
			secretAccessKey: credentials.SecretAccessKey,
			sessionToken: credentials.SessionToken,
			expiration: credentials.Expiration,
		},
	};
}
export async function getSecretManagerClient(
	config: SecretsManagerClientConfig
) {
	return new SecretsManagerClient(config);
}

export async function getSecretValueCommandInput(): Promise<GetSecretValueCommandInput> {
	return {
		SecretId: process.env.SECRET_NAME,
		VersionStage: 'AWSCURRENT',
	};
}

export async function getSecretValueCommand(
	input: GetSecretValueCommandInput
): Promise<GetSecretValueCommand> {
	return new GetSecretValueCommand(input);
}

export async function getSecretValue(
	client: SecretsManagerClient,
	command: GetSecretValueCommand
): Promise<GetSecretValueCommandOutput> {
	return await client.send(command);
}
