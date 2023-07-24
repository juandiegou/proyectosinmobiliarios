from datetime import datetime
from typing import List, Tuple
from pydantic import BaseModel
import pytz
from .location import LocationModel


class PropertyModel(BaseModel):
    """
    Pydantic model representing a property with various attributes.

    This Pydantic model class defines the structure of a property record with the following attributes:
    'id', 'address', 'price', 'bedrooms', 'bathrooms', 'size_sqft', 'location', 'terrain_type', 'is_offer',
    'discount', 'description', 'details', 'created_at', and 'updated_at'. It is used to ensure type validation
    and data consistency when working with property data.

    Attributes:
        id (int): The unique identifier of the property.
        address (str): The address of the property.
        price (float): The price of the property.
        bedrooms (int): The number of bedrooms in the property.
        bathrooms (int): The number of bathrooms in the property.
        size_sqft (int): The size of the property in square feet.
        location (LocationModel): A nested LocationModel representing the location of the property.
        terrain_type (str): The type of terrain the property is located on.
        is_offer (bool): A boolean flag indicating if the property is currently offered as a special offer.
        discount (float): The discount percentage applied to the property if it is offered.
        description (str): A description of the property.
        details (dict): Additional details about the property.
        created_at (datetime): The timestamp when the property record was created (default: current time in 'America/Bogota' timezone).
        updated_at (datetime): The timestamp when the property record was last updated (default: current time in 'America/Bogota' timezone).

    Methods:
        __getitem__(self, name) -> str:
            Get the value of a specific attribute by its name.
    """

    __tablename__ = "properties"

    id: int
    address: str
    price: float
    bedrooms: int
    bathrooms: int
    size_sqft: int
    location: LocationModel | Tuple[float, float]
    terrain_type: str
    is_offer: bool
    discount: float
    description: str
    details: dict
    created_at: datetime = datetime.now(pytz.timezone("America/Bogota"))
    updated_at: datetime = datetime.now(pytz.timezone("America/Bogota"))

    def __getitem__(self, name) -> str:
        """
        Get the value of a specific attribute by its name.

        This method allows accessing the value of a specific attribute of the PropertyModel
        by providing its name as a string.

        Args:
            name (str): The name of the attribute to retrieve.

        Returns:
            str: The value of the requested attribute.
        """
        return self.__getattribute__(name)
