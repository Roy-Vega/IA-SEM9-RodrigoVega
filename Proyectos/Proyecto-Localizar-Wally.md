# Proyecto Localizar a Wally 

## Descripción

Para realizar este proyecto se usa la herramienta "Cascade Trainer GUI" en Windows, el cual permite entrenar un modelo usando Haar cascade. 

A continuación se describe el dataset:
* Una carpeta, que contiene una carpeta llamada "n" con imágenes negativas y otra carpeta llamada "p" que contiene imágenes positivas.
* En este caso, las imágenes positivas son recortes del rostro de Wally, y del cuerpo de Wally. Intentando evitar ruido (colores, contenido, objetos, personas, etc.) de los alrededores de la imagen. 
* Las imágenes negativas son objetos, ya sean completos, o parte de un objeto, como árboles, auto, personas, prendas, y también se tienen varios rostros y cuerpos de personajes que no son Wally.  

Para entrenarlo mediante esta herramienta se proporciona con lo siguiente:
Sección "Train":
* Input: En el apartado "Samples Folder" se selecciona la carpeta donde se tiene el dataset con imágenes negativas y positivas. En el apartado "Positive Image Usage" se usa 80, en el apartado "Negative Image Count" se ingresa la cantidad exacta de imágenes negativas. El otro apartado "Force Positive Sample Count" se deja por defecto en 1.
* Common: Se dejan los valores por defecto, excepto el número de "stages" se reduce a 16 debido a que tarda mucho tiempo en entrenarse mientras más épocas.
* Cascade: Se dejan los valores por defecto. 
* Boost: Se dejan los valores por defecto. 

Una vez que se genera el XML entrenado "cascade.xml" se usa en el siguiente código de Python para leer una imagen y que se detecta a Wally en la imagen (al dibujar un recuadro verde en el rostro) y guardando la imagen en la carpeta seleccionada.

Código - Detectar a Wally - Folder:
```python

import cv2 as cv
import os

# Usar modelo XML
wally_cascade = cv.CascadeClassifier(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Wally-Waldo - Actividad - Cascade Trainer GUI\Waldo9TrainBestv4\classifier\cascade.xml')

# List of image files and their corresponding detectMultiScale parameters
image_params = {
    # 'test0-recortada.jpg': {'scaleFactor': 1.01, 'minNeighbors': 80, 'minSize': (55, 55)},
    # #'test1-recortada.jpg': {'scaleFactor': 1.01, 'minNeighbors': 390, 'minSize': (65, 65)},
    # #'test2-recortada.png': {'scaleFactor': 1.01, 'minNeighbors': 88, 'minSize': (55, 55)},
    # 'test3-recortada.jpg': {'scaleFactor': 1.01, 'minNeighbors': 1200, 'minSize': (65, 65)},
    # 'test4-recortada.jpg': {'scaleFactor': 1.01, 'minNeighbors': 25, 'minSize': (65, 65)},
    # 'test5-recortada.png': {'scaleFactor': 1.01, 'minNeighbors': 195, 'minSize': (65, 65)},
    # 'test6-recortada.png': {'scaleFactor': 1.01, 'minNeighbors': 120, 'minSize': (65, 65)},
    # 'test96.png': {'scaleFactor': 1.01, 'minNeighbors': 650, 'minSize': (55, 55)},
    'test94.png': {'scaleFactor': 1.01, 'minNeighbors': 650, 'minSize': (55, 55)},
}

# Base directories
input_dir = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Wally-Waldo - Actividad - Cascade Trainer GUI\Waldos Fotos\Test IA'
output_dir = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Wally-Waldo - Actividad - Cascade Trainer GUI\Waldos Fotos\Test IA\Resultados\Waldo9TrainBestv4\minN35, 55,55'

# Process each image
for image_file, params in image_params.items():
    # Construct full paths
    image_path = os.path.join(input_dir, image_file)
    output_path = os.path.join(output_dir, image_file.replace('recortada', 'v1'))

    # Leer img
    image = cv.imread(image_path)

    # Convertir img a escala de grises
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

    # Detectar a Wally en la img
    wally_apparitions = wally_cascade.detectMultiScale(
        gray,
        scaleFactor=params['scaleFactor'],
        minNeighbors=params['minNeighbors'],
        minSize=params['minSize']
    )

    if len(wally_apparitions) == 0:
        print(f"Wally no se encontró en {image_file}.")
    else:
        # Dibujar rectangulo de Wally
        for (x, y, w, h) in wally_apparitions:
            cv.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Guardar img con rectangulos
        cv.imwrite(output_path, image)
        print(f"Wally detectado en {image_file}. Guardado en {output_path}.")

```

