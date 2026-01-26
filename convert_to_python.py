import json

# 1. Load the JSON
try:
    with open('gita_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 2. Write it to a Python file as a variable
    with open('gita_data_source.py', 'w', encoding='utf-8') as f:
        f.write("# This file contains the Gita data as a Python list\n")
        f.write(f"GITA_DATA_LIST = {json.dumps(data, indent=4)}")
        
    print("✅ Success! Created gita_data_source.py")
    print("You can now import this file in app.py")
    
except FileNotFoundError:
    print("❌ Error: Could not find gita_data.json")
