#!/usr/bin/env bash

ansible-galaxy collection install openstack.cloud:1.10.0

# . ./unimelb-comp90024-2023-grp-3-openrc.sh; ansible-playbook --ask-become-pass -i inventory/inventory.ini playbook.yaml 
. ./unimelb-comp90024-2023-grp-3-openrc.sh; ansible-playbook -i inventory/inventory.ini playbook.yaml -vvv --tags "local,harvester"