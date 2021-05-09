var dog,sadDog,happyDog;
var foodObj;
var foodS, foodStock;
var fedTime, lastFed, feed, addFood;  
var bedroom,garden,washroom;  
var readState;
var currentTime;
var gameState="Hungry"

function preload(){
  sadDog=loadImage("img/dogimg.png");
  happyDog=loadImage("img/dogimg1.png");
  bedroom=loadImage("img/Bed Room.png")
  garden=loadImage("img/Garden.png");
  washroom=loadImage("img/Wash Room.png")


}

function setup() {
  database = firebase.database()
  createCanvas(1000,400);
  
  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState')
  readState.on("value",function(data) {
    gameState=data.val();
  })
}

function draw() {
  background(46,139,87);
  if (gameState!="Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage("dog",sadDog)
 // foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data){
    lastFed = data.val();
  })

 

  fill(255,255,254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed: " + lastFed %12 + "PM", 350, 30);
  }
  else if(lastFed == 0) {
    text("Last Feed: 12AM ", 350, 30);
  }
  else {
    text("Last Feed:  " + lastFed + "AM", 350, 30);
  }

 
  }

  currentTime=hour();
  if (currentTime==(lastFed+1)) {
    update("Playing")
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom();
  }else if(currentTime==(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathroom")
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }
  drawSprites();

}

//function to read Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
  function feedDog() {
    dog.addImage(happyDog);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food: foodObj.getFoodStock(),
      FeedTime : hour()
    })
  }


//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state) {
  database.ref('/').update({
    gameState:state
  })
}