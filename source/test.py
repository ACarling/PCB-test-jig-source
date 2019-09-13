relayCombinations = [
    [11, 13],
    [13, 15],
    [15, 16],
    [16, 18],
    [18, 29],
    [29, 31],
    [31, 32],
    [11, 31]
]


def nextCombination(comboNumber):
    if(comboNumber < 1):
        print(str(relayCombinations[7][0]) + " off")
        print(str(relayCombinations[7][1]) + " off")
        #GPIO.output(relayCombinations[7][0], 0)
        #GPIO.output(relayCombinations[7][1], 0)
    else:
        print(str(relayCombinations[comboNumber - 1][0]) + " off")
        print(str(relayCombinations[comboNumber - 1][1]) + " off")
        #GPIO.output(relayCombinations[comboNumber - 1][0], 0)
        #GPIO.output(relayCombinations[comboNumber - 1][1], 0)

    print(str(relayCombinations[comboNumber][0]) + " on")
    print(str(relayCombinations[comboNumber][1]) + " on")

    #GPIO.output(relayCombinations[comboNumber][0], 1)
    #GPIO.output(relayCombinations[comboNumber][1], 1)

#for i in range(8):
#    print(nextCombination(i))

#print(str(relayCombinations[1][0]) + ", " + str(relayCombinations[1][1]))