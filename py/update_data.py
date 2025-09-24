import asyncio
import aiohttp
import os
import json


async def download_file(url, header, dest_path, namefile=None, format=None):
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=header) as r:
                if r.status == 200:
                    if namefile and format:
                        path_file = os.path.join(dest_path, f"{namefile}.{format}")
                    else:
                        path_file = dest_path  
                    with open(path_file, "wb") as f:
                        f.write(await r.read())
                    print(f"Downloaded: {path_file}")
                else:
                    print(f"Error downloading {url}: {r.status}")
    except Exception as e:
        print(f"Error: {e}")


async def main():

    DATA_DIR = "../data"
    USERNAME = "pippobonas"
    
    REPO_JSON = os.path.join(DATA_DIR, "repo.json")
    TAGS_DIR = os.path.join(DATA_DIR, "tags")
    PREVIEW_DIR = os.path.join(DATA_DIR, "preview")

    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(TAGS_DIR, exist_ok=True)
    os.makedirs(PREVIEW_DIR, exist_ok=True)

    github_token = os.getenv("GITHUB_TOKEN")
    headers = {"Authorization": f"Bearer {github_token}"} if github_token else {}

    repo_url = f"https://api.github.com/users/{USERNAME}/repos"

    await download_file(repo_url, headers, REPO_JSON)

    with open(REPO_JSON, "r") as f:
        repos = json.load(f)
        
    # Filter repositories to include only those with "fork" set to False
    repos = [repo for repo in repos if not repo.get("fork", False)]
    
    # Extract relevant fields from each repository
    repos = [
        {
            "name": repo["name"],
            "full_name": repo["full_name"],
            "languages_url": repo["languages_url"],
            "description": repo.get("description", "No description provided")
        }
        for repo in repos
    ]

    for repo in repos:
        repo_name = repo["name"]
        repo_full_name = repo["full_name"]
        lang_url = repo["languages_url"]
        await download_file(lang_url, headers, TAGS_DIR, repo_name, "json")

        preview_url = f"https://raw.githubusercontent.com/{repo_full_name}/main/preview.png"
        await download_file(preview_url, headers, PREVIEW_DIR, repo_name, "png")


if (__name__ == "__main__"):
   asyncio.run(main())