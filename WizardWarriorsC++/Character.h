#ifndef CHARACTER_H
#define CHARACTER_H

using namespace std;
 
class Character {
    protected:
        string name;            
        int dmg;
        int health;
        int baseHp;
        int level;
        int regen;
        int rgnDlay;   //regen rate delay after being hit
        int wlkSped;  
        int atkSped;
    public:  
        Character();
        int getHealth();
        string getName();
        int getLevel();
        virtual int getDmg();
        void takeDmg(int d);  
        int getWSpd();
        int getASpd();
};

#endif
//aspects,buffs,time

//target...agro
