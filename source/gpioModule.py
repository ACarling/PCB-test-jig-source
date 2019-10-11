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

def nextCombination(comboNumber):
    if(comboNumber >= 1):
        GPIO.output(relayCombinations[comboNumber - 1][0], 0)
        GPIO.output(relayCombinations[comboNumber - 1][1], 0)
    GPIO.output(relayCombinations[comboNumber][0], 1)
    GPIO.output(relayCombinations[comboNumber][1], 1)

def allOff():
    for i in relayCombinations:
        GPIO.output(i[0],0)
        GPIO.output(i[1],0)
    GPIO.cleanup()

def allFlash(sleepTime):
    for i in relayCombinations:
        GPIO.output(i[0], 1)
        GPIO.output(i[1], 1)
    sleep(sleepTime)
    for i in relayCombinations:
        GPIO.output(i[0],0)
        GPIO.output(i[1],0)

