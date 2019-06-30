/*
  Button

  Turns on and off a light emitting diode(LED) connected to digital pin 13,
  when pressing a pushbutton attached to pin 2.

  The circuit:
  - LED attached from pin 13 to ground
  - pushbutton attached to pin 2 from +5V
  - 10K resistor attached to pin 2 from ground

  - Note: on most Arduinos there is already an LED on the board
    attached to pin 13.

  created 2005
  by DojoDave <http://www.0j0.org>
  modified 30 Aug 2011
  by Tom Igoe

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/Button
*/

// constants won't change. They're used here to set pin numbers:


class Button {
    private:
        bool _state;
        uint8_t _pin;

    public:
        Button(uint8_t pin) : _pin(pin) {}

        void begin() {
            pinMode(_pin, INPUT_PULLUP);
            _state = digitalRead(_pin);
        }

        bool isReleased() {
            bool v = digitalRead(_pin);
            if (v != _state) {
                _state = v;
                if (_state) {
                    return true;
                }
            }
            return false;
        }
};

Button myButton(16);

void setup() {
    myButton.begin();
    Serial.begin(115200);
    // initialize the LED pin as an output:
    pinMode(5, OUTPUT);
}



void loop() {

   
    if (myButton.isReleased()) {
    // turn LED on:
    digitalWrite(5, HIGH);
    } else {
    // turn LED off:
    digitalWrite(5, LOW);
    }

    Serial.println(myButton.isReleased());
    if (myButton.isReleased()) {
        Serial.println(F("Released"));
    }
}
