import glob
import os
def get_files(path):


    files = glob.glob(path + "/**/*", recursive=True)


    print(files)



    files.sort()



    return files


def get_content(files):




    all = open("all.txt", "w")
    all.write("")
    all.close()


    all = open("all.txt", "a")




    for file in files:

        if os.path.isdir(file):
            continue


        f = open(file, "r")


        content = f.read()


        all.write('content of file: ' + file + '\n\n```\n' + content + '\n```\n')


        f.close()


    all.close()

if __name__ == "__main__":


    # C:\AM\Github\digitalMenu\src\app\api

    # files = get_files("C:/AM/Github/digitalMenu/src/app/api")

    # C:\AM\Github\campaign-manager\c.py

    files = get_files("C:/AM/Github/campaign-manager")

    get_content(files)
