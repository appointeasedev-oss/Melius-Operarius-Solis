import os
import json
import requests

class MeliusOperarius:
    def __init__(self):
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        self.pantry_id = os.getenv("PANTRY_ID")
        self.base_url = f"https://getpantry.cloud/apiv1/pantry/{self.pantry_id}/basket"
        # The target directory is now inside deployed-website
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
        except Exception as e:
            print(f"Error posting pantry data ({basket_name}): {e}")

    def read_local_json(self, filename):
        full_path = os.path.join(self.target_folder, filename)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                try:
                    return json.load(f)
                except json.JSONDecodeError:
                    return None
        return None

    def write_local_json(self, filename, data):
        full_path = os.path.join(self.target_folder, filename)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return True

    def run(self):
        if not self.pantry_id:
            print("PANTRY_ID not found. Melius Operarius requires a Pantry ID.")
            return

        print(f"Starting sync for Pantry ID: {self.pantry_id}")
        
        for config_file in self.config_files:
            basket_name = config_file.replace(".json", "")
            print(f"Checking {config_file} (Basket: {basket_name})...")
            
            pantry_data = self.get_pantry_data(basket_name)
            local_data = self.read_local_json(config_file)
            
            if pantry_data is None:
                print(f"Basket {basket_name} not found in Pantry. Initializing with local data...")
                if local_data:
                    self.post_pantry_data(basket_name, local_data)
                continue

            if local_data != pantry_data:
                print(f"Change detected in {config_file}. Updating local file from Pantry...")
                self.write_local_json(config_file, pantry_data)
                print(f"Successfully updated {config_file}.")
            else:
                print(f"{config_file} is already in sync.")

        print("Melius Operarius sync complete.")

if __name__ == "__main__":
    # For testing purposes
    operarius = MeliusOperarius()
    operarius.run()
