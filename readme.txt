--Readme document for *Hanin Ali Barakat*, *habaraka@uci.edu*, *24925252*--
Working SOLO but joined group: A4 24

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

11/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 3/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
About 18 hours



3. What online resources did you consult when completing this assignment? (list specific URLs)
- https://ionicframework.com/docs/api/datetime?utm_source=chatgpt.com#events (Helped me understand the usage of ion-datetime)
- https://capacitorjs.com/docs/apis/preferences?utm_source=chatgpt.com (Helped me understand how to backup data in local storage using preferences)
- ChatGPT (Used ChatGPT as a learning and debugging resource throughout the assignment. Below are examples of prompts I used and how they helped me.)

Prompt 1: "Where should I convert the selected time string into a Date object?"
  
    How it helped:Helped me understand how Ionic's `ion-datetime` values work and how to convert them into JavaScript Date objects for recording overnight sleep.

Prompt 2: "Why should I use SleepService instead of saving the data directly?"
  
    How it helped: Helped me understand the purpose of Angular services and how to organize sleep records so they can be accessed across different pages.

Prompt 3: "How can I save my sleep data locally using Capacitor Preferences?"
  
    How it helped: Guided me through understanding local storage and implementing data persistence so sleep and sleepiness records remain available after refreshing the app.

Prompt 4: "How can I allow only logging once per day?"
  
    How it helped: Helped me implement a check that prevents users from logging multiple overnight sleep records for the same wake-up date while still allowing multiple sleepiness entries throughout the day.

Prompt 5: "How can I make sure that when a user logs their sleep in the morning, the record appears under today's date?"
  
    How it helped: Helped me debug the date calculation so bedtime is assigned to the previous day when appropriate and wake-up time is assigned to the current day.

Prompt 6: "How can I check whether my app follows the four principles of good mobile design?"
  
    How it helped: Helped me evaluate my app's navigation, error prevention, editing and deleting functionality, and use of Ionic components.




4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
None



5. Is there anything special we need to know in order to run your code?
No. Make sure to run cd sleeptracker, install dependencies with npm install if needed, and then run npx ionic serve in the terminal.


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
I had college students in mind because I wanted them to be able to quickly log their sleep data after waking up and easily record their sleepiness throughout the day.


7. Did you design your app specifically for iOS or Android, or both?
Both. I didn't particularly favor one platform over the other.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
The user logs their overnight sleep after waking up by first selecting when they went to bed, then selecting when they woke up, and finally saving the data. I chose this implementation because it allows users to log their sleep once in the morning, which is time-efficient for those with busy schedules, such as students, while also helping them track their sleep day by day in a logical way.


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
The user simply accesses the Sleepiness tab and drags the slider to select the number that best describes how they feel, with the option to expand an information section explaining what each number on the scale means. I chose this method because it looks clean and straightforward; instead of always displaying the descriptions, which may not be visually appealing, users can choose to show or hide them once they become familiar with the scale.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
The user can access the History tab, which includes a calendar with dates containing logged data marked in blue and the current date highlighted in blue with black text; each selected date displays the overnight sleep and daytime sleepiness records logged for that day, along with their corresponding times. I chose this implementation because it makes it easy to identify which day the user is viewing and distinguish between overnight sleep and sleepiness records throughout the day.


11. Which feature choose--using a native device resource, backing up logged data, or both?
I chose backing up logged data.



12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
WASN'T IMPLEMENTED


13. If you backed up logged data, where does it back up to?
The data is stored locally on the user's device or browser using Capacitor Preferences, allowing previously logged records to remain available after the app is refreshed or reopened.

14. How does your app implement or follow principles of good mobile design?
My app follows the four main principles of good mobile design by providing a useful initial view with simple tab navigation, allowing users to edit or delete incorrect records, and preventing errors through input validation, duplicate sleep-log prevention, and delete confirmation. I also followed platform conventions by using Ionic components such as time pickers, sliders, buttons, and bottom navigation tabs, while maintaining a consistent nighttime theme throughout the app.