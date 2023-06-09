## Web based Training Catalog
A dynamic web application that allows content creators to upload videos with overlays and generate an embedded code to display the video player on any authenticated website. It provides various features to enhance the viewing experience and engage the audience. 

## Features

1. **Video Upload**: Content creators can upload their videos to the platform. The application supports various video formats and ensures smooth playback.

2. **Overlays**: Creators can add overlays to their videos, such as chapter marks, to help viewers track their progress. These overlays appear at specific timestamps during the video playback.

3. **Intro Screen Editor**: The application includes an intro screen editor, enabling creators to design customized intro screens for their videos. The intro screen is also set as the default thumbnail of the video, improving its visual representation.

4. **Intro Screen Templates**: To assist content creators, the application provides a collection of pre-designed intro screen templates. Creators can choose from these templates and customize them according to their preferences.

5. **MCQ Questions**: Creators can generate multiple-choice questions (MCQs) that appear to viewers at specified times during video playback. These questions help engage the audience and test their understanding. User answers to the MCQs are saved in the database for further analysis.

6. **User Insights**: The application includes a dedicated section to view user insights. Content creators can access valuable analytics and data related to user interactions, video views, and MCQ responses. These insights aid in evaluating the performance and effectiveness of the videos.

## Installation

To set up the web application locally, follow these steps:

**Download Source Codes**
	
Clone the repositories

https://github.com/chamara-senarath/fluid-video-editor-frontend.git  
https://github.com/chamara-senarath/fluid-video-editor-backend.git

There are two methods to run the applications.
- Using Docker Image
- Setting up own environment (Manual Setup)

The application was originally built to support two servers called DIPS and Layup. You can point these two varibles to your own servers.( assigning second server is optional )

```javascript
VUE_APP_DIPS_SERVER
VUE_APP_LAYUP_SERVER
```


Follow one of the methods given below to run the applications



**Docker Setup (Method 1)**

- Go to https://docs.docker.com/install/ and follow the instruction to install docker
- Open backend folder (fluid-video-editor-backend)
- Open command prompt in the current location and run the following command,

    `docker-compose up`

- Open frontend folder (fluid-video-editor-frontend)
- Open command prompt in the current location.
- Replace <DIPS_SERVER_URL> with the URL for the first server API and <LAYUP_SERVER_URL> with the URL for the second server API. ( assigning second server is optional )







- Run the following command,

```dockerfile    
docker build -t chamara-senarath/fluid-video-editor-frontend .
docker run -it -p 8080:80 -e VUE_APP_DIPS_SERVER=<DIPS_SERVER_URL> VUE_APP_LAYUP_SERVER=<LAYUP_SERVER_URL> --rm --name fluid-video-editor-frontend-app chamzjay/fluid-video-editor-frontend
```





**Setting up the Environment (Method 2)**

**Install Node.js**
- Go to https://nodejs.org/en/ and download the latest build of Node.js and install it.
- If you use NVM, select the latest version of Node.js

**Install Nginx server**
- Go to https://nginx.org/en/download.html and download the latest version of the Nginx server.
- Unzip the zip file to the location where you want to save the Nginx files.

**Install PM2**
- Open the command prompt and paste the following code. 

    `npm install pm2 -g`

**Install MongoDB**
- Visit https://www.mongodb.com/download-center/community
- Download the current release of MongoDB Community Server
- Install MSI file
- Make a folder in C and name it as “data”
- Make another folder “db” inside “data” folder
- Go to C:\Program Files\MongoDB\Server\4.2\bin
- Open Command Prompt in the current location 
- Run the following command

    `mongod`


**Build & Run Source Codes (Method 2 - Cont.)**

**Build & Run Frontend**
- Open the folder which contains the frontend files. (frontend)
- Open command prompt in the current location and paste the following commands,

```nodejs
    npm install
    npm run build
```

- If the build is successful, there should be a folder named ‘dist’ in the current location. This is the folder where you need to copy the frontend contents from.
- Go to the folder where you installed Nginx Server.
- Change directory path to nginx-1.17.8/html
- Paste files inside the ‘dist’ folder mentioned above to the current location.
- Change directory path to nginx-1.17.8/conf
- Edit nginx.conf file as mentioned in the below code segment (Nginx configuration code segment)
- Change directory path to nginx-1.17.8
- Open the command prompt in the current location and run the following command. 

    `start nginx`

**Run backend**
- Copy files inside the backend folder to where you need to save backend files. (backend)
- Go to the folder where you saved the backend files.
- Open the command prompt in the current location and run the following commands.
    
```nodejs
npm install 
    pm2 start index.js
```








**Nginx configuration code segment**


```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        client_max_body_size 2000M;
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://localhost:3000/api;

        }
    }

}
```







**Deploy on Amazon EC2 (Using Method 2)**

- Create a new Ubuntu Server on AWS EC2
- Sign into the AWS Management Console at https://aws.amazon.com/console/. If you don't have an account yet click the "Create a Free Account" button and follow the prompts.
- Go to the EC2 Service section.
- Click the "Launch Instance" button.
- Enter "Ubuntu" in the search box and press enter, then select the "Ubuntu Server 18.04" Amazon Machine Image (AMI).
- Choose Instance Type - Select an instance type and click "Configure Security Group" in the top menu.
- Configure Security Group - Add a new rule to allow HTTP traffic then click "Review and Launch".
- Review - Click Launch
- Select "Create a new key pair", enter a name for the key pair and click "Download Key Pair" to download the private key, you will use this to connect to the server via SSH.
- Click "Launch Instances", then scroll to the bottom of the page and click "View Instances" to see details of the new Ubuntu EC2 instance that is launching.



- Connect to Ubuntu EC2 Instance via SSH
- Open a terminal window and update the permissions of the private key file with the command

     `chmod 400 <path-to-key-file>`

- Copy the "Public DNS (IPv4)" property from the instance description tab in the AWS Console, then connect to the instance from the terminal window with the command

     `ssh -i <path-to-key-file> ubuntu@<domain name>`
 
- Enter yes to the prompt "Are you sure you want to continue connecting (yes/no)?" to add the URL to your list of known hosts.



- Setup Web Server with Node.js + MongoDB + NGINX
- While connected to the new AWS EC2 instance in the terminal window, run the following command:

    `curl https://gist.githubusercontent.com/cornflourblue/f0abd30f47d96d6ff127fe8a9e5bbd9f/raw/e3047c9dc3ce8b796e7354c92d2c47ce61981d2f/setup-nodejs-mongodb-production-server-on-ubuntu-1804.sh | sudo bash`

- Deploy Node.js + MongoDB Back-end API
- Clone the Node.js + MongoDB API project into the /opt/back-end directory with the command

    `sudo git clone https://github.com/janaka44/CreativeTrainingCatalog /opt/`

- Navigate into the back-end directory and install all required npm packages with the command 

    `cd /opt/backend && sudo npm install`

- Start the API using the PM2 process manager with the command 

    `sudo pm2 start index.js`

- Deploy Vue.js + Vuex Front-end app
- Navigate into the front-end directory and install all required npm packages with the command 

    `cd /opt/frontend && sudo npm install`

- Build the front end app with the command 

    `sudo npm run build`


- Configure NGINX to serve the Node.js API and Vue.js front-end
- Delete the default NGINX site config file with the command 

    `sudo rm /etc/nginx/sites-available/default`

- Launch the nano text editor to create a new default site config file with

    `sudo nano /etc/nginx/sites-available/default`

- Paste in the following config:

    
    ```nginx
    worker_processes  1;
    events {
        worker_connections  1024;
    }
    
    http {
        include       mime.types;
        default_type  application/octet-stream;
        sendfile        on;
        keepalive_timeout  65;
    
        server {
            client_max_body_size 2000M;
            listen       80;
            server_name  localhost;
    
            location / {
                root /opt/frontend/dist;
                try_files $uri /index.html;
            }
    
            location /api {
                proxy_pass http://localhost:3000/api;
            }
        }
    }
    ```
    

- Save the file by pressing ctrl + x and selecting Yes to save.
- Restart NGINX with the command 

    `sudo systemctl restart nginx`

**How to Update**

- Run the following command to update the application to the latest build.

    
    ```bash
    cd /opt/
    sudo git pull https://github.com/chamara-senarath/fluid-video-editor-frontend-frontend
    sudo git pull https://github.com/chamara-senarath/fluid-video-editor-frontend-backend
    ```
    

- Change directory to frontend

    `cd frontend`

- Run this command to install new npm packages if there is any.

    `sudo npm install`

- Build the frontend by using the following command.

    `sudo npm run build`


- stop pm2 server before updating the back-end.

    `sudo pm2 delete all`    

- Run the following command to change directory to backend

    `cd /opt/backend`

- Run this command to install new npm packages if there is any.

    
    ```bash
    sudo npm install
    Run pm2 server
    sudo pm2 start index.js
    ```
    

