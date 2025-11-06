import arcjet, {tokenBucket, shield, detectBot} from "@arcjet/node";

import "dotenv/config";
import { token } from "morgan";

//init arcjet with your API key

export const aj = arcjet({
   key: process.env.ARCJET_KEY,
   characteristics:["ip.src"],
   rules:[
        //protect SQL injection, XSS, CSRF attacks
        shield({mode:"LIVE"}),
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE", //List at arcjet.com
            ]
        }),
        //rate limit && you can change in demand
        tokenBucket({ 
            mode:"LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        })
    ]
});

