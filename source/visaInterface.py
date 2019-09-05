import visa
import time
import os
import sys
import json

#for testing
#import random

results = ''
json_string = '{}'

#everything thats printed is returned to the webserver, all results are put into a json file
#TODO: needs to be updated to include gpio libraries to interface with relays
rm = visa.ResourceManager()

try:
    inst = rm.open_resource('ASRL/dev/ttyUSB0::INSTR') # in big pi this port is called 'ASRL/dev/ttyUSB0::INSTR' - to test on small pi use the rm.list_resources() function
    print("** loaded instrument **")
except:
    print('fatal error: check instrument is loaded properly and correct drivers are installed')



def readData(): # READS DATA FROM SCREEN 'L' (HENRIES) THEN READ FROM SCREEN R (OHMS)
    result = "{"
    

    for x in range(8):
        try:
            inst.write("FUNCTION:impa L")
            time.sleep(1)
            microHenries = round(1000000 * float(inst.query("FETCH?")[1:12]), 3)
            time.sleep(.7)
            inst.write("FUNCTION:impa R")
            time.sleep(1)
            ohms = round(float(inst.query("FETCH?")[1:12]), 3)


            json_string = {
                "rd{}".format((x+1 if (x != 7) else "total")) : {"microHenries": microHenries, "ohms" : ohms}
            }
            result += json.dumps(json_string)[1:-1] + (", " if (x != 7) else "}" ) 

            time.sleep(.25)         
        except:
            print("error at command queue")

    return result

''' generate test cases 
    for x in range(8):
        microHenries = 0
        ohms = 0

        microHenries = random.randint(160,180)
        ohms = random.randint(10,16)

        json_string = {
            "rd{}".format((x+1 if x != 7 else "total") : {"microHenries": microHenries, "ohms" : ohms}
        }
        result += json.dumps(json_string)[1:-1] + (", " if (x != 7) else "}" )
    return result



results = {
    "rd1": {"microHenries": "110", "ohms": "20"},
    "rd2": {"microHenries": "120", "ohms": "20"},
    "rd3": {"microHenries": "130", "ohms": "20"},
    "rd4": {"microHenries": "140", "ohms": "20"},
    "rd5": {"microHenries": "150", "ohms": "20"},
    "rd6": {"microHenries": "160", "ohms": "20"},
    "rd7": {"microHenries": "170", "ohms": "20"},
    "total": {"microHenries": "1000", "ohms": "20"}
}
'''
results = readData()
print(results + "\n\n")

with open('./source/results.json', 'w') as jsonFile:
    jsonFile.write(results)

print(str(results))
sys.stdout.flush()