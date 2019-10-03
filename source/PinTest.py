import RPi.GPIO as GPIO
from time import sleep

GPIO.setwarnings(False)

GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.OUT) #I
GPIO.setup(13, GPIO.OUT) #rd2
GPIO.setup(15, GPIO.OUT) #rd3
GPIO.setup(16, GPIO.OUT) #rd4
GPIO.setup(18, GPIO.OUT) #rd5
GPIO.setup(29, GPIO.OUT) #rd6
GPIO.setup(31, GPIO.OUT) #rd7
GPIO.setup(32, GPIO.OUT) #O

relayPins = [11,13,15,16,18,29,31,32]

comboNumber = 0

relayCombinations = [
    [11, 13],
    [13, 15],
    [15, 16],
    [16, 18],
    [18, 29],
    [29, 31],
    [31, 32],
    [32, 11]
]

while True:
    relayTest = input("type a number between 1 and 7 or 'q' to quit")
    if (relayTest == 'q'):
        break
    int(relayTest)
    GPIO.output(relayCombinations[relayTest][0], 1)
    GPIO.output(relayCombinations[relayTest][1], 1)
    sleep(3)
    GPIO.output(relayCombinations[relayTest][0], 0)
    GPIO.output(relayCombinations[relayTest][1], 0)


GPIO.cleanup()