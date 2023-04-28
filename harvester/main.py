import json
import couchdb
#import requests
from mastodon import Mastodon, StreamListener
import pandas as pd
import harvester_util
import os 



#setup basic informatio for couchdb
couchdb_admin = os.environ.get("DB_USER")
couchdb_password = os.environ.get("DB_PASSWORD")

#setup basic informatio for mastodon
mastodon_server = os.environ.get("MASTODON_SERVER")
mastodon_token = os.environ.get("MASTODON_TOKEN")

couchdb_url = f'http://{couchdb_admin}:{couchdb_password}@172.26.134.0:5984/'
couch = couchdb.Server(couchdb_url)

#two db for two different contents
db_name_ls = ['mental_disabled_db', 'non_mental_disabled_db']

print(f"Scraping Mastodon Server: {mastodon_server}")

def main():
    create_database()
    m = Mastodon(api_base_url=mastodon_server,
                 access_token=mastodon_token)  # Johnny's tocken.
    m.stream_public(Listener())


def create_database():
    """
    Create a database in the CouchDB Cluster if it is not exits
    """
    for db in db_name_ls:
        if db not in couch:
            db = couch.create(db)
        else:
            db = couch[db]


class Listener(StreamListener):
    def on_update(self, status):
        """
        Assume that the database named toots exists in CouchDB.
        Store a toot in CouchDB by sending a POST request to CouchDB.
        Each toot is a document in that database.
        """

        mental_db = couch[db_name_ls[0]]
        non_mental_db = couch[db_name_ls[1]]

        raw_data = json.dumps(status, sort_keys=True, default=str)

        #process the raw toots here.
        processed_data = harvester_util.processed_fuction(json.loads(raw_data))
        if processed_data[0] == 0:
            doc_id, doc_rev = non_mental_db.save(json.loads(processed_data[1]))
            print(f'Document saved with ID: {doc_id} and revision: {doc_rev}', 'in non_mental_db')
        else:
            doc_id, doc_rev = mental_db.save(json.loads(processed_data[1]))
            print(f'Document saved with ID: {doc_id} and revision: {doc_rev}', 'in mental_db')


if __name__ == "__main__":
    main()
