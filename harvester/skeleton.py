import json

import requests
from mastodon import Mastodon, StreamListener


def main():
    create_database()
    m = Mastodon(api_base_url="https://mastodon.au",
                 access_token="1opBnKVhYAeM8fQNUaVefDZg8qr24nK74T-NtKjg1Nw")  # It is my access token. You may replace it with yours.
    m.stream_public(Listener())


def create_database():
    """
    Create a database named posts in the CouchDB Cluster.
    """
    url = "http://admin:DbPassword.1@172.26.134.0:5984/posts"
    requests.put(url)


class Listener(StreamListener):
    def on_update(self, status):
        """
        Assume that the database named posts exists in CouchDB.
        Store a post in CouchDB by sending a POST request to CouchDB.
        Each post is a document in that database.
        """
        url = "http://admin:DbPassword.1@172.26.134.0:5984/posts"
        headers = {"Content-Type": "application/json"}
        raw_data = json.dumps(status, sort_keys=True, default=str)

        # You may process the raw data here.

        # Then you may replace raw_data with processed_data in the following statement.
        response = requests.post(url, data=raw_data, headers=headers)
        print(response.json())


if __name__ == "__main__":
    main()
