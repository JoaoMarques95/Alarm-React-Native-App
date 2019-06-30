/*
 Basic ESP8266 MQTT example

 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.

 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.

 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <time.h>

//Hardware varibles (button)
const int buttonPin = 16;     // the number of the pushbutton pin
const int ledPin =  5;      // the number of the LED pin
String Click= "";
long timer = 0;


// variables will change:
int buttonState = 0;         // variable for reading the pushbutton status
time_t CurrentTime();


// Update these with values suitable for your network.

const char* ssid = "AndroidAP_5128";
const char* password = "getthejets";
const char* mqtt_server = "m24.cloudmqtt.com";
const char* mqtt_user = "rgnyorkv";
const char* mqtt_pass = "8_QL2PQKEC9B";
const int port_server = 10344;

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
      client.publish("outTopic", "hello world");
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
  } else if (buttonState == LOW){
    // turn LED off:
    digitalWrite(ledPin, LOW);
    Click ="false";
  }else{
    Serial.print("invalid option--led");
    }

    
 if(millis() - timer > 1000){
     JsonObject& root = jsonBuffer.createObject();
     root.set("State",Click);
     root.set("time",ctime(&currentTime));
     String payload = "";
     root.printTo(payload);
     client.publish("Button",payload.c_str());
    
    timer = millis();
  }

/*
if (Click.equals("Pressed")){
  long now = millis();
  if (now - lastMsg > 2000) {
    char value1[50];
    lastMsg = now;
    ++value;
    snprintf (msg, 50, "hello world #%ld", value);
    Serial.print("Publish message: ");
    Serial.println(msg);
    client.publish("outTopic", msg);
    Click.toCharArray(value1,50);
    client.publish("outTopic", value1);
    Serial.println(value1);
    }
    */
}


  
  

      
}
