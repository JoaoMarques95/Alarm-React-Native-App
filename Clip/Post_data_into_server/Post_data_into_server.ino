/*
 * HTTP Client POST Request
 * Copyright (c) 2018, circuits4you.com
 * All rights reserved.
 * https://circuits4you.com 
 * Connects to WiFi HotSpot. */

#include <ESP8266WiFi.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

/* Set these to your desired credentials. */
const char *ssid = "Vodafone-2F52DD";  //ENTER YOUR WIFI SETTINGS
const char *password = "84jwUTTUaj";

//Web/Server address to read/write from
const char *host = "http://www.localhost:3000/";   //https://circuits4you.com website or IP address of server

//=======================================================================
//                    Power on setup
//=======================================================================

void setup() {
  delay(1000);
  Serial.begin(115200);
  WiFi.mode(WIFI_OFF);        //Prevents reconnection issue (taking too long to connect)
  delay(1000);
  WiFi.mode(WIFI_STA);        //This line hides the viewing of ESP as wifi hotspot
  
  WiFi.begin(ssid, password);     //Connect to your WiFi router //when the work is done!!!
  Serial.println("...");

  Serial.print("Connecting");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {  //WL_CONNECTED: assigned when connected to a WiFi network;
    delay(500);
    Serial.print("."); //multiple dots will apear
  }

  //If connection successful show IP address in serial monitor
  Serial.println("");
  Serial.println("Connected to ");
  Serial.println(ssid);
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());  //IP address assigned to your ESP,,,,Gets the WiFi shield's IP address
}

//=======================================================================
//                    Main Program Loop
//=======================================================================
void loop() {
  HTTPClient http;    //Creating a client on the hardware itself
  
  http.begin("http://www.localhost:3000/test");              //Specify request destination --> this is the destination on the post request on the website!!!!!(link)
  http.addHeader("Content-Type", "text/plain");    //Specify content-type header

  int httpCode = http.POST("Message from ESP8266");   //Send the request --> sending the post request to the path defined
  
  //We can now get the payload by calling the getString method, which will return the response payload as a string.
  String payload = http.getString();    //Get the response payload (the esp will receive a simple response like "success" --> In this case a string
  



  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload

  http.end();  //Close connection
  
  delay(5000);  //Post Data at every 5 seconds
}
//=======================================================================
