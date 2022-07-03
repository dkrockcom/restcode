/**
 * Copyright (c) 2022-present, Codehuntz.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

require('dotenv-flow').config();
const cors = require('cors');
const Logger = require('./Helper/Logger');
const express = require('express');
require('express-async-errors');
const app = express();
const path = require('path');
const fs = require('fs');
const ControllerBase = require('./ControllerBase');
const Controller = require('./Controller');
const Utility = require('./Utility');
const http = require('http');
const https = require('https');
const multer = require('multer');
const bodyparser = require('body-parser');
const ExceptionHandler = require('./ExceptionHandler');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const WebPage = require('./WebPage');
const LoginHelper = require('./LoginHelper');
const Helper = require('./Helper');
const Export = require('./Export');
const DateTime = require('./DateTime');
const MongoConnection = require('./MongoConnection');

const WebPageRoute = require('./WebPageRoute');
const Route = require('./Route');
const TaskManager = require('./TaskManager');
const Notification = require('./Notification');
const Mongoose = require('mongoose');

const isLoggerApiEnable = JSON.parse(process.env.LOGGER_API_LOG_ENABLE || false);

app.use((req, res, next) => {
    req.authenticate = function () {
        const options = {
            maxAge: (24 * 60 * 60 * 1000), // 24 hours
            signed: true // Indicates if the cookie should be signed
        }
        req.session.isAuthenticated = true;
        req.sessionOptions = options;
    };
    next();
});

class Framework {
    static get Mongoose() { return Mongoose };
    static get Notification() { return Notification };
    static get DateTime() { return DateTime };
    static get TaskManager() { return TaskManager };
    static get Logger() { return Logger };
    static get Export() { return Export };
    static get Helper() { return Helper };
    static get LoginHelper() { return LoginHelper };
    static get WebPage() { return WebPage };
    static get ControllerBase() { return ControllerBase };
    static get Controller() { return Controller };
    static get Utility() { return Utility };
    static StartApp(program) {
        return new program();
    }

    static Initialize(onException, cb) {

        if (isLoggerApiEnable) {
            const apiLogger = Logger.logger.getLogger("endPointLog");
            app.use(Logger.logger.connectLogger(apiLogger, {
                level: "info", format: (req, res, format) => {
                    return format(`:remote-addr :method :url time: ${res.responseTime}`)
                }
            }));
        }

        if (Boolean(process.env.CORS_ENABLED)) {
            //Access Control Allow
            const corsOptions = {
                origin: process.env.CORS_ORIGIN,
                credentials: true,            //access-control-allow-credentials:true
                optionSuccessStatus: 200
            }
            app.use(cors(corsOptions));
        }
        let upload = multer();
        app.use(upload.any());
        app.use(cookieParser(process.env.APP_NAME));

        //Session Initialization
        app.use(cookieSession({
            name: process.env.APP_NAME,
            keys: [process.env.APP_NAME],
            secret: process.env.APP_NAME,
            // Cookie Options
            maxAge: process.env.SESSION_TIMEOUT || 86400, // 24 hours in seconds
            path: "/"
        }));

        //Body Parser
        app.use(bodyparser.json({ limit: '100mb', extended: true }));
        app.use(bodyparser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 1000000 }));

        let route = new Route(app);
        route.apiPrefix = process.env.API_PREFIX || null
        route.init();

        let isWebSetup = fs.existsSync(path.resolve('Web'));
        if (isWebSetup && !JSON.parse(process.env.WEB_DISABLED)) {
            app.set('view engine', 'ejs');
            let wpr = new WebPageRoute(app);
            wpr.setRoute();
        }

        //Set static contents
        app.use(express.static(path.resolve(process.env.STATIC_CONTENT_PATH), { fallthrough: true, dotfiles: 'allow' }));
        //ExceptionHandler
        let exceptionHandler = new ExceptionHandler();
        exceptionHandler._app = app;
        exceptionHandler._callBack = onException;
        exceptionHandler.init();

        //404
        // app.use(function (req, res, next) {
        //     if (req.method.toLocaleUpperCase() == 'GET') {
        //         return isWebSetup ? res.redirect('/404') : res.status(404).send("<h1>404 Not Found</h1");
        //     } else {
        //         res.json({ success: false, message: '404 Not Found' });
        //     }
        // });
        let server;
        const isHttpsEnabled = JSON.parse(process.env.HTTPS_ENABLE || false);
        if (isHttpsEnabled) {
            server = https.createServer(app, {
                key: fs.readFileSync(process.env.HTTPS_PRIVATE_KEY),
                cert: fs.readFileSync(process.env.HTTPS_CERT)
            });
        } else {
            server = http.createServer(app);
        }
        let appPort = process.env.PORT || process.env.PORT;
        server.listen(appPort, async () => {
            Logger.info("Application is running at localhost:" + appPort);
            Logger.info("Application is started on: " + new Date());
            await MongoConnection.connect();
            cb(app, server);
        });
    }
}
module.exports = Framework;