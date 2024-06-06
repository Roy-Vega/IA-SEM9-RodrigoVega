# Proyecto Localizar a Wally 

## Objetivo
Desarrollar un sistema de detección automática de Wally en imágenes utilizando un clasificador Haar cascade. El sistema será entrenado con imágenes positivas y negativas y se implementará en una aplicación que procesa imágenes de una carpeta y detecta la presencia de Wally.

## Descripción

Para realizar este proyecto se usa la herramienta "Cascade Trainer GUI" en Windows, el cual permite entrenar un modelo usando Haar cascade. 

A continuación se describe el dataset:
* Una carpeta que contiene una subcarpeta llamada "n" con imágenes negativas y otra subcarpeta llamada "p" que contiene imágenes positivas.
* Las imágenes positivas son recortes del rostro y cuerpo de Wally, intentando evitar ruido de los alrededores.
* Las imágenes negativas incluyen objetos completos o partes de objetos como árboles, autos, personas, prendas, y varios rostros y cuerpos de personajes que no son Wally.

Para entrenar el modelo se usa "Cascade Trainer GUI" configurado de la siguiente manera:
- **Input**: Se selecciona la carpeta del dataset. Se usa 80 para "Positive Image Usage" y se ingresa la cantidad exacta de imágenes negativas para "Negative Image Count". "Force Positive Sample Count" se deja en 1.
- **Common**: Se dejan los valores por defecto excepto el número de "stages" que se reduce a 16.
- **Cascade**: Se dejan los valores por defecto.
- **Boost**: Se dejan los valores por defecto.

Una vez generado el XML entrenado ("cascade.xml"), se usa en un código Python para leer imágenes y detectar a Wally, dibujando un recuadro verde alrededor de su rostro y guardando la imagen en una carpeta seleccionada.

## Pasos para Realizar el Proyecto

### 1. Entrenar el Modelo
Se entrena el modelo usando la herramienta "Cascade Trainer GUI" con un dataset de imágenes positivas y negativas.

### 2. Detectar a Wally en Imágenes
Se utiliza el modelo entrenado para detectar a Wally en imágenes almacenadas en una carpeta.

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

Este código carga el modelo entrenado y procesa imágenes de una carpeta, detectando la presencia de Wally y dibujando un rectángulo alrededor de su rostro.

## Resultados

El sistema fue capaz de detectar a Wally en varias imágenes con una precisión razonable. El entrenamiento del modelo Haar cascade se realizó con éxito y el modelo se integró en una aplicación de detección de imágenes.

