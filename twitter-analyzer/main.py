import ijson
import argparse
import os.path
import util


# specify this index as the last(the biggest) index in the db to avoid rework (if somehow the program failed)
LAST_INDEX = -1

def process_data(index, tweet, gcc_code, emo_score):
    doc = {}
    doc["index"] = index
    doc["gcc"] = gcc_code
    doc["emotion_score"] = emo_score
    doc["text"] = tweet.get("data", {}).get("text")
    doc["includes"] = tweet.get("includes")
    return doc

def main(data_path, location_path):
    util.create_db()
    # Get gcc code by locations. data looks like: [{"abb": "1gsyd"}, ...]
    code_by_places = util.process_location_file(location_path)
    with open(os.path.dirname(__file__) + data_path, "r", encoding="UTF-8") as twitter_file:
        twitter = ijson.items(twitter_file, "rows.item")

        bulk_docs = list()
        for index, tweet in enumerate(twitter):
            # Check INDEX in case this is a re-run
            if index <= LAST_INDEX:
                continue
            
            tweet = tweet.get("doc")
            # Check Geolocation
            if not tweet.get("includes"):
                continue
            t_place_name = tweet["includes"].get("places")[0].get("full_name").lower()
            code = util.get_gcc_code(t_place_name, code_by_places)
            if not code:
                continue
            
            # Check Hashtags and Keywords
            if not util.does_include_keywords(tweet.get("data", {}).get("text")):
                continue
            
            # Check Emotion Score
            # score = GET_EMOTION_SCORE()
            score = None

            processed_data = process_data(index, tweet, code, score)

            bulk_docs.append(processed_data)
            if len(bulk_docs) % 1000 == 0:
                util.bulk_send(bulk_docs)
                bulk_docs = list()

        if len(bulk_docs) != 0:
            util.bulk_send(bulk_docs)
        


if __name__ == "__main__":
    # USAGE: python main.py --location /../sal.json --data /../twitter-data-small.json

    parser = argparse.ArgumentParser(description="Processing Twitter data focusing on the geolocation attribute")
    # Pass in the location file path
    parser.add_argument("--location", type=str, help="File path to the location file. e.g. sal.json")
    # Pass in the twitter data file path
    parser.add_argument("--data", type=str, help="File path to the twitter data file")
    args = parser.parse_args()

    location_path = args.location
    data_path = args.data

    main(data_path, location_path)

    
