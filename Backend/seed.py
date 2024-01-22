import requests, random
from faker import Faker
from app import app 
from model import db, Team, Trainer, Pokemon, PokeTeam

fake = Faker()

def create_teams():
    teams = []
    for _ in range(5):
        t = Team(
            name=fake.name(), 
        )
        teams.append(t)

    return teams  

def create_trainers():
    trainers = []
    for _ in range(5):
        t = Trainer(
            username=fake.user_name(), 
            _password_hash='hashed_password',  
        )
        trainers.append(t)

    return trainers

def create_poke_teams(teams, pokemons, trainers):
    poke_teams = []
    for _ in range(10):  
        print(teams)
        team = random.choice(teams)
        pokemon = random.choice(pokemons)
        trainer = random.choice(trainers)

        pt = PokeTeam(
            team=team,
            pokemon=pokemon,
        )
        poke_teams.append(pt)

    return poke_teams

def seed_poke_teams_data():
    teams = Team.query.all()
    pokemons = Pokemon.query.all()
    trainers = Trainer.query.all()

    poke_teams = create_poke_teams(teams, pokemons, trainers)
    for poke_team in poke_teams:
        db.session.add(poke_team)
    db.session.commit()
    print('PokeTeams seeded successfully.')

def seed_trainers_data():
    trainers = create_trainers()
    for trainer in trainers:
        db.session.add(trainer)
    db.session.commit()
    print('Trainers seeded successfully.')


def seed_teams_data():
    teams = create_teams()
    for team in teams:
        db.session.add(team)
    db.session.commit()
    print('Teams seeded successfully.')

def seed_pokemon_data():
    api_url = 'https://pokeapi.co/api/v2/pokemon/'
    response = requests.get(api_url)

    if response.status_code: 
        pokemon_data = response.json()
        for pokemon in pokemon_data['results']:
            name = pokemon['name']
            new_pokemon = Pokemon(**Pokemon(name=name).to_dict())
            db.session.add(new_pokemon)
            db.session.commit()

            print('Pokemon data seeded successfully.')
    else:
        print('Failed to fetch Pokemon data')

if __name__ == '__main__':
    with app.app_context():
        seed_pokemon_data()
        seed_trainers_data()
        seed_teams_data()
        seed_poke_teams_data()