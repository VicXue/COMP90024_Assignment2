
# COMP90024 Assignment 2



## Deployment

To deploy this project run:

```bash
  cd playbook
  ./run-mrc.sh
```

- You would need the `id_rsa` ssh private key in the `playbook` folder, if you want to deploy the playbook with a clean slate. 
- You would need to replace the `ansible_become_pass` variable in the `inventory/inventory.ini` file with your sudo password. 
- You would need to set up your MRC password and provide it upon the input prompt when executing the script.

p.s. Due to the intrinsics of docker swarm, the CouchDB cluster may not finish its setup sometimes. The deployment process may fail or throw errors. Let me know if that happens. 

## Documentation

- CouchDB
    - [x] Docker Swarm Deployment
    - [ ] Secret Hiding via Ansible Vault
        - DB Admin credentials are open in the repo, may need to update it to use ansible vault, but it's low priority for now.
- Harvester
    - [ ] Elaboration
    - [ ] Development
    - [ ] Docker Swarm/Container Deployment
- API
    - [ ] Elaboration
    - [ ] Development
    - [ ] Docker Container Deployment
- Frontend
    - [ ] Elaboration
    - [ ] Development
    - [ ] Docker Container Deployment
- Analyser
    - [ ] Elaboration
    - [ ] Development
    - [ ] Docker Container Deployment
    
## Demo
CouchDB cluster is ready to play with. Go to MRC and find our project. You can use any instance's IP to access it. The url to the GUI is `<IP>::5984/_utils/`. Username and password can be found [here](/playbook/variables/couchdb-vars.yaml#L6-L7).
If you are not on campus, use the AnyConnect VPN.
