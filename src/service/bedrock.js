import _ from 'lodash'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
const client = new BedrockRuntimeClient({ region: 'us-east-1' })

export default {
	async analyse(nric) {
		// const prompt = `Based on this raw text extract from a malaysia nric: ${nric}, extract is to json of {name : '', idNumber : '', address : '', gender : ''}`
		const prompt = `Given a raw text extract from a Malaysian National Registration Identity Card (NRIC) represented as ${nric},
		 returns it in a JSON format: {name: '', idNumber: '', address: '', gender: ''} only.
		 Ensure that the extracted information corresponds to the relevant fields in the NRIC. 
		 The NRIC format may include details such as the individual's name, identification number, address, and gender. Gender should be returned as either 'Male' or 'Female,' and it may be provided in Malay return empty if there. If any of the required information cannot be found in the given NRIC text, the corresponding field in the JSON should be returned as an empty string.`
		const request = {
			prompt,
			maxTokens: 200
		}
		const input = {
			body: JSON.stringify(request),
			modelId: 'ai21.j2-ultra-v1',
			// modelId: 'ai21.j2-mid-v1',
			contentType: 'application/json',
			accept: '*/*'
		}
		const command = new InvokeModelCommand(input)
		const response = await client.send(command)
		const str = Buffer.from(response.body).toString('utf8')
		const result = JSON.parse(str)

		console.log(`Bedrock Prompt: ${prompt}`)

		// const data = _.map(result.completions, 'data')
		// return _.map(result.completions, 'data')

		const extractedText = _.map(result.completions, (completion) => {
			try {
				const parsedData = JSON.parse(completion.data.text)
				return parsedData
			} catch (error) {
				// Handle parsing errors if needed
				console.log(str)
				console.error('Error parsing JSON:', error)
				return null
			}
		})

		return extractedText
	}
}
