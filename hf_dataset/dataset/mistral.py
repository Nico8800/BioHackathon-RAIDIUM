import json
import os
from dataset_utils import divide_file_in_batches
from mistralai import Mistral
from dotenv import dotenv_values

def translate(data) :
    config = dotenv_values('.env')
    api_key = config.get("MISTRAL_API_KEY")
    model = "open-mistral-nemo"

    client = Mistral(api_key=api_key)

    chat_response = client.chat.complete(
        model = model,
        messages = [
            {
                "role": "user",
                "content": f'Translate this python list in french, stay consistent with the words and use specific words. Answer only with the translated content formated as the list you were given {data}',
            },
        ]
    )

    return chat_response.choices[0].message.content

def full_translate(file_name='metadata.jsonl') :
    jsonl_file = divide_file_in_batches(batches=10)
    merged = ''
    data = []
    for batch in jsonl_file :
        texts = [elem['text'] for elem in batch]
        tsl = translate(texts)
        print(tsl)
        json.loads(str(tsl))
        
        

    with open('matadata_translate.jsonl', 'w') as file :
        file.write(merged)

# def one_go():
#     with open('data/metadata.jsonl', 'r') as file :
#         jsonl_file = file.read()
#     merged = translate(jsonl_file)

#     with open('matadata_translate.jsonl', 'w') as file :
#         file.write(merged)

full_translate()

# one_go()