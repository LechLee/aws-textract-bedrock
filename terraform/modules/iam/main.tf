provider "aws" {
  region = var.region
}

resource "aws_iam_role" "lambda" {
  name               = "${var.project_name}-role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_role" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" # Attach basic Lambda execution policy
}


resource "aws_iam_policy" "api_gateway_lambda_policy" {
  name        = "${var.project_name}-api-gateway-lambda-policy"
  description = "IAM policy for API Gateway to invoke Lambda function"

  policy = jsonencode({
    Version = "2012-10-17",
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

resource "aws_iam_role_policy_attachment" "api_gateway_lambda_attachment" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.api_gateway_lambda_policy.arn
}