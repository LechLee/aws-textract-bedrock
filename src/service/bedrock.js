import _ from 'lodash'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
const client = new BedrockRuntimeClient({ region: 'us-east-1' })

export default {
	async analyse(text, type = 'identity document') {
		const prompt = `
		 Given a raw text extracted as ${text}, return it in a JSON format of {name: '', idNumber: '', address: '', gender: '', mobile : {countryDialCd : '', number : ''}, email : ''} only.
		 Ensure that the extracted information corresponds to the relevant fields. 
		 Break the mobile number into countryDialCd and number, example {countryDialCd : '60', number : '173134123'}, remove the spacing or other symbols for the mobile number and do not use the example
		 Gender should be returned as either 'Male' or 'Female,' and may be provided in other language, return it as empty string if is not found.
		 If any of the required information cannot be found in the given text, the corresponding field in the JSON should be returned as an empty string, 
		 Do not generate random names / reorder the names and the name must be in title case.`.trim()
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

		// return {extracted : extractedText, prompt}
		return extractedText[0]
	}
}
