import {
	DecryptCommand,
	DecryptCommandInput,
	DecryptCommandOutput,
	EncryptCommand,
	EncryptCommandInput,
	EncryptCommandOutput,
	EncryptionAlgorithmSpec,
	KMSClient,
	KMSClientConfig,
} from '@aws-sdk/client-kms';
import { Credentials } from '@aws-sdk/client-sts';

export async function getKMSConfig(
	credentials: Credentials
): Promise<KMSClientConfig> {
	return {
		region: process.env.REGION,
		credentials: {
			sessionToken: credentials.SessionToken,
			secretAccessKey: credentials.SecretAccessKey,
			accessKeyId: credentials.AccessKeyId,
			expiration: credentials.Expiration,
		},
	};
}

export async function getKMSClient(
	config: KMSClientConfig
): Promise<KMSClient> {
	return new KMSClient(config);
}

export async function getEncryptCommandInput(): Promise<EncryptCommandInput> {
	const enc = new TextEncoder();
	return {
		KeyId: process.env.KMS_KEY_ID,
		Plaintext: enc.encode(process.env.MNEMONIC),
		EncryptionAlgorithm: EncryptionAlgorithmSpec.RSAES_OAEP_SHA_256,
	};
}

export async function getEncryptCommand(
	params: EncryptCommandInput
): Promise<EncryptCommand> {
	return new EncryptCommand(params);
}

export async function encrypt(
	client: KMSClient,
	command: EncryptCommand
): Promise<EncryptCommandOutput> {
	return await client.send(command);
}

export async function getDecryptCommandInput(
	ciphertextBlob: Uint8Array
): Promise<DecryptCommandInput> {
	return {
		CiphertextBlob: ciphertextBlob,
		KeyId: process.env.KMS_KEY_ID,
		EncryptionAlgorithm: EncryptionAlgorithmSpec.RSAES_OAEP_SHA_256,
	};
}

export async function getDecryptCommand(
	input: DecryptCommandInput
): Promise<DecryptCommand> {
	return new DecryptCommand(input);
}

export async function decrypt(
	client: KMSClient,
	command: DecryptCommand
): Promise<DecryptCommandOutput> {
	return await client.send(command);
}
