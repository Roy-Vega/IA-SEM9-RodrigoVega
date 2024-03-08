# Actividad 1 - Eigenface

## Generacion de Modelo 

A continuacion se describe el codigo que genera el modelo xml entrenado por el algoritmo eigenface. 

Lo primero que se realiza es importar librerias.
* Numpy importado como "np", se usa para realizar operaciones en matrices y arreglos. 
* La librería "cv2" importada como "cv", se usa para utilizar la librería OpenCV, diseñada para procesamiento de imágenes y visión por computadora. En este caso permite usar los algoritmos de reconocimiento facial como EigenFace, FisherFace y LBPH. 
* La librería "os" permite interactuar con el sistema operativo, para realizar ciertas operaciones y funcionalidades.

Después en la variable "dataSet" se almacena la ruta absoluta de la carpeta que contiene las subcarpetas individuales de cada persona. Los nombres de esas subcarpetas se almacenan en la lista (arreglo) "faces" como strings, que son de donde se va a entrenar el modelo y se imprime en consola. En este caso se entrena el modelo con seis personas, por lo que la lista imprime los nombres de las carpetas correspondientes a esas seis personas.

Posteriormente, se declara la variable "labels" que es una lista en donde se guardan las etiquetas generadas durante el proceso de lectura de las carpetas. Por cada imagen de las subcarpetas que son las personas, corresponde a una etiqueta y empieza por el número 0. En este caso, como son seis personas, se tendrán valores del 0 al 5. Y dependiendo de la cantidad de imágenes que encuentra por persona se tendrá ese número de etiquetas. Si la primera persona tiene 366 imágenes, se agrega 366 veces el valor 0 a la lista.

Codigo:
```python
import numpy as np
import cv2 as cv 
import os

dataSet = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\caras\actividad1'
faces = os.listdir(dataSet)
print(faces)

labels = []
facesData = []
label = 0

for face in faces:
    facePath = dataSet + '\\' + face
    
    for faceName in os.listdir(facePath):
        labels.append(label)
        facesData.append(cv.imread(facePath + '/' + faceName, 0))
    
    label = label + 1

print(np.count_nonzero(np.array(labels) == 0))

faceRecognizer = cv.face.EigenFaceRecognizer_create()

faceRecognizer.train(facesData, np.array(labels))
faceRecognizer.write(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\carasAmigos.xml')
print('Exito!')

```

## Leer Modelo 




Codigo:
```python

import cv2 as cv
import os

faceRecognizer = cv.face.EigenFaceRecognizer_create()
faceRecognizer.read(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\carasAmigos.xml')

dataSet = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\caras\actividad1'
faces = os.listdir(dataSet)

cap = cv.VideoCapture(0)
rostro = cv.CascadeClassifier(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\haarcascade_frontalface_alt.xml')

while True:
    ret, frame = cap.read() 
    if ret == False:
        break
        
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY) 
    cpGray = gray.copy()
    rostros = rostro.detectMultiScale(gray, 1.3, 3)
    
    for (x, y, w, h) in rostros:
        frame2 = cpGray[y:y+h, x:x+w]
        frame2 = cv.resize(frame2, (100, 100), interpolation=cv.INTER_CUBIC)
        result = faceRecognizer.predict(frame2)
        
        if result[1] > 2800:
            cv.putText(frame, '{}'.format(faces[result[0]]), (x, y-25), 2, 1.1, (0, 255, 0), 1, cv.LINE_AA)
            cv.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        else:
            cv.putText(frame, 'Desconocido', (x, y-20), 2, 0.8, (0, 0, 255), 1, cv.LINE_AA)
            cv.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)

    cv.imshow('frame', frame)
    k = cv.waitKey(1)

    if k == 27:
        break

cap.release()
cv.destroyAllWindows()

```