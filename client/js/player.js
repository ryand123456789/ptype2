class Player{
    constructor(data){
    this.username = data
    this.player_width = 20;
    this.player_height = 20;
    this.health = data.health;
    this.damage = data.damage;
    this.entity_type = "player";
    this.levels_unlocked = data.levels_unlocked;
    this.current_skin = data.current_skin;
    this.speed = data.speed; //pixels moved each tick, stat can increase/decrease


    //positional
    this.x = 500;
    this.y = 500;

    this.xVelocity = 0;
    this.yVelocity = 0;

    this.friction = 0.9;

    //socket variables
    this.id = Math.random();
    }
}
export default Player;
