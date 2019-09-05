import visa
import time
import os
import sys
import json

#everything thats printed is returned to the webserver, all results are put into a json file
#TODO: needs to be updated to include gpio libraries to interface with relays
rm = visa.ResourceManager()
try:
    inst = rm.open_resource('ASRL4::INSTR')
    print("** loaded instrument **")
except:
    print('fatal error: check instrument is loaded properly and correct drivers are installed')

def readData(): # READS DATA FROM SCREEN 'L' (HENRIES) THEN READ FROM SCREEN R (OHMS)
    for x in range(7):
        print(x)
        microHenries = 0
        ohms = 0
        try:
            inst.write("FUNCTION:impa L")
            time.sleep(.7)
            microHenries = round(1000000 * float(inst.query("FETCH?")[1:12]), 3)
            time.sleep(.7)
            inst.write("FUNCTION:impa R")
            time.sleep(1)
            ohms = round(float(inst.query("FETCH?")[1:12]), 3)
            print(str(microHenries) + ", " + str(ohms))
            return(str(microHenries) + ", " + str(ohms))
        except:
            print("error at command queue")

#data = readData()
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

with open('./source/results.json', 'w') as jsonFile:
    jsonFile.write(json.dumps(results))

print(str(results))
sys.stdout.flush()