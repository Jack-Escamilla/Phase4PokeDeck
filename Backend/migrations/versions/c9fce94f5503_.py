"""empty message

Revision ID: c9fce94f5503
Revises: 2518036c702e
Create Date: 2024-01-22 13:27:41.533820

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c9fce94f5503'
down_revision = '2518036c702e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('pokemons',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('teams',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('trainer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['trainer_id'], ['trainers.id'], name=op.f('fk_teams_trainer_id_trainers')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('poke_teams',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('team_id', sa.Integer(), nullable=True),
    sa.Column('pokemon_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['pokemon_id'], ['pokemons.id'], name=op.f('fk_poke_teams_pokemon_id_pokemons')),
    sa.ForeignKeyConstraint(['team_id'], ['teams.id'], name=op.f('fk_poke_teams_team_id_teams')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('poke_teams')
    op.drop_table('teams')
    op.drop_table('pokemons')
    # ### end Alembic commands ###
