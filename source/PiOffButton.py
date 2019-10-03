import RPi.GPIO as GPIO
import time
import os
import gpioModule as relay


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(10, GPIO.IN, pulll_up_down=GPIO.PUD_UP)

#wiring goes from gpio 6 - pin 22; to gnd - pin 20

while True:
    if GPIO.input(10) == GPIO.LOW:
        relay.allFlash()
        if GPIO.input(10) == GPIO.LOW:
            os.system("shutdown now -h")
    time.sleep(1)