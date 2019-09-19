import visa
import time
import os
import sys
import json

import gpioModule

#for testing
import random

results = ''
json_string = '{}'

#everything thats printed is returned to the webserver, all results are put into a json file
#TODO: needs to be updated to include gpio libraries to interface with relays
rm = visa.ResourceManager()

print("attempting to load instrument")
sys.stdout.flush()

try:
    inst = rm.open_resource('ASRL/dev/ttyUSB0::INSTR') # in big pi this port is called 'ASRL/dev/ttyUSB0::INSTR' - to test on small pi use the rm.list_resources() function
    print("** loaded instrument **")
except:
    print('fatal error: check instrument is loaded properly and correct drivers are installed')
sys.stdout.flush()


def readData(): # READS DATA FROM SCREEN 'L' (HENRIES) THEN READ FROM SCREEN R (OHMS)
    result = "{"
    for x in range(8): #0 - 7
        print("RD{}".format(x+1) if x < 7 else "total", end="") # --------- changed != to <= ----------------------- test please
        sys.stdout.flush()
        try:
            gpioModule.nextCombination(x) #should turn on correct pin

            inst.write("FUNCTION:impa L")
            time.sleep(.7)
            microHenries = round((1000000 if x < 7 else 1000) * float(inst.query("FETCH?")[1:12]), 3)
            time.sleep(.5)
            inst.write("FUNCTION:impa R")
            time.sleep(.7)
            ohms = round(float(inst.query("FETCH?")[1:12]), 3)

            json_string = {
                "rd{}".format((x+1 if (x != 7) else "total")) : {"microHenries": microHenries, "ohms" : ohms}
            }
            result += json.dumps(json_string)[1:-1] + (", " if (x != 7) else "}" )

            time.sleep(.5)         
        except:
            print("error at command queue")
    return result



def readDataTest():
    result = "{"	
    for x in range(8):
        print("RD{}".format(x+1) if x < 7 else "total", end="") #prints the test being conducted
        sys.stdout.flush()
        microHenries = 0
        ohms = 0
        gpioModule.nextCombination(x) #should turn on correct pin
        microHenries = random.randint(175,180)
        ohms = random.randint(10,16)

        json_string = {
            "rd{}".format((x+1 if x != 7 else "total")) : {"microHenries": microHenries, "ohms" : ohms}
        }
        result += json.dumps(json_string)[1:-1] + (", " if (x != 7) else "}" )
        time.sleep(.5)
    return result



def main():
    results = readData()
    #print(results + "\n\n")

    with open('./source/results.json', 'w') as jsonFile:
        jsonFile.write(results)

    sys.stdout.flush()
    gpioModule.allOff()

#run everything
main()
