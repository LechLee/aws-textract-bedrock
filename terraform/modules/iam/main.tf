provider "aws" {
  region = var.region
}

resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}



resource "aws_iam_policy" "api_gateway_lambda_policy" {
  name        = "${var.project_name}-api-gateway-lambda-policy"
  description = "IAM policy for API Gateway to invoke Lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow",
      Action   = "lambda:InvokeFunction",
      Resource = var.lambda.arn
    }],
  })
}

resource "aws_lambda_permission" "allow_api" {
  statement_id  = "AllowAPIgatewayInvocation"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda.function_name
  principal     = "apigateway.amazonaws.com"
}

# Create IAM policy for Textract permissions
resource "aws_iam_policy" "textract_policy" {
  name        = "${var.project_name}-textract-policy"
  description = "IAM policy for Textract permissions"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = "textract:AnalyzeDocument",
      Resource = "*"
    }]
  })
}

resource "aws_iam_policy" "bedrock_policy" {
  name        = "InvokeModelPolicy"
  description = "Policy allowing invocation of bedrock models"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "bedrock:InvokeModel"
        Resource = "arn:aws:bedrock:us-east-1::foundation-model/ai21.j2-ultra-v1"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_role" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" # Attach basic Lambda execution policy
}

resource "aws_iam_role_policy_attachment" "api_gateway_lambda_attachment" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.api_gateway_lambda_policy.arn
}

resource "aws_iam_role_policy_attachment" "textract_lambda_attachment" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.textract_policy.arn
}

resource "aws_iam_role_policy_attachment" "example_policy_attachment" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.bedrock_policy.arn
}