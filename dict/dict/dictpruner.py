dic = "en_US"

with open(dic + ".dic") as inp:
    noOfWords = int(inp.readline())
    with open(dic + "_pruned.txt", "w") as out:
        for i in range(noOfWords):
            line = inp.readline()
            if  (line[0].islower() and not any(char.isdigit() for char in line) and len(line.split("/")[0]) > 2): out.write(line)
            