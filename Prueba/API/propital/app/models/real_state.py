from datetime import datetime
from pydantic import BaseModel, EmailStr
import pytz


class RealState(BaseModel):

    """
    Pydantic model representing a real estate entity.

    This Pydantic model class defines the structure of a real estate entity with the following attributes:
    'ID', 'name', 'data', 'created_at', and 'updated_at'. It is used to ensure type validation and data consistency
    when working with real estate data.

    Attributes:
        ID (int): The unique identifier of the real estate entity.
        name (str): The name of the real estate entity.
        data (dict): Additional data associated with the real estate entity.
        created_at (datetime): The timestamp when the real estate record was created (default: current time in 'America/Bogota' timezone).
        updated_at (datetime): The timestamp when the real estate record was last updated (default: current time in 'America/Bogota' timezone).

    Methods:
        __getitem__(self, name) -> str:
            Get the value of a specific attribute by its name.
    """

    __tablename__ = "realstates"
    ID: int
    name: str
    data: dict
    created_at: datetime = datetime.now(pytz.timezone("America/Bogota"))
    updated_at: datetime = datetime.now(pytz.timezone("America/Bogota"))

    def __getitem__(self, name) -> str:
        """
        Get the value of a specific attribute by its name.

        This method allows accessing the value of a specific attribute of the RealState model
        by providing its name as a string.

        Args:
            name (str): The name of the attribute to retrieve.

        Returns:
            str: The value of the requested attribute.
        """
        return self.__getattribute__(name)
