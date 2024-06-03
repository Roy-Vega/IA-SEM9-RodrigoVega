

# Proyecto Phaser Bala Rebota

## Descripción

Para realizar este proyecto se usó de base el juego de phaser funcionando con 1 bala horizontal y el jugador puede saltar o no hacer nada. El cual se entrenaba y jugaba de forma automática mediante el modelo. 

Se adaptó y modificó el código para que la bala rebotara en los bordes del juego (arena) y que el jugador se pudiera mover libremente como en un juego top-down, en este caso puede:
* Hacer Nada
* Moverse Izquierda
* Moverse Derecha
* Moverse Arriba
* Moverse Abajo

A continuación se explica cómo se entrenó al modelo:
* El perceptron tiene 3 entradas, 2 capas ocultas de 6 neuronas cada una y 4 salidas.
* Entradas: distanciaBalaJugador, balaPosX, balaPosY
* Salidas: estatusArriba, estatusAbajo, estatusDerecha, estatusIzquierda

Al mandarse los datos de entrada, la neurona arroja las probabilidades de salida para cada acción, y en el código se toma el valor más alto (equivalente a la acción más probable o correcta) y realiza la acción correspondiente a ese valor. 


Código del juego Phaser:
```javascript
var w=800;
var h=400;
var jugador;
var fondo;

var bala, balaD=false;

var derechaKey;
var izquierdaKey;
var arribaKey;
var abajoKey;
var menu;

var velocidadBala;
var despBalaX, despBalaY, jugadorX, jugadorY;

var estatusQuieto;
var estatusDerecha;
var estatusIzquierda;
var estatusArriba;
var estatusAbajo;

var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;

var cursors;

var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});

function preload() {
    juego.load.image('fondo', 'assets/game/fondo2.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    bala = juego.add.sprite(w-100, h, 'bala');
    jugador = juego.add.sprite(400, 200, 'mono');

    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    jugador.body.gravity.y = 0;

    var correDerecha = jugador.animations.add('correIzqDer', [8, 9, 10, 11]);
    var correArriba = jugador.animations.add('correArriba', [12, 13, 14, 15]);
    var correAbajo = jugador.animations.add('correAbajo', [0, 1, 2, 3]);
    var idle = jugador.animations.add('idle', [0]);

    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;
    bala.body.bounce.set(1);
    bala.body.velocity.set(450);

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    derechaKey = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    izquierdaKey = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    arribaKey = juego.input.keyboard.addKey(Phaser.Keyboard.UP);
    abajoKey = juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    nnNetwork = new synaptic.Architect.Perceptron(3,6,6,4);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}

function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 15000, shuffle: true});
}

function datosDeEntrenamiento(param_entrada){
    console.log("-----------");
    console.log("Input: distanciaBalaJugador: "+param_entrada[0]+" balaPosX: "+param_entrada[1]+" balaPosY: "+param_entrada[2]);
    nnSalida = nnNetwork.activate(param_entrada);

    var porcentajeArriba = Math.round(nnSalida[0] * 100);
    var porcentajeAbajo = Math.round(nnSalida[1] * 100);
    var porcentajeDerecha = Math.round(nnSalida[2] * 100);
    var porcentajeIzquierda = Math.round(nnSalida[3] * 100);

    var HACER = 0.10;
    var NADA = 0.9;
    var maxValue = Math.max(nnSalida[0], nnSalida[1], nnSalida[2], nnSalida[3]);
    var minValue = Math.min(nnSalida[0], nnSalida[1], nnSalida[2], nnSalida[3]);
    var range = maxValue - minValue;

    var result = nnSalida.indexOf(maxValue);

    if (range < 0.01) {
        return -1;
    }

    return result;
}

function pausa() {
    juego.paused = true;
    menu = juego.add.sprite(w/2, h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(evento){     
    if(juego.paused){
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = evento.x , mouse_y = evento.y;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                eCompleto=false;
                datosEntrenamiento = [];
                modoAuto = false;
            }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!eCompleto) {
                    console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" );
                    enRedNeural();
                    eCompleto=true;
                }
                modoAuto = true;
            }

            menu.destroy();
            resetVariables();
            juego.paused = false;
        }
    }
}

function resetVariables(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;

    jugador.position.x = 400;
    jugador.position.y = 200;

    velocidadBala = 350;
    bala.body.velocity.x = velocidadBala ;
    bala.body.velocity.y = -velocidadBala;
    bala.position.x = w - 100;
    bala.position.y = h - 100;
}

function derecha(){
    jugador.animations.play('correIzqDer', 10, true);
    jugador.position.x = 550;
    jugador.position.y=200;
    
    estatusDerecha=1;
    estatusIzquierda=0;
    estatusQuieto=0;
    puedesContar_para_Regresar=false;
}

function izquierda(){
    jugador.animations.play('correIzqDer', 10, true);
    jugador.position.x = 250;
    jugador.position.y=200;

    estatusDerecha=0;
    estatusIzquierda=1;
    estatusQuieto=0;
    puedesContar_para_Regresar=false;
}

function arriba(){
    jugador.animations.play('correArriba', 10, true);
    jugador.position.x =400;
    jugador.position.y=80;

    estatusArriba=1;
    estatusAbajo=0;
    estatusQuieto=0;
    puedesContar_para_Regresar=false;
}
function abajo(){
    jugador.animations.play('correAbajo', 10, true);
    jugador.position.x =400;
    jugador.position.y=320;

    estatusArriba=0;
    estatusAbajo=1;
    estatusQuieto=0;
    puedesContar_para_Regresar=false;
}

function calculateDistance(x1, y1, x2, y2) { 
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

function getQuadrant(despBalaX, despBalaY) {
    if (despBalaX <= jugador.position.x && despBalaY <= jugador.position.y) {
        return 2;
    } else if (despBalaX > jugador.position.x && despBalaY <= jugador.position.y) { 
        return 1;
    } else if (despBalaX <= jugador.position.x && despBalaY > jugador.position.y) {
        return 3;
    } else if (despBalaX > jugador.position.x && despBalaY > jugador.position.y) {
        return 4;
    }
}

var timer=0;
var puedesContar_para_Regresar = true; 
function update() {

    if(puedesContar_para_Regresar==false){
        timer+=1;
    }

    jugador.animations.play('idle', 10, true);

    estatusQuieto=1;
    estatusDerecha=0;
    estatusIzquierda=0;
    estatusArriba=0;
    estatusAbajo=0;

    despBalaX = bala.position.x;
    despBalaY = bala.position.y;
    jugadorX = jugador.position.x;
    jugadorY = jugador.position.y;

    var balaPosX = bala.x - jugador.x; 
    var balaPosY =  jugador.y - bala.y;  

    var distanciaBalaJugador = calculateDistance(despBalaX, despBalaY, jugadorX, jugadorY);

    var quadrant = getQuadrant(despBalaX, despBalaY);

    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;

    if (derechaKey.isDown) { 
        jugador.animations.play('correIzqDer', 10, true);
        jugador.scale.x = 1; 
        jugador.position.x = 550;
        jugador.position.y=200;

        estatusDerecha=1;
        estatusIzquierda=0;
        estatusQuieto=0;
        puedesContar_para_Regresar=false;
        
    } else if (izquierdaKey.isDown){
        jugador.scale.x = -1; 
        jugador.animations.play('correIzqDer', 10, true);
        jugador.position.x = 250;
        jugador.position.y=200;

        estatusDerecha=0;
        estatusIzquierda=1;
        estatusQuieto=0;
        puedesContar_para_Regresar=false;
    }

    if (arribaKey.isDown) { 
        jugador.animations.play('correArriba', 10, true);
        jugador.position.x =400;
        jugador.position.y=80;

        estatusArriba=1;
        estatusAbajo=0;
        estatusQuieto=0;
        puedesContar_para_Regresar=false;
        
    } else if (abajoKey.isDown){
        jugador.animations.play('correAbajo', 10, true);
        jugador.position.x =400;
        jugador.position.y=320;

        estatusArriba=0;
        estatusAbajo=1;
        estatusQuieto=0;
        puedesContar_para_Regresar=false;
    }

    if(timer>25){ 
        jugador.position.x = Phaser.Math.linear(jugador.position.x, 400, 0.5); 
        jugador.position.y = Phaser.Math.linear(jugador.position.y, 200, 0.5);
        if(Math.abs(jugador.position.x - 400) < 1 && Math.abs(jugador.position.y - 200) < 1){  
            puedesContar_para_Regresar = true; 
            timer=0;
            jugador.position.x=400;
            jugador.position.y=200;

        }
    }

    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);

    if (modoAuto == true && distanciaBalaJugador <= 200) {

        var decision = datosDeEntrenamiento([distanciaBalaJugador, balaPosX, balaPosY]);

        switch (decision) {
                
            case 0: 
                arriba();
                break;
            case 1: 
                abajo();
                break;
            case 2: 
                derecha();
                break;
            case 3: 
                izquierda();
                break;
            case -1:
                break;
            default:
                break;
        }
    }

    if(modoAuto == false) {
        datosEntrenamiento.push({ 
            'input' :  [distanciaBalaJugador, balaPosX, balaPosY], 
            'output':  [estatusArriba, estatusAbajo, estatusDerecha, estatusIzquierda]  
        });
    }
}

function colisionH(){
    resetVariables();
    pausa();            
}

function render(){

}



```
