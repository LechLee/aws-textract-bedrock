import TextractServ from './service/textract.js'
import BedrockServ from './service/bedrock.js'

export async function handler(event) {
	const body = JSON.parse(event.body)
	const document = body?.document || {}
	const type = body?.type || ''

	console.info(JSON.stringify(event, null, 2))
	console.info(document)

	if(!document){
		return {
			statusCode: 500,
			body: 'Document not found'
		}
	}
	
	const text = await TextractServ.analyzeDocument(document)
	const json = await BedrockServ.analyse(text.raw, type)

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "OPTIONS,POST,GET"
		},
		body: JSON.stringify({
			message: 'Success',
			result: {
				...text,
				...json
			}
		})
	}
}
