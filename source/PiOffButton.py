import RPi.GPIO as GPIO
import time
import os
import gpioModule as relay


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(22, GPIO.IN, pull_up_down=GPIO.PUD_UP)

#wiring goes from gpio 6 - pin 22; to gnd - pin 20

while True:
    if GPIO.input(22) == GPIO.LOW:
        relay.allFlash()
        if GPIO.input(22) == GPIO.LOW:
            relay.allOff()
            os.system("shutdown now -h")
    time.sleep(1)
