from typing import Tuple
from pydantic import BaseModel


class LocationModel(BaseModel):
    """
    Pydantic model for representing a location with latitude and longitude.

    This model class defines the structure of a location with latitude and longitude.
    It is used to ensure type validation and data consistency when working with location data.

    Attributes:
        latitude (float): The latitude coordinate of the location.
        longitude (float): The longitude coordinate of the location.
    """

    latitude: float
    longitude: float
