from datasets import load_dataset
from huggingface_hub import login
from dotenv import dotenv_values
import json

def load() :
    config = dotenv_values('.env')
    login(token=config.get('HF_TOKEN'), add_to_git_credential=False)
    dataset = load_dataset("imagefolder", data_dir="./data")
    
    return dataset

def push_dataset(dataset, key='Polaire/CXR_BioXAi_Hackathon_2024') :
    dataset.push_to_hub(key)

def divide_file_in_batches(filename='metadata.jsonl', batches=50):
    with open('data/'+filename, 'r') as file :
        count = 0
        data = []
        tmp = []
        for line in file :
            if count == batches-1 :
                data.append(tmp)
                tmp = [json.loads(line)]
                count =0
            else :
                tmp.append(json.loads(line))
                count += 1
        if len(tmp) < batches :
            data.append(tmp)
        return data