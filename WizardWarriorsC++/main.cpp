#include <iostream>
#include "Player.h"
#include "Enemy.h"
#include "Weapon.h"

using namespace std;

int main() {
    cout << "Welcome to Wizard Warriors!" << endl;
    cout << "Main menu" << endl;
    
    // c++ test
    cout << "Create a character." << endl;
    
    //calling player
    Player p;
    
    cout << endl;
    cout << "Your character name is: " << p.getName() << "." << endl;
    cout << p.getName() << " your level is: " << p.getLevel() << "." << endl;
    cout << "Your health is at: " << p.getHealth() << "." << endl;
    cout << "You deal " << p.getDmg() << " damage per hit." << endl; 
    cout << endl;

    Weapon deflt;   //starting weapon
    cout << "The default weapon does " << deflt.getDmg() << " extra damage." << endl;
    cout << endl;

    //calling an enemy goblin
    string name = "goblin";
    Enemy goblin(name);

    //taking damage
    cout << "A goblin hit you with a surprise attack!" << endl;
    p.takeDmg(goblin.getDmg());
    p.takeDmg(goblin.getDmg());
    p.takeDmg(goblin.getDmg());
    p.takeDmg(goblin.getDmg());
    
    // testing xp for leveling up
    int xp;
    cout << "You killed a goblin! +150xp" << endl;
    xp = 150;
    p.addXP(xp);
    cout << "You killed a dragon! +600xp" << endl;
    xp = 0;
    xp = 600;
    p.addXP(xp);

    cout << "Your level is: " << p.getLevel() << "\nYour damage is: " << p.getDmg()
    << "\nYour health is: " << p.getHealth() << endl;
    
    return 0;
}
