
import os
import json
import requests

# Configuration
# Hardcoded Google Drive links as requested by the user.
GOOGLE_DRIVE_LINKS = {
    "content.json": "https://drive.google.com/file/d/1CqjzJeMmojHC0r7TBS3k_sGA-oYIMszs/view?usp=drive_link",
    "metadata.json": "https://drive.google.com/file/d/1E1IgNNHdO1yMIvrZYrV2qZFO0vL3md6K/view?usp=sharing",
    "styles.json": "https://drive.google.com/file/d/1VGG1VhIb5V0dJcv_s2FwdLCMQXgfP2Ku/view?usp=sharing",
}

LOCAL_FILES_PATH = "/home/ubuntu/Melius-Operarius-Solis/deployed-website/test-website"

def get_google_drive_file_id(url):
    """Extracts the file ID from a Google Drive share URL."""
    if "id=" in url:
        return url.split("id=")[1]
    elif "/file/d/" in url:
        return url.split("/file/d/")[1].split("/")[0]
    return None

def download_file_from_google_drive(url):
    """Downloads content from a public Google Drive share link."""
    file_id = get_google_drive_file_id(url)
    if not file_id:
        print(f"Error: Could not extract file ID from URL: {url}")
        return None

    # This is a common direct download URL for Google Drive files.
    download_url = f"https://docs.google.com/uc?export=download&id={file_id}"
    
    try:
        response = requests.get(download_url, stream=True)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error downloading file from {url}: {e}")
        return None

def sync_files():
    print("Starting Melius Engine synchronization...")

    for filename, drive_link in GOOGLE_DRIVE_LINKS.items():
        if not drive_link:
            print(f"Error: Google Drive link for {filename} is not set. Skipping.")
            continue

        local_filepath = os.path.join(LOCAL_FILES_PATH, filename)
        print(f"Processing {filename}...")

        # 1. Fetch content from Google Drive
        print(f"Attempting to download from Google Drive: {drive_link}")
        external_content = download_file_from_google_drive(drive_link)
        if external_content is None:
            print(f"Skipping {filename} due to download error or invalid link.")
            continue

        # Ensure content is valid JSON if expected
        try:
            external_data = json.loads(external_content)
        except json.JSONDecodeError:
            print(f"Warning: External content for {filename} is not valid JSON. Skipping update.")
            continue

        # 2. Read local content
        local_data = None
        if os.path.exists(local_filepath):
            with open(local_filepath, 'r') as f:
                try:
                    local_data = json.load(f)
                except json.JSONDecodeError:
                    print(f"Warning: Local content for {filename} is not valid JSON. Overwriting.")
                    local_data = None # Force overwrite if local is corrupt
        
        # 3. Compare content and update if changed
        if local_data != external_data:
            print(f"Changes detected for {filename}. Updating local file.")
            with open(local_filepath, 'w') as f:
                json.dump(external_data, f, indent=2)
            print(f"Updated {local_filepath}")
        else:
            print(f"No changes detected for {filename}. Local file is up-to-date.")

    print("Synchronization complete.")

if __name__ == "__main__":
    sync_files()
