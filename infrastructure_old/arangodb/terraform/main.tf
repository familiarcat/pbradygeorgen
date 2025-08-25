// alexai-arangodb-deployment/terraform/main.tf

provider "aws" {
  region  = "us-east-2"
  profile = "AmplifyUser"
}

variable "public_key_path" {
  description = "Path to the public key file"
  type        = string
}

resource "aws_key_pair" "alexai" {
  key_name   = "AlexKeyPair"
  public_key = file(var.public_key_path)
}

resource "aws_security_group" "arangodb_sg" {
  name        = "AlexAI-ArangoDB-SG"
  description = "Allow ArangoDB traffic"

  ingress {
    from_port   = 8529
    to_port     = 8529
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "arangodb" {
  ami                    = "ami-0a91cd140a1fc148a" # Ubuntu Server 22.04 LTS in us-east-2
  instance_type          = "t3.medium"
  key_name               = aws_key_pair.alexai.key_name
  vpc_security_group_ids = [aws_security_group.arangodb_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              apt update -y
              apt install docker.io -y
              systemctl start docker
              systemctl enable docker
              docker run -d -e ARANGO_ROOT_PASSWORD=secretpassword -p 8529:8529 --name arangodb arangodb/arangodb:latest
              EOF

  tags = {
    Name = "AlexAI-ArangoDB"
  }
}
