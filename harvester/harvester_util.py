import json
import nltk 
nltk.download('punkt')
from nrclex import NRCLex
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk.stem import PorterStemmer
from nltk. tokenize import word_tokenize


key_words = ['cope', 'social', 'anxieti', 'mental', 'kill', 'mental', 'mentalhealth', 'adhd', 'dysthymia', 'ocd', 'ptsd', 
             'ptsr', 'ptss', 'schizo', 'depr', 'mdd', 'trauma', 'cishet', 'dehuman', 'angri', 'control', 'suicid', 
             'ableist', 'counsel', 'blade', 'wrist', 'harm', 'disord', 'dysphoria', 'celexa', 'ill', 'rant', 'nausea', 
             'borderlin', 'suicid', 'citalopram', 'insecur', 'unbear', 'diseas', 'sexual', 'horrid', 'relaps', 'emo', 
             'thinspo', 'griev', 'bother', 'scar', 'prescrib', 'admit', 'abus', 'dizzi', 'puke', 'victim', 'manic', 
             'mentalhospit', 'survivor', 'stain', 'worthless', 'tens', 'effexor', 'offend', 'alcohol', 'horrifi', 
             'useless', 'vile', 'recov', 'wellbutrin', 'guilt', 'razor', 'horni', 'duloxetin', 'counsellor', 'paranoid', 
             'hallucin', 'sexual', 'syndrom', 'destruct', 'cannib', 'damag', 'problemat', 'disappear', 'unstabl', 
             'manipul', 'underweight', 'insult', 'treatment', 'vagina', 'inject', 'sorrow', 'isol', 'misogynist', 
             'threaten', 'hallucin', 'heal', 'psych', 'purg', 'overwhelm', 'hurt', 'doxycyclin', 'empathi', 'insomnia', 
             'vent', 'endur', 'distress', 'restless', 'consent', 'overdos', 'lethal', 'stab', 'talentless', 'punish', 
             'relaps', 'fail', 'stigma', 'obsess', 'narcissist', 'harsh', 'control', 'panic', 'disturb', 'shame', 'whini', 
             'refus', 'agoni', 'suffer', 'terror', 'bug', 'prescript', 'intent', 'disgrac', 'pedophil', 'sad', 'xanax', 
             'hatr', 'drown', 'loneli', 'mark', 'moan', 'vomit', 'abus', 'intoler', 'horrend', 'bulli', 'ableism', 
             'lexapro', 'androgyn', 'anxiou', 'heroin', 'failur', 'attack', 'drown', 'masturb', 'threaten', 'bleed', 
             'wreck', 'escap', 'bulli', 'strain', 'flesh', 'selfcar', 'rape', 'gut', 'devast', 'dizzi', 'abort', 'sob', 
             'betray', 'fraud', 'paranoia', 'abus', 'delus', 'haunt', 'bother', 'die right now', 'bulli', 'mentalhealth', 
             'void', 'overweight', 'whine', 'desper', 'conscious', 'repli', 'depress', 'mentalhealthawar', 'bipolardisord', 
             'eatingdisord', 'schizophrenia', 'headspac', 'lifelin', 'selfcar']

key_tags = ['anxietydisorder', 'anxietyrecovery', 'anxietyhealing', 'anxietytips', 'emotionalhealth', 'anxiety', 
     'depression', 'ocd', 'chronicillness', 'pressure', 'stress', 'divergentmind', 'hsp', 
     'trauma', 'psychiatry', 'healthcare', 'patientportal', 'psychology', 'socialwork', 'psychotherapy', 
     'peacefulmind', 'peacefullife', 'motivation', 'innerwork', 'mentalhealthmatters', 'struggles', 'substanceabuse', 
     'selfharm', 'eatingdisorder', 'mentalhealthtreatment', 'mentalillness', 'surviving', 'ptsd', 'mentalhealthfirstaid', 
     'psychischekrisen', 'notjustsad', 'psyche', 'mentalhealthcare', 'mindfulness', 'mentalhealth', 
     'mindfulnessselfawareness', 'personalgrowth', 'selfinjury', 'deathsofdespair', 'suicide', 
     'autism', 'neurokin', 'neuropride', 'autismawareness', 'autismacceptance', 'adhders', 'sensitive', 
     'autism', 'adhd', 'adhdbrain', 'latediagnosis', 'autistic', 'autismawarenessmonth', 'neurodivergent', 
     'neurodiversity', 'asd', 'actuallyautistic', 'autistictwitter', 'audhd', 'neurospicy', 'neurodiverse']



def content_valid_func(content):
    """
    whether the content include mental-health related keywords
    if included: return 1
    else: return 0
    """
    flag = 0
    for each_word in content:
        if each_word in key_words:
            flag == 1
            break
    return flag


def tags_valid_func(tags):
    """
    whether the post-tags include mental-health related tags
    if included: return 1
    else: return 0
    """
    flag = 0
    for tag in tags:
        if tag in key_tags:
            flag = 1
            break
    return flag



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



def preprocess_content_func(content):
    content = content.lower()

    words = word_tokenize(content)
    ps = PorterStemmer()
    new_content = []
    for w in words:
        rootword=ps.stem (w)
        if rootword not in """,./;'[]\-=<>?:"{}|!@#$%^&*()""" and len(rootword) != 1:
            new_content.append(rootword)
    return new_content
    


def processed_fuction(raw_data):
    """"
    filtering the useful information from raw data
    return list:
    "value that identity if the content is related 
    to mental health"

    AND
    {
    valid info from raw toot (6 features),
    emotion_score,
    sentiment_score
    }
    """

    account = raw_data['account']['acct']
    content = raw_data['content']
    language = raw_data['language']
    created_at = raw_data['created_at']
    followers_count = raw_data['account']['followers_count']


    raw_tags = raw_data['tags']
    tags = [dict_tag['name'].lower() for dict_tag in raw_tags]

    emo_score = get_emotion_score(content)
    senti_score = get_sentiment_score(content)


    preprocess_content = preprocess_content_func(raw_data['content'])
    content_valid = content_valid_func(preprocess_content)
    tags_valid = tags_valid_func(tags)

    toot_clean = {
    'account':account,
    'preprocess_content':preprocess_content,
    'content':content,
    'tags':tags,
    'language':language,
    'created_at':created_at,
    'followers_count':followers_count,
    'emo_score':emo_score,
    'senti_score':senti_score
    }

    json_object = json.dumps(toot_clean)

    return [content_valid+tags_valid, json_object]

