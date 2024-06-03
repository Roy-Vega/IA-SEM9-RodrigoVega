# Proyecto Deteccion Estados de Animo - LBPH

## Descripción

Para realizar este proyecto se entrena el modelo mediante el algoritmo LBPH (identificación de objetos y reconocimiento facial), el cual funciona mejor en comparación con Eigenceface y Fisherface. 

El dataset de imágenes, está compuesto de rostros de distintas personas, con distintas emociones:
* Feliz (496)
* Triste (669)
* Sorprendido (459)

Una vez entrenado se usa la camara de video de la laptop para detectar las emociones.


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