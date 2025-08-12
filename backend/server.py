#!/usr/bin/env python3
"""
Python equivalent of the Node.js server.js backend
Provides the same API endpoints and functionality
"""

import os
import sys
import time
import json
import asyncio
from pathlib import Path
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file in backend directory
load_dotenv(dotenv_path=Path(__file__).parent / '.env')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration - same as Node.js
port = 5000
MAX_RETRIES = 3
INITIAL_BACKOFF_MS = 1000  # Start with 1 second
MAX_BACKOFF_MS = 10000  # Maximum 10 seconds
REQUEST_TIMEOUT_MS = 30000  # 30 second timeout

# Validate API key on startup
if not os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY') == 'your_openai_api_key_here':
    print('❌ OPENAI_API_KEY not found or still contains placeholder value')
    print('Please update your .env file with a valid OpenAI API key')
    print('Get your API key from: https://platform.openai.com/api-keys')
    sys.exit(1)

print('✅ OpenAI API key loaded successfully')

# Initialize OpenAI client
openai_client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
    timeout=REQUEST_TIMEOUT_MS / 1000  # Convert to seconds
)

def sleep(ms):
    """Helper function to sleep for a given number of milliseconds"""
    time.sleep(ms / 1000)

def call_openai_with_retry(messages, temperature=0.7):
    """Simplified retry mechanism with better error reporting - same as Node.js"""
    last_error = None
    
    for attempt in range(MAX_RETRIES):
        try:
            print(f"🤖 Attempt {attempt + 1}/{MAX_RETRIES} - Sending request to OpenAI...")
            
            completion = openai_client.chat.completions.create(
                model='gpt-3.5-turbo',
                messages=messages,
                temperature=temperature,
            )
            
            print(f"✅ OpenAI request successful on attempt {attempt + 1}")
            return completion
            
        except Exception as error:
            last_error = error
            print(f"❌ Attempt {attempt + 1} failed: {str(error)}")
            
            # Check for specific error types
            if hasattr(error, 'status_code'):
                if error.status_code == 401:
                    print('❌ Invalid API key detected')
                    raise Exception('Invalid OpenAI API key. Please check your .env file.')
                
                if error.status_code == 429:
                    print('❌ Rate limit exceeded')
                    raise Exception('OpenAI API rate limit exceeded. Please try again later.')
                
                if error.status_code == 402:
                    print('❌ Insufficient quota')
                    raise Exception('OpenAI API quota exceeded. Please check your billing.')
            
            # Check if this is a retryable error (network/connection issues)
            error_str = str(error).lower()
            is_retryable = (
                'connection' in error_str or
                'timeout' in error_str or
                'network' in error_str or
                'fetch failed' in error_str or
                (hasattr(error, 'status_code') and error.status_code >= 500)  # Server errors
            )
            
            # Don't retry on non-retryable errors
            if not is_retryable:
                print(f"❌ Non-retryable error: {str(error)}")
                raise error
            
            # If this was the last attempt, throw a descriptive error
            if attempt == MAX_RETRIES - 1:
                print(f"❌ All {MAX_RETRIES} attempts failed")
                raise Exception(f"Connection to OpenAI failed after {MAX_RETRIES} attempts. This may be due to network issues or OpenAI service unavailability. Please check your internet connection and try again.")
            
            # Calculate backoff time
            backoff_time = min(INITIAL_BACKOFF_MS * (2 ** attempt), MAX_BACKOFF_MS)
            print(f"⏳ Waiting {backoff_time}ms before retry...")
            
            sleep(backoff_time)
    
    raise last_error

def get_base_dir():
    """Helper function to get base directory for data files (project root)"""
    return Path(__file__).parent.parent

def capitalize_first_letter(string):
    """Helper for capitalizing first letter"""
    return string[0].upper() + string[1:] if string else string

def load_prompt_template():
    """Load prompt template - same as Node.js"""
    prompt_path = get_base_dir() / 'src' / 'data' / 'prompts' / 'interrogation_prompt.txt'
    if not prompt_path.exists():
        print(f"❌ Prompt template not found at: {prompt_path}")
        raise Exception('Prompt template file not found')
    return prompt_path.read_text(encoding='utf-8')

def load_suspect_data(name):
    """Load suspect data - same as Node.js"""
    suspect_path = get_base_dir() / 'src' / 'data' / 'suspects' / f"{name.lower()}.json"
    if suspect_path.exists():
        try:
            return json.loads(suspect_path.read_text(encoding='utf-8'))
        except Exception as error:
            print(f"❌ Error parsing suspect data for {name}: {error}")
            return {}
    print(f"⚠️ Suspect data not found for: {name}")
    return {}

def load_clue_data(day, suspect):
    """Load clue data - FIXED VERSION - same as Node.js"""
    base_dir = get_base_dir()
    
    # Try both day 1 and day1 format
    day_formats = [f"day{day}", f"day {day}"]
    
    for day_format in day_formats:
        clue_dir = base_dir / 'src' / 'data' / 'clues' / day_format
        
        # Check if the directory exists
        if not clue_dir.exists():
            print(f"📁 Directory not found: {clue_dir}")
            continue
        
        try:
            # Read all files in the directory
            files = list(clue_dir.iterdir())
            file_names = [f.name for f in files if f.is_file()]
            print(f"📂 Found files in {day_format}: {file_names}")
            
            # Look for files that start with the suspect name (case-insensitive)
            suspect_lower = suspect.lower()
            matching_files = [f for f in file_names if 
                            f.lower().startswith(suspect_lower) and 
                            (f.lower().endswith('.json') or f.lower().endswith('.txt'))]
            
            print(f"🔍 Matching files for {suspect}: {matching_files}")
            
            if matching_files:
                # Use the first matching file
                file_name = matching_files[0]
                file_path = clue_dir / file_name
                
                try:
                    if file_name.lower().endswith('.json'):
                        file_content = file_path.read_text(encoding='utf-8')
                        data = json.loads(file_content)
                        clue_text = data.get('clue') or data.get('text') or data.get('content') or 'No clue text found in JSON'
                        print(f"✅ Loaded JSON clue for {suspect}: {clue_text}")
                        return f"🧩 Clue about {capitalize_first_letter(suspect)}: {clue_text}"
                    else:  # .txt file
                        clue = file_path.read_text(encoding='utf-8').strip()
                        print(f"✅ Loaded TXT clue for {suspect}: {clue}")
                        return f"🧩 Clue about {capitalize_first_letter(suspect)}: {clue}"
                except Exception as error:
                    print(f"❌ Error reading clue file {file_path}: {error}")
        except Exception as error:
            print(f"❌ Error reading directory {clue_dir}: {error}")
    
    print(f"⚠️ No clue files found for {suspect} on day {day}")
    return f"No new clues for {capitalize_first_letter(suspect)} today."

@app.route('/api/ask', methods=['POST'])
def ask_endpoint():
    """API endpoint for asking questions with improved error handling - same as Node.js"""
    try:
        data = request.get_json()
        suspect = data.get('suspect', '')
        question = data.get('question', '')

        print(f"📝 Received question for {suspect}: {question}")

        if not suspect or not question:
            return jsonify({'error': 'Missing suspect or question'}), 400

        prompt_template = load_prompt_template()
        data = load_suspect_data(suspect)

        backstory = data.get('backstory', '')
        timeline = data.get('timeline', {})
        relationship = data.get('relationship_to_victim', 'Unknown relationship')
        tone = data.get('tone', 'neutral')

        filled_prompt = prompt_template.replace('{name}', capitalize_first_letter(suspect)) \
                                     .replace('{question}', question) \
                                     .replace('{tone}', tone) \
                                     .replace('{backstory}', backstory) \
                                     .replace('{time_range}', timeline.get('time_range', '')) \
                                     .replace('{location}', timeline.get('claimed_location') or timeline.get('location', '')) \
                                     .replace('{relationship_to_victim}', relationship)

        system_message = {
            'role': 'system',
            'content': 'You are a detective AI assistant. Your task is to help generate responses for a character in a murder mystery interrogation.',
        }
        user_message = {
            'role': 'user',
            'content': filled_prompt,
        }

        # Use the retry mechanism for the OpenAI API call
        completion = call_openai_with_retry([system_message, user_message], 0.7)

        response = completion.choices[0].message.content.strip()
        print(f"✅ Generated response for {suspect}")

        return jsonify({'response': response})
    except Exception as error:
        print(f"❌ Error generating response: {str(error)}")
        
        # Return the actual error message from our retry mechanism
        return jsonify({'error': f'Error generating response: {str(error)}'}), 500

@app.route('/api/clue', methods=['GET'])
def clue_endpoint():
    """API endpoint for loading clues - same as Node.js"""
    try:
        day = request.args.get('day', type=int)
        suspect = request.args.get('suspect', '')

        print(f"🔍 Loading clue for day {day}, suspect: {suspect}")

        if not day or not suspect:
            return jsonify({'error': 'Missing or invalid day or suspect parameter'}), 400

        clue = load_clue_data(day, suspect)
        print(f"✅ Loaded clue for {suspect}: {clue}")
        return jsonify({'clue': clue})
    except Exception as error:
        print(f"❌ Error loading clue: {str(error)}")
        return jsonify({'error': f'Error loading clue: {str(error)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint - same as Node.js"""
    health_data = {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'openai_configured': bool(os.getenv('OPENAI_API_KEY') and os.getenv('OPENAI_API_KEY') != 'your_openai_api_key_here'),
        'server_version': '1.2.0',
        'retry_config': {
            'max_retries': MAX_RETRIES,
            'initial_backoff_ms': INITIAL_BACKOFF_MS,
            'max_backoff_ms': MAX_BACKOFF_MS,
            'request_timeout_ms': REQUEST_TIMEOUT_MS
        }
    }

    # Optional: Test OpenAI connection if requested
    if request.args.get('test_openai') == 'true' and health_data['openai_configured']:
        try:
            print('🔍 Testing OpenAI connection...')
            test_completion = call_openai_with_retry([
                {'role': 'user', 'content': 'Say "OK" if you can hear me.'}
            ], 0)
            health_data['openai_test'] = 'success'
            health_data['openai_response'] = test_completion.choices[0].message.content.strip()
            print('✅ OpenAI connection test successful')
        except Exception as error:
            print(f'❌ OpenAI connection test failed: {str(error)}')
            health_data['openai_test'] = 'failed'
            health_data['openai_error'] = str(error)

    return jsonify(health_data)

if __name__ == '__main__':
    print(f"🚀 Python API server listening on port {port}")
    print(f"📡 Health check available at /health")
    print(f"🔑 OpenAI API key: {'Configured' if os.getenv('OPENAI_API_KEY') and os.getenv('OPENAI_API_KEY') != 'your_openai_api_key_here' else 'Missing or Invalid'}")
    print(f"🔄 Retry mechanism: {MAX_RETRIES} attempts with exponential backoff")
    print(f"⏱️  Request timeout: {REQUEST_TIMEOUT_MS}ms")
    
    if not os.getenv('OPENAI_API_KEY') or os.getenv('OPENAI_API_KEY') == 'your_openai_api_key_here':
        print(f"\n⚠️  WARNING: OpenAI API key is not properly configured!")
        print(f"   Please update your .env file with a valid API key from:")
        print(f"   https://platform.openai.com/api-keys\n")
    else:
        print(f"\n💡 Tip: Test OpenAI connection with: curl \"/health?test_openai=true\"\n")
    
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', port)), debug=False, use_reloader=False) 