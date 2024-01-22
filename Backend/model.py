from sqlalchemy import ForeignKey, Column, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, relationship, validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin

from config import db, bcrypt

Base = declarative_base()


class Trainer(db.Model, SerializerMixin):
    __tablename__ = 'trainers'
# id that is an integer type and a primary key.
    id = db.Column(db.Integer, primary_key = True)
# trainer that is a String type.
    trainer = db.Column(db.String, unique = True, nullable = False)
# _password_hash that is a String type.
    _password_hash = db.Column(db.String)

    poke_teams = db.relationship('PokeTeam', back_populates = "trainer")
    
    serialize_rules = ('-poke_teams.trainer',)

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Can't access this")
        # return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = hashed_password.decode('utf-8')

    def authenticate(self,password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    @validates('trainer')
    def validate_trainer(self,key,value):
        if value:
            return value
        else:
            raise ValueError("Not valid trainer")


class Team(Base,SerializerMixin):
    __tablename__= "teams"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    name1 = db.Column(db.String)
    name2= db.Column(db.String)
    name3 = db.Column(db.String)
    name4 = db.Column(db.String)
    name5 = db.Column(db.String)
    name6 = db.Column(db.String)
    poke_teams = db.relationship("PokeTeam", back_populates="team")
    serialize_rules=('-poke_teams.team',)
    trainer_id = db.Column(db.Integer, db.ForeignKey("trainers.id"))
    trainer = db.relationship("Trainer", back_populates="team")

    def __repr__(self):
        return repr(f"{self.name}")

class Pokemon(Base):
    __tablename__= "pokemons"
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String)
    poke_teams = db.relationship("PokeTeam", back_populates="pokemon")
    serialize_rules=('-poke_teams.pokemon',)

    def __repr__(self):
        return repr(f"{self.name}")

#PokeTeam is not your actual team. Poketeam is a locker for keeping your teams in. Teams is the most important table.
class PokeTeam(Base):
    __tablename__ = "poke_teams"
    id = db.Column(db.Integer, primary_key = True)
    team_id = db.Column(db.Integer, ForeignKey("teams.id"))
    team = db.relationship("Team", back_populates="poke_teams")
    pokemon_id = db.Column(db.Integer, ForeignKey("pokemons.id"))
    pokemon = db.relationship("Pokemon", back_populates="poke_teams")

    serialize_rules = ('-trainer.poke_teams','')

    def __repr__(self):
        return repr(f"{self.team}, {self.pokemon}, {self.trainer}")


#engine = create_engine("sqlite:///darktide_builder.db")
