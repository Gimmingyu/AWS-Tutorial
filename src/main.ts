import 'dotenv/config';
import { AssumeRoleCommandOutput, STSClient } from '@aws-sdk/client-sts';
import {
	KMSClient,
	EncryptCommand,
	DecryptCommand,
	EncryptCommandInput,
	DecryptCommandInput,
	EncryptCommandOutput,
	KMSClientConfig,
	DecryptCommandOutput,
} from '@aws-sdk/client-kms';
import { AssumeRoleCommand } from '@aws-sdk/client-sts';
import { assumeRole, getAssumeRoleCommand, getSTSClient } from './sts/sts';
import {
	encrypt,
	getDecryptCommand,
	getDecryptCommandInput,
	getEncryptCommand,
	getEncryptCommandInput,
	getKMSClient,
	getKMSConfig,
} from './kms/kms';
import {
	getSecretManagerClient,
	getSecretManagerClientConfig,
	getSecretValue,
	getSecretValueCommand,
	getSecretValueCommandInput,
} from './secret_manager/secret_manager';
import {
	GetSecretValueCommand,
	GetSecretValueCommandInput,
	GetSecretValueCommandOutput,
	SecretsManagerClient,
	SecretsManagerClientConfig,
} from '@aws-sdk/client-secrets-manager';

async function main() {
	try {
		const client: STSClient = await getSTSClient();

		const assumeRoleCommand: AssumeRoleCommand = await getAssumeRoleCommand();

		const assumeRoleResult: AssumeRoleCommandOutput = await assumeRole(
			client,
			assumeRoleCommand
		);

		const kmsConfig: KMSClientConfig = await getKMSConfig(
			assumeRoleResult.Credentials
		);

		const kmsClient: KMSClient = await getKMSClient(kmsConfig);

		const encryptCommandInput: EncryptCommandInput =
			await getEncryptCommandInput();

		const encryptCommand: EncryptCommand = await getEncryptCommand(
			encryptCommandInput
		);

		const encryptResult: EncryptCommandOutput = await encrypt(
			kmsClient,
			encryptCommand
		);

		const decryptCommandInput: DecryptCommandInput =
			await getDecryptCommandInput(encryptResult.CiphertextBlob);

		const decryptCommand: DecryptCommand = await getDecryptCommand(
			decryptCommandInput
		);

		const decryptResult: DecryptCommandOutput = await kmsClient.send(
			decryptCommand
		);

		console.log(decryptResult);

		const secretManagerClientConfig: SecretsManagerClientConfig =
			await getSecretManagerClientConfig(assumeRoleResult.Credentials);

		const secretManagerClient: SecretsManagerClient =
			await getSecretManagerClient(secretManagerClientConfig);

		const secretValueCommandInput: GetSecretValueCommandInput =
			await getSecretValueCommandInput();

		const secretValueCommand: GetSecretValueCommand =
			await getSecretValueCommand(secretValueCommandInput);

		const secretValue: GetSecretValueCommandOutput = await getSecretValue(
			secretManagerClient,
			secretValueCommand
		);

		console.log(secretValue);
	} catch (error) {
		console.error(error);
	}
}

main().catch((err) => console.error);
