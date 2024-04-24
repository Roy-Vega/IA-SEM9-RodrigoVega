# Actividad Modelado - 3 Balas

## Modelo de Red Neuronal

Para este problema se plantea usar una red neuronal multicapa (MLP).
- La cantidad de neuronas en la capa de entrada, coincide con la cantidad de caracteristicas para los datos de entrada, que en este caso son cinco en total de las tres balas.
- La cantidad de nueronas en la capa de salida, coincide con la cantidad de acciones de salida que son tres (saltar, moverse izquierda y moverse derecha).

### Funcion de Activacion

En este caso se usa la función de activación "sigmoidea". 


### Bias
El bias puede tomar valores reales, pueden ser positivos, negativos o cero.

Como no hay un límite específico para el valor máximo que puede tomar el bias. Los valores del bias suelen ser pequeños y se inicializan aleatoriamente para facilitar el entrenamiento de la red neuronal.

En este caso el bias se incluiría en cada neurona de las capas ocultas y de salida, excepto en la capa de entrada. 

De esta forma el bias ayudaría a ajustar la salida de cada neurona en función de los datos de entrada y los pesos, lo que permitiría que la red neuronal aprenda a esquivar las balas de manera más efectiva.

### Peso Sinaptico 

Los pesos sinapticos son parámetros ajustables que se utilizan para ponderar la influencia de las entradas en las neuronas de la red

Se puede usar un valor como incremento que se hace poco a poco a W1 Y W2 para irse aproximando a target. 

Tambien en un perceptron simple los pesos sinpaticos se conocen como w1 y w1. 

En los pesos sinpatico es donde se guarda el conocimiento de la red neuronal y si se quiere guardar los datos mas releventes para futuso problemas simialres se guarda el bias, w1 y w2. 

## Tabla - Entradas y Salidas

**Tabla:**

| Dx1 (Distancia Bala 1) | Vx1 (Velocidad Bala 1) | Dx2 (Distancia Bala 2) | Vx2 (Velocidad Bala 2) | Dy (Distancia Bala 3) | S1 (Saltar) | S2 (Moverse Derecha) | S3 (Moverse Izquierda)
|:---------------:|:---------------:|:---------------:|:---------------:|:--------------:|:-----------:|:-----------:|:------------:|
|    500    | 100 |      500    |       100      |       450        |      0      |      0      |   0   |
|    30    | 100 |      500    |       100      |       450        |      1      |      0      |    0   |
|    500    | 100 |      500    |       100      |       30        |      0      |      1      |    0   |
|    30    | 100 |      500    |       100      |       30        |      1      |      1      |    0   |
|    20    | 100 |      20    |       100      |       20        |      1      |      0      |    1   |

Entradas:
- Distancia de la bala 1
- Velocidad de la bala 1
- Distancia de la bala 2
- Velocidad de la bala 2
- Distancia de la bala 3
  
Salidas:
- Saltar
- Moverse Izquierda
- Moverse Derecha  



## Target

El target representa la salida deseada o esperada para un conjunto de entradas dados, es la respuesta correcta que se quiere que la red neuronal aprenda a predecir. 

La funcion del target es para usarse como referencia o objetivo durante el proceso de entrenamiento de una red neuronal.

Entnnces durante el entrenamiento de la red neuronal se compara la salida producida contra el target esperado, para calcular el error, este error se usa para ajustar los pesos sinpatiocs, con el objetivo de minimizar el error para que cada vez se parezca al resultado/target esperado.

El target en este caso es la combinacion de acciones que el jugador debe tomar para esquivar/evitar las tres balas que se dirigen hacia el jugador.
- La primera bala se dirige enfrente del jugador en una linea horizontal con velocidad variable.
- La segunda bala se dirige diagonalmente con velocidad variable.
- La tercera bala cae encima del jugador en el mismo punto con la misma velocidad constante.

### Posible Situaciones

- Primera situacion:
Las tres balas lleguen a estar cerca del jugador en ese caso lo mas recomendando es mover el jugador a la izquierda (para atras), y de esa forma esquiva la segunda y tercera bala, y solo tendria que brincar para esquivar la primera bala. 

## Representacion Modelo MLP

Basandose en lo anterior a continuacion se muestra una imagen del diagrma de como seria la aquitectura de la red nueuronal. 



## Comportamiento de Datos


## Grafica


### Codigo 
### Resultados

