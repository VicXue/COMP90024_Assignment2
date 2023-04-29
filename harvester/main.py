import json
import os

import couchdb
from mastodon import Mastodon, StreamListener

import harvester_util

# Grab the admin account for the CouchDB Cluster.
couchdb_admin = os.environ.get("DB_USER")
couchdb_password = os.environ.get("DB_PASSWORD")

# Grab the URL and access token for the Mastodon server.
mastodon_server = os.environ.get("MASTODON_SERVER")
mastodon_token = os.environ.get("MASTODON_TOKEN")

# Initialise a CouchDB server.
couchdb_url = f'http://{couchdb_admin}:{couchdb_password}@172.26.134.0:5984/'
couch = couchdb.Server(couchdb_url)

# A list consisting of the names of the two databases employed in the project
db_name_ls = ['mental_disabled_db', 'non_mental_disabled_db']


def main():
    create_databases()

    m = Mastodon(api_base_url=mastodon_server,
                 access_token=mastodon_token)  # Johnny's tocken.
    print(f"Harvesting Mastodon Server: {mastodon_server}")
    m.stream_public(Listener())


def create_databases():
    """
    Create two databases in the CouchDB Cluster if they do not exist.
    """
    for db in db_name_ls:
        if db not in couch:
            couch.create(db)


class Listener(StreamListener):
    def on_update(self, status):
        mental_db = couch[db_name_ls[0]]
        non_mental_db = couch[db_name_ls[1]]

        raw_data = json.dumps(status, sort_keys=True, default=str)

        # Process the raw toots.
        processed_data = harvester_util.processed_fuction(json.loads(raw_data))

        if processed_data[0] == 0:
            doc_id, doc_rev = non_mental_db.save(json.loads(processed_data[1]))
            print(f'Document Saved [_id: {doc_id}, _rev: {doc_rev}]', 'in non_mental_db')
        else:
            doc_id, doc_rev = mental_db.save(json.loads(processed_data[1]))
            print(f'Document Saved [_id: {doc_id}, _rev: {doc_rev}]', 'in mental_db')


if __name__ == "__main__":
    main()
