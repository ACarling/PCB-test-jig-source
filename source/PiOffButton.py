from gpiozero
import time
import os
import gpioModule as relay

#wiring goes from gpio 6 - pin 22; to gnd - pin 20
stopButton = gpiozero.button(6)

while True:
    if stopButton.is_pressed:
        relay.allFlash()
        if stopButton.is_pressed:
            os.system("shutdown now -h")
    time.sleep(1)