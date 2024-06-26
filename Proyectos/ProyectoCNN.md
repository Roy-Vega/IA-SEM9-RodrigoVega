# Proyecto CNN 

## Objetivo

Implementar una Convolutional Neural Network (CNN) para la clasificación de imágenes que representan diferentes situaciones de emergencia, como asaltos, robos a casa, incendios, inundaciones y tornados.

## Descripción

Para realizar este proyecto se nos proporcionó el código base, para probar la CNN (red neuronal convolucional) la cual originalmente detectaba varios tipos de deportes.

Para el proyecto se realizaron algunos ajustes al código debido a que tenía código de paqueterías antiguas. 

Y también se agrega al final código para leer un folder con imágenes y que agregará un texto en la imagen, que diga a qué situación pertenece. 

Las 5 situaciones con las que se entrenó el modelo y la cantidad de imágenes del dataset son:
* Asalto (6,709)
* Robo a casa (8,765)
* Incendio (9,389)
* Inundación (5,240)
* Tornado (8,436)


## Pasos para realizar el proyecto

### 1. Preparación del entorno y dataset: 
Se prepara el entorno de trabajo y se organiza el dataset de imágenes en carpetas separadas por categorías de situaciones de emergencia.

### 2. Adaptación del código base: 
Se realiza la adaptación del código base de la CNN para su uso en la clasificación de situaciones de emergencia en lugar de deportes.

### 3. Entrenamiento del modelo: 
Se entrena el modelo de CNN utilizando el dataset preparado.

### 4. Evaluación del modelo: 
Se evalúa el rendimiento del modelo entrenado utilizando un conjunto de datos de prueba, midiendo la precisión y otros indicadores de rendimiento.

### 5. Generación de etiquetas en imágenes: 
Se añade funcionalidad al código para etiquetar imágenes con texto que indique la situación de emergencia detectada por el modelo.

## Código CNN:
```python

import cv2 

img = cv2.imread(r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\situationsimages28x28\asalto\1.jpg')
print(img.shape[0], img.shape[1], img.shape[2], len(img.shape))
# Convolutional Neural Networks

# Importar Librerías
import numpy as np
import os
import re
import matplotlib.pyplot as plt
%matplotlib inline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import keras
import tensorflow as tf
from tensorflow.keras.utils import to_categorical
from keras.models import Sequential,Model
from tensorflow.keras.layers import Input
from keras.layers import Dense, Dropout, Flatten
#from keras.layers import Conv2D, MaxPooling2D
#from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    BatchNormalization, SeparableConv2D, MaxPooling2D, Activation, Flatten, Dropout, Dense, Conv2D
)
from keras.layers import LeakyReLU
# Cargar set de Imágenes
dirname = os.path.join(os.getcwd(), r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\situationsimages28x28')
imgpath = dirname + os.sep 
images = []
directories = []
dircount = []
prevRoot=''
cant=0

print("leyendo imagenes de ",imgpath)

for root, dirnames, filenames in os.walk(imgpath):
    for filename in filenames:
        if re.search("\.(jpg|jpeg|png|bmp|tiff)$", filename):
            cant=cant+1
            filepath = os.path.join(root, filename)
            image = plt.imread(filepath)
            if(len(image.shape)==3):
                
                images.append(image)
            b = "Leyendo..." + str(cant)
            print (b, end="\r")
            if prevRoot !=root:
                print(root, cant)
                prevRoot=root
                directories.append(root)
                dircount.append(cant)
                cant=0
dircount.append(cant)

dircount = dircount[1:]
dircount[0]=dircount[0]+1
print('Directorios leidos:',len(directories))
print("Imagenes en cada directorio", dircount)
print('suma Total de imagenes en subdirs:',sum(dircount))
# Creamos las etiquetas
labels=[]
indice=0
for cantidad in dircount:
    for i in range(cantidad):
        labels.append(indice)
    indice=indice+1
print("Cantidad etiquetas creadas: ",len(labels))

deportes=[]
indice=0
for directorio in directories:
    name = directorio.split(os.sep)
    print(indice , name[len(name)-1])
    deportes.append(name[len(name)-1])
    indice=indice+1
y = np.array(labels)
X = np.array(images, dtype=np.uint8) #convierto de lista a numpy



# Find the unique numbers from the train labels
classes = np.unique(y)
nClasses = len(classes)
print('Total number of outputs : ', nClasses)
print('Output classes : ', classes)
# Creamos Sets de Entrenamiento y Test
train_X,test_X,train_Y,test_Y = train_test_split(X,y,test_size=0.2)
print('Training data shape : ', train_X.shape, train_Y.shape)
print('Testing data shape : ', test_X.shape, test_Y.shape)
plt.figure(figsize=[5,5])

# Display the first image in training data
plt.subplot(121)
plt.imshow(train_X[0,:,:], cmap='gray')
plt.title("Ground Truth : {}".format(train_Y[0]))

# Display the first image in testing data
plt.subplot(122)
plt.imshow(test_X[0,:,:], cmap='gray')
plt.title("Ground Truth : {}".format(test_Y[0]))
# Preprocesamos las imagenes
train_X = train_X.astype('float32')
test_X = test_X.astype('float32')
train_X = train_X/255.
test_X = test_X/255.
plt.imshow(test_X[0,:,:])

## Hacemos el One-hot Encoding para la red
# Change the labels from categorical to one-hot encoding
train_Y_one_hot = to_categorical(train_Y)
test_Y_one_hot = to_categorical(test_Y)

# Display the change for category label using one-hot encoding
print('Original label:', train_Y[0])
print('After conversion to one-hot:', train_Y_one_hot[0])

# Creamos el Set de Entrenamiento y Validación
#Mezclar todo y crear los grupos de entrenamiento y testing
train_X,valid_X,train_label,valid_label = train_test_split(train_X, train_Y_one_hot, test_size=0.2, random_state=13)
print(train_X.shape,valid_X.shape,train_label.shape,valid_label.shape)

# Creamos el modelo de CNN
#declaramos variables con los parámetros de configuración de la red
INIT_LR = 1e-3 # Valor inicial de learning rate. El valor 1e-3 corresponde con 0.001
epochs = 20 # Cantidad de iteraciones completas al conjunto de imagenes de entrenamiento
batch_size = 64 # cantidad de imágenes que se toman a la vez en memoria
#from keras.models import Sequential
#from keras.layers import Conv2D, MaxPooling2D, Dropout, Flatten, Dense, LeakyReLU, Input

sport_model = Sequential()
#sport_model.add(Input(shape=(21, 28, 3)))  # Add Input layer with the specified input shape
sport_model.add(Input(shape=(28, 28, 3)))  # Add Input layer with the specified input shape
sport_model.add(Conv2D(32, kernel_size=(3, 3), activation='linear', padding='same'))
sport_model.add(LeakyReLU(negative_slope=0.1)) # Replace alpha with negative_slope
sport_model.add(MaxPooling2D((2, 2), padding='same'))
sport_model.add(Dropout(0.5))

sport_model.add(Flatten())
sport_model.add(Dense(32, activation='linear'))
sport_model.add(LeakyReLU(negative_slope=0.1)) # Replace alpha with negative_slope
sport_model.add(Dropout(0.5))
sport_model.add(Dense(nClasses, activation='softmax'))

sport_model.summary()

sport_model.compile(loss=keras.losses.categorical_crossentropy, optimizer=tf.keras.optimizers.SGD(learning_rate=INIT_LR), metrics=['accuracy'])

# Entrenamos el modelo: Aprende a clasificar imágenes
# este paso puede tomar varios minutos, dependiendo de tu ordenador, cpu y memoria ram libre
sport_train = sport_model.fit(train_X, train_label, batch_size=batch_size,epochs=epochs,verbose=1,validation_data=(valid_X, valid_label))
# guardamos la red, para reutilizarla en el futuro, sin tener que volver a entrenar

# Save the model in the native Keras format
sport_model.save(r"C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\Red Neuronal Entrenada\trainedCNNv4.keras")

# Evaluamos la red

test_eval = sport_model.evaluate(test_X, test_Y_one_hot, verbose=1)
print('Test loss:', test_eval[0])
print('Test accuracy:', test_eval[1])
sport_train.history
accuracy = sport_train.history['accuracy']
val_accuracy = sport_train.history['val_accuracy']
loss = sport_train.history['loss']
val_loss = sport_train.history['val_loss']
epochs = range(len(accuracy))
plt.plot(epochs, accuracy, 'bo', label='Training accuracy')
plt.plot(epochs, val_accuracy, 'b', label='Validation accuracy')
plt.title('Training and validation accuracy')
plt.legend()
plt.figure()
plt.plot(epochs, loss, 'bo', label='Training loss')
plt.plot(epochs, val_loss, 'b', label='Validation loss')
plt.title('Training and validation loss')
plt.legend()
plt.show()
predicted_classes2 = sport_model.predict(test_X)
predicted_classes=[]
for predicted_sport in predicted_classes2:
    predicted_classes.append(predicted_sport.tolist().index(max(predicted_sport)))
predicted_classes=np.array(predicted_classes)
predicted_classes.shape, test_Y.shape
# Aprendamos de los errores: Qué mejorar
correct = np.where(predicted_classes==test_Y)[0]
print("Found %d correct labels" % len(correct))
for i, correct in enumerate(correct[0:9]):
    plt.subplot(3,3,i+1)
    plt.imshow(test_X[correct].reshape(28,28,3), cmap='gray', interpolation='none') #CAMBIAR
    plt.title("{}, {}".format(deportes[predicted_classes[correct]],
                                                    deportes[test_Y[correct]]))

    plt.tight_layout()
incorrect = np.where(predicted_classes!=test_Y)[0]
print("Found %d incorrect labels" % len(incorrect))
for i, incorrect in enumerate(incorrect[0:9]):
    plt.subplot(3,3,i+1)
    plt.imshow(test_X[incorrect].reshape(28,28,3), cmap='gray', interpolation='none')  #CAMBIAR
    plt.title("{}, {}".format(deportes[predicted_classes[incorrect]],
                                                    deportes[test_Y[incorrect]]))
    plt.tight_layout()
target_names = ["Class {}".format(i) for i in range(nClasses)]
print(classification_report(test_Y, predicted_classes, target_names=target_names))

#nos da la precision de cada clase, algunos esta alto y otros bajos, puede ser porque se tienen pocos ejemplos de ciertas situaciones. 
import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.transform import resize
import os

images = []

# Folder containing the images
#folder_path = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\Testing Red - Fotos\asalto'
#folder_path = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\Testing Red - Fotos\incendio'
#folder_path = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\Testing Red - Fotos\inundaciones'
#folder_path = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\Testing Red - Fotos\robo'
folder_path = r'C:\Users\rovega\Desktop\ITM\Sem 9\Inteligencia Artificial\IA - Actividades NO GIT\Convolucion\CodigoSportImages\Testing Red - Fotos\tornados'

# List all image files in the folder
filenames = [os.path.join(folder_path, fname) for fname in os.listdir(folder_path) if fname.endswith('.jpeg') or fname.endswith('.jpg') or fname.endswith('.png')]

# Class names
deportes = ['asalto', 'incendio', 'inundaciones', 'robo a casa', 'tornado']

# Resize and normalize images
for filepath in filenames:
    image = plt.imread(filepath)
    if image.ndim == 2:  # Convert grayscale to RGB
        image = np.stack((image,) * 3, axis=-1)
    elif image.shape[2] == 4:  # Remove alpha channel if present
        image = image[..., :3]
    image_resized = resize(image, (28, 28), anti_aliasing=True, clip=False, preserve_range=True)
    images.append(image_resized)

# Convert list to numpy array with the correct shape and type
X = np.array(images, dtype=np.float32)  # Ensure dtype is float32 for the model input
test_X = X / 255.0  # Normalize to [0, 1]

# Predict classes using the model
predicted_classes = sport_model.predict(test_X) # array of predictions, one hot encoding

# Add text to each image
for i, img_tagged in enumerate(predicted_classes):
    predicted_class = deportes[img_tagged.tolist().index(max(img_tagged))] #finds the index of the highest probability using max(img_tagged), which corresponds to the predicted class. 
    print(filenames[i], predicted_class)
    
    # Read the image with OpenCV to add text
    original_image = cv2.imread(filenames[i])
    if original_image is None:
        print(f"Error loading image {filenames[i]}")
        continue

    # Set the position for the text
    text_position = (10, original_image.shape[0] - 10)
    
    # Add text to the image
    cv2.putText(original_image, predicted_class, text_position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    
    # Save the image with the added text
    output_filepath = filenames[i].replace('.jpeg', '_tagged.jpeg').replace('.jpg', '_tagged.jpg').replace('.png', '_tagged.png')
    cv2.imwrite(output_filepath, original_image)
    print(f"Tagged image saved as {output_filepath}")

# Display the tagged images
for filepath in filenames:
    output_filepath = filepath.replace('.jpeg', '_tagged.jpeg').replace('.jpg', '_tagged.jpg').replace('.png', '_tagged.png')
    img_tagged = cv2.imread(output_filepath)
    if img_tagged is not None:
        plt.imshow(cv2.cvtColor(img_tagged, cv2.COLOR_BGR2RGB))
        plt.axis('off')
        plt.show()
```

## Resultados

El código se adapta para funcionar con imágenes de diferentes situaciones de emergencia, y el modelo de CNN logra una precisión aceptable en la clasificación de estas situaciones. Cabe mencionar que el modelo llega a confundirse entre la situacion de "robo a casa" y "asalto". 

