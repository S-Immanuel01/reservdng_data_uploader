# RESERVDNG BOT
Download the code by running `git clone https://github.com/S-Immanuel01/reservd_bot_uploader.git`


## Running the bot
1 -> In the IDE of your choice open the reservd_bot_uploader folder

2 -> Run this in terminal `npm i`

3 -> Copy the sheet url from the search bar on your browser, and paste it in the url variable
```
2 const url = 'Copied url goes here'
```

4 -> specify the range for the bot to uplaod from the excel file (use the excel numbering system to check this range). do this by editing the range start and end variables in the code:

This would upload from row 1 to 10 on the excel sheet
```
4 const range = {
5    'start': 1,
6    'end': 10
7  }
```

This should be used when uploading a single row:
e.g: the expression below would only upload row 10
```
4 const range = {
5    'start' = 10,
6    'end' = 10
7 }
```

5 -> run the bot by typing `npm run bot` in your terminal, hit enter

6 -> A cypress window would be opened in your taskbar, click on it and select e2e and a browser to open the bot in (recommend: the native cypress browser i.e electron or chrome)

7 -> select the file to run (e.g Hotels | stays | clubs).

## Photo Upload Bot
start by opening the `directories_path.txt` file and add the names of the location you want to upload e.g if hotel you add hotels/{name of hotel}

run this command `npm run create_dir`

put the photo of the hotels into the director created at cypress/fixtures/hotels/{name of hotel you put in the directories path file}

To run the photo upload bot the steps are similar, with only steps 3 and 4 being different

follow these steps 1 and 2, then reference these steps and continue step 5 to 7 above

3 -> Change the sheet url to your desired url do this by deleting the "hotel_url" after url in "url.hotel_url" and making typing the url you want...

Accepted types are: `hotel_url , shortlets_url, clubs_url, restaurant_url`

 i.e: if you want ot use shortlet url
`9 const sheet_url = url.shortlets_url`

4 -> Change the start to the number of the first data point on your excel sheet

i.e if you are trying to upload from Eko Hotels downward, just check to the left on the s/n for the number beside Eko Hotel and change the start to that number

```
11  const range = {
12      'start': 10, // change this to the number on the excel sheet
13      'end': 10 // do not touch this... not needed
14    }

```
