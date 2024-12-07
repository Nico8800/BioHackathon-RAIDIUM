import json
import os

imgs_safe = []
with open('data/metadata.jsonl', 'r') as file :
    for line in file :
        tmp = json.loads(line)
        imgs_safe.append(tmp['id']+'.jpg')

dir_img = os.listdir('data/img')
for img in dir_img :
    os.remove(f'data/img/{img}') if img not in imgs_safe else None
