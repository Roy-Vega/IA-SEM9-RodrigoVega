        var w=800;
        var h=400;
        var jugador;
        var fondo;

        var bala, bala2, balaD=false, balaD2=false, nave;
        var bullet2ResetScheduled = false; // Flag to track if resetBullet2 has been scheduled


        var salto;
        var menu;

        var velocidadBala;
        var despBala;
        var velocidadBala2;
        var despBala2;
        var estatusAire;
        var estatuSuelo;

        var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
        var modoAuto = false, eCompleto=false;

        ////////////////
        var cursors;
        ///////////


        // inicia la instancia del juego
        var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});

        function preload() { // carga el fondo, la nave, el jugador (muñeco), la bala y el menú.
            juego.load.image('fondo', 'assets/game/fondo.jpg');
            juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48); //le digo de q tamaño es el segmento de muñecos, en este caso 32x48 pixeles, que es altura y ancho. //genera animiacion, de matriz (imagenes)
            juego.load.image('nave', 'assets/game/ufo.png');
            juego.load.image('bala', 'assets/sprites/purple_ball.png');
            juego.load.image('menu', 'assets/game/menu.png');

        }




        function create() { //configurar el entorno del juego, cargar los recursos necesarios y establecer la física del juego.

           
            ///////////
            cursors = this.input.keyboard.createCursorKeys(); //creates cursor key objects for up, down, left, and right arrow keys.
            ///////////


            juego.physics.startSystem(Phaser.Physics.ARCADE); // Inicia el sistema de física del juego en el modo ARCADE.
            juego.physics.arcade.gravity.y = 800; // Establece la gravedad en el eje y del sistema de física.
            juego.time.desiredFps = 30; // Establece la velocidad de fotogramas deseada del juego.

            //sprite es un elemento gráfico bidimensional q representar objetos, personajes, fondos, efectos visuales, etc
            //sprites son imágenes que pueden ser manipuladas, animadas y posicionadas en la pantalla.
            fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
            nave = juego.add.sprite(w-100, h-70, 'nave');
            bala = juego.add.sprite(w-100, h, 'bala');
            jugador = juego.add.sprite(50, h, 'mono');

            bala2 = juego.add.sprite(w - 745, -400, 'bala');
            bala2 = juego.add.sprite(jugador.x + 10, jugador.y - 400, 'bala');




            // bala.visible = false; 




            juego.physics.enable(jugador); // Habilita la física para el jugador.
            jugador.body.collideWorldBounds = true; // Permite que el jugador colisione con los límites del mundo.
            var corre = jugador.animations.add('corre',[8,9,10,11]); // Agrega una animación de correr al jugador.
            jugador.animations.play('corre', 10, true); // Reproduce la animación de correr del jugador.

            juego.physics.enable(bala); // Habilita la física para la bala.
            juego.physics.enable(bala2); // Habilita la física para la bala.
            bala.body.collideWorldBounds = true; // Permite que la bala colisione con los límites del mundo.
            bala2.body.collideWorldBounds = true; 

            pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' }); // Agrega un texto de pausa en la esquina superior derecha.
            pausaL.inputEnabled = true; // Habilita la entrada de clics para el texto de "pausa".
            pausaL.events.onInputUp.add(pausa, self); // Agrega un evento de clic al texto de pausa.
            juego.input.onDown.add(mPausa, self); // Agrega un evento de clic para pausar el juego.

        
            salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); // asigna la tecla de espacio del teclado a la variable salto

            
            //**/
            //Generar Red Neuronal: usando Perceptrón (arquitectura de red neuronal simple)
            
            nnNetwork =  new synaptic.Architect.Perceptron(2, 6, 6, 2); //nmeros representan estructura de la red neuronal:
            // 2 neuronas de entrada
            // (6,6)=2 capas ocultas, cada una con 6 neuronas. 
            //2 neuronas de salida.

            nnEntrenamiento = new synaptic.Trainer(nnNetwork); //crea un objeto Trainer para entrenar la red neuronal anterior, 

        }



        //Entrenar Modelo **
        function enRedNeural(){ //entrenar modelo con parametros/datos de entrenamiento especificos, esta funcion se llama cuando le ponemos "auto"
            
        //"datosEntrenamiento" es variable global, ya estan datos guardados

            //train (1 argumento: datosEntrenamiento, para entrenar modelo, pares de entrada y salida para ajustar pesos? )
            //      (2 argumento: objeto - tasa de aprendizaje (ajuste de pesos de red), iteraciones, mezclar datos si o no antes de cada iteracion)
            nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true}); 
            //objeto Trainer se utiliza para entrenar modelos de red neuronal.
        }


        //USAR MODELO ENTRENADO
        //ME REGRESA LO QUE VOY A HACER O NO VOY A HACER
        function datosDeEntrenamiento(param_entrada){ //recibe parametros (datos de entrada que se utilizarán para tomar una decisión)

            console.log("Entrada",param_entrada[0]+" "+param_entrada[1]); //Imprime en la consola los datos de entrada recibidos.
            
            // Pasa los datos de entrada a través de la red y obtiene las salidas predicha
            nnSalida = nnNetwork.activate(param_entrada); //cuando ya esta entrenada, mando parametros para decirle q hacer con esos datos 
            
            // Calcula el porcentaje redondeado de la salida correspondiente al aire
            var aire=Math.round( nnSalida[0]*100 );
            // Calcula el porcentaje redondeado de la salida correspondiente al piso
            var piso=Math.round( nnSalida[1]*100 );
            
            // Imprime en la consola los valores calculados
            console.log("Valor Aire: "+ aire + "%. Valor Suelo: " + piso + "%.");
            // console.log("aire:"+aire);
            // console.log("piso:"+piso);

            if(nnSalida[0]>=nnSalida[1]){
                console.log("salte");
            }
            
            return nnSalida[0]>=nnSalida[1]; //si (aire >= piso), return true, si es verdado salto =  true si el modelo predice que el personaje está en el aire
            // aire > 80;
        }



        function pausa() {
            // Pausa el juego
            juego.paused = true;
            
            // Agrega un menú de pausa al centro de la pantalla
            menu = juego.add.sprite(w/2, h/2, 'menu');
            
            // Establece el punto de anclaje del menú en su centro
            menu.anchor.setTo(0.5, 0.5);
        }


        // función maneja el evento de clic cuando el juego está pausado
        function mPausa(event){     
            if(juego.paused){ // Verifica si el juego está pausado.
                // Calcula las coordenadas del menú de pausa.
                var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
                    menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

                // Obtiene las coordenadas del clic del mouse.
                var mouse_x = event.x  ,
                    mouse_y = event.y  ;

                // Verifica si el clic del mouse está dentro de los límites del menú de pausa.
                if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
                    if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){  // clic del mouse ocurrió dentro de la parte superior del menú de pausa.
                        eCompleto=false; //entrenamiento de la red neuronal no está completo.
                        datosEntrenamiento = []; //Se VACIA el arreglo datosEntrenamiento, que almacena los datos de entrenamiento para la red neuronal.
                        modoAuto = false; // Se desactiva el modo automático del juego.

                    }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) { //clic del mouse ocurrió dentro de la parte inferior del menú de pausa.
                        if(!eCompleto) { //Verifica si el entrenamiento de la red neuronal no está completo.
                            console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" ); // indicando el número de datos de entrenamiento recopilados hasta el momento.
                            enRedNeural(); //SE MANDA A LLAMAR a funcion de entrenamiento  de la red neuronal.
                            eCompleto=true; //entrenamiento ha sido completado.
                        }
                        modoAuto = true; //activa el modo automático del juego.
                    }

                    menu.destroy(); // Elimina el menú de pausa.
                    resetVariables();  // LLAMA FUNCION para Reiniciar las variables del juego.
                    resetBullet1()
                    resetBullet2()
                    juego.paused = false; // Desactiva la pausa del juego.

                }
            }
        }


        function resetVariables(){
            //player's current movement is stopped by setting its velocity to 0.
            jugador.body.velocity.x=0;
            jugador.body.velocity.y=0;

            //REINICAR BALA 2
            bala2.position.x = w - 745; // X coordinate
            bala2.position.y = -400; // Y coordinate
            // bala2.position.x = jugador.x + 10; // Reset bullet 2 above the player
            // bala2.position.y = jugador.y - 400; // Adjust the y position as needed
            balaD2 = false; // Set the flag to indicate that bullet 2 is not in motion

        }

        function resetBullet1() {
            // Reset bullet 1 (bala) variables
            bala.body.velocity.x = 0;
            bala.position.x = w - 100; // Reset bullet 1 to its original position
            //jugador.position.x=50;
            balaD = false; // Set the flag to indicate that bullet 1 is not in motion
        }
        
        function resetBullet2() {
            
            // Define the delay before spawning bala2 (300 seconds)
            // var delayInSeconds = 300;

            // Uncomment the line below if you want to add random delays
            var delayInSeconds = velocidadRandom(2.5, 4); // Random delay between 100 and 600 seconds

            // Call the 'disparo2Delayed' function after the specified delay
            juego.time.events.add(Phaser.Timer.SECOND * delayInSeconds, disparo2Delayed, this);


        }

        
        // Function to be called after the delay
        function disparo2Delayed() {
            // velocidadBala2 = -1 * 300; // Adjust velocity as needed
            // bala2.body.velocity.y = velocidadBala2;
            // balaD2 = true;
            
            
            // Reset the flag to allow scheduling of resetBullet2 again
            bullet2ResetScheduled = false;

            // Reset bullet 2 (bala2) variables
            bala2.body.velocity.x = 0;

            bala2.position.x = w - 745; // X coordinate
            bala2.position.y = -400; // Y coordinate
            // bala2.position.x = jugador.x + 10; // Reset bullet 2 above the player
            // bala2.position.y = jugador.y - 400; // Adjust the y position as needed

            balaD2 = false; // Set the flag to indicate that bullet 2 is not in motion
            bala2.visible = true; 

        }


        function saltar(){
            jugador.body.velocity.y = -270;
        }



        //** 
        //actualiza continuamente la lógica del juego en cada fotograma, como desplazamiento del fondo, 
        //la detección de colisiones, el control del jugador (saltar),
        // el disparo de balas y la recopilación de datos de entrenamiento en función del modo de juego (manual o automático).
        var canMoveRight = true; // Variable to track if the player can move right
        function update() { //verifica si el juego está en modo automático o manual.


            /////
            if (cursors.right.isDown && canMoveRight) { // Check if the right arrow key is pressed and the player can move right
                jugador.body.velocity.x = 190;
                canMoveRight = false; // Disable further movement to the right
                setTimeout(enableMovement, 2000); // Enable movement after 3 seconds
            }
            

            // Calculate the distance to move back to the original position
            var distanceToOriginalPosition = Math.abs(jugador.position.x - 50);
                
            // Define the duration of the tween (adjust as needed)
            var tweenDuration = 200; // in milliseconds

            // Create a tween to move the player back to the original position
            var tween = juego.add.tween(jugador).to({ x: 50 }, tweenDuration, Phaser.Easing.Linear.None, true);

            ///////



            // Desplaza el fondo hacia la izquierda para crear un efecto de desplazamiento lateral
            fondo.tilePosition.x -= 1;

            // Verifica si hay colisión entre la bala y el jugador y ejecuta la función 'colisionH' si ocurre
            juego.physics.arcade.collide(bala, jugador, colisionH, null, this);

            juego.physics.arcade.collide(bala2, jugador, colisionH, null, this);

            // Inicializa las variables 'estatuSuelo' y 'estatusAire' para determinar si el jugador está en el suelo o en el aire
            estatuSuelo = 1;
            estatusAire = 0;

            // Verifica si el jugador no está en el suelo para actualizar los valores de 'estatuSuelo' y 'estatusAire' en consecuencia
            if(!jugador.body.onFloor()) {
                estatuSuelo = 0;
                estatusAire = 1;
            }

            // Calcula la distancia horizontal entre el jugador y la bala
            despBala = Math.floor(jugador.position.x - bala.position.x);


            // Verifica si el juego está en modo manual y si se presionó la tecla de salto y el jugador está en el suelo, entonces hace que el jugador salte
            if(modoAuto == false && salto.isDown && jugador.body.onFloor()) {
                saltar();
            }
            
            //MODO AUTO: YA UNA VEZ Q SE TIENE MODELO ENTRENADO, SE MANDAN DATOS Y DECIDE SI SALTAR
            // Verifica si el juego está en modo automático, la posición de la bala es mayor que cero y el jugador está en el suelo.
            // Si se cumplen estas condiciones, utiliza la función 'datosDeEntrenamiento' para determinar si el jugador debe saltar
            if(modoAuto == true && bala.position.x > 0 && jugador.body.onFloor()) {
                if(datosDeEntrenamiento([despBala, velocidadBala])) {
                    saltar();
                }
            }

            // Si la bala no está en movimiento, dispara una nueva bala
            if(balaD == false) {
                disparo();
            }

            if(balaD2 == false) {
                disparo2();
            }

            // If the bullet is not in motion and its position is less than or equal to zero, reset the bullet variables
            if (bala.position.x <= 0) {
                resetBullet1();
            }
        
           
            // if (bala2.position.y > 370) {
            //     resetBullet2();
            // }

            // Check if bullet 2 reset has been scheduled and not yet executed
            if (!bullet2ResetScheduled && bala2.position.y > 370) {
                // Hide bullet 2 immediately
                bala2.visible = false;  
                resetBullet2(); // Schedule resetBullet2 if conditions are met
                bullet2ResetScheduled = true; // Set the flag to indicate that resetBullet2 has been scheduled
            }

            //GUARDAR DATOS SI EN MODO MANUAL
            // Si el juego está en modo manual y la posición de la bala es mayor que cero, guarda los datos de entrenamiento actuales
            if(modoAuto == false && bala.position.x > 0) {
                datosEntrenamiento.push({
                    'input' :  [despBala , velocidadBala],
                    'output':  [estatusAire , estatuSuelo ]  
                });

                // Muestra en la consola los datos de entrenamiento actuales
                console.log("Desplazamiento Bala, Velocidad Bala, Salto, Suelo: ",
                    despBala + " " +velocidadBala + " "+ estatusAire+" "+  estatuSuelo);
        }
        }


        function enableMovement() {
            canMoveRight = true; // Enable movement to the right
        }




        function disparo(){
            velocidadBala =  -1 * velocidadRandom(300,800);
            bala.body.velocity.y = 0 ;
            bala.body.velocity.x = velocidadBala ;
            balaD=true;
        }

        function disparo2(){
            velocidadBala2 = -1 * 300; // Adjust velocity as needed
            bala2.body.velocity.y = velocidadBala2;
            balaD2 = true;

            // velocidadBala2 =  -1 * 300;
            // bala2.body.velocity.y = velocidadBala2 ;
            // balaD2=true;
        }






        function colisionH(){
            resetVariables();
            pausa();
            

        }




        function velocidadRandom(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }




        function render(){

        }
