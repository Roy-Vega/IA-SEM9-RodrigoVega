# Proyecto Deteccion Estados de Animo - LBPH

## Objetivo
Desarrollar un sistema de reconocimiento facial que sea capaz de detectar y clasificar emociones humanas (feliz, triste, sorprendido) en tiempo real utilizando el algoritmo LBPH (Local Binary Patterns Histograms). Este sistema será implementado y evaluado utilizando un conjunto de datos de imágenes de rostros con diferentes emociones, y se desplegará en una aplicación de video en tiempo real.

## Descripción
  
Para realizar este proyecto se entrena el modelo mediante el algoritmo LBPH (Local Binary Patterns Histograms), el cual ha demostrado un mejor rendimiento en comparación con otros métodos como Eigenfaces y Fisherfaces. El dataset utilizado está compuesto por imágenes de rostros de distintas personas con diferentes emociones: 
* Feliz (496 imágenes)
* Triste (669 imágenes)
* Sorprendido (459 imágenes)

Una vez entrenado, el modelo se utiliza junto con la cámara de video de una laptop para detectar y clasificar las emociones en tiempo real.

## Pasos para Realizar el Proyecto

### 1. Entrenar el Modelo
Se entrena el modelo utilizando imágenes de rostros etiquetadas con diferentes emociones. El código carga las imágenes, las procesa, y entrena un clasificador LBPH.

Código - Entrenar Modelo:
```python
import numpy as np
import cv2 as cv 
import os

dataSet =  r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\caras\actividad2-Refined'
faces = os.listdir(dataSet) 
print(faces)

labels = [] 
facesData = [] 
label = 0

for face in faces:
    
    facePath = dataSet+'\\'+face 
    
    for faceName in os.listdir(facePath):
        labels.append(label)
        facesData.append(cv.imread(facePath+'/'+faceName,0)) 
    label = label + 1 
    
print(np.count_nonzero(np.array(labels)==0)) 

faceRecognizer = cv.face.LBPHFaceRecognizer_create()

faceRecognizer.train(facesData, np.array(labels))
faceRecognizer.write(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\LBPH-carasSentimientosv2.xml')
print('Exito!')
#10seg
```

El código carga las imágenes de diferentes emociones, las etiqueta y entrena un modelo LBPH con ellas. Finalmente, guarda el modelo entrenado en un archivo XML.

### 2.  Detectar Emociones en Video

Se utiliza el modelo entrenado para detectar emociones en tiempo real mediante la cámara de la laptop.

Código - Detectar Emoción - Video:
```python

import cv2 as cv
import os 

faceRecognizer = cv.face.LBPHFaceRecognizer_create()
faceRecognizer.read(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\LBPH-carasSentimientos.xml') 

dataSet =  r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\caras\actividad2-Refined'
faces = os.listdir(dataSet) 

cap = cv.VideoCapture(0)
rostro = cv.CascadeClassifier(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\Git IA - Actividades\ModelosXML\haarcascade_frontalface_alt.xml') #uso clasificador, para detectar rostro dentro de escena, barre 
while True:
    ret, frame = cap.read() 
    if ret == False: 
        break
        
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY) 
    cpGray = gray.copy()
    rostros = rostro.detectMultiScale(gray, 1.3, 3) 
    
    for(x, y, w, h) in rostros:
        
        frame2 = cpGray[y:y+h, x:x+w]
        frame2 = cv.resize(frame2,  (100,100), interpolation=cv.INTER_CUBIC)
        result = faceRecognizer.predict(frame2) 
        
        cv.putText(frame, '{}'.format(result), (x,y-20), 1,3.3, (255,255,0), 1, cv.LINE_AA)
        
        if result[1] > 70:
            cv.putText(frame,'{}'.format(faces[result[0]]),(x,y-25),2,1.1,(0,255,0),1,cv.LINE_AA)
            cv.rectangle(frame, (x,y),(x+w,y+h),(0,255,0),2)
        else:
            cv.putText(frame,'Desconocido',(x,y-20),2,0.8,(0,0,255),1,cv.LINE_AA)
            cv.rectangle(frame, (x,y),(x+w,y+h),(0,0,255),2)
            
    cv.imshow('frame', frame)
    k = cv.waitKey(1)
    
    if k == 27:
        break
        
cap.release()
cv.destroyAllWindows()
```
Este código carga el modelo entrenado y utiliza la cámara para capturar video en tiempo real. Detecta rostros en el video y clasifica las emociones utilizando el modelo LBPH. Las emociones detectadas se muestran en pantalla junto con un recuadro alrededor del rostro.

## Resultados
El sistema fue capaz de detectar y clasificar las emociones de las personas en tiempo real con una precisión aceptable. El entrenamiento del modelo LBPH se realizó con éxito y el modelo se pudo integrar con una aplicación de detección en tiempo real utilizando la cámara de la laptop.

