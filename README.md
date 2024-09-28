 # <img src="public/icons/logo.png" width="45" align="left"> WebTrace Tracker

<p align="left">
  <img src="https://img.shields.io/badge/firebase-v9.23.0-FFCA28?logo=firebase" alt="firebase" />
  <img src="https://img.shields.io/badge/typescript-v5.2.2-3178C6?logo=typescript" alt="typescript" />
</p>

WebTrace Tracker is an interaction tracking tool for web applications. The Tracker is provided as a Chrome extension and is designed to remotely monitor client-side user interactions during usability testing.

The tracked data is recorded in Firebase and can be reviewed through the
[WebTrace Dashboard](https://github.com/SIT-Lab/WebTrace-Dashboard), which is designed for managing and analyzing tests.

### Types of Collected Data

#### Event Data
- **eventType**: The type of event that occurred (e.g., "scroll down", "left click", "data input")
- **hostName**: The domain of the accessed website (e.g., "www.amazon.com")
- **pathName**: The path portion of the URL (e.g., "/s", "/dp/B007TIN0GW/ref=as_sl_pc_as_ss_li_til")
- **url**: The full URL address
- **time**: The timestamp when the event occurred
- **xpath**: The XPath path of the element where the event occurred
- **imageUrl**: The URL of the screenshot captured during the event (stored in Firebase Storage).

#### Mouse Event Data
- **x**: The X coordinate of the mouse pointer when the event occurred
- **y**: The Y coordinate of the mouse pointer when the event occurred
- **scrollDirection**: The direction of the mouse scroll (e.g., "scroll down", "scroll up")
- **scrollState**: The state of the scroll event (e.g., "scroll start", "scrolling", "scroll end")


#### Keyboard Event Data
- **keyboardInputKeyCode**: The code of the pressed key (e.g., "KeyH", "Backspace")
- **keyboardInputPressedKey**: The pressed key (e.g., "A")
- **keyboardInputState**: The state of the keyboard input (e.g., "input start", "input ongoing", "input end")
- **keyboardInputType**: The type of keyboard input (e.g., "keydown")

#### Screen Information Data
- **h**: Screen height
- **w**: Screen width

#### Result Data
- **accessedAt**: The date when the user performed the task (timestamp)
- **browser**: The browser used by the user (e.g., "Chrome")
- **device**: The device used by the user (e.g., "Desktop")
- **durationSec**: Task duration time
- **isFinished**: Whether the task is completed (true/false)
- **os**: he operating system used by the user (e.g., "Windows 10.0")
<!-- - **userAge**: 사용자의 나이
- **userCountry**: 사용자의 국가 (예: "korea")
- **userGender**: 사용자의 성별 (예: "man")
- **userId**: 사용자의 ID -->

<!-- ## 👨🏼‍💻팀원
| **편지승**  | **허민**    |
|:-----------:|:-----------:|
| <img src="https://avatars.githubusercontent.com/vuswltmd" height="130" width="130"></img> | <img src="https://avatars.githubusercontent.com/i-mymeminn" height="130" width="130"></img> |
| <a href="https://github.com/vuswltmd" target="_blank"><img src="https://img.shields.io/badge/GitHub-black.svg?&style=round&logo=github&logoColor=white"/></a> | <a href="https://github.com/i-mymeminn" target="_blank"><img src="https://img.shields.io/badge/GitHub-black.svg?&style=round&logo=github&logoColor=white"/></a> |
| <a href="mailto:sseung7367@jbnu.ac.kr" target="_blank"><img src="https://img.shields.io/badge/Gmail-EA4335?style=round&logo=Gmail&logoColor=white"/></a> | <a href="mailto:heomin02@jbnu.ac.kr" target="_blank"><img src="https://img.shields.io/badge/Gmail-EA4335?style=round&logo=Gmail&logoColor=white"/></a> | -->

<!-- ## 시스템 아키텍쳐
<작성예정> -->

## Getting Started

### 1. Obtain Firebase SDK:
   -  Create a project in Firebase and obtain the SDK.

### 2. Clone the Code
   - Clone the project repository by running the following command
      ```sh
      git clone [https://github.com/SIT-Lab/WebTrace-Tracker]
      ```
### 3. Set Environment Variables:
  - Create a `.env` file in the root directory and add the Firebase configuration settings as follows:
      ```dosini
      REACT_APP_FIREBASE_API_KEY=Your_Firebase_API_Key
      REACT_APP_FIREBASE_AUTH_DOMAIN=Your_Firebase_Auth_Domain
      REACT_APP_FIREBASE_PROJECT_ID=Your_Firebase_Project_ID
      REACT_APP_FIREBASE_STORAGE_BUCKET=Your_Firebase_Storage_Bucket
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID=Your_Firebase_Messaging_Sender_ID
      REACT_APP_FIREBASE_APP_ID=Your_Firebase_App_ID
      REACT_APP_FIREBASE_MEASUREMENT_ID=Your_Firebase_Measurement_ID
      ```
### 4. Install Required Packages:
   - Install the necessary dependencies by running:
      ```sh
        npm install
      ```
### 5. Build the Project:
   - Build the application by running the following command:
      ```sh
        npm run build
      ```

<!-- ### 6. Load Tracker:

   - Open Chrome browser and go to the extensions management page by typing chrome://extensions/ in the address bar.
   - Enable Developer Mode in the top right corner.
   - Click on "Load unpacked" and select the build folder.
   - The extension will be uploaded and installed in Chrome. -->

### 6. Distribute Tracker to Test Participants:
- Once the project is built, tester will need to distribute the necessary files to test participant.
- The key folder to distribute is the build folder, which contains all the necessary files to run the Chrome extension.

#### Instructions for Test Participants:

1. Make sure that the test participants receive the build folder.

2. Instruct the test participants to follow these steps to install the Chrome extension:
    - Open the Chrome browser and go to the extensions management page by typing chrome://extensions/ in the address bar.
    - Enable **Developer Mode** in the top right corner.
    - Click on the **Load unpacked** button.
    - Select the `build` folder that tester provided to test participant.
    - The extension will be uploaded and installed in their Chrome browser.

For further details, refer the test participants to the [Google Chrome Extension Guide](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=en#load-unpacked).

## Tracker Features

<!-- ### For tester
Generate the build file using the instructions in the Getting Started section, and provide it to the test participants.

### For Test participant
WebTrace Tracker is a Chrome extension. Participants must have Chrome browser installed before the test begins. After receiving the WebTrace Tracker build file from the tester, the application can be installed in the browser by referring to section 6 of the **Getting Started** guide. -->

<p align="left" >
  <img src="https://github.com/user-attachments/assets/d34c5b76-cf54-488b-b807-47c8a04cfa56" width="220" alt="image1" style=""/>
 
  ### A. Enter IDs
  This is the page where you enter the IDs provided by the tester.
  - Enter the IDs (Project ID, Task Suite ID, Task ID) provided by the tester
into the Tracker
  - After entering the IDs correctly, click the Submit button to proceed to the next page
</p>

<p align="left">
  <img src="https://github.com/user-attachments/assets/8568cb12-3cf8-4b24-b047-a965f2b40d77" width="220" alt="image2" style=""/>

  ### B. Enter Personal Details
  This is the page where the personal Details of the Test participant is entered.
  - Enter the user ID, age, gender, and country
  - After entering the Personal Details correctly, Click the Submit button to proceed to the next page
</p>

<p align="left">
  <img src="https://github.com/user-attachments/assets/8b452728-0fc8-4613-a49c-a4c9dde2f221" width="220" alt="image3" style=""/>
  
  ### C. Click to Start
  This is the page where you decide whether to start the task.
  - Confirm the notification message
  - Click the "Click to Start" button to begin the task.
  - The Tracker begins monitoring the participant's interactions with the currently active Chrome browser tab
</p>

<p align="left">
  <img src="https://github.com/user-attachments/assets/60526ff1-9af2-4f4c-94c7-aa55f64fe458" width="220" alt="image4"/>
  
  ### D. End Task Options
  This is the page where you decide how to end the task.

  - **Pause:** Participants can pause the test by clicking the “Pause” button during the session. When this feature is activated, the recording of participant activities is temporarily halted until the “Resume” button is clicked.

  - **Finish:** Participants can complete the test by clicking the “Finish” button
when they successfully accomplish the given task. In this case, all
collected data up to that point is sent to Firebase, and the test session
ends.

  - **Give up:** Participants can end the test by clicking the "Give up" button if they believe completing the task is impossible.

  - **Quit:** Participants can quit the test at any time by clicking the “Quit” button, unrelated to the task itself. In this case, the collected data is considered unsuitable for analysis and is therefore discarded
instead of being sent to Firebase.
</p>






## License

This project is licensed under the Apache License 2.0. For more details, please refer to the  [LICENSE](LICENSE) file.

This project includes third-party libraries that are licensed under the Apache License 2.0. For more details, please refer to the [NOTICE](NOTICE) file.
```
   Copyright [2024] [Division of Computer Science and Engineering,
   Jeonbuk National University SIT Lab]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```