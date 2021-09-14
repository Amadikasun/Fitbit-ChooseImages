import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import { preferences } from "user-settings";
import * as util from "../common/utils";

import * as messaging from "messaging"; //settings

import { display } from "display"; //turned off/on
import { HeartRateSensor } from "heart-rate"; //bpm
import { BodyPresenceSensor } from "body-presence"; //onWrist

import { me as appbit } from "appbit"; //part of using today
import { today } from "user-activity"; //steps, elevation, goals, ...
import { user } from "user-profile"; //resting heart rate, gender, age, bmr, stride, weight, height, ...

import { battery } from "power";

// Update the clock every minute
clock.granularity = "minutes";
let background = document.getElementById("background");
let images = document.getElementById("img");
let images1 = document.getElementById("img1");
let images2 = document.getElementById("img2");
let images3 = document.getElementById("img3");
let images4 = document.getElementById("img4");
// Get a handle on the <text> element
//const background = document.getElementById("background");
const time = document.getElementById("time");
const datem = document.getElementById("datem");
const dated = document.getElementById("dated");

const steps = document.getElementById("steps-data");
const minutes = document.getElementById("minutes-data");
const burn = document.getElementById("burn-data");
const distance = document.getElementById("distance-data");
const elevation = document.getElementById("floor-data");
const bpsData = document.getElementById("bps-data");
const hrmData = document.getElementById("hrm-data");

const batteries = document.getElementById("battery");
const textField = document.getElementById("textField");


clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  time.text = `${hours}:${mins}`;
  
  //date
  let months = today.getMonth();
  let day = today.getDate();
  const month = ["January","February","March","April","May","June","Jully","August","September","October","November","December"]
  
  let monthname = month[months];
  datem.text = day +". " +monthname;
  
  let daynum = today.getDay();
  const wday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
  let dayname = wday[daynum];
  dated.text = dayname;
   
    /*--- Battery charging ---*/
  batteries.text = battery.chargeLevel + "%";
}


//HR, Steps, Floor, Distance, Callories, activeZoneMinutes
const sensors = [];

if (appbit.permissions.granted("access_heart_rate")) {
   const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate ? hrm.heartRate : 0;
  });
  sensors.push(hrm);
  hrm.start();
}

const bodyPresence = new BodyPresenceSensor();
bodyPresence.addEventListener("reading", () => {
  if(bodyPresence.present) {
    textField.text = ""
  } else {
    textField.text = "User not detected." 
  }
});
sensors.push(bodyPresence);
bodyPresence.start();

//Todo: Condition this with onWrist
if (appbit.permissions.granted("access_activity")) {
  /* Today  */ 
  steps.text = today.adjusted.steps;
  minutes.text = today.adjusted.activeZoneMinutes.total;
  burn.text = today.adjusted.calories;
  distance.text = (today.adjusted.distance/1000).toFixed(2) + " km";
  elevation.text = today.adjusted.elevationGain;
}


/* Stop senzor if battery low then 50% */

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});

battery.addEventListener("change", () => {
  // Battery changes
  batteries.text = battery.chargeLevel + "%";
  
  if(battery.charging) {
    textField.text = "Charging.";
  } else if(!bodyPresence.present) {
    textField.text = "User not detected.";
  } else {
    textField.text = "";
  }
});

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
    background.style.fill = color;
    
     /*colors={[
            {color: "#e0af00"},
            {color: "#490058"},
            {color: "#2f4d4c"},
            {color: "#282780"},
            {color: "#777"}
          ]}*/
    
    
            if(color === "#282780"){
     images.style.visibility = "visible";//sky
            } else {
    images.style.visibility = "hidden";
  }
              if(color === "#777") {
            images1.style.visibility = "visible"; //wolf
            }else {
    images1.style.visibility = "hidden";
  }
              if(color === "#2f4d4c") {
            images2.style.visibility = "visible"; //poppies
            }else {
    images2.style.visibility = "hidden";
  }
              if(color === "#490058") {
            images3.style.visibility = "visible"; //dragon
            }
            else{
    images3.style.visibility = "hidden";
  }
     if(color === "#e0af00") {
            images4.style.visibility = "visible"; //cat
            }
            else{
    images4.style.visibility = "hidden";
  }
    
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};

