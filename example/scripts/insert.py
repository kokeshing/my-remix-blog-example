import argparse
import datetime
import json
import os

import boto3
import requests

R2_BUCKET_NAME = "[bucket_name]"
R2_ENDPOINT_URL = "[endpoint_url]"
R2_ACCESS_KEY_ID = "[access_key_id]"
R2_SECRET_ACCESS_KEY = "[secret_access_key]"
CLOUDFLARE_API_TOKEN = "[cloudflare_api_token]"
ACCOUNT_ID = "[account_id]"
D1_TABLE_ID = "[table_id]"


def upload_r2(key, file_path):
    s3 = boto3.client(
        service_name="s3",
        endpoint_url=R2_ENDPOINT_URL,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name="auto",
    )
    s3.upload_file(file_path, R2_BUCKET_NAME, key)


def insert_d1(key, title, abstract, body, date=None):
    if date is None:
        payload = {
            "params": [key, title, abstract, body],
            "sql": "INSERT INTO articles (key, title, abstract, body) VALUES (?, ?, ?, ?);",
        }
    else:
        # dateはUTCのISO8601形式
        dt = datetime.datetime.fromisoformat(date.replace("Z", "+00:00"))
        created_at = dt.strftime("%Y-%m-%d %H:%M:%S")
        payload = {
            "params": [key, title, abstract, body, created_at, created_at],
            "sql": "INSERT INTO articles (key, title, abstract, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);",
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

    for file in os.listdir(directory_path):
        if file == "index.md" or file == "metadata.json":
            continue

        file_path = os.path.join(directory_path, file)
        if os.path.isdir(file_path):
            print(f"Skip directory: {file_path}")
            continue

        print(f"Uploading {file_path}...")
        upload_r2(f"{key}/{file}", file_path)

    print(f"Inserting {key}...")
    print(f"Title: {title}")
    print(f"Abstract: {abstract}")
    print(f"Body: {len(body)}")
    print(f"Date: {date}")
    insert_d1(key, title, abstract, body, date)


if __name__ == "__main__":
    main()
