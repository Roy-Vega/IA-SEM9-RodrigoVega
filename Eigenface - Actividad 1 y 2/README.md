# Actividad 1 - Eigenface

## Generacion de Modelo 

A continuacion se describe el codigo que genera el modelo XML entrenado por el algoritmo eigenface. 

Lo primero que se realiza es importar librerias.
* Numpy importado como "np", se usa para realizar operaciones en matrices y arreglos. 
* La librería "cv2" importada como "cv", se usa para utilizar la librería OpenCV, diseñada para procesamiento de imágenes y visión por computadora. En este caso permite usar los algoritmos de reconocimiento facial como EigenFace, FisherFace y LBPH. 
* La librería "os" permite interactuar con el sistema operativo, para realizar ciertas operaciones y funcionalidades.

Después en la variable "dataSet" se almacena la ruta absoluta de la carpeta que contiene las subcarpetas individuales de cada persona. Los nombres de esas subcarpetas se almacenan en la lista (arreglo) "faces" como strings, que son de donde se va a entrenar el modelo y se imprime en consola. En este caso se entrena el modelo con seis personas, por lo que la lista imprime los nombres de las carpetas correspondientes a esas seis personas.

Posteriormente, se declara la variable "labels" que es una lista en donde se guardan las etiquetas generadas durante el proceso de lectura de las carpetas. Por cada imagen de las subcarpetas que son las personas, corresponde a una etiqueta y empieza por el número 0. En este caso, como son seis personas, se tendrán valores del 0 al 5, ya que la cantidad de etiquetas depende del numero de carpetas de personas que se tenga. Y dependiendo de la cantidad de imágenes que encuentra por persona se tendrá ese cantidad de etiquetas. Si la primera persona tiene 366 imágenes, se agrega 366 veces el valor 0 a la lista. 

* La variable "facesData" se usa para almacenar las imágenes de los rostros una vez que se leen. 
* La variable "label" se usa para asignar un identificador a la clase de cada rostro, y el valor se usa en la lista (arreglo) "labels".

En el primer ciclo "for" se recorre la carpeta de cada persona.
Dentro del ciclo, la variable "facePath" guarda la ruta completa de la carpeta de cada persona, ya que se concatena la ruta base "dataSet" con el nombre de la carpeta. Por ejemplo, en mi caso, si la carpeta es "axel", la ruta completa sería `C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\caras\actividad1\axel`.

Dentro del primer ciclo se tiene un segundo ciclo "for" que recorre las imágenes de los rostros por persona, ya que recorre la variable "facePath". Dentro de este segundo ciclo con la línea `labels.append(label)` agrega el valor de "label" a la lista "labels". La línea `facesData.append(cv.imread(facePath+'/'+faceName,0))` agrega a la lista "facesData" la imagen del rostro, usando la libreria "cv" para leer la imagen desde la ruta "facePath" y le concatena el nombre de la imagen con "faceName", indicando que la imagen se lee en escala de grises al especificar el valor 0. Al acabar este segundo ciclo se incrementa en uno la variable "label" para pasar a las imagenes de otra persona.

La línea `print(np.count_nonzero(np.array(labels)==0))` es opcional, ya que imprime la cantidad de imágenes etiquetadas con el valor de 0, siendo la primera carpeta que revisa. "np.array" crea un arreglo de valores booleanos y "np.count_nonzero" cuenta el número de elementos verdaderos en el arreglo.

Con la línea `faceRecognizer = cv.face.EigenFaceRecognizer_create()` se crea una instancia de clase "EigenFaceRecognizer" de la librería "cv", que se utiliza para crear y entrenar el modelo que reconocerá los rostros faciales.

Por último, en la línea `faceRecognizer.train(facesData, np.array(labels))` se entrena el modelo a partir de la lista (arreglo) "facesData" y el arreglo de etiquetas "labels". Con la línea `faceRecognizer.write(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\carasAmigos.xml')` se guarda el archivo XML, que contiene la información del modelo de los rostros, y se imprime un texto para saber que ya terminó el proceso con la línea `print('Exito!')`.


Código:
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

Para explicar este código, solo se hará mención de las nuevas líneas o procesos más relevantes que no se hayan mencionado en la explicación anterior.

Se crea una instancia del algoritmo "EigenFaceRecognizer" con la línea `faceRecognizer = cv.face.EigenFaceRecognizer_create()`, y se lee el modelo XML con la línea `faceRecognizer.read(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\carasAmigos.xml')`.

Después, con la línea `cap = cv.VideoCapture(0)` se inicializa una instancia de la clase "VideoCapture" para acceder al video de la cámara web. En la línea `rostro = cv.CascadeClassifier(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\haarcascade_frontalface_alt.xml')` se usa el clasificador Haarcascade, para detectar objetos, en este caso los rostros. 

A continuación se usa un ciclo infinito "while", ya que se dice que se siga ejecutando mientras "True" lo cual siempre será verdadero. 

Dentro del ciclo "while" sucede lo siguiente:
* La línea `ret, frame = cap.read()` captura un fotograma del video en vivo, "ret" es un valor booleano que indica si se lee el fotograma exitosamente, "frame" contiene el fotograma capturado y con el método `.read()` lee el fotograma y retorno los dos valores "ret" y" frame".
* La línea `if ret == False: break` se usa para romper el ciclo, si no hay video.
* La línea `gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)` convierte el fotograma a una escala de grises usando el método `.cvtColor`. 
* La línea `cpGray = gray.copy()` crea una copia del fotograma (imagen) en escala de grises.
* La línea `rostros = rostro.detectMultiScale(gray, 1.3, 3)` usa el clasificador Haar para detectar rostros en la imagen en escala de grises, ya que en esta escala se reduce la complejidad computacional y se mejora el rendimiento, haciendo que sea más eficiente. 

Enseguida, en la línea `for(x, y, w, h) in rostros:` se tiene un ciclo "for" para iterar sobre "rostros" que es la lista de rectángulos. Se tiene `(x, y, w, h)` ya que representa las coordenadas del rectángulo que delimita el rostro. Donde "w" es el ancho, y "h" es la altura. Este ciclo recorre cada rectángulo de la lista, procesando cada objeto o región detectada por el clasificador de objetos. 

A continuación se describe lo que se realiza dentro del ciclo "for":
* En la línea `frame2 = cpGray[y:y+h, x:x+w]` se extrae el rostro. 
* En la línea `frame2 = cv.resize(frame2,  (100,100), interpolation=cv.INTER_CUBIC)` se redimensiona el rostro al tamaño de 100x100 píxeles usando la interpolación bicúbica. 
* En la línea `result = faceRecognizer.predict(frame2)` se envía como parámetro el rostro recortado "frame2" al algoritmo "EigenFace" para que haga una predicción, el cual devuelve una tupla con dos elementos, el primer elemento es la etiqueta de la persona y el segundo es la confianza (valor) que determina la similitud, mientas más grande sea el valor, mayor será la similitud. 
* En la línea `if result[1] > 2800:` si verifica si el valor de confianza es mayor a 2800, si lo es con la línea `cv.putText(frame,'{}'.format(faces[result[0]]),(x,y-25),2,1.1,(0,255,0),1,cv.LINE_AA)` se muestra un texto con la etiqueta de la persona reconocida que se guarda en "result[0]", después con `cv.rectangle(frame, (x,y),(x+w,y+h),(0,255,0),2)` se pinta un rectángulo.
* Si el "if" no se cumple, entonces con la línea `cv.putText(frame,'Desconocido',(x,y-20),2,0.8,(0,0,255),1,cv.LINE_AA)` se muestra un texto que dice "Desconocido" y se vuelve a pintar un rectángulo.

Una vez que acaba el ciclo "for" con la línea `cv.imshow('frame', frame)` se muestra el fotograma con el texto y rectángulo que se dibuja en el reconocimiento facial. Con la línea `k = cv.waitKey(1)` espera 1 milisegundo, a que se presione una tecla y almacena el código ASCII de la tecla que se presiona. Si la tecla (variable "k") que se presiona corresponde a "Esc" el bucle "while" se rompe. 

Por último, con la línea `cap.release()` libera los recursos del video y `cv.destroyAllWindows()` cierra todas las ventanas abiertas.

Código:
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

## Algoritmos - EigenFace, FisherFace & LBPH

Cabe mencionar que para cambiar de algoritmo en ambos códigos (generación y lectura del modelo), solo es necesario modificar la siguiente línea, en donde se use:
* `faceRecognizer = cv.face.EigenFaceRecognizer_create()`
* `faceRecognizer = cv.face.FisherFaceRecognizer_create()`
* `faceRecognizer = cv.face.LBPHFaceRecognizer_create()`
 
Esto se debe a que la biblioteca 'cv' ya cuenta con los algoritmos necesarios e integrados.. 
