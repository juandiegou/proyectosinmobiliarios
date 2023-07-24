"""_summary_
    A Mongo DB Connection
"""
from os import getenv
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

load_dotenv()
HOST: str = str(getenv('MYSQL_HOST'))
USER: str = str(getenv('MYSQL_USER'))
PASSWORD: str = str(getenv('MYSQL_PASSWORD'))
DATABASE: str = str(getenv('MYSQL_DB_NAME'))
DATABASE_URL = f'mysql+mysqlconnector:{USER}:{PASSWORD}@{HOST}/{DATABASE}'
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()