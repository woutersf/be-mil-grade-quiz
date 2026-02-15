#!/usr/bin/env python3
import json
import re

# Load the parsed data
with open('/Users/frederikwouters/dev/mil/grades.mil.be/parse_ranks.py', 'r') as f:
    exec(f.read())

# Create parser and parse
parser = RankParser()
with open('/Users/frederikwouters/dev/mil/grades.mil.be/source_grades', 'r', encoding='utf-8') as f:
    content = f.read()
    parser.feed(content)

def clean_rank_name(name):
    """Clean rank name by removing parentheses and cleaning up soft hyphens"""
    # Remove parenthetical parts
    name = re.sub(r'\s*\([^)]*\)', '', name)
    # Clean up multiple spaces
    name = re.sub(r'\s+', ' ', name)
    # Remove soft hyphens
    name = name.replace('­', '')
    return name.strip()

def get_higher_res_image(url):
    """Convert to higher resolution image URL"""
    # Change from 60px to 120px or remove the size constraint
    url = url.replace('/60px-', '/120px-')
    return url

# Clean up the data
cleaned_ranks = {
    'land': [],
    'air': [],
    'marine': []
}

for component in ['land', 'air', 'marine']:
    for rank in parser.ranks[component]:
        cleaned_ranks[component].append({
            'nato': rank['nato'],
            'name': clean_rank_name(rank['name']),
            'image': get_higher_res_image(rank['image'])
        })

# Now create the JavaScript structure
js_output = {
    'land': [{'name': r['name'], 'image': r['image']} for r in cleaned_ranks['land']],
    'air': [{'name': r['name'], 'image': r['image']} for r in cleaned_ranks['air']],
    'marine': [{'name': r['name'], 'image': r['image']} for r in cleaned_ranks['marine']]
}

# Print as formatted JSON
print(json.dumps(js_output, indent=2, ensure_ascii=False))
