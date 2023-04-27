import json
import os
import re
import pandas as pd
import requests
from nrclex import NRCLex
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

USER = "admin"
PASSWORD = "DbPassword.1"
BASE_URL = "http://172.26.134.0:5984/"
DB_NAME = "tweets"
DB_SESSION = requests.Session()
DB_SESSION.auth = (USER, PASSWORD)

AMBIGUOUS_REASON = "AMBIGUOUS"

STATE_ABB_DICT = {
    "new south wales": "nsw",
    "victoria": "vic",
    "queensland": "qld",
    "south australia": "sa",
    "western australia": "wa",
    "tasmania": "tas",
    "northern territory": "nt",
    "australian capital territory": "act"
}

GCC_DICT = {"sydney": "1gsyd", "melbourne": "2gmel", "brisbane": "3gbri", "adelaide": "4gade", "perth": "5gper",
            "hobart": "6ghob", "darwin": "7gdar", "canberra": "8acte", "RURAL": "RURAL"}

# Choose key words and related hashtags for analysis
KEY_WORDS_SET = {"mental", "mental health", "emotional health", "psychological health", 
               "mental soundness","emotional soundness", "psychological soundness",
               "mental balance", "emotional balance", "psychological balance"
               "mental wellbeing","emotional wellbeing","psychological wellbeing",
               "mental wellness", "emotional wellness", "psychological wellness",
               "mental stability", "emotional stability","psychological stability",
               "mental fitness", "emotional fitness","psychological fitness",
               "mental resilience", "emotional resilience","psychological resilience",
                "mental strength", "emotional strength","psychological strength",
               "mental issue", "depression", "mental illness", "anxiety disorder", 
               "mental care", "wellbeing", "MentalHealthAwareness", "EndTheStigma", "SelfCare", "Wellness", 
                "Mindfulness", "MentalHealthMatters", "MentalIllness", "MentalHealthRecovery", 
                "MentalHealthSupport", "MentalHealthAdvocate", "YouAreNotAlone", "BreakTheStigma", 
                "MentalHealthWarrior", "Anxiety", "Depression", "PTSD", "BipolarDisorder", "EatingDisorders", 
                "Schizophrenia", "SuicidePrevention", "TraumaHealing", "MentalHealthAustralia", "RUOK", 
                "Lifeline", "BeyondBlue", "Headspace", "BlackDogInstitute", "MentalHealthWeek", "MensMentalHealth", 
                "WomensMentalHealth", "KidsMentalHealth", "YouthMentalHealth", "IndigenousMentalHealth", 
                "MentalHealthSupportServices", "MentalHealthPolicy", "MentalHealthReform", "MentalHealthAdvocacy", 
                "MentalHealthAwarenessMonthAU", "MentalHealthResearchAU", "MentalHealthNurseAU", "MentalHealthCounsellorAU",
                'coping', 'do not deserve to', 'social anxie', 'mental disease', 'kill themselves', 'mentally ill', 
                'mental health', 'adhd', 'dysthymia', 'ocd', 'ptsd', 'ptsr', 'ptss', 'schizo', 'depres', 'mdd', 'anxiety', 
                'trauma', 'cishet', 'dehumanizing', 'so angry', 'i dont want to', 'controlled', 'suicidal', 'ableist', 
                'counselling', 'blade', 'want to kill', 'wrists', 'harm', 'disorder', 'i will never be', 'voices in my', 
                'want to hug', 'want to die', 'dysphoria', 'hear voices', 'days clean', 'celexa', 'illness', 'getting worse', 
                'they do not care', 'im screaming', 'ranting', 'run away', 'nausea', 'borderline', 'suicide', 'citalopram', 
                'insecure', 'unbearable', 'diseases', 'kill myself', 'sorry for being', 'i am sorry that', 'to die in', 
                'sexually', 'horrid', 'i give up', 'relapsing', 'need to talk', 'emo', 'thinspo', 'grieving', 'feel sick', 
                'getting bad again', 'deal with it', 'wish i was dead', 'i am so sick', 'bothered', 'scars', 'prescribed', 
                'admitted', 'abusive', 'dizzy', 'puking', 'a victim', 'really sad', 'weeks clean', 'my existence', 'trigger', 
                'manic', 'mental hospital', 'irl friends', 'survivor', 'hearing voices', 'stains', 'wanting to die', 
                'i am scared', 'want to help', 'afraid that', 'worthless', 'tense', 'masturbating', 'not alone', 'the voices in', 
                'have to deal with', 'and never wake up', 'effexor', 'gives a shit', 'do not want to eat', 'offend', 'was forced', 
                'alcoholism', 'feel like shit', 'actually crying', 'months clean', 'shit like this', 'tendencies', 'horrifying', 
                'useless', 'to hurt myself', 'vile', 'recover', 'wellbutrin', 'guilt', 'razor', 'hate everything', 'horny', 
                'duloxetine', 'counsellor', 'feel the same way', 'paranoid', 'hallucinating', 'free will', 'weight loss', 
                'end my life', 'me to kill', 'sexuality', 'syndrome', 'destructive', 'cannibal', 'damage', 'sorry to hear that', 
                'it hurts so much', 'problematic', 'hope you are ok', 'hope you are well', 'disappear', 'unstable', 'manipulating', 
                'underweight', 'insulted', 'treatment', 'vaginas', 'i would feel', 'helped me a lot', 'no one likes me', 'injection', 
                'my mental', 'sorrow', 'isolated', 'drained', 'cuts', 'what i am going', 'purged', 'esteem', 'rough day', 'misogynist', 
                'threatening', 'not available', 'kill him', 'shrink', 'voices are', 'i have not spoken to', 'vulnerable', 'collarbones', 
                'hallucinations', 'i have lost', 'i can not bring myself', 'cals', 'healing', 'psych', 'nostalgic', 'i need to lose', 
                'rapist', 'cries', 'purging', 'that feel when', 'toxic', 'overwhelming', 'hurtful', 'doxycycline', 'i cut', 
                'sad all the time', 'empathy', 'insomnia', 'vent', 'grave', 'seroquel', 'to live anymore', 'endure', 'i have been feeling', 
                'distress', 'restless', 'hope i die', 'the bottom of the', 'consent', 'overdose', 'lethal', 'stabbed', 'talentless', 'punish', 
                'relapse', 'save me from myself', 'rest of my life', 'near the end of', 'a burden', 'for mental', 'failings', 'stigma', 
                'obsessive', 'narcissistic', 'health it', 'am not worth', 'i am sorry you', 'am so stressed', 'a deep breath', 'harsh', 
                'doctors', 'to love myself', 'controlling', 'panic', 'disturbed', 'lose weight', 'would kill', 'shaming', 'it is my fault', 
                'angry i', 'whiny', 'refused', 'agony', 'not eaten', 'does get better', 'i will be dead', 'will never get over', 
                'commit', 'bugging', 'prescription', 'intention', 'disgrace', 'pedophiles', 'sadness', 'not defending', 'urges', 'xanax', 
                'condition', 'i am crying so', 'appropriation is', 'needle', 'cutting', 'a bad person', 'swear to god i', 'my weight', 
                'i need to cut', 'hatred', 'i am so worried', 'attacking', 'am still alive', 'erasure', 'drowning', 'loneliness', 
                'to swallow', 'marks', 'moan', 'vomiting', 'can not do this anymore', 'abuse', 'want to be skinny', 'intolerant', 
                'been clean', 'hate life', 'bawling', 'so alone', 'so scared', 'horrendous', 'bullies', 'ableism', 
                'victim of', 'lexapro', 'androgynous', 'anxious', 'alone and', 'not stop crying', 'crying so much', 'heroin', 'failure', 
                'my own fault', 'attacks', 'tired omg', 'killing people', 'be alone', 'feel sad', 'not sleeping', 'im crying so', 
                'hate people', 'drowned', 'manipulate', 'i want to cut', 'masturbation', 'am struggling', 'how hard it is', 'threatened', 
                'bleed', 'wreck', 'med', 'to therapy', 'in pain', 'weight again', 'feel so much better', 'broke down', 'worrying', 
                'still struggle', 'am losing', 'am going through', 'exploited', 'escape', 'my wrist', 'to hate me', 'give a shit', 
                'this is too much', 'reason to live', 'do not cut', 'deserve to die', 'am disgusting', 'my own skin', 'hate myself', 
                'not :)', 'let me die', 'bullied', 'strain', 'flesh', 'feel so fat', 'look in the mirror', 'died in', 'self-care', 'raping', 
                'gutted', 'devastated', 'innocence', 'clean from', 'a waste of space', 'i hate my life', 'to try and sleep', 'dizziness', 
                'am not the only one', 'abortion', 'sob', 'need someone to talk', 'betrayed', 'fraud', 'kill herself', 'personalities', 
                'paranoia', 'i cant do this', 'abusing', 'so sorry to', 'commenting', 'you realise', 'want to live', 'deserve to be happy', 
                'be thin', 'edgy', 'drop dead', 'flashbacks', 'being fat', 'sorry for your', 'someone to talk to', 'delusion', 'haunt', 'hate my body', 
                'imaginary', 'bothering', 'die right now', 'bully', 'am just sick of', 'mentalhealth', 'i am already dead', 'void', 'i am trash', 
                'i have been up', 'safe space', 'a piece of shit', 'are feeling better', 'i can not deal with', 'lucid', 'overweight', 'whining', 
                'desperation', 'consciousness', 'have lost weight', 'i should probably sleep'}

def process_location_file(location_path):
    """
    Open sal.json and pass it to the next function to get gcc codes
    :param location_path: sal.json, which contains the gcc codes
    :return: Another function that extracts the gcc code
    """

    with open(os.path.dirname(__file__) + location_path, "r", encoding="UTF-8") as location_file:
        sal = json.load(location_file)

    return get_code_by_places(sal)


def get_code_by_places(sal):
    """
    Extract all the gcc codes and save into a dict
    :param sal: place information in json format
    :return: gcc code (type: dict)
    """
    code_by_place_dict = {}

    for (place, value) in sal.items():
        code = value.get("gcc")

        code_by_place_dict[place] = code

    return code_by_place_dict


def get_gcc_code(t_place, place_dict: dict):
    """
    Get the gcc code of the place, and update the counts of ambiguous locations
    :param t_place: Temp place name
    :param place_dict: Dict (key: place name, Value: gcc code)
    :param ambiguous_locations: Dict (key: Ambiguous place name, Value: count)
    :return: gcc code or None
    """

    # if the location is in two parts
    if t_place.find(",") != -1:
        t_place_first, t_place_second = t_place.split(",", 1)
        # All locations that end with Australia are ambiguous. e.g. Victoria, Australia;  South Australia, Australia
        if t_place_second == "australia":
            return None

        if t_place_first in GCC_DICT.keys():
            return GCC_DICT[t_place_first]
        else:
            returns = check_against_places(t_place_first, place_dict, t_place_second)
            return handle_location_check_returns(t_place, returns)
    # if the location is a single word
    else:
        # If it"s Australia or States, return None, as they are ambiguous
        if t_place == "australia" or t_place in STATE_ABB_DICT.keys():
            return None

        returns = check_against_places(t_place, place_dict)
        return handle_location_check_returns(t_place, returns)


def check_against_places(place_first_part, place_dict, place_second_part=None):
    """
    Check whether the place name is ambiguous, 
    if not, return the gcc code,
    if yes, return None (for the gcc code) and the reason why it is ambiguous
    :param place_first_part: The first part (before comma) of the temp place name
    :param place_dict: Dict (key: place name, Value: gcc code)
    :param place_second_part: The second part (after comma) of the temp place name, default value set to None
    :return: gcc code or None, and the reason (if not ambiguous, the reason is omitted)
    """

    # Get all places that contains the current location - O(n)
    places_matched = [place for place in place_dict.keys() if place_first_part in place]
    if len(places_matched) == 1:
        code = place_dict[places_matched[0]]
        if is_gcc(code):
            return code,

    # if there are multiple results found
    elif len(places_matched) > 1:
        # if there is an exact match
        if place_first_part in places_matched:
            return place_dict[place_first_part],

        # get all returned gcc in a set
        gcc_variances = set(place_dict[place] for place in places_matched)
        # if we only have one kind of gcc code, then it"s the one
        if len(gcc_variances) == 1:
            if is_gcc(list(gcc_variances)[0]):
                return list(gcc_variances)[0],
            else:
                return None, "NOT_A_GCC"

        elif len(gcc_variances) > 1:
            state_abb = STATE_ABB_DICT.get(place_second_part.strip()) if place_second_part else None
            if state_abb:
                # Try to find a specific match with state info
                specific_refined_matched_places = [place for place in places_matched if
                                          re.search(f"{place_first_part} \({state_abb}\.?\).*", place)]
                if len(specific_refined_matched_places) == 1:
                        if is_gcc(place_dict[specific_refined_matched_places[0]]):
                            return place_dict[specific_refined_matched_places[0]],
                        else:
                            return None, "NOT_A_GCC"

                # Try to do a fuzzy match with state info
                fuzzy_refined_matched_places = [place for place in places_matched if
                                          re.search(f".*{place_first_part}.*{state_abb}\.?.*", place)]
                # Find place names include state abbreviations in brackets, like white rock (cairns - qld).

                if len(fuzzy_refined_matched_places) == 0:
                    return None, f"{AMBIGUOUS_REASON}: Multiple Matches Found, But None Matched After State Info Applied"

                elif len(fuzzy_refined_matched_places) > 1 and \
                        len(set(place_dict[place] for place in fuzzy_refined_matched_places)) > 1:
                    return None, f"{AMBIGUOUS_REASON}: Multiple Matches Found After State Info Applied"

                # REPORT: If the only refined match can"t match the location with a GCC,
                # we don"t consider it as AMBIGUOUS
                # e.g. "gold coast, queensland" is not ambiguous, as all entries found in sal.json are not within a GCC.
                elif is_gcc(place_dict[fuzzy_refined_matched_places[0]]):
                    return place_dict[fuzzy_refined_matched_places[0]],
    else:
        return None, "NO_MATCH_FOUND"

    return None, "NOT_A_GCC"


def is_gcc(code):
    """
    Use regular expressions to identify whether the gcc code belongs to a greater city
    :param code: gcc code
    :return: true/false (is a greater city or not)
    """

    if re.search("\dg\w{3}|8acte", code):
        # "\d" - Digits, "g" - Character "g",
        # "\w" - Word Characters, "{3}" - Exactly 3 word characters.
        # Or "8acte"
        return True
    return False


def handle_location_check_returns(t_place, returns):
    """
    Handle the returns.
    If the location is ambiguous, update the count in the dict.
    If not, return the gcc code.
    :param t_place: Temp place name
    :param ambiguous_locations: Dict (key: place name, Value: count)
    :param returns: Return values (First value: Place code or None, Second Value: Omitted or Reason)
    :return: If not ambiguous, return gcc code. If ambiguous, return None.
    """

    if len(returns) == 1:
        return returns[0]
    else:
        return None

def create_db():
    res = DB_SESSION.put(BASE_URL+DB_NAME)
    print(res.text)

def bulk_send(doc_bulk):
    json_docs = { "docs": doc_bulk}
    res = DB_SESSION.post(BASE_URL+DB_NAME+"/_bulk_docs", json=json_docs)
    doc_bulk = list()
    print(res.text)

def does_include_keywords(text):
    if any(word in text for word in KEY_WORDS_SET):
        return True
    return False

def get_emotion_score(text):
    '''
    Returns: dictionary of emotional affect indicators 
    {'fear': 0.0, 'anger': 0.0, 'anticip': 0.0, 
    'trust': 0.0, 'surprise': 0.0, 'positive': 0.0, 
    'negative': 0.0, 'sadness': 0.0, 'disgust': 0.0, 'joy': 0.0, 
    'anticipation': 0.0}

    The bigger indicator, the more affect from this emotion is detected from the text
    '''
    emotion = NRCLex(text)
    emo_dict = emotion.affect_frequencies
    return emo_dict

def get_sentiment_score(text):
    '''
    Returns: dictionary of sentiment affect indicators 
    {'neg': 0.0, 'neu': 0.0, 'pos': 0.0, 'compound': 0.0}

    The bigger indicator, the more affect from this sentiment is detected from the text
    '''
    senti_analyser = SentimentIntensityAnalyzer()
    sentiment_dict = senti_analyser.polarity_scores(text)
    return sentiment_dict

def gen_dict_extract(key, var):
    if hasattr(var,"items"): # hasattr(var,"items") for python 3
        for k, v in var.items(): # var.items() for python 3
            if key in k:
                yield v
            if isinstance(v, dict):
                for result in gen_dict_extract(key, v):
                    yield result
            elif isinstance(v, list):
                for d in v:
                    for result in gen_dict_extract(key, d):
                        yield result