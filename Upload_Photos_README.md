# Uploading Photos

## Step 1: Set the URL type

In the code, locate this line:

```js
const sheet_url = url.shortlets_url
```

Change `.shortlets_url` to the type of data you want to post:

| URL Type           | Use For      |
|--------------------|--------------|
| `.shortlets_url`   | stays        |
| `.restaurants_url` | Restaurants  |
| `.clubs_url`       | clubs        |
| `.hotels_url`      | hotels       |


*(e.g. change `.shortlets_url` to `.restaurants_url` for restaurants)*

## Step 2: Set the range

> ⚠️ **The range is very important.** It tells the code which page on the website to start searching from.
>
> - `1 – 10` → first page
> - `11 – 20` → second page
> - `21 – 30` → third page
>
> ...and so on.

## Step 3: Create the directories

1. Open the `/directories_path.txt` file.
2. Delete the guide text inside it.
3. Paste the names of the web elements you want to create directories for (e.g. `Restaurant`, `Stays`, `Clubs` — one per line).
4. Run the following command to create the folders:

```bash
npm run create_dir
```

## Step 4: Upload the images

1. Place your images inside each newly created folder.
2. Run the code to upload them.
