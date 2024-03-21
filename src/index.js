// import TextractServ from './service/textract.js'
// import BedrockServ from './service/bedrock.js'

export async function handler(event) {
	// const file = event.documentData;

	// if (!file) {
	// 	throw new Error('No documentData provided');
	// }

	// const result = await TextractServ.analyzeDocument(file)
	// const json = await BedrockServ.analyse(result)
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Success'
		})
	}
}
