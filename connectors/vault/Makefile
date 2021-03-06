ROOT_DIR = ../..
include $(ROOT_DIR)/Makefile.env

DOCKER_NAME = vault-connector
DOCKER_CONTEXT=$(ROOT_DIR)
DOCKER_FILE = $(DOCKER_CONTEXT)/connectors/vault/Dockerfile
include $(ROOT_DIR)/.mk/docker.mk

VAULT_PATH=${ABSTOOLBIN}/vault
include $(ROOT_DIR)/pkg/policy-compiler/policy-compiler.env

.PHONY: vaultserver-clean
vaultserver-clean:
	rm -f output-vault.log && rm -f output-vault-init.log

.PHONY: uservaultserver-clean
uservaultserver-clean:
	rm -f output-uservault.log && rm -f output-uservault-init.log

.PHONY: vaultserver
vaultserver:
	{ $(VAULT_PATH) server -dev -dev-root-token-id=$(VAULT_TOKEN) > output-vault.log 2>&1 & echo $$! >> vault_pids.txt; } && sleep 5
	chmod +x ./vault_init.sh
	./vault_init.sh $(ROOT_DIR) $(ABSTOOLBIN) > output-vault-init.log 2>&1

.PHONY: uservaultserver
uservaultserver : USR_VAULT_ADDR1 = $(USER_VAULT_ADDRESS:http://%=%)
uservaultserver:
	{ $(VAULT_PATH) server -dev -dev-listen-address=$(USR_VAULT_ADDR1:/=) -dev-root-token-id=$(USER_VAULT_TOKEN) > output-uservault.log 2>&1 & echo $$! >> uservault_pids.txt; } && sleep 5
	chmod +x user_vault_init.sh && ./user_vault_init.sh $(ROOT_DIR) $(ABSTOOLBIN) > output-uservault-init.log 2>&1

.PHONY: vaultserver-terminate
vaultserver-terminate:
	-kill -9 $$( cat vault_pids.txt ) && rm -f vault_pids.txt

.PHONY: uservaultserver-terminate
uservaultserver-terminate:
	-kill -9 $$( cat uservault_pids.txt ) && rm -f uservault_pids.txt

.PHONY: build
build:
	go build -o vault_connector

.PHONY: test
test:

.PHONY: clean
clean: vaultserver-clean uservaultserver-clean
	rm -f vault_connector && rm -f output-vaultconnector.log

.PHONY: run
run: vaultserver uservaultserver
	nohup ./vault_connector > output-vaultconnector.log &  2>&1 && echo "$$!" >> pids.txt && sleep 5

.PHONY: terminate
terminate: vaultserver-terminate uservaultserver-terminate
	kill -9 $$( cat pids.txt ); rm -f pids.txt

