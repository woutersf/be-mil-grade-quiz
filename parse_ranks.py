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
        self.current_nato = None
        self.current_row = {}
        self.in_td = False
        self.td_index = 0
        self.capture_text = False
        self.current_text = []
        self.current_component = None

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
                # Convert to full URL
                if src.startswith('//'):
                    src = 'https:' + src
                self.current_row[f'img_{self.td_index}'] = src

    def handle_data(self, data):
        if self.capture_text:
            text = data.strip()
            if text and text not in ['&shy;']:
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
            # Process the row
            if 'text_0' in self.current_row:
                nato_match = re.match(r'(OF-\d+|OR-\d+)', self.current_row['text_0'])
                if nato_match:
                    nato = nato_match.group(1)

                    # Extract ranks for each component
                    # Land: columns 1-3, Air: columns 7-9, Marine: columns 10-12
                    # But we need to account for Medical Service (columns 4-6)

                    # Land Component
                    if 'text_1' in self.current_row and 'img_2' in self.current_row:
                        rank_name = self.current_row['text_1']
                        self.ranks['land'].append({
                            'nato': nato,
                            'name': rank_name,
                            'image': self.current_row['img_2']
                        })

                    # Air Component (Luchtmacht)
                    if 'text_7' in self.current_row and 'img_8' in self.current_row:
                        rank_name = self.current_row['text_7']
                        self.ranks['air'].append({
                            'nato': nato,
                            'name': rank_name,
                            'image': self.current_row['img_8']
                        })

                    # Marine Component
                    if 'text_10' in self.current_row and 'img_11' in self.current_row:
                        rank_name = self.current_row['text_10']
                        self.ranks['marine'].append({
                            'nato': nato,
                            'name': rank_name,
                            'image': self.current_row['img_11']
                        })

# Parse both files
parser = RankParser()

with open('/Users/frederikwouters/dev/mil/grades.mil.be/source_grades', 'r', encoding='utf-8') as f:
    content = f.read()
    parser.feed(content)

# Print results
print(json.dumps(parser.ranks, indent=2, ensure_ascii=False))
