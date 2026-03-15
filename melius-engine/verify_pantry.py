import os
import json
import requests
import sys

class PantryVerifier:
    def __init__(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.pantry_id = os.getenv("PANTRY_ID")
        self.base_url = f"https://getpantry.cloud/apiv1/pantry/{self.pantry_id}/basket"
        self.target_folder = os.path.join(self.root_dir, "deployed-website", "test-website")
        self.config_files = ["content.json", "metadata.json", "styles.json"]

    def get_pantry_data(self, basket_name):
        if not self.pantry_id:
            return None
        try:
            response = requests.get(f"{self.base_url}/{basket_name}")
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"Error fetching pantry data ({basket_name}): {e}")
        return None

    def post_pantry_data(self, basket_name, data):
        if not self.pantry_id:
            return
        try:
            requests.post(f"{self.base_url}/{basket_name}", json=data)
            return True
        except Exception as e:
            print(f"Error posting pantry data ({basket_name}): {e}")
            return False

    def read_local_json(self, filename):
        full_path = os.path.join(self.target_folder, filename)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                try:
                    return json.load(f)
                except json.JSONDecodeError:
                    return None
        return None

    def verify_and_sync(self):
        if not self.pantry_id:
            print("PANTRY_ID environment variable is not set.")
            return

        print(f"Verifying Pantry ID: {self.pantry_id}")
        
        for config_file in self.config_files:
            basket_name = config_file.replace(".json", "")
            local_data = self.read_local_json(config_file)
            pantry_data = self.get_pantry_data(basket_name)

            if local_data is None:
                print(f"Local file {config_file} not found. Skipping.")
                continue

            if pantry_data is None:
                print(f"Basket {basket_name} not found in Pantry. Initializing Pantry with local data...")
                if self.post_pantry_data(basket_name, local_data):
                    print(f"Successfully initialized {basket_name} in Pantry.")
                continue

            # Compare local and pantry
            if local_data != pantry_data:
                print(f"Mismatch detected in {config_file}. Local data is different from Pantry.")
                print("Updating Pantry to match local JSON file...")
                if self.post_pantry_data(basket_name, local_data):
                    print(f"Successfully updated Pantry basket {basket_name} to match local file.")
            else:
                print(f"{config_file} is already in sync with Pantry.")

if __name__ == "__main__":
    verifier = PantryVerifier()
    verifier.verify_and_sync()
