import gpiozero as gpio
import time

# dict to store each test and the two pin numbers that need to be called to do it
## initial value - false ------- active high true
#relay = gpiozero.OutputDevice(pinnum, active_high=True, initial_value=False)

combinations = {
    1 : [29, 31],
    2 : [31, 32],
    3 : [32, 33],
    4 : [33, 35],
    5 : [35, 36],
    6 : [36, 37],
    7 : [37, 29]
}

for i in combinations:
    relaya = gpio.OutputDevice(combinations[i][0], active_high=True, initial_value=False)
    relayb = gpio.OutputDevice(combinations[i][1], active_high=True, initial_value=False)
    print("{}, {}".format(combinations[i][0], combinations[i][1]))
    relaya.on()
    relayb.on()

    #take reading 
    time.sleep(2)

    relaya.off()
    relayb.off()