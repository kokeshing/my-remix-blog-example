import argparse
import datetime
import json
import os

import requests

R2_SECRET_ACCESS_KEY = "[secret_access_key]"
CLOUDFLARE_API_TOKEN = "[cloudflare_api_token]"
ACCOUNT_ID = "[account_id]"
D1_TABLE_ID = "[table_id]"


def update_d1(key, title, abstract, body, date=None):
    now = datetime.datetime.now()
    updated_at = now.strftime("%Y-%m-%d %H:%M:%S")
    payload = {
        "params": [title, abstract, body, updated_at, key],
        "sql": "UPDATE articles SET title = ?, abstract = ?, body = ?, updated_at = ? WHERE key = ?;",
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
    }

    response = requests.request(
        "POST",
        f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/database/{D1_TABLE_ID}/query",
        json=payload,
        headers=headers,
    )

    print(response.text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", help="Directory to upload")
    args = parser.parse_args()

    directory_path = os.path.join(args.directory, "")
    if not os.path.exists(os.path.join(directory_path, "index.md")):
        raise Exception("index.md not found")

    if not os.path.exists(os.path.join(directory_path, "metadata.json")):
        raise Exception("metadata.json not found")

    with open(os.path.join(directory_path, "index.md")) as f:
        body = f.read()

    with open(os.path.join(directory_path, "metadata.json")) as f:
        metadata = json.load(f)

    key = os.path.basename(os.path.dirname(directory_path))
    title = metadata["title"]
    abstract = metadata["abstract"]
    date = metadata["date"] if "date" in metadata else None

    print(f"Update {key}...")
    print(f"Title: {title}")
    print(f"Abstract: {abstract}")
    print(f"Body: {len(body)}")
    print(f"Date: {date}")
    update_d1(key, title, abstract, body, date)


if __name__ == "__main__":
    main()
