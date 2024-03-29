import TextractServ from './service/textract.js'
import BedrockServ from './service/bedrock.js'

export async function handler(event) {
	const body = JSON.parse(event.body)
	const document = body.document
	// const parsed = await parser.parse(event);

	// const { content, filename, contentType } = parsed.files[0];

	// if (!content) {
	// 	console.error('No document provided')
	console.info(JSON.stringify(event, null, 2))
	console.info(document)
	// 	return {
	// 		statusCode: 400,
	// 		body: JSON.stringify({
	// 			message: 'No document provided'
	// 		})
	// 	}
	// }

	const text = await TextractServ.analyzeDocument(document)

	// if(!result || !result.raw){
	// 	return {
	// 		statusCode: 500,
	// 		body: JSON.stringify({
	// 			...result
	// 		})
	// 	}
	// }
	const json = await BedrockServ.analyse(text.raw)

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Success',
			result: {
				...text,
				...json
			}
		})
	}
}
