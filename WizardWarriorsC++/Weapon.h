#ifndef WEAPON_H
#define WEAPON_H

class Weapon
{
private:
    int dmg;     //buff to player dmg
public:
    Weapon();
    void setDmg();
    int getDmg(){return dmg;}
    
};

#endif /* WEAPON_H */

//range
