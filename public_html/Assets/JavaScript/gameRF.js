var _Game = null;
var id;
var idM;
var _Width;
var _Height; 
var _Canvas, canvas;
var _Contx,ctx;
var _Menu = null;
var _PointsB;

$(document).ready(function () {
	init();
});

this.init = function()
{
	clearInterval(id);
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	InputManager.connect(document, canvas);
	StartMainMenu();	
}

this.StartMainMenu = function()
{
	clearInterval(idM);
	 InputManager.reset();
	_Game = null;
	// Async load audio and start menu when loaded
	MultiStepLoader( [
		[ "audio", function(cb, i) {
			AudioManager.load({
				'blip'   : 'Assets/Sounds/blip',
				'select' : 'Assets/Sounds/select'
			}, function() {
				cb(i); } ) } ],
	], function() {
		// All done, go!
		InputManager.reset();
		_Menu = new Menu("Mario Flying",
				[ "Play" ],
				"Jesus Torres Graficas Para Videojuegos USB",
				100, 50, 320,
				function(numItem) { if (numItem == 0) new Game().initGame(); },	null);
				
		 idM = setInterval(function(){if(_Menu!=null){_Menu.Tick (1 / 32 * 1000);}}, 1 / 32 * 1000);
		
	} );
}


function Game()
{
	var points,
		state = false
		Fnd = null,
		platforms = null,
		enemigos = null,
		items = null,
		lives = 1,
		Ilives = new Image(),
		Banner = new Image(),
		onPause=true,
		finJuego = false,
		player=null;
		
    this.maxfps = 32;
    this.drawInterval = 1 / this.maxfps * 1000;

	this.livesUP = function()
	{
		lives++;
	}

	function generarPlataformas(nrOfPlatforms)
	{
		platforms = [];
		var pos = 0, type;  
		for (var i = 0; i < nrOfPlatforms; i++) {  
			type = ~~(Math.random()*5);  
			if (type == 0) 
				type = 1;  
			else 
				type = 0;
				
			platforms[i] = new Platform();
			platforms[i].initPlatform(Math.random()*(_Width-70),pos,type)
			generarItems(i,platforms[i].getX()+platforms[i].getWidth()/2,platforms[i].getY()-platforms[i].getHeight());
			
			if (pos < _Height - 20)   
				pos += ~~(_Height / nrOfPlatforms);  
		}
	}
	
	function generarEnemigos(nrOfEnemigos)
	{
		enemigos = [];
		items = [];
		var pos = 0;  
		for (var i = 0; i < nrOfEnemigos; i++) {  
		
			enemigos[i] = new Enemigo();
			enemigos[i].initEnemigo(((enemigos[i].getDirection() * _Width)-(_Width))/2 , pos - enemigos[i].getHeight());

			
			if (pos < _Height - enemigos[i].getHeight())   
				pos += ~~(_Height / nrOfEnemigos);  
		}
	}
	
	function generarItems(index,x,y)
	{
		var type, Ruta, frames, width,height;  
		
		//Type => 0 - Coin, 1 - Star, 2 - 1UP 
		
		type = ~~(Math.random()*10);  			
			if(type == 3) //Vida
			{
				type = 2;
				Ruta = "1UP";
				frames = 0;
				width = 20;
				height = 20;
			}
			else 
				{
					Ruta = "coin";					
					type = 0;
					frames = 3;
					width = 10;
					height = 16;
				}
			
			items[index] = new Item();
			items[index].init(x,y,Ruta,frames,width,height,type)	
	}
	
	var intentos = 0;
	
	
	/**
	Tarde muchisimo haciendo el cambio de direccion, notar que aveces el mause
	hace pequeños movimientos que no queremos notar entonces lo que hace la parte de intentos
	es solo hacer el cambio correctamente si son mas de 5 intentos en la misma direccion
	*/
	document.onmousemove = function(e){
		if (player.getX() + player.getWidth()/2 +c.offsetLeft > e.pageX && !onPause) { 
			if(player.getDirection() == 1)
				if(intentos == 5)
				{
					player.turnDirection();
					intentos = 0;
				}
				else
				{
					intentos++;
					intentos = Math.min(intentos,5);
				}
			else
			{
				intentos--;
				intentos = Math.max(intentos,0);				
			}
					
			player.moveLeft(); 					
			
		} else if (player.getX() + player.getWidth()/2 + c.offsetLeft < e.pageX && !onPause) { 
			if(player.getDirection() == -1)
				if(intentos == 5)
				{
					player.turnDirection();
					intentos = 0;
				}
				else
				{
					intentos++;
					intentos = Math.min(intentos,5);
				}
			else
			{
				intentos--;
				intentos = Math.max(intentos,0);				
			}
			
			player.moveRight();			
		}
	}
	
	var IsPress = "";

	document.onkeydown = function (event)
	{   
		var keycode = (window.event||event).keyCode;
		
		if(keycode == 32)
			onPause = !onPause;
						
		IsPress = keycode;
		IsPress = '' + String.fromCharCode(keycode)

	}

    this.initGame = function()
    {
		_Menu = null;
        _Game = this;
		_Width  = 320;
		_Height = 500;
		points = 0,
		state = false;
		_Canvas = document.getElementById('c');
		_Contx = _Canvas.getContext('2d');	
		_Canvas.width = _Width;
		_Canvas.height = _Height + 50;
		_PointsB = 0;
		onPause = true;
		finJuego = false;
		
		generarEnemigos(3);
		generarPlataformas(7);

		Fnd = new Fondo();
		Fnd.initFondo('#d0e7f9');
		
		
		Ilives.src = "Assets/Images/1UP.png";
		Banner.src = "Assets/Images/banner.png";
		
		MultiStepLoader( [
			[ "audio", function(cb, i) {
				AudioManager.load({
					'1up'   : 'Assets/Sounds/1_UP',
					'coin' : 'Assets/Sounds/Coin',
					'die' : 'Assets/Sounds/Die',
					'fondo' : 'Assets/Sounds/Fondo',
					'game_over' : 'Assets/Sounds/Game_Over',
					'high_score' : 'Assets/Sounds/High_Score',		
					'jump' : 'Assets/Sounds/Jump',		
				}, function() {
					cb(i); } ) } ],
		], function() {		
	        		
		} );
		AudioManager.allowLoop("fondo");
		StartPlayer();
		id = setInterval(function(){if(_Game!=null){_Game.startApp();}}, this.drawInterval);
    }
	
	function StartPlayer()
	{
		AudioManager.pauseSong("fondo");
		AudioManager.play("fondo");
		player = new Player();	
		player.initPlayer(~~((_Width-player.getWidth())/2), ~~((_Height - player.getHeight())/2));
	}
	
    this.startApp = function()
    {
		if(finJuego)
			init();
			
		if(onPause)
		{
			this.updateP();
	        this.drawP();
		}
		else
		{
        	this.update();
			this.draw();
		}
    }

	this.GameOver = function()
	{
		IsPress;
		
		localStorage.setItem('foo', 'bar');
	}

	this.updateP = function()
	{
		
	}

    this.update = function()
    {
		if(player.update(platforms,Fnd))
			points++;

		if(player.Die()){
			lives--;
			if(lives>0)
			{
				StartPlayer();
				onPause = true;
			}
			else
				finJuego=true;
		}
			
		Fnd.update(0.005 * points);
		platforms.forEach(function(platform, index){
			if(!platform.update((index / 2) * ~~(points / 100) ,0.005 * points))
			{
				var type = ~~(Math.random() * 5);  
				if (type == 0)
					type = 1;  
				else   
					type = 0; 
					
				platforms[index] = new Platform();  
				platforms[index].initPlatform(Math.random() * (_Width - platform.getWidth()), 0 - platform.getHeight(), type);
			};
			items[index].setX(platforms[index].getX()+platforms[index].getWidth()/2);
		});
		
		enemigos.forEach(function(enemigo, index){
			if(!enemigo.update((index / 2) * ~~(points / 100) ,0.005 * points))
			{
				enemigos[index] = new Enemigo();  
				enemigos[index].initEnemigo(((_Width)-(enemigo.getDirection() * _Width))/2 , 0 - enemigo.getHeight());				
			
			};
		});

		items.forEach(function(itemx, index){
			if(!itemx.update(0,0.005 * points))
			{
				generarItems(index, platforms[index].getX() + platforms[index].getWidth()/2 , platforms[index].getY() - platforms[index].getHeight() );	
				
				if(platforms[index].getisMoving())
					items[index].isMovingON();
					
			};
		});
		
    }
	
    this.draw = function()
    {

		Fnd.draw(points);
		
		platforms.forEach(function(platform, index){  
			platform.draw();
		});
		
		enemigos.forEach(function(enemigo, index){  
			enemigo.draw(points);
		});		
		
		items.forEach(function(itemx, index){  
			itemx.draw();
		});	
		
		player.draw();
		
		this.marcador();
		
		
    }
	
    this.drawP = function()
    {

		Fnd.draw(points);
		
		platforms.forEach(function(platform, index){  
			platform.draw();
		});
		
		enemigos.forEach(function(enemigo, index){  
			enemigo.draw(points);
		});		
		
		items.forEach(function(itemx, index){  
			itemx.draw();
		});	
		
		player.draw();
		
		this.marcador();
		
		_Contx.fillStyle = 'rgba(0, 0, 0, 0.2)';  
		_Contx.beginPath();
		_Contx.rect(0, 0, _Width, _Height);
		_Contx.closePath();
		_Contx.fill();
		
		_Contx.font = "20pt Arial";  
		_Contx.fillStyle = "White";  
		_Contx.fillText("PRESS SPACE BAR ", _Width-30, 70);  
		_Contx.fillText("  TO CONTINUE ", _Width-50, _Height-50);  

		
    }
	
		
	
	this.marcador = function()
	{
			_Contx.drawImage(Banner, 0, _Height, _Width, 50);
			_Contx.font = "10pt Arial";  
			_Contx.fillStyle = "Black";  
			_Contx.fillText("POINTS:" + (points+_PointsB), _Width - 50, _Height+15);  
			
			_Contx.fillText("LIVES: ", _Width - 80, _Height+40); 
			

			lives = Math.min(lives,3);	
			for(i=0; i < lives;i++)
				_Contx.drawImage(Ilives, 0, 0, 20, 20, 250 + 20 * i , _Height+30 , 20, 20);
			
	}
	
}

function Fondo()
{
	

// Circulos que se dibujan en el fondo
var howManyCircles, circles, Color;
	
	
function randomNumber(limit){
  return Math.floor(Math.random()*limit);
}

function decToHex(dec)

{

  var hexStr = "0123456789ABCDEF";

  var low = dec % 16;

  var high = (dec - low)/16;

  hex = "" + hexStr.charAt(high) + hexStr.charAt(low);

  return hex;

}

function randomBgColor()
{
  var r,g,b;
  r = decToHex(randomNumber(256)-1);
  g = decToHex(randomNumber(256)-1);
  b = decToHex(randomNumber(256)-1);
  Color = "#" + r + g + b;
}
	
	//Inicializa el Fondo
	this.initFondo = function(CF)
	{
		Color = CF;
		randomBgColor();
		howManyCircles = 10;
		circles =[];
		// Se inicializan estos circulos
		for (var i = 0; i < howManyCircles; i++)
			circles.push([Math.random() * _Width, Math.random() * _Height, Math.random() * 100, Math.random() / 2]);
	}
	
	//Mueve los Circulos del Fondo haciendo parecer fondo animado
	function MoveCircles(e){
		for (var i = 0; i < howManyCircles; i++) {
			if (circles[i][1] - circles[i][2] > _Height) {
				circles[i][0] = Math.random() * _Width;
				circles[i][2] = Math.random() * 100;
				circles[i][1] = 0 - circles[i][2];
				circles[i][3] = Math.random() / 2;
			}
			else {
				circles[i][1] += e;
			}
		}
	}	
	
	// Limpia la pantalla para el proximo dibujar
	function clear(puntos){
		_Contx.fillStyle = Color;

		var ColorI,ColorT,ColorF,niv;
		
		if(puntos < 500)
		{
			niv = puntos/250;
			ColorF = 'rgba(0, 0, 255, 1)';
			
			
			if(puntos > 250)
			{
				ColorT = 'rgba(0, 0, 255, 1)';
				niv -= 1;
			}
			else
				ColorT = 'rgba(0, 255, 0, 1)';
			
			ColorI = 'rgba(0, 255, 0, 1)';

		}
		else if(puntos <1000)
		{
			niv = (puntos-500)/250;
			ColorF = 'rgba(0, 0, 0, 1)';
			
			
			if(puntos > 750)
			{
				ColorT = 'rgba(0, 0, 0, 1)';
				niv -= 1;
			}
			else
				ColorT = 'rgba(0, 0, 255, 1)';
			
			ColorI = 'rgba(0, 0, 255, 1)';

		}
		else
		{
			niv = 1;
			ColorF = 'rgba(0, 0, 0, 1)';
			ColorT = 'rgba(0, 0, 0, 1)';
			ColorI = 'rgba(0, 0, 0, 1)';
		}
		
		_Contx.fillStyle = 'rgba(255, 255, 255, 1)';  
		var gradient = _Contx.createLinearGradient((_Width/2), 0, (_Width/2), _Height);  
		gradient.addColorStop(0, ColorF);  
		gradient.addColorStop(niv, ColorT);  		
		gradient.addColorStop(1, ColorI);  
		_Contx.fillStyle = gradient;  
		_Contx.fillRect(0, 0, _Width,_Height);  
		
		
		_Contx.clearRect(0, 0, _Width, _Height);
		_Contx.beginPath();
		_Contx.rect(0, 0, _Width, _Height);
		_Contx.closePath();
		_Contx.fill();
	}

	// Se dibujan los circullos
	function DrawCircles(){
		for (var i = 0; i < howManyCircles; i++) {
			_Contx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';
			_Contx.beginPath();
			_Contx.arc(circles[i][0], circles[i][1], circles[i][2], 0, Math.PI * 2, true);
			_Contx.closePath();
			_Contx.fill();
		}
	}
	
	//Update las posiciones dele Fondo
	this.update = function(e)
	{
		MoveCircles(e);
	}
	
	//Dibuja el fondo
	this.draw = function(puntos)
	{
		clear(puntos);
		DrawCircles();
	}
	
}


function Platform()
{
// Plataforma de Salto
var image = new Image(),
	Width = 68,
	Height = 22,
	isMoving = ~~(Math.random() * 2), //0 No se mueve, 1 Si 
	direction= ~~(Math.random() * 2) ? -1 : 1, // -1 Izquierda, 1 Derecha
	x,
	y,
	type;
	
	//Inicializa la Plataforma
	this.initPlatform = function(xx,yy,typee)
	{
		type = typee;
		x = xx;
		y = yy;
		
		if(type == 0)
			image.src="Assets/Images/nube.png";
		else
			image.src="Assets/Images/nube2.png";	
			
	}
	
	//Update las posiciones de las plataformas, si sale de la pantalla retorna FALSE
	this.update = function(dx,dy)
	{
		if (isMoving) {
            if (x < 0)
                direction = 1;  
            else if (x > _Width - Width)
                direction = -1;  
				
            x += direction * dx;  
        }
		y += dy;
		
		return (y < _Height);
	}
	
	//Dibuja la Plataforma
	this.draw = function()
	{	
		_Contx.save();
		_Contx.drawImage(image, 0, 0, Width, Height, x, y, Width, Height);		
		_Contx.restore();
	
	}
	
	//Devuelve el tipo
	this.getType = function()
	{
		return type;
	}

	this.getX= function()
	{
		return x;
	}
	
	this.getisMoving = function()
	{
		return isMoving;	
	}
	
	this.getY = function()
	{
		return y;
	}

	this.getWidth = function()
	{
		return Width;
	}

	this.getHeight = function()
	{
		return Height;
	}	
	
	//Retorna True si (dx,dy) pertenece a la plataforma
	this.Collide = function(dx,dy,dw,dh)
	{	
		return 	(dx < x + Width) && (dx + dw > x) && (dy + dh > y) && (dy + dh < y + Height);
	}
}


function Player()
{
var image = new Image(),
	imageI = new Image(),
	imageD = new Image(),
	Width = 52,
	Height = 60,
	frames = 1,
	actualFrame = 0,
	direction= 1, // -1 Izquierda, 1 Derecha
	x,
	y,
	dx = 5,
	isJumping = false,
	isFalling = false,
	jumpSpeed = 0,
	fallSpeed = 0,
	Invulnerability = false,
	timetoNormal = 0,
	live,
	end,
	interval = 0;
	
	this.getX= function()
	{
		return x;
	}
	
	this.turnDirection = function()
	{
		direction *= -1;	
	}
	
	this.getDirection = function()
	{
		return direction;	
	}
		
	
	this.getY = function()
	{
		return y;
	}

	this.getWidth = function()
	{
		return Width;
	}

	this.getHeight = function()
	{
		return Height;
	}	
	
	this.initPlayer = function(xx,yy)
	{
		x = xx;
		y = yy;
		image.src="Assets/Images/Mario.png";
		imageI.src="Assets/Images/MarioI.png";
		imageD.src="Assets/Images/Mario_Die.png";
		live = true;
		end = false;
		jump();
	}

	function setPosition(xx, yy){
		x = xx;
		y = yy;
	}
	
	this.moveLeft = function(){
		if (x > 0 && live) {
			setPosition(x - 5, y);  				
		}
	}
	  
	this.moveRight = function(){
		if (x + Width < _Width && live) {  
			setPosition(x + 5, y);  				
		}
	}
	
	function jump() {
		
		if (!isJumping && !isFalling) {
		
			fallSpeed = 0;
			isJumping = true;
			jumpSpeed = 17;
		}
	}
	
	function checkFall(){  
		if (y + Height < _Height ) {
			fallSpeed++;
		}
		else
			if(live)
			{
				AudioManager.play("die");
				live=false;
				isJumping = false;  
				isFalling = true;
				fallSpeed = -5;
				fallSpeed++;
			}
			else
				if(AudioManager.inReproduction("die"))
					end = true;
					
		if (y < _Height )
			setPosition(x, y + fallSpeed);  
				
	}


	function checkJump(platforms,Fondo){
		if (y > _Height * 0.4)
			setPosition(x,y - jumpSpeed);
		else {  
			Fondo.update(jumpSpeed * 0.5);
			platforms.forEach(function(platform, ind){  
				platform.update(0,jumpSpeed);		
			}); 
			enemigos.forEach(function(enemigo, ind){  
				enemigo.update(0,jumpSpeed);		
			}); 
			items.forEach(function(itemx, ind){  
				itemx.update(0,jumpSpeed);		
			}); 
				
		}
		 
		jumpSpeed--;
		if (jumpSpeed == 0) {  
			isJumping = false;  
			isFalling = true;  
			fallSpeed = 0;  
		}
		return (jumpSpeed > 10);
	}
	
	function fallStop(){
		isFalling = false;
		fallSpeed = 0;
		jump();
	}
	
	this.Die = function()
	{
		return end;
	}
	
	this.update = function(platforms,Fondo)
	{		
		var bool = false;
		
		if(live)
		{
			if (isJumping) 
				bool = checkJump(platforms,Fondo);  
			
			if (isFalling) 
				checkFall();  
			
			platforms.forEach(function(platform, ind){  
				if (isFalling && platform.Collide(x,y,Width,Height))
				{
					AudioManager.play("jump");
					fallStop();
					if(platform.getType() == 1)
						jumpSpeed = 50;
				}
			});
			
			items.forEach(function(itemx,ind){
				type = itemx.Collide(x,y,Width,Height);
				if(type != null )
				{
					if(type == 0) // Coin
					{
						_PointsB += 20;
						AudioManager.play("coin");
					}
					if(type == 1) // Star
					{
						Invulnerability = true;
//						AudioManager.play("jump");
					}
					if(type == 2) //1UP
					{
						_Game.livesUP();
						AudioManager.play("1up");
					}
				}
			});
			
			enemigos.forEach(function(enemigo, ind){  
				if(enemigo.Collide(x,y,Width,Height))
					{
						AudioManager.pauseSong("fondo");
						AudioManager.play("die");
						live=false;
						isJumping = false;  
						isFalling = true;  
						fallSpeed = -10;  
					}
			});			
			
			
		} 
		else			
			checkFall();  

		
		
		return bool;
	}
	
	this.draw = function()
	{
		try {
			_Contx.save();
			
			if(live)
			{			
				if( direction== 1)
					_Contx.drawImage(image, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
				else
					_Contx.drawImage(imageI, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
			}
			else
				_Contx.drawImage(imageD, 0, 0, Width, Height, x, y, Width, Height);
			
			_Contx.restore();
		}
		catch (e) {
		};

		if (interval == 4 ) {
			if (actualFrame == frames) {
				actualFrame = 0;
			}
			else {
				actualFrame++;
			}
			interval = 0;
		}
		interval++;
	}	
	
}

function Enemigo()
{
// Enemigos en Movimiento
var image1 = new Image(),
	image1I = new Image(),
	image2 = new Image(),
	image2I = new Image(),
	image3 = new Image(),
	image3I = new Image(),
	frames = 3,
	actualFrame = 0,
	Width = 65,
	Height = 60,
	isMoving = 1,
	direction= ~~(Math.random() * 2) ? -1 : 1, // -1 Izquierda, 1 Derecha
	x,
	y,
	type,
	interval = 0;
	
	//Inicializa
	this.initEnemigo = function(xx,yy)
	{
		x = xx;
		y = yy;
		
		image1.src="Assets/Images/Koopa_troopaM.png";
		image1I.src="Assets/Images/Koopa_troopaMI.png";		
		image2.src="Assets/Images/Koopa_troopaM.png";
		image2I.src="Assets/Images/Koopa_troopaMI.png";		
		image3.src="Assets/Images/Koopa_troopaM.png";
		image3I.src="Assets/Images/Koopa_troopaMI.png";
		
	}
	
	//Update, si sale de la pantalla retorna FALSE
	this.update = function(dx,dy)
	{

		if (isMoving) {
            if (x < 0)
                direction = 1;  
            else if (x > _Width - Width)
                direction = -1;  
				
            x += direction * dx;  
        }
		y += dy;
		
		return (y < _Height);
	}
	
	//Dibujar
	this.draw = function(Puntaje)
	{
		try {
			_Contx.save();
			if(Puntaje <500)
				if(direction == -1)
					_Contx.drawImage(image1I, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
				else
					_Contx.drawImage(image1, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
			if(Puntaje <1000)
				if(direction == -1)
					_Contx.drawImage(image2I, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
				else
					_Contx.drawImage(image2, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
			if(Puntaje >1000)
				if(direction == -1)
					_Contx.drawImage(image3I, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
				else
					_Contx.drawImage(image3, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
				
			_Contx.restore();
		}
		catch (e) {
		};

		if (interval == 4 ) {
			if (actualFrame == frames) {
				actualFrame = 0;
			}
			else {
				actualFrame++;
			}
			interval = 0;
		}
		interval++;
		
	}
	
	this.getX= function()
	{
		return x;
	}
	
	this.getY = function()
	{
		return y;
	}

	this.getWidth = function()
	{
		return Width;
	}

	this.getHeight = function()
	{
		return Height;
	}	
	
	this.getDirection = function()
	{
		return direction;	
	}
	
	//Retorna True si (dx,dy) pertenece a la textura
	this.Collide = function(dx,dy,dw,dh)
	{
		return 	(dx < x + Width) && (dx + dw > x) && (dy + dh > y) && (dy + dh < y + Height);
	}
}

function Item()
{
var image1 = new Image(),
	frames,
	actualFrame = 0,
	Width = 65,
	Height = 60,
	isMoving = false,
	x,
	y,
	type,
	isTake,
	interval = 0;
	
	//Inicializa 
	this.init = function(xx,yy,Archivo,Frames,WidthI,HeightI, Type)
	{
		x = xx;
		y = yy;
		
		frames = Frames;
		Width = WidthI;
		Height = HeightI;
		
		type = Type;
		
		image1.src="Assets/Images/"+Archivo+".png";
		isTake = false;
	}
	
	//Update, si sale de la pantalla retorna FALSE
	this.update = function(dx,dy)
	{
		if(isMoving)
			x += dx;  
			
		y += dy;	
		return (y < _Height);
	}
	
	//Dibuja 
	this.draw = function()
	{
		try {
			_Contx.save();
			
			if(!isTake)
				_Contx.drawImage(image1, Width * actualFrame, 0, Width, Height, x, y, Width, Height);
				
			_Contx.restore();
		}
		catch (e) {
		};

		if (interval == 8 ) {
			if (actualFrame == frames) {
				actualFrame = 0;
			}
			else {
				actualFrame++;
			}
			interval = 0;
		}
		interval++;
		
	}
	
	this.setinterval = function( intvl)
	{
		interval = 	intvl;
	}
	
	this.getX= function()
	{
		return x;
	}
	
	this.getY = function()
	{
		return y;
	}

	this.getWidth = function()
	{
		return Width;
	}

	this.getHeight = function()
	{
		return Height;
	}	
	
	this.getType = function()
	{
		return type;
	}		
	
	this.isMovingON = function()
	{
		isMoving = true;
	}			
	
	this.isMovingOFF = function()
	{
		isMoving = false;
	}			
	
	this.setX = function(dx) 
	{
		x = dx;
	}
	
	//Retorna el Typo que colisiono si (dx,dy) pertenece a la textura, sino Retorna null
	this.Collide = function(dx,dy,dw,dh)
	{
		if(!isTake && (dx < x + Width) && (dx + dw > x) && (dy + dh > y) && (dy + dh < y + Height))
		{
			isTake = true;
			return type	;
		}
		else
			return null;
	}
}