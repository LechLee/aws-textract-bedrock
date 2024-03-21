provider "aws" {
  region = var.region
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "../src" # Directory containing the Lambda function code
  output_path = "dist/${var.project_name}.zip"
}

resource "aws_lambda_function" "handler_code" {
  function_name    = var.project_name
  role             = var.role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  filename         = "dist/${var.project_name}.zip"
  source_code_hash = filebase64sha256("dist/${var.project_name}.zip")

  memory_size = 128
  timeout     = 10
}
