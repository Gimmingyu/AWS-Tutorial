import { STSClient } from '@aws-sdk/client-sts';
import {
	KMSClient,
	EncryptCommand,
	EncryptionAlgorithmSpec,
	DecryptCommand,
} from '@aws-sdk/client-kms';
import { AssumeRoleCommand } from '@aws-sdk/client-sts';
import 'dotenv/config';

async function main() {
	try {
		const client = new STSClient({
			region: process.env.REGION,
			credentials: {
				accessKeyId: process.env.ACCESS_KEY_ID,
				secretAccessKey: process.env.SECRET_ACCESS_KEY,
			},
		});

		const result = await client.send(
			new AssumeRoleCommand({
				RoleArn: process.env.ROLE_ARN,
				RoleSessionName: process.env.ROLE_SESSION_NAME,
				DurationSeconds: parseInt(process.env.ROLE_DURATION_SECOND),
			})
		);

		const kmsClient = new KMSClient({
			region: process.env.REGION,
			credentials: {
				sessionToken: result.Credentials.SessionToken,
				secretAccessKey: result.Credentials.SecretAccessKey,
				accessKeyId: result.Credentials.AccessKeyId,
				expiration: result.Credentials.Expiration,
			},
		});
		const enc = new TextEncoder();

		const params = {
			KeyId: process.env.KMS_KEY_ID,
			Plaintext: enc.encode('dddd'),
			EncryptionAlgorithm: EncryptionAlgorithmSpec.RSAES_OAEP_SHA_256,
		};

		const command = new EncryptCommand(params);

		const res = await kmsClient.send(command);

		console.log('res = ', res);

		const decodeParam = {
			CiphertextBlob: res.CiphertextBlob,
			KeyId: process.env.KMS_KEY_ID,
			EncryptionAlgorithm: EncryptionAlgorithmSpec.RSAES_OAEP_SHA_256,
		};

		const decodeCommand = new DecryptCommand(decodeParam);

		const decode = await kmsClient.send(decodeCommand);

		console.log(`decode = `, decode.Plaintext);
	} catch (error) {
		console.error(error);
	}
}

main().catch((err) => console.error);
