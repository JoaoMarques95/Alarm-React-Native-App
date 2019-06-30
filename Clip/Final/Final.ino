//for time
#include <NTPClient.h>
#include <WiFiUdp.h>

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//Hardware varibles (button)
const int buttonPin = 16;     // the number of the pushbutton pin
const int ledPin =  5;      // the number of the LED pin
String Click= "";
String Reset="Reset Data";
long timer = 0;


// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status
String t="";

// Update these with values suitable for your network.
//Net casa: Vodafone-2F52DD Pass:84jwUTTUaj
//net phone: AndroidAP_5128 pass: getthejets


const char* ssid = "Vodafone-2F52DD";
const char* password = "84jwUTTUaj";
const char* mqtt_server = "m24.cloudmqtt.com";
const char* mqtt_user = "rgnyorkv";
const char* mqtt_pass = "8_QL2PQKEC9B";
const int port_server = 10344;


//For time---------
WiFiUDP ntpUDP;
// You can specify the time server pool and the offset (in seconds, can be
// changed later with setTimeOffset() ). Additionaly you can specify the
// update interval (in milliseconds, can be changed using setUpdateInterval() ).
NTPClient timeClient(ntpUDP, "europe.pool.ntp.org", 3600, 60000);

// Variables to save date and time
String formattedDate;
String dayStamp;
String timeStamp;

WiFiClient espClient;
PubSubClient client(espClient); // ligação wifi do nosso esp
long lastMsg = 0;
char msg[50];
int value = 0;
DynamicJsonBuffer jsonBuffer(1024);

void setup() {
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);

  
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  timeClient.begin();
  setup_wifi(); //call wifi ligação
  client.setServer(mqtt_server, port_server); //ligar ao servidor
  client.setCallback(callback);
}


void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) { //sempre que o esp recebe uma mensagem mqtt, ele chama esta função
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  String payloadStr ="";
  for (int i = 0; i < length; i++) {
    payloadStr += (char)payload[i];
  }
  Serial.println();
if(String(topic).equals("inTopic")){
  // Switch on the LED if an 1 was received as first character
  if (payloadStr.equals("ON")) {
    digitalWrite(BUILTIN_LED, HIGH);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is active low on the ESP-01)
  } else if (payloadStr.equals("OFF")) {
    digitalWrite(BUILTIN_LED, LOW);  // Turn the LED off by making the voltage HIGH
  } else{
    Serial.print("Invalid option");
  }
}
}


void reconnect() { //sempre á espera de uma perca de ligação e a reconectar
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-"; //ele edentifica-se com o nome!
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(),mqtt_user,mqtt_pass)) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      // ... and resubscribe
      client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}



void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  
  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);

  // check if the pushbutton is pressed. If it is, the buttonState is HIGH:
  if (buttonState == HIGH) {
    // turn LED on:
    digitalWrite(ledPin, HIGH);
     Click = "Pressed";
     Serial.println(Click);
  } else if (buttonState == LOW){
    // turn LED off:
    digitalWrite(ledPin, LOW);
    Click ="Button not cliked";
    Serial.println(Click);
  }else{
    Serial.print("invalid option--led");
    }
    
timeClient.update();
formattedDate = timeClient.getFormattedDate();

// Extract date
int splitT = formattedDate.indexOf("T");
dayStamp = formattedDate.substring(0, splitT);
// Extract time
timeStamp = formattedDate.substring(splitT+1, formattedDate.length()-1);
String Time = dayStamp.substring(0)+" "+timeStamp.substring(0);
  
long now = millis();
if (Click.equals("Pressed")){
  if (now - lastMsg > 2000) {
    lastMsg = now;
    ++value;
    snprintf (msg, 50, "#%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("Msg_Num", msg);

     JsonObject& root = jsonBuffer.createObject();
     root.set("State",Click);
     root.set("Time",Time);
     String payload = "";
     root.printTo(payload);
     client.publish("Clip1",payload.c_str());
     Serial.println(payload.c_str());
    }
}


/*
if(timeStamp.substring(0,5)="00:00"){
  if (now - lastMsg > 2000) {
    char value1[50];
    lastMsg = now;
    Click.toCharArray(value1,50);
    client.publish("Button_state", value1);
    Serial.println(value1);
   }
}
*/


/*
 //FUNCIONA!!!!!!!!!
 //---------------------------------------------------------------------------
if (Click.equals("Pressed")){
  long now = millis();
  if (now - lastMsg > 2000) {
    char value1[50];
    lastMsg = now;
    ++value;
    snprintf (msg, 50, "#%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("Msg_Num", msg);
    Click.toCharArray(value1,50);
    client.publish("Button_state", value1);
    Serial.println(value1);
   }
} */
    
}
