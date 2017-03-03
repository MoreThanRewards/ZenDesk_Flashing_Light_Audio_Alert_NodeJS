/**
 * AUTHOR: @morethanrewards  | morethanrewards.com | sexyhackers.com   Please follow us cuz we post new shirt designs every week!
 *
 * @TLDR When ZenDesk tickets don't get responded to in a certain amount of time this script turns on up to 10 
 * electrical devices ON/OFF making lights and buzzers flash and go beep beep. When the lights flash and alarms go off, it reminds 
 * your customer service people that they need to be more awesome.
 *
 * WE KNOW OUR SPELLING, GRAMMER SUCK, WE SHOULD NOT TYPE IN ALL CAPS, AND OUR EXCESSIVE USE OF UNDERSCORES ARE ANNOYING 
 * THIS WAS JUST AN EXPERIMENT. WE FIGURED WE WOULD SHARE IT SO.. DON'T FLAME US TOO MUCH, SINCE WE ARE JUST PLAYING AROUND.. 
 * 
 * ------------------------------------------------------------------- 
 * WHAT THIS THING DOES 
 * -------------------------------------------------------------------
 * This is a NodeJS app that runs on a computer and monitors up to 10 ZenDesk views.  It polls ZenDesk every
 * few minutes to see if any  tickets appear in the view.  If tickets appear in a view it turns a power outlet
 * on automatically.   So you can plug light or buzzer in the outlet and turn the lights on if tickets appear in
 * the Zendesk view.   This is helpful if you want to flash some lights or play a song or something if there are
 * tickets which are not being responded to in a certain amount of time.   It's really however you configure the
 * zendesk view.   So it's totally flexiable, whatever condition in zendesk you want to trap for you setup the view
 * then if tickets appear in the view BOOM the power switch turns on, if the view is empty BOOM power switch turns off.
 * it's that simple.  Since the power switch has 10 ports we let you control up to 10 views. It also does not kill
 * your ZenDesk be because it only looks for changes vs calling the view API directly.  So unlike other projects
 * which call the view which is cached, this calls the change API so we can update the state faster like every 25 seconds
 * without calling the view API and killing desk.
 *
 * -------------------------------------------------------------------
 * DISCLAIMER - THIS CODE COULD REALLY SUCK DON'T HATE...  APPRECIATE
 * -------------------------------------------------------------------
 * I made this for fun so that our lights will turn on and off when certain things happen in ZenDesk don't blame me
 * if this does not work for your specific needs, I don't activly monitor this repo, maybe you want to do it let me know?
 * but I used it to learn nodejs so my job is done.. he he he EVIL LAUGH... anyway..  I would say it works  good if you
 * have a need to turn a buzzer on if tickets don't get responded too fast enough or lights or maybe activate
 * a shock collar who knows on your favorite co-worker, possiblities are limitless.   Also my spelling and grammer suck so
 * yeah, I also like to end everything with... sorry about that.  I did this in few hours over weekend as part of
 * Eureka Days at More Than Rewards so that I could learn nodeJS because it's my first nodeJS app and I have no idea
 * what the heck I'm doing in node.
 *
 * Thank you @morethanrewards for letting us do this at work for Eureka Days for fun then share it on GitHub!
 * http://www.morethanrewards.com/about-eureka-days.htm
 *
 * @requires;
 * 
 *     REQUIRED LIBRARIES 
 *     https://nodejs.org
 *     https://github.com/request/request  | https://www.npmjs.com/package/request
 *     https://developer.zendesk.com/rest_api/docs/core/views
 *     
 *     REQUIRED POWER SWITCH: https://www.amazon.com/gp/product/B00EZWD146/ref=oh_aui_detailpage_o01_s00?ie=UTF8&psc=1
 *     http://www.digital-loggers.com/lpc.html  (the electrical switch we control - it's a $100 ten port power switch)
 * 
 *     OPTIONAL LIGHTS (need a power supply): https://www.amazon.com/gp/product/B019I13EQI/ref=oh_aui_detailpage_o06_s00?ie=UTF8&psc=1
 *     OPTIONAL LIGHTS (need a power supply): https://www.amazon.com/gp/product/B00HIILYU2/ref=oh_aui_detailpage_o04_s00?ie=UTF8&psc=1
 *     OPTIONAL LIGHTS (plug and play): https://www.amazon.com/American-Dj-Led-Red-Beacon/dp/B000UUSWVO/ref=sr_1_1?ie=UTF8&qid=1488511626&sr=8-1&keywords=DJ+Beacons                 
 *     OPTIONAL LIGHTS (LAASSEERRS):  https://www.amazon.com/Coidea-Projector-Strobe-Actived-Control/dp/B01ASNBYZI/ref=sr_1_3?ie=UTF8&qid=1488511667&sr=8-3&keywords=dj+laser
 *     OPTIONAL BUZZER (super annoying and loud): https://www.amazon.com/Jameco-Valuepro-7S3240LFLA-Indicator-Alerts/dp/B01K7FNCKC/ref=sr_1_7?ie=UTF8&qid=1488511730&sr=8-7&keywords=Audio+alerts
 * 
 * -------------------------------------------------------------------
 * HOW TO INSTALL
 * -------------------------------------------------------------------
 *    1 - Download the ZenDeskMonitor.js into a directory on the computer
 *    2 - Download and install NodeJS here - https://nodejs.org
 *    3 - Open a command prompt, navigate to the directory where you put the file at then install node refer by typing
 *        npm install refer
 *    4 - Buy one of these power switches, plug it in and give it a static IP
 *        http://www.digital-loggers.com/lpc.html
 *    5 - Plug a light in the power outlet 1 on the switch like this  https://www.amazon.com/Rhode-Island-Novelty-Police-Beacon/dp/B00TGBD9RA
 *    6 - Lookup  your ZenDesk authorization token - if you don't know how to do this just install postman and lookup your ZenDesk
 *        Authorization token.  GO here and install  PostMan https://www.getpostman.com/ then stick this URL in the GET Box
 *        https://PUT_YOUR_ZENDESK_ACCOUNT_HERE.zendesk.com/api/v2/views    switch the type to "BasicAuth" in postman
 *        enter your ZenDesk username and Password and push SEND. Your creds are right you'll get a response other then
 *        "Couldn't authenticate you" back.  Once you do then push the "headers" tab in Postman and you'll see thing
 *        "Authorization" and a value that looks like..  "Basic amblahblahblahblah" that's your ZenDesk authorization token
 *        you need to put in the config below so it can login to your zendesk account and call your account API's
 *    7 - Lookup your auth token for your power switch as well doing the same thing, I would go in the admin setup of the
 *        power switch create a new user so you don't use your admin user. Then do post to the URL http://THE_IP_/outlet?1=ON
 *        if you did this correctly the outlet will turn on, if you pass OFF it will turn off.. wooo, the point is your doing
 *        this to lookup the authorization token for that cuz you'll need it also in the config below.
 *    8 - Determine which ZenDesk view you want to monitor, just login to zendesk and look at the URL the view ID is in the
 *        URL so navigate to the view then snatch the number in the URL that's the viewID.
 *    9 - Configure all the global varibles below, IP address, port, min/max threshold, viewID and auth tokens.
 *   10 - YOU'RE FINALLY READY TO RUN THIS SUCKER...   just open a command prompt, navigate to the directory and type
 *        node ZenDeskMonitor.js   (case matters)  if all goes well this will be polling ZenDesk every 10 seconds for
 *        changes in your views.  If the views change it then fetches the changes and if the total ticket count in the view
 *        goes above the configured max value it will turn the outlet ON, if it drops below it will turn
 *        the outlet OFF... woo that's it!  Groovy right...  you can now really annoy your co-workers by putting loud
 *        sirens under the desk and turning them on when they don't respond to zendesk tickets fast enough.. sweet!
 *
 * ---------------------------------------------------------------------------------
 * PLEASE SUPPORT US AND BUY OUR T-SHIRTS IF YOU LIKE THIS NODEJS SCRIPT
 * ---------------------------------------------------------------------------------
 * Check Out Our Online T-Shirt Shop - http://www.sexyhackers.com
 * We promise that site is work safe, it just has a bunch of cool t-shirts we made,
 * for peopole who like computers, video games, science, dungeons and dragons and
 * other cool stuff!  If you have no money then just share our link atleast please.
 *
 * ---------------------------------------------------------------------------------
 * CHECK OUT OUR OTHER FREE ZENDESK APP WE MADE ALSO CALLED... SUPPORT WARRIORZ
 * ---------------------------------------------------------------------------------
 * https://www.zendesk.com/apps/support-warriorz/
 *
 **/

// *********************************************************************
// SETUP MY ZENDESK OPTIONS
// *********************************************************************

// HOW FAST SHALL WE POST ZENDESK IN SECONDS.......
// DISCLAIMER : DO NOT HURT ZENDESK AND IT WON'T HURT YOU!!
// I'm sure ZenDesk don't want you polling them every X seconds or it may cause your account to run like garbage so be
// careful - you been warned! We do every 25 seconds and it work good for us but who knows what your ZenDesk world may
// hold, the ZenDesk folks are groovy so be nice to them!  I did use the change API so it should only refresh if there
// is new data if I did my job right , it's not calling the cached view API, so should be able to poll it pretty fast
// but I make no promises.  Also, this console keeps running and running and running, it just tick tocks every X seconds..
// ya dig, so no scheduled task! Just run it and leave it running, no scheduled task needed.
// JUST BE SAFE I ADDED A CHECK THAT WON'T LET YOU MAKE THIS GO BELOW 10 SECONDS
var _zenDesk_PollRate = 60; // this number is in Seconds....  (

// This is the location of your zendesk account example: https://blahblah.zendesk.com
var _zenDesk_Account = "blahblah";  

// This is the ZenDesk user we are going to impersonate and login with - maybe we can do this with API keys also, but
// for now I just logged in with my normal zendesk email and password then looked up my auth tokens in postman and used those
var _zenDesk_Authorization = "Basic blahblahashhas=";  // This is in postman in the "Authorization" of the header
var _zenDesk_AssumeUser = "blah@blah.com";  // This is in postman as "Assume-User" in the header

// OUTLET 1
var _ZenDesk_ViewIDtoMonitor_Outlet1 = 11111111;  // This is the view ID you snatch from the URL when you login to zendesk that you want to monitor - SET TO 0 IF YOU WANT TO DISABLE THIS OUTLET FROM CHECKING
var _ZenDesk_TicketThresholdMAX_Outlet1 = 1; // Turn the power  ON when ticket count is equal to or above this value


// OUTLET 2
var _ZenDesk_ViewIDtoMonitor_Outlet2 = 0;  // YOU CAN SET EACH OUTLET TO ZERO IF YOU DO NOT WANT TO MONITOR THIS  VIEW OR CONTROL OUTLET FROM THIS APP - SO IT DON'T MESS WITH THOSE OUTLETS IF VIEW IS ZERO
var _ZenDesk_TicketThresholdMAX_Outlet2 = 1;

// OUTLET 3
var _ZenDesk_ViewIDtoMonitor_Outlet3 = 0;  // IDEA IS CREATE A PULSE CIRCUIT SO THE LIGHTS FLASH FASTER AND BEEP MORE THE MORE SEVER IT GETS
var _ZenDesk_TicketThresholdMAX_Outlet3 = 0;

// OUTLET 4
var _ZenDesk_ViewIDtoMonitor_Outlet4 = 0;
var _ZenDesk_TicketThresholdMAX_Outlet4 = 0;

// OUTLET 5
var _ZenDesk_ViewIDtoMonitor_Outlet5 = 0;
var _ZenDesk_TicketThresholdMAX_Outlet5 = 0;

// OUTLET 6
var _ZenDesk_ViewIDtoMonitor_Outlet6 = 0;
var _ZenDesk_TicketThresholdMAX_Outlet6 = 0;

// OUTLET 7
var _ZenDesk_ViewIDtoMonitor_Outlet7 = 0;
var _ZenDesk_TicketThresholdMAX_Outlet7 = 0;

// OUTLET 8
var _ZenDesk_ViewIDtoMonitor_Outlet8 = 0;
var _ZenDesk_TicketThresholdMAX_Outlet8 = 0;

// OUTLET 9
var _ZenDesk_ViewIDtoMonitor_Outlet9 = 0;
var _ZenDesk_TicketThresholdMAX_Outlet9 = 0;

// OUTLET 10
var _ZenDesk_ViewIDtoMonitor_Outlet10 = 1212;
var _ZenDesk_TicketThresholdMAX_Outlet10 = 0;


// *********************************************************************
// SETUP MY WEB POWER SWITCH OPTIONS
// *********************************************************************
// You need to base64 the user/password on this - I just used postman and copied and pasted it from there, cuz I'm lazy
var outletDevice_AuthorizationToken = "Basic blahblahblah=";

// This is the IP of the switch, make sure it' static so things don't change on ya
var outletDevice_IP = "xx.xx.xx.xx";  

/**
*  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*  ++++++++++++++++++++++++++ DO NOT CHANGE ANYTHING AFTER THIS LINE UNLESS YOU KNOW WHAT YOUR DOING  ++++++++++++++++++++++++++++++++++++
*  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*
*  YOU SHOULD ALSO BE AWARE THAT - THELORDVIPER IS THE MAN - WE LOVE YOU BUDDY .. THANKS FOR KEEP OUR APPS WORKING SMOOTH LIKE BUTTA
*  AND MONITORING OUR NETWORK 24/7 LIKE A BEAST.. JUST LIKE GILFOYLE ==> https://www.youtube.com/watch?v=dkrzZ8-gfn0
*    __     __        ______   ____    ____  _______     _______   ___________    ____        ______   .______     _______.
*   |  |   |  |      /  __  \  \   \  /   / |   ____|   |       \ |   ____\   \  /   /       /  __  \  |   _  \   /       |
*   |  |   |  |     |  |  |  |  \   \/   /  |  |__      |  .--.  ||  |__   \   \/   / ______|  |  |  | |  |_)  | |   (----`
*   |  |   |  |     |  |  |  |   \      /   |   __|     |  |  |  ||   __|   \      / |______|  |  |  | |   ___/   \   \
*   |  |   |  `----.|  `--'  |    \    /    |  |____    |  '--'  ||  |____   \    /         |  `--'  | |  |   .----)   |
*   |__|   |_______| \______/      \__/     |_______|   |_______/ |_______|   \__/           \______/  | _|   |_______/
*
*  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
**/

// We use the request library to make all our http calls to zendesk API and the switch
var request = require("request");

// Set the default outlet status to OFF when we boot up the app
console.log("Turning Outlet 1 Off");
var _outlet1_Status = "OFF";
console.log("Turning Outlet 2 Off");
var _outlet2_Status = "OFF";
console.log("Turning Outlet 3 Off");
var _outlet3_Status = "OFF";
console.log("Turning Outlet 4 Off");
var _outlet4_Status = "OFF";
console.log("Turning Outlet 5 Off");
var _outlet5_Status = "OFF";
console.log("Turning Outlet 6 Off");
var _outlet6_Status = "OFF";
console.log("Turning Outlet 7 Off");
var _outlet7_Status = "OFF";
console.log("Turning Outlet 8 Off");
var _outlet8_Status = "OFF";
console.log("Turning Outlet 9 Off");
var _outlet9_Status = "OFF";
console.log("Turning Outlet 10 Off");
var _outlet10_Status = "OFF";
console.log("All Outlets Are Now Off");

controlPower(1,"OFF");
controlPower(2,"OFF");
controlPower(3,"OFF");
controlPower(4,"OFF");
controlPower(5,"OFF");
controlPower(6,"OFF");
controlPower(7,"OFF");
controlPower(8,"OFF");
controlPower(9,"OFF");
controlPower(10,"OFF");

// Safty Check To Prevent Ya Below 10 Seconds
_zenDesk_PollRate = _zenDesk_PollRate * 1000;
if (_zenDesk_PollRate<10000)
{
    _zenDesk_PollRate = 10000
}

// DEBUG TIME
//_zenDesk_PollRate = 2000;
//console.log(_zenDesk_PollRate);

// Poll Every Few Seconds
setInterval(main,_zenDesk_PollRate);

// ************************************************************************************************************
// This is the main function that does all the work that's why I called it main()
// You should also be aware that I'm drinking Tito's Vodka right now, watching Silcon Valley really enjoying
// my ramblings in my code comments... also I'm not a hipster, kinda wish I was so I was skinny...
// ************************************************************************************************************
function main()
{
    // If the zendesk view is enabled then DO WORK!
    // That reminds me of our work's exercise room @MoreThanRewards
    // https://twitter.com/MoreThanRewards/status/824406773322960896
    if (_ZenDesk_ViewIDtoMonitor_Outlet1 > 0)
    {
       // OUTLET 1
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet1, _ZenDesk_TicketThresholdMAX_Outlet1,1);
    }

    if (_ZenDesk_ViewIDtoMonitor_Outlet2 > 0)
    {
        // OUTLET 2
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet2,_ZenDesk_TicketThresholdMAX_Outlet2,2);
    }

    if (_ZenDesk_ViewIDtoMonitor_Outlet3 > 0)
    {
        // OUTLET 3
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet3,_ZenDesk_TicketThresholdMAX_Outlet3,3);
    }

    if (_ZenDesk_ViewIDtoMonitor_Outlet4 > 0)
    {
        // OUTLET 4
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet4,_ZenDesk_TicketThresholdMAX_Outlet4,4);
    }

    if (_ZenDesk_ViewIDtoMonitor_Outlet5 > 0)
    {
        // OUTLET 5
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet5,_ZenDesk_TicketThresholdMAX_Outlet5,5);
    }
    if (_ZenDesk_ViewIDtoMonitor_Outlet6 > 0)
    {
        // OUTLET 6
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet6,_ZenDesk_TicketThresholdMAX_Outlet6,6);
    }
    if (_ZenDesk_ViewIDtoMonitor_Outlet7 > 0)
    {
        // OUTLET 7
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet7,_ZenDesk_TicketThresholdMAX_Outlet7,7);
    }
    if (_ZenDesk_ViewIDtoMonitor_Outlet8 > 0)
    {
        // OUTLET 8
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet8,_ZenDesk_TicketThresholdMAX_Outlet8,8);
    }
    if (_ZenDesk_ViewIDtoMonitor_Outlet9 > 0)
    {
        // OUTLET 9
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet9,_ZenDesk_TicketThresholdMAX_Outlet9,9);
    }
    if (_ZenDesk_ViewIDtoMonitor_Outlet10 > 0)
    {
        // OUTLET 10
        processZenDeskCheck(_ZenDesk_ViewIDtoMonitor_Outlet10,_ZenDesk_TicketThresholdMAX_Outlet10,10);
    }
}

var intViewONECOUNT
// ************************************************************************************************************
// This function looks at the view and see if the status changed since the last run if it has then it fetches
// the new data, if there is new data it compares to see if the max rule is valid and returns true
// if the rule NOT broken, so the status is good and we do not want to turn on any power.
// ************************************************************************************************************
function processZenDeskCheck(iZenDeskViewID, iMaxAllowedCount,iOutletNumber)
{
    // https://morethanrewards.zendesk.com/api/v2/incremental/tickets.json?start_time=1488092414
    // https://developer.zendesk.com/rest_api/docs/core/incremental_export
    // this will  let you check within a 5 min time the view end point lets you check within 10 minutes
    var sZenDeskAPIURL = {
        url: 'https://' + _zenDesk_Account + '.zendesk.com/api/v2/views/' + iZenDeskViewID + '/execute.json',
        headers: {
            'Authorization': '' + _zenDesk_Authorization + '',
            'Assume-User': '' + _zenDesk_AssumeUser + ''
        }
    };

    request(sZenDeskAPIURL, function (error, response, body){
        if (!error && response.statusCode == 200) {

            // Serialize the JSON string that is returned into actual JSON object
            var parsedData = JSON.parse(body);

            // Get the total tickets in this view it should be ZERO if we are doing our job in customer service
            iZenDeskViewCount = parsedData.count;

            // If are over the max allowed then we need to turn the lights on
            if (iZenDeskViewCount > iMaxAllowedCount) {
                // There are too many tickets in this view , naughty, naughty, naughty!
                // TURN POWER OUTLET ON!!!
                controlPower(iOutletNumber,"ON")
            } else {
                // View ticket count is not beyond the allowed max so we are still ok
                // TURN POWER OUTLET OFF!!!
                controlPower(iOutletNumber,"OFF")
            }
        }
    });

}

// ************************************************************************************************************
// This function turns controls the power outlet by passing in the ID and current state of "ON" or "OFF"
// ************************************************************************************************************
//
//  API DOCS
//  http://www.digital-loggers.com/scripting.html
//  http://www.digital-loggers.com/curl.html
//  http://www.digital-loggers.com/http.html
//  Examples?
//    Turn on outlet 1: curl http://admin:4321@lpc.digital-loggers.com:80/outlet?1=ON
//    Power off outlet 1: curl http://admin:4321@lpc.digital-loggers.com:80/outlet?1=OFF
//    Cycle outlet 1: curl http://admin:4321@lpc.digital-loggers.com/outlet?1=CCL
//    Run a script starting at line 10: curl http://admin:4321@lpc.digital-loggers.com/script?run010
//    Get the encoded outlet status: curl http://admin:4321@lpc.digital-loggers.com/status/
//
//    This sample setup script does pretty much everything...  To execute it:   curl -K sample.curl
//    #!/usr/bin/curl -K
//    #
//    silent
//    retry=3
//    show-error
//    basic
//    max-time=10
// ************************************************************************************************************
function controlPower(iOutletID,sPowerState)
{
    // Clean up the string
    sPowerState = sPowerState.toUpperCase();

    if (sPowerState != "ON"){
        sPowerState = "OFF"
    }
    var sPowerOutletURL = 'http://' + outletDevice_IP + '/outlet?' + iOutletID + '=' + sPowerState;

    // DEBUG
    //console.log(sPowerOutletURL);
    //return;

    var powerStripURL = {
        url: '' + sPowerOutletURL + '',
        headers: {
            'Authorization': '' + outletDevice_AuthorizationToken + ''
        }
    }
    request(powerStripURL, function (error, response, body){
        if (!error && response.statusCode == 200) {
            // DO NOTHING JUST CONTROL THE DEVICE
            // SEND THE COMMAND NOW!
            // later we will save the state of the switch to a global bar so we are not always
            // pinging the electircal switch but for now we are good
            //_outlet1_Status = sPowerState
            console.log("OUTLET:" + iOutletID + " STATUS:" + sPowerState)

        }



    });


}

