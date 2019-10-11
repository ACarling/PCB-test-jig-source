import RPi.GPIO as GPIO
import time
import os
import gpioModule as relay


GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(22, GPIO.IN, pull_up_down=GPIO.PUD_UP)

#wiring goes from gpio 6 - pin 22; to gnd - pin 20

while True:
    canOff = True
    if GPIO.input(22) == GPIO.LOW:
        for i in range(10):
            if GPIO.input(22) == GPIO.LOW: #if you let go of button stop flashing 
                canOff = False
                break
            relay.allFlash(0.2)
        if GPIO.input(22) == GPIO.LOW and canOff: #if button is held down for 2 secconds turn all lights on for 2 seconds then turn off pi
            relay.allFlash(2)
            relay.allOff()
            os.system("shutdown now -h")
    time.sleep(1)
