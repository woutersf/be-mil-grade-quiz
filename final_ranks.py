#!/usr/bin/env python3
import re
import json
from html.parser import HTMLParser

class RankParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ranks = {
            'land': [],
            'air': [],
            'marine': []
        }
        self.current_row = {}
        self.in_td = False
        self.td_index = 0
        self.capture_text = False
        self.current_text = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        if tag == 'tr':
            self.td_index = 0
            self.current_row = {}

        elif tag == 'td':
            self.in_td = True
            self.current_text = []
            self.capture_text = True

        elif tag == 'b' and self.in_td:
            self.capture_text = True

        elif tag == 'img' and self.in_td:
            if 'src' in attrs_dict:
                src = attrs_dict['src']
                if src.startswith('//'):
                    src = 'https:' + src
                # Convert to 120px for better quality
                src = src.replace('/60px-', '/120px-')
                self.current_row[f'img_{self.td_index}'] = src

    def handle_data(self, data):
        if self.capture_text:
            text = data.strip()
            if text and text not in ['&shy;', '\u00ad']:
                self.current_text.append(text)

    def handle_endtag(self, tag):
        if tag == 'td':
            self.in_td = False
            text = ' '.join(self.current_text).strip()
            if text:
                self.current_row[f'text_{self.td_index}'] = text
            self.td_index += 1
            self.capture_text = False
            self.current_text = []

        elif tag == 'tr':
            if 'text_0' in self.current_row:
                nato_match = re.match(r'(OF-\d+|OR-\d+)', self.current_row['text_0'])
                if nato_match:
                    nato = nato_match.group(1)

                    # Land Component
                    if 'text_1' in self.current_row and 'img_2' in self.current_row:
                        self.ranks['land'].append({
                            'nato': nato,
                            'name': self.current_row['text_1'],
                            'image': self.current_row['img_2']
                        })

                    # Air Component
                    if 'text_7' in self.current_row and 'img_8' in self.current_row:
                        self.ranks['air'].append({
                            'nato': nato,
                            'name': self.current_row['text_7'],
                            'image': self.current_row['img_8']
                        })

                    # Marine Component
                    if 'text_10' in self.current_row and 'img_11' in self.current_row:
                        self.ranks['marine'].append({
                            'nato': nato,
                            'name': self.current_row['text_10'],
                            'image': self.current_row['img_11']
                        })

def clean_rank_name(name):
    """Clean rank name by removing parentheses and cleaning up soft hyphens"""
    # Remove parenthetical parts
    name = re.sub(r'\s*\([^)]*\)', '', name)
    # Remove soft hyphens (including unicode soft hyphen)
    name = name.replace('\u00ad', '')
    name = name.replace('­', '')
    # Clean up multiple spaces
    name = re.sub(r'\s+', ' ', name)
    return name.strip()

# Parse the file
parser = RankParser()
with open('/Users/frederikwouters/dev/mil/grades.mil.be/source_grades', 'r', encoding='utf-8') as f:
    content = f.read()
    parser.feed(content)

# Clean up the data and format for JavaScript
js_output = {
    'land': [],
    'air': [],
    'marine': []
}

for component in ['land', 'air', 'marine']:
    for rank in parser.ranks[component]:
        js_output[component].append({
            'name': clean_rank_name(rank['name']),
            'image': rank['image']
        })

# Print as formatted JSON
print(json.dumps(js_output, indent=2, ensure_ascii=False))
