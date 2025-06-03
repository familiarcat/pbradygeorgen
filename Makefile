# === AlexAI Makefile ===
# Usage:
#   make seed-local         # Seed katras to local ArangoDB
#   make seed-remote        # Seed katras to EC2-hosted ArangoDB
#   make query-local        # Query katras from local ArangoDB
#   make query-remote       # Query katras from EC2-hosted ArangoDB
#   make unify-remote       # Unify and push katras to remote ArangoDB

.PHONY: seed-local seed-remote query-local query-remote unify-remote unify-katras-to-remote

unify-katras-to-remote:
	./scripts/unify_katras_to_remote_arangodb.sh

seed-local:
	./arangodb-cli.sh local

seed-remote:
	@./arangodb-cli.sh remote

query-local:
	./arangodb-cli.sh query-local

query-remote:
	./arangodb-cli.sh query-remote

unify-remote:
	./scripts/unify_katras_to_remote_arangodb.sh
