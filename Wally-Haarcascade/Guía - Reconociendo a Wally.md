# Actividad Wally/Waldo - Haarcascade


## Recortando Imágenes - Resize 

Se usó la herramienta "ImageMagick" y código de Python para cambiar el tamaño de las imágenes encontradas en Google y en repositorios de GitHub donde Wally se encontraba y en donde no se encontraba. 

Las imágenes donde está Wally son las positivas (p) y donde no se encuentra Wally son las negativas (n). 

### ImageMagick

Usando PowerShell se posiciona en la ubicación de la carpeta con las imágenes y después se usa el comando para renombrar y modificar el tamaño de las imágenes. 

Comandos:
```powershell

cd "C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Wally-Waldo - Actividad - Cascade Trainer GUI\Waldos Fotos\WALDO-50"

magick mogrify -resize 50x50! *.jpg


```


### Python - Código

El código del archivo "Ej7.5-ImgReescalar.ipynb" código también cambia el tamaño de las imágenes a 50x50 píxeles. 

Código:
```python

import cv2 as cv
import numpy as np
import os

def escala(imx, escala):
    #width = int (imx.shape[1] * escala / 100) #escalo el porcentaje de ancho
    #height = int (imx.shape[0] * escala / 100) #escalo el porcentaje de alto
    #size= (width, height) #
    #im = cv.resize (imx, size, interpolation = cv.INTER_AREA) #resize (img, nuevo tamaño, tipo de interpolacion) 
    
    size = (escala, escala)
    im = cv.resize(imx, size, interpolation=cv.INTER_AREA)
    return im
    # - resize: escalar positivamente o negativamente
    # - interpocation: rellenar espacios de img.
    # - cv.INTER_AREA: dice como llenar huecos de img
    

# Carpeta de entrada y salida
folder_input = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Wally-Waldo - Actividad - Cascade Trainer GUI\Waldos Fotos\WALDO'
folder_output = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Wally-Waldo - Actividad - Cascade Trainer GUI\Waldos Fotos\WALDO-50'

# Asegúrate de que la carpeta de salida exista
if not os.path.exists(folder_output):
    os.makedirs(folder_output)
    
    
# Iterar sobre cada archivo en la carpeta de entrada
for x in os.listdir(folder_input):

     # Construir la ruta completa para la imagen de entrada
    input_path = os.path.join(folder_input, x)
    
    # Leer la imagen
    img = cv.imread(input_path)
    
    # Aplicar la función de escala
    img_rescaled = escala(img, 50)  # Escalar a los pixeles que se quiera, en esta caso 50x50
    
    
    
    # Construir la ruta completa para la imagen de salida
    output_path = os.path.join(folder_output, x)
    
    # Guardar la imagen escalada en la carpeta de salida
    cv.imwrite(output_path, img_rescaled)


```

## Cascade Trainer GUI - Generación de Modelo



## Código Detección de Wally - Leer Modelo 


Código:
```python



```
