The project allows to organize video chat connection between the client and the manager via corporative web-site and  
[WebRTC](https://webrtc.org/ "WebRTC official site"). Application develop on Express (write to NodeJS 6.x, now uses NodeJS 7.x), server part based on EasyRTC framework. As database used (MongoDB 3.х).

# Install & config
## Software Requirements
To work correctly application server need:
+ NodeJS 6.x
+ MongoDB 3.x
+ Certificate https (path to it configure no server.js)

Everything else written in package.json
### Architecture Features
Folder with this project must been is inside the folder SDK. It felt more logical SDK developers have not tried to cure (yet).

## Install application
To install and run correctly in the folder where is located the working project folder execute commands in a terminal:

> $ git clone https://github.com/priologic/easyrtc && cd easyrtc && npm install

Then execute the command:
> $ git clone https://github.com/neuromantic-js/easyrtc-server.git && cd easyrtc-server && npm install

To run project execute:
> $ node server

Connection settings to the base is in a mongo-express-config.js file.
