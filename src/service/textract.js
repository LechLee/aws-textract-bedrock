import { AnalyzeDocumentCommand, AnalyzeExpenseCommand, FeatureType, TextractClient } from '@aws-sdk/client-textract'
import { TextractDocument, TextractExpense } from 'amazon-textract-response-parser'

const textractClient = new TextractClient({})
export default {
	async scan() {
		const file = ''
		const documentParams = {
			Document: {
				Bytes: file.buffer
			},
			FeatureTypes: [FeatureType.FORMS, FeatureType.TABLES]
		}
		const expenseParams = {
			Document: {
				Bytes: file.buffer
			}
		}

		const analyzeDocumentRes = await textractClient.send(new AnalyzeDocumentCommand(documentParams))
		const analyzeExpenseRes = await textractClient.send(new AnalyzeExpenseCommand(expenseParams))

		const res = await Promise.all([analyzeDocumentRes, analyzeExpenseRes])
		const document = new TextractDocument(res[0])
		const expense = new TextractExpense(res[1])
	},
	async analyzeDocument(documentData) {
		try {
			// Read the document from the file
			// const documentData = await readFile(filePath)

			// Create a buffer from the document data
			const documentBuffer = Buffer.from(documentData, 'base64')

			// Call AWS Textract to analyze the document
			const analyzeDocumentCommand = new AnalyzeDocumentCommand({
				Document: { Bytes: documentBuffer },
				FeatureTypes: [FeatureType.FORMS]
			})

			const analyzeDocumentResponse = await textractClient.send(analyzeDocumentCommand)

			// Parse the Textract response using the provided parser
			const parsedDocument = new TextractDocument(analyzeDocumentResponse)
			// console.log('parsedDocument', parsedDocument)
			// Extract raw text from the parsed document
			const rawText = analyzeDocumentResponse.Blocks.filter((block) => block.BlockType === 'LINE')
				.map((line) => line.Text)
				.join(' ')

			// Print the raw text
			console.log('Raw Text:', rawText)
			return Promise.resolve({raw : rawText})
		} catch (error) {
			console.error('Error:', error)
			return Promise.reject(error)
		}
	}
}
